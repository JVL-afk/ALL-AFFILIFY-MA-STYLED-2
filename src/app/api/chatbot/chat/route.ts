import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { requirePremium } from '@/lib/auth-middleware';
import { connectToDatabase } from '@/lib/mongodb';
import { TenantAwareDb } from '@/lib/tenant-aware-db';
import { QuotaService } from '@/services/quota-service';
import { PIIRedactionService } from '@/services/pii-redaction-service';
import { PromptInjectionShield } from '@/services/prompt-injection-shield';
import { ChatRequestSchema } from '@/lib/validation/chat-schemas';
import { logger } from '@/lib/production-logger';
import { ObjectId } from 'mongodb';

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `You are the AFFILIFY AI Assistant, a world-class expert in affiliate marketing, digital entrepreneurship, and performance tracking.
Your goal is to provide actionable, data-driven advice to help users scale their affiliate businesses.
Always be professional, concise, and focused on ROI.`;

export async function POST(req: NextRequest) {
  return requirePremium(req, async (user) => {
    try {
      const body = await req.json();
      
      // 1. Validation
      const validation = ChatRequestSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ success: false, error: 'Invalid request data', details: validation.error.format() }, { status: 400 });
      }
      const { message, sessionId, history = [] } = validation.data;

      // 2. Security Shields
      const shieldResult = PromptInjectionShield.analyze(message);
      if (!shieldResult.isSafe) {
        return NextResponse.json({ success: false, error: 'Security violation detected', reason: shieldResult.reason }, { status: 403 });
      }

      const redactedMessage = PIIRedactionService.redact(message);

      // 3. Database & Quota Setup
      const { db } = await connectToDatabase();
      const tenantDb = new TenantAwareDb(db, { userId: user.id, userPlan: user.plan, role: user.role });
      const quotaService = new QuotaService(db);

      // 4. Atomic Quota Check
      const quotaCheck = await quotaService.checkAndDecrementAiChatbotQuota(new ObjectId(user.id));
      if (!quotaCheck.allowed) {
        return NextResponse.json({ success: false, error: 'Quota exceeded', reason: quotaCheck.reason }, { status: 429 });
      }

      // 5. AI Execution
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(redactedMessage);
      const responseText = result.response.text();

      // 6. Persistence
      if (sessionId) {
        const messagesCol = tenantDb.collection('chat_messages');
        
        // Save User Message
        const userMsgId = new ObjectId();
        await messagesCol.insertOne({
          _id: userMsgId,
          sessionId: new ObjectId(sessionId),
          type: 'user',
          content: message, // Save original for user, but AI saw redacted
          timestamp: new Date(),
        });

        // Save AI Response
        const aiMsgId = new ObjectId();
        await messagesCol.insertOne({
          _id: aiMsgId,
          sessionId: new ObjectId(sessionId),
          type: 'model',
          content: responseText,
          timestamp: new Date(),
        });

        // Update Session Last Message
        const sessionsCol = tenantDb.collection('chat_sessions');
        await sessionsCol.updateOne(
          { _id: new ObjectId(sessionId) },
          { $set: { lastMessageAt: new Date(), updatedAt: new Date() } }
        );

        return NextResponse.json({
          success: true,
          response: responseText,
          message: {
            id: aiMsgId.toString(),
            type: 'model',
            content: responseText,
            timestamp: new Date().toISOString()
          }
        });
      }

      return NextResponse.json({ success: true, response: responseText });

    } catch (error: any) {
      logger.error('Chatbot API Error', { error: error.message, stack: error.stack });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}

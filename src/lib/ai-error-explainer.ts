import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export class AIErrorExplainer {
  /**
   * Analyze build errors and provide human-friendly explanations with fix suggestions
   */
  static async explainBuildError(errorLog: string): Promise<{
    explanation: string
    suggestedFixes: string[]
    severity: 'critical' | 'warning' | 'info'
  }> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

      const prompt = `
You are an expert Next.js and TypeScript developer. Analyze the following build error log and provide:

1. A clear, human-friendly explanation of what went wrong
2. 3-5 specific, actionable steps to fix the error
3. The severity level (critical, warning, or info)

Build Error Log:
\`\`\`
${errorLog}
\`\`\`

Respond in JSON format:
{
  "explanation": "Clear explanation of the error",
  "suggestedFixes": ["Fix 1", "Fix 2", "Fix 3"],
  "severity": "critical" | "warning" | "info"
}
`

      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed
      }

      // Fallback if JSON parsing fails
      return {
        explanation: 'An error occurred during the build process. Please review the build logs for details.',
        suggestedFixes: [
          'Check the build logs for syntax errors',
          'Ensure all dependencies are installed',
          'Verify that all imports are correct'
        ],
        severity: 'critical'
      }
    } catch (error) {
      console.error('AI error explanation failed:', error)
      return {
        explanation: 'Unable to analyze the error. Please review the build logs manually.',
        suggestedFixes: ['Review the error log above', 'Check for syntax errors', 'Verify imports'],
        severity: 'critical'
      }
    }
  }

  /**
   * Suggest code improvements
   */
  static async suggestImprovements(code: string, filePath: string): Promise<string[]> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

      const prompt = `
You are an expert code reviewer. Analyze the following code and suggest 3-5 improvements for:
- Performance
- Readability
- Best practices
- Security

File: ${filePath}

Code:
\`\`\`typescript
${code}
\`\`\`

Respond with a JSON array of suggestions:
["Suggestion 1", "Suggestion 2", "Suggestion 3"]
`

      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Extract JSON array from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      return []
    } catch (error) {
      console.error('AI code suggestions failed:', error)
      return []
    }
  }
}


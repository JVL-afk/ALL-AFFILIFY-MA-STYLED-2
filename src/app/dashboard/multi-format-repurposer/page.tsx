// src/app/dashboard/multi-format-repurposer/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Copy,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
  Twitter,
  Mail,
  Youtube,
  BookOpen,
  MessageSquare,
  FileText,
  Sparkles,
  Download,
  Share2,
  ChevronRight,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { AffiliateContentDNA } from '@/lib/content-brain/types'
import { getAffiliateDNA } from '@/lib/content-brain/api'

interface RepurposedContent {
  format: string;
  icon: any;
  title: string;
  content: string;
  wordCount: number;
}

export default function MultiFormatRepurposerPage() {
  const [dna, setDna] = useState<AffiliateContentDNA | null>(null);
  const [sourceContent, setSourceContent] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['twitter', 'email', 'youtube']);
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Fetch DNA on component mount
  useEffect(() => {
    const fetchDNA = async () => {
      try {
        const fetchedDNA = await getAffiliateDNA('mock-project-id');
        setDna(fetchedDNA);
      } catch (err) {
        setError('Failed to load Campaign DNA.');
      }
    };
    fetchDNA();
  }, []);

  const formatOptions = [
    { id: 'twitter', name: 'Twitter Thread', icon: Twitter, description: '10-tweet thread' },
    { id: 'email', name: 'Email Sequence', icon: Mail, description: '5-email sequence' },
    { id: 'youtube', name: 'YouTube Script', icon: Youtube, description: '5-min video script' },
    { id: 'linkedin', name: 'LinkedIn Post', icon: MessageSquare, description: 'Professional post' },
    { id: 'tiktok', name: 'TikTok Script', icon: Sparkles, description: '60-sec video' },
    { id: 'newsletter', name: 'Newsletter', icon: Mail, description: 'Full newsletter' },
  ];

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    );
  };

  const handleRepurpose = async () => {
    if (!sourceContent.trim()) {
      setError('Please paste or enter source content to repurpose.');
      return;
    }
    if (selectedFormats.length === 0) {
      setError('Please select at least one format.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRepurposedContent([]);

    try {
      // Mock repurposing - in a real app, this would call specialized LLM routes
      const mockRepurposed: RepurposedContent[] = [];

      if (selectedFormats.includes('twitter')) {
        mockRepurposed.push({
          format: 'twitter',
          icon: Twitter,
          title: 'Twitter Thread',
          content: `1/ 🚀 Just reviewed the 2026 KTM 450 SX-F and I'm blown away. This isn't just a motocross bike - it's a game-changer for competitive riders.

2/ The weight-to-power ratio is insane. At 220 lbs dry with 450cc of pure power, you're getting the lightest, most powerful combo on the market.

3/ What impressed me most? The traction control. No more wheelspin off the line. You're getting consistent hole-shots every single time.

4/ The handling is butter-smooth. Tight corners? No problem. High-speed sections? This bike carves like nothing else.

5/ Price point is $11,999 - not cheap, but when you're competing at the highest level, you need the best equipment.

6/ Bottom line: If you're serious about winning, the KTM 450 SX-F is the only choice. Get yours today.

7/ Full review + specs link in bio 👇`,
          wordCount: 145,
        });
      }

      if (selectedFormats.includes('email')) {
        mockRepurposed.push({
          format: 'email',
          icon: Mail,
          title: 'Email Sequence',
          content: `Subject: The Bike That Wins Races

---

Hi [First Name],

I just got my hands on the 2026 KTM 450 SX-F and I had to share this with you.

This isn't just another motocross bike. It's the lightest, most powerful machine on the track.

220 lbs. 450cc of pure performance. Traction control that gives you consistent hole-shots.

If you're tired of losing races because your equipment isn't matching your skill level, this is the answer.

Check out my full review here: [LINK]

Talk soon,
[Your Name]`,
          wordCount: 98,
        });
      }

      if (selectedFormats.includes('youtube')) {
        mockRepurposed.push({
          format: 'youtube',
          icon: Youtube,
          title: 'YouTube Script (5-min)',
          content: `[INTRO - 0:00-0:15]
"What's up guys, welcome back to the channel! Today, I'm reviewing the 2026 KTM 450 SX-F - the bike that's dominating the competition. If you're serious about winning, stick around."

[SPECS & UNBOXING - 0:15-1:00]
"Let me show you what you're getting. This beauty weighs just 220 pounds dry, packed with a 450cc SOHC engine that delivers serious power..."

[PERFORMANCE TEST - 1:00-3:30]
"Let's take it to the track. Watch how the traction control gives us a perfect hole-shot every single time. The handling is unreal..."

[COMPARISON - 3:30-4:15]
"Compared to the competition, the KTM 450 SX-F is in a league of its own. Here's why..."

[CTA - 4:15-5:00]
"If you want to upgrade your setup, I've got an exclusive link in the description. Thanks for watching, and I'll see you in the next one!"`,
          wordCount: 187,
        });
      }

      if (selectedFormats.includes('linkedin')) {
        mockRepurposed.push({
          format: 'linkedin',
          icon: MessageSquare,
          title: 'LinkedIn Post',
          content: `Just wrapped up testing the 2026 KTM 450 SX-F and I'm genuinely impressed.

In the world of competitive motocross, equipment matters. A lot.

This bike represents the pinnacle of engineering - lightweight, powerful, and engineered for winners.

220 lbs. 450cc. Traction control that delivers consistent performance.

For anyone in the industry looking to understand what peak performance looks like, this is a masterclass.

The future of motocross is here.

#Motocross #Engineering #Performance #KTM`,
          wordCount: 102,
        });
      }

      if (selectedFormats.includes('tiktok')) {
        mockRepurposed.push({
          format: 'tiktok',
          icon: Sparkles,
          title: 'TikTok Script (60-sec)',
          content: `[0-5 sec] POV: You just got the fastest motocross bike on the market

[5-15 sec] *Show bike close-ups* 
"The 2026 KTM 450 SX-F - 220 pounds of pure performance"

[15-30 sec] *Riding footage*
"Watch this hole-shot. Traction control = consistent wins"

[30-45 sec] *Comparison shots*
"Lighter. More powerful. Better handling."

[45-60 sec] *Call to action*
"Link in bio to get yours. Are you ready to dominate?"

#Motocross #KTM #BikeReview #Racing`,
          wordCount: 68,
        });
      }

      if (selectedFormats.includes('newsletter')) {
        mockRepurposed.push({
          format: 'newsletter',
          icon: FileText,
          title: 'Newsletter',
          content: `🏍️ THE MOTOCROSS INSIDER - Issue #42

---

TOP STORY: The KTM 450 SX-F is Changing the Game

I just spent two weeks testing the 2026 KTM 450 SX-F, and I have to tell you - this is the bike to beat.

Here's what makes it special:
• Lightest in its class at 220 lbs dry
• 450cc SOHC engine with serious power
• Advanced traction control for consistent hole-shots
• Superior handling and cornering

For competitive riders, this is the only choice. Period.

---

QUICK TAKES:
- New Yamaha YZ450F specs leaked
- Kawasaki announces 2027 lineup
- Motocross training tips from pro riders

---

FEATURED PRODUCT:
2026 KTM 450 SX-F - $11,999
Get the competitive edge you need. [LINK]

---

See you next week!
[Your Name]`,
          wordCount: 156,
        });
      }

      setRepurposedContent(mockRepurposed);
    } catch (err) {
      console.error(err);
      setError('Repurposing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (content: string, format: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const repurposerBackground = "min-h-screen bg-gray-900";
  const contentAreaBackground = "bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl";
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400";
  const primaryButtonClass = "w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg";

  return (
    <div className={`${repurposerBackground} p-6`}>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-extrabold ${gradientText}`}>
            Multi-Format Repurposer <Share2 className="inline-block w-8 h-8 ml-2" />
          </h1>
          <p className="text-gray-500 mt-1">
            Transform one piece of content into multiple high-converting formats. Blog post → Twitter thread, Email, YouTube script, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Format Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-3 p-4 rounded-xl bg-gray-800 border border-gray-700 overflow-y-auto`}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-cyan-400" /> Output Formats
            </h2>
            <div className="space-y-3">
              {formatOptions.map((format) => (
                <Card
                  key={format.id}
                  onClick={() => handleFormatToggle(format.id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedFormats.includes(format.id)
                      ? 'border-cyan-500 ring-2 ring-cyan-500 bg-gray-700'
                      : 'border-gray-700 hover:border-cyan-500 hover:bg-gray-700/50'
                  } bg-gray-800 text-white`}
                >
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm flex items-center">
                      <format.icon className="w-4 h-4 mr-2 text-cyan-400" />
                      {format.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {format.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="font-medium text-white">{selectedFormats.length}</span> format{selectedFormats.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </motion.div>

          {/* Main Content Area: Input & Output */}
          <div className="lg:col-span-9 space-y-6">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={contentAreaBackground}
            >
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                  Source Content
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Paste your blog post, review, or any content you want to repurpose.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  placeholder="Paste your source content here... (e.g., a full blog post or product review)"
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  rows={12}
                  className="bg-gray-900 border-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </motion.div>
                )}
                <Button
                  onClick={handleRepurpose}
                  disabled={isLoading || selectedFormats.length === 0 || !sourceContent.trim()}
                  className={`${primaryButtonClass} mt-4`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Repurposing Content...' : 'Repurpose to Selected Formats'}
                </Button>
              </CardContent>
            </motion.div>

            {/* Output Cards */}
            <AnimatePresence mode="wait">
              {repurposedContent.length > 0 && (
                <motion.div
                  key="repurposed-output"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
                      Repurposed Content
                    </h2>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                  </div>

                  {repurposedContent.map((item, index) => (
                    <motion.div
                      key={item.format}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={contentAreaBackground}
                    >
                      <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-2 text-cyan-400" />
                          <div>
                            <CardTitle className="text-white">{item.title}</CardTitle>
                            <CardDescription className="text-gray-500">{item.wordCount} words</CardDescription>
                          </div>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(item.content, item.format)}
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {copiedFormat === item.format ? 'Copied!' : 'Copy'}
                        </Button>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="prose prose-invert max-w-none text-gray-300">
                          <pre className="whitespace-pre-wrap p-4 bg-gray-900 border border-gray-700 rounded-lg text-sm">
                            {item.content}
                          </pre>
                        </div>
                      </CardContent>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

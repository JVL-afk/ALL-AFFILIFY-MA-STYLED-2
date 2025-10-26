# 🚀 AFFILIFY Enterprise Code Editor - Complete Documentation

## Overview

The **AFFILIFY Enterprise Code Editor** is the world's first fully-integrated, AI-powered code editor for SaaS platforms, allowing Enterprise users to customize their entire after-login dashboard experience with professional-grade tools.

---

## 🎯 Key Features

### 1. **Dual-Mode Editing**
- **Code Editor**: Monaco Editor (VS Code engine) with full TypeScript/JSX support
- **Visual Editor**: Drag-and-drop Wix-style interface for non-technical users

### 2. **File Management**
- Browse and edit all dashboard files
- Auto-populated with 24 default dashboard files
- Real-time file tree navigation
- Syntax highlighting for TypeScript, TSX, CSS, JSON

### 3. **GitHub Integration**
- Automatic code push to user-specific branches
- Commit history tracking
- Real GitHub API integration (not mocked)
- Branch isolation per user (`user-{userId}`)

### 4. **Netlify Deployment**
- One-click deployment to production
- Real-time build status tracking
- Live URL generation
- Build log streaming

### 5. **AI-Powered Features**
- **Error Explanation**: Gemini 2.0 Flash analyzes build errors
- **Fix Suggestions**: AI provides 3-5 actionable steps
- **Code Improvements**: AI reviews code for performance, readability, security
- **Smart Formatting**: Auto-format on paste and type

### 6. **Version Control & Rollback**
- Full deployment history
- One-click rollback to any successful deployment
- Diff viewer (planned)
- Commit hash tracking

### 7. **Advanced Toolbar**
- **Format**: Instant code formatting
- **Search**: Multi-file search with regex support
- **Replace**: Global find-and-replace
- **AI Assist**: Get improvement suggestions

### 8. **Visual Editor Components**
- Navbar
- Hero Section
- Card
- Button
- Text
- Image
- Footer
- Custom Sections

### 9. **Responsive Design Tools**
- Desktop preview (100% width)
- Tablet preview (768px)
- Mobile preview (375px)
- Real-time responsive testing

### 10. **Security & Isolation**
- Enterprise-only access (`requireEnterprise` middleware)
- User-specific code storage in MongoDB
- Isolated GitHub branches
- No cross-user contamination

---

## 📂 File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── code-editor/
│   │       └── page.tsx                    # Main Code Editor UI
│   └── api/
│       └── code-editor/
│           ├── files/route.ts              # File management API
│           ├── deploy/route.ts             # Netlify deployment API
│           ├── rollback/route.ts           # Version rollback API
│           └── ai-assist/route.ts          # AI suggestions API
├── components/
│   ├── VisualEditor.tsx                    # Drag-and-drop visual editor
│   ├── CodeEditorToolbar.tsx               # Advanced toolbar
│   └── DashboardLayout.tsx                 # Navigation (updated)
├── lib/
│   ├── models/
│   │   └── UserCode.ts                     # Database schema
│   ├── github-service.ts                   # GitHub API integration
│   ├── ai-error-explainer.ts               # AI error analysis
│   └── default-dashboard-files.json        # 24 default files
└── scripts/
    └── extract-dashboard-files.js          # File extraction utility
```

---

## 🗄️ Database Schema

### Collection: `userCode`

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                         // User reference
  appId: string,                            // "affilify-app-{userId}"
  files: [
    {
      path: string,                         // "src/app/dashboard/page.tsx"
      content: string,                      // File content
      lastModified: Date
    }
  ],
  deployments: [
    {
      id: string,                           // "deploy-1234567890"
      timestamp: Date,
      commitHash: string,                   // GitHub commit SHA
      status: "pending" | "building" | "success" | "failed",
      buildLogs: string,
      liveUrl: string,                      // Netlify URL
      errorDetails: string                  // AI-explained errors
    }
  ],
  lastDeployed: Date,
  lastModified: Date,
  createdAt: Date,
  netlifyAppId: string,                     // Netlify site ID
  githubBranch: string                      // "user-{userId}"
}
```

---

## 🔌 API Endpoints

### 1. **GET /api/code-editor/files**
- **Auth**: Enterprise only
- **Returns**: All files for the user's workspace
- **Auto-initializes**: Creates workspace with 24 default files if none exists

### 2. **POST /api/code-editor/files**
- **Auth**: Enterprise only
- **Body**: `{ filePath: string, content: string }`
- **Action**: Saves file changes to MongoDB

### 3. **POST /api/code-editor/deploy**
- **Auth**: Enterprise only
- **Action**: 
  1. Pushes code to GitHub
  2. Triggers Netlify build
  3. Returns deployment ID for polling

### 4. **GET /api/code-editor/deploy?deploymentId={id}**
- **Auth**: Enterprise only
- **Returns**: Deployment status and logs

### 5. **POST /api/code-editor/rollback**
- **Auth**: Enterprise only
- **Body**: `{ deploymentId: string }`
- **Action**: Rollback GitHub branch to specific commit

### 6. **POST /api/code-editor/ai-assist**
- **Auth**: Enterprise only
- **Body**: `{ code: string, filePath: string }`
- **Returns**: AI-generated improvement suggestions

---

## 🛠️ Technical Implementation

### Monaco Editor Integration
```typescript
<MonacoEditor
  height="100%"
  language="typescript"
  theme="vs-dark"
  value={code}
  onChange={(value) => setCode(value || '')}
  onMount={(editor) => {
    editorRef.current = editor
  }}
  options={{
    minimap: { enabled: true },
    fontSize: 14,
    wordWrap: 'on',
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
  }}
/>
```

### GitHub Push (Real Implementation)
```typescript
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: GITHUB_TOKEN })

// Create blobs, tree, commit, and update ref
await octokit.git.createBlob(...)
await octokit.git.createTree(...)
await octokit.git.createCommit(...)
await octokit.git.updateRef(...)
```

### AI Error Explanation
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

const result = await model.generateContent(`
  Analyze this build error and provide:
  1. Human-friendly explanation
  2. 3-5 actionable fixes
  3. Severity level
  
  Error: ${errorLog}
`)
```

---

## 🎨 Visual Editor Features

### Component Palette
- **Navbar**: Full-width navigation bar
- **Hero**: Large banner section
- **Card**: Content container with border
- **Button**: Interactive CTA
- **Text**: Editable text block
- **Image**: Image placeholder

### Property Inspector
- Content editing
- Background color picker
- Text color picker
- Font size control
- Padding control
- Border radius control

### Drag & Drop
- Click to select component
- Drag to reposition
- Duplicate with one click
- Delete with confirmation

### Code Generation
Automatically generates React/TSX code from visual components:
```tsx
<div style={{ 
  position: 'absolute',
  left: '50px',
  top: '100px',
  backgroundColor: '#3b82f6',
  color: '#ffffff'
}}>
  Hero Section
</div>
```

---

## 🚀 Deployment Flow

1. **User clicks "Deploy to Netlify"**
2. **System creates deployment record** (status: pending)
3. **Code pushed to GitHub** via Octokit API
4. **Netlify webhook triggered** with branch reference
5. **Build starts** (status: building)
6. **Build completes** (status: success/failed)
7. **Live URL generated** (for successful builds)
8. **AI analyzes errors** (for failed builds)
9. **User notified** with build logs

---

## 🔄 Rollback System

### How It Works
1. User views deployment history
2. Clicks "Rollback" on a successful deployment
3. System confirms action
4. GitHub branch force-pushed to old commit SHA
5. New deployment record created
6. User's code reverted to previous state

### Safety Features
- Only successful deployments can be rolled back
- Confirmation dialog prevents accidents
- Rollback creates new deployment record (audit trail)
- Original deployments preserved in history

---

## 🤖 AI Features

### 1. Build Error Explanation
- **Model**: Gemini 2.0 Flash Exp
- **Input**: Build error logs
- **Output**: 
  - Plain English explanation
  - 3-5 specific fix steps
  - Severity rating

### 2. Code Improvement Suggestions
- **Model**: Gemini 2.0 Flash Exp
- **Input**: Current file code
- **Output**: 
  - Performance tips
  - Readability improvements
  - Best practice recommendations
  - Security warnings

---

## 📊 Default Files (24 Total)

All dashboard files are auto-populated for new users:
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/ab-testing/page.tsx`
- `src/app/dashboard/advanced-analytics/page.tsx`
- `src/app/dashboard/ai-chatbot/page.tsx`
- `src/app/dashboard/analyze-website/page.tsx`
- `src/app/dashboard/api-management/page.tsx`
- `src/app/dashboard/billing/page.tsx`
- `src/app/dashboard/create-website/page.tsx`
- `src/app/dashboard/custom-integrations/page.tsx`
- `src/app/dashboard/email-marketing/page.tsx`
- `src/app/dashboard/help/page.tsx`
- `src/app/dashboard/my-websites/page.tsx`
- `src/app/dashboard/reviews/page.tsx`
- `src/app/dashboard/settings/page.tsx`
- `src/app/dashboard/team-collaboration/page.tsx`
- And 8 more...

---

## 🔐 Security Considerations

### Access Control
- **Middleware**: `requireEnterprise` on all routes
- **Database**: User-specific queries with `userId` filter
- **GitHub**: Isolated branches per user
- **Netlify**: Separate site per user

### Data Isolation
- Users can ONLY access their own code
- No cross-user file access
- MongoDB queries scoped to `userId`
- GitHub branches isolated by `user-{userId}` naming

### Token Security
- Netlify token stored in environment variables
- GitHub PAT stored in environment variables
- Tokens never exposed to client
- All API calls server-side only

---

## 📈 Performance Optimizations

### Monaco Editor
- Dynamic import to avoid SSR issues
- Lazy loading for faster initial page load
- Automatic layout adjustment

### File Loading
- Only current file loaded into editor
- File tree loads metadata only
- Content fetched on-demand

### Deployment
- Async deployment process
- Non-blocking UI
- Real-time polling (3-second intervals)
- Auto-stop polling on completion

---

## 🎯 User Experience Flow

### First-Time User
1. Logs in as Enterprise user
2. Sees "🚀 Code Editor" in sidebar
3. Clicks to open editor
4. System auto-initializes workspace with 24 files
5. User browses file tree
6. Selects file to edit
7. Makes changes
8. Clicks "Save"
9. Clicks "Deploy to Netlify"
10. Watches real-time build progress
11. Receives live URL on success

### Returning User
1. Opens Code Editor
2. Sees existing files and deployment history
3. Continues editing
4. Can rollback to previous versions
5. Can use AI assist for improvements

---

## 🌟 Competitive Advantages

### Why This is Revolutionary

1. **First-of-its-Kind**: No other SaaS platform offers in-app code editing
2. **Enterprise-Only**: Creates strong upgrade incentive
3. **AI-Powered**: Gemini 2.0 for error explanation and suggestions
4. **Full Stack**: Code editor + Visual editor in one
5. **Production-Ready**: Real GitHub + Netlify integration
6. **Version Control**: Built-in rollback system
7. **User Isolation**: Bulletproof security model
8. **Professional Tools**: Monaco Editor (VS Code quality)

---

## 📝 Future Enhancements (Planned)

- [ ] Collaborative editing (multiple users)
- [ ] Real-time preview iframe
- [ ] Git diff viewer
- [ ] Custom component library
- [ ] Template marketplace
- [ ] Code snippets library
- [ ] Keyboard shortcuts customization
- [ ] Dark/light theme toggle
- [ ] Export code as ZIP
- [ ] Import from GitHub repo

---

## 🐛 Known Limitations

1. **Netlify Site Creation**: Currently creates new site per deployment (should reuse existing site)
2. **Build Time**: First deployment may take 2-3 minutes
3. **File Size**: Large files (>1MB) may cause performance issues
4. **Concurrent Edits**: No conflict resolution for simultaneous edits

---

## 🔧 Environment Variables Required

```env
# Netlify
NETLIFY_ACCESS_TOKEN=nfp_hmio4j7N2WeEMji3c8PbAsiaiw64QD7D85e1

# GitHub
GITHUB_PAT=ghp_sxvhlCXj5Bm0cXMpK7e1QWRElrfj6A1GwZaj

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Files not loading
- **Solution**: Check MongoDB connection
- **Solution**: Verify user is Enterprise plan

**Issue**: Deployment fails
- **Solution**: Check Netlify token validity
- **Solution**: Review build logs for errors
- **Solution**: Use AI assist for error explanation

**Issue**: GitHub push fails
- **Solution**: Verify GitHub PAT permissions
- **Solution**: Check repository access

**Issue**: Visual Editor not rendering
- **Solution**: Clear browser cache
- **Solution**: Check console for errors

---

## 🎓 Developer Notes

### Adding New Default Files
1. Add files to `src/app/dashboard/`
2. Run `node scripts/extract-dashboard-files.js`
3. Commit updated `default-dashboard-files.json`

### Modifying Visual Editor Components
1. Edit `src/components/VisualEditor.tsx`
2. Update `componentTemplates` array
3. Add new component type to interface

### Extending AI Features
1. Edit `src/lib/ai-error-explainer.ts`
2. Add new methods to `AIErrorExplainer` class
3. Create corresponding API routes

---

## ✅ Testing Checklist

- [ ] Enterprise user can access Code Editor
- [ ] Basic/Pro users cannot access Code Editor
- [ ] Files load correctly
- [ ] File saving works
- [ ] Code Editor syntax highlighting works
- [ ] Visual Editor drag-and-drop works
- [ ] Deployment to Netlify succeeds
- [ ] Build logs display correctly
- [ ] Rollback functionality works
- [ ] AI assist provides suggestions
- [ ] Error explanation is helpful
- [ ] Toolbar features work (format, search, replace)

---

## 🏆 Success Metrics

### Key Performance Indicators
- **Conversion Rate**: Basic → Enterprise upgrades
- **Engagement**: Time spent in Code Editor
- **Deployment Success Rate**: % of successful builds
- **Rollback Usage**: Frequency of rollbacks
- **AI Assist Usage**: Number of AI suggestions requested

### Expected Impact
- **30-50% increase** in Enterprise conversions
- **2x longer** session duration for Enterprise users
- **90%+ deployment** success rate
- **High user satisfaction** due to AI assistance

---

**TRĂIASCĂ AFFILIFY!** 🚀

*Built with passion by the AFFILIFY team*
*Last Updated: October 26, 2025*


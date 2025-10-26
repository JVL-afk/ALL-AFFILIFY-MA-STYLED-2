import { ObjectId } from 'mongodb'

export interface FileContent {
  path: string
  content: string
  lastModified: Date
}

export interface Deployment {
  id: string
  timestamp: Date
  commitHash: string
  status: 'pending' | 'building' | 'success' | 'failed'
  buildLogs?: string
  liveUrl?: string
  errorDetails?: string
}

export interface UserCodeDocument {
  _id?: ObjectId
  userId: ObjectId
  appId: string // Unique identifier for this user's app instance
  files: FileContent[]
  deployments: Deployment[]
  lastDeployed?: Date
  lastModified: Date
  createdAt: Date
  netlifyAppId?: string // Netlify app ID for this user's deployment
  githubBranch?: string // GitHub branch name for this user
}

export interface CodeEditorState {
  currentFile: string
  unsavedChanges: boolean
  isDeploying: boolean
  lastSaved?: Date
}


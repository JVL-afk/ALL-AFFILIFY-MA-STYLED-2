import { Octokit } from '@octokit/rest'

const GITHUB_TOKEN = process.env.GITHUB_PAT || 'ghp_sxvhlCXj5Bm0cXMpK7e1QWRElrfj6A1GwZaj'
const GITHUB_OWNER = 'JVL-afk'
const GITHUB_REPO = 'ALL-AFFILIFY-MA-STYLED-2'

const octokit = new Octokit({
  auth: GITHUB_TOKEN
})

export interface FileUpdate {
  path: string
  content: string
}

export class GitHubService {
  /**
   * Push files to a specific branch in the repository
   */
  static async pushFiles(
    branchName: string,
    files: FileUpdate[],
    commitMessage: string
  ): Promise<string> {
    try {
      // Get the reference to the main branch
      const mainRef = await octokit.git.getRef({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        ref: 'heads/main'
      })

      const mainSha = mainRef.data.object.sha

      // Check if the user branch exists
      let branchExists = false
      try {
        await octokit.git.getRef({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          ref: `heads/${branchName}`
        })
        branchExists = true
      } catch (error) {
        // Branch doesn't exist, we'll create it
      }

      // Create or update the branch
      if (!branchExists) {
        await octokit.git.createRef({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          ref: `refs/heads/${branchName}`,
          sha: mainSha
        })
      }

      // Get the current commit SHA for the branch
      const branchRef = await octokit.git.getRef({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        ref: `heads/${branchName}`
      })

      const branchSha = branchRef.data.object.sha

      // Get the current tree
      const currentCommit = await octokit.git.getCommit({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        commit_sha: branchSha
      })

      const currentTreeSha = currentCommit.data.tree.sha

      // Create blobs for each file
      const blobs = await Promise.all(
        files.map(async (file) => {
          const blob = await octokit.git.createBlob({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64'
          })

          return {
            path: file.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blob.data.sha
          }
        })
      )

      // Create a new tree
      const newTree = await octokit.git.createTree({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        base_tree: currentTreeSha,
        tree: blobs
      })

      // Create a new commit
      const newCommit = await octokit.git.createCommit({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        message: commitMessage,
        tree: newTree.data.sha,
        parents: [branchSha]
      })

      // Update the branch reference
      await octokit.git.updateRef({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        ref: `heads/${branchName}`,
        sha: newCommit.data.sha
      })

      return newCommit.data.sha
    } catch (error: any) {
      console.error('GitHub push error:', error)
      throw new Error(`Failed to push to GitHub: ${error.message}`)
    }
  }

  /**
   * Get the list of commits for a branch
   */
  static async getCommits(branchName: string, limit: number = 10): Promise<any[]> {
    try {
      const commits = await octokit.repos.listCommits({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        sha: branchName,
        per_page: limit
      })

      return commits.data
    } catch (error: any) {
      console.error('Get commits error:', error)
      return []
    }
  }

  /**
   * Rollback to a specific commit
   */
  static async rollbackToCommit(branchName: string, commitSha: string): Promise<void> {
    try {
      await octokit.git.updateRef({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        ref: `heads/${branchName}`,
        sha: commitSha,
        force: true
      })
    } catch (error: any) {
      console.error('Rollback error:', error)
      throw new Error(`Failed to rollback: ${error.message}`)
    }
  }
}


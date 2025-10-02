import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, MessageSquare, Shield, Clock, Share2, ArrowRight, CheckCircle, Lock, UserPlus, Settings } from 'lucide-react'
import Header from '@/components/Header'

export default function TeamCollaborationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Team Collaboration for Affiliate Marketers
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Work together seamlessly with your team to create, manage, and optimize affiliate websites for maximum success.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Invite Team Members</h3>
              <p className="text-white/70">
                Add team members and assign specific roles and permissions based on their responsibilities.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Collaborate on Projects</h3>
              <p className="text-white/70">
                Work together on website creation, content, design, and optimization in real-time.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Manage Access & Security</h3>
              <p className="text-white/70">
                Control who can view, edit, or publish content with granular permission settings.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Role-Based Permissions</h3>
                <p className="text-white/70">
                  Assign specific roles like Admin, Editor, Writer, or Analyst with customized access levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Real-Time Collaboration</h3>
                <p className="text-white/70">
                  Work simultaneously on the same project with live updates and changes visible to all team members.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Task Management</h3>
                <p className="text-white/70">
                  Assign tasks, set deadlines, and track progress to ensure projects stay on schedule.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Communication Tools</h3>
                <p className="text-white/70">
                  Built-in messaging, comments, and notifications to keep everyone in sync.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Version History</h3>
                <p className="text-white/70">
                  Track changes, compare versions, and restore previous versions if needed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Activity Logs</h3>
                <p className="text-white/70">
                  Comprehensive logs of all actions taken by team members for transparency and accountability.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Roles */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Team Roles & Permissions</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-4 px-6 text-left text-white">Role</th>
                    <th className="py-4 px-6 text-center text-white">View</th>
                    <th className="py-4 px-6 text-center text-white">Edit</th>
                    <th className="py-4 px-6 text-center text-white">Publish</th>
                    <th className="py-4 px-6 text-center text-white">Manage Team</th>
                    <th className="py-4 px-6 text-center text-white">Access Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white font-medium">Admin</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white font-medium">Editor</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white font-medium">Writer</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white font-medium">Analyst</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-white font-medium">Viewer</td>
                    <td className="py-4 px-6 text-center text-green-400">✓</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                    <td className="py-4 px-6 text-center text-red-400">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Collaboration Tools */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Collaboration Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <MessageSquare className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Team Chat</h3>
              <p className="text-white/70">
                Communicate with your team in real-time with dedicated project channels and direct messages.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Clock className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Task Tracking</h3>
              <p className="text-white/70">
                Assign tasks, set deadlines, and monitor progress with visual task boards and timelines.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Lock className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Access Control</h3>
              <p className="text-white/70">
                Manage permissions and secure sensitive information with granular access controls.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Settings className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Workflow Automation</h3>
              <p className="text-white/70">
                Automate repetitive tasks and approval processes to streamline team workflows.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Team Dashboard Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Team Dashboard</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">FitnessGearPro Team</h3>
                  <p className="text-white/70">5 members · 3 active projects</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>Invite Member</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Active Projects</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">FitnessGearPro Website</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Yoga Equipment Blog</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">In Progress</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Home Gym Guide</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Planning</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Team Members</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white text-xs">JD</span>
                        </div>
                        <span className="text-white">John Doe</span>
                      </div>
                      <span className="text-white/70 text-sm">Admin</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white text-xs">JS</span>
                        </div>
                        <span className="text-white">Jane Smith</span>
                      </div>
                      <span className="text-white/70 text-sm">Editor</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white text-xs">RJ</span>
                        </div>
                        <span className="text-white">Robert Johnson</span>
                      </div>
                      <span className="text-white/70 text-sm">Writer</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs">JS</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">Jane updated the product comparison page</p>
                        <p className="text-white/50 text-xs">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs">RJ</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">Robert added 3 new product reviews</p>
                        <p className="text-white/50 text-xs">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs">JD</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">John published the Home Gym landing page</p>
                        <p className="text-white/50 text-xs">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Upcoming Tasks</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-white">Update product pricing for Black Friday</span>
                    </div>
                    <span className="text-white/70 text-sm">Due in 2 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-white">Create email campaign for new treadmill models</span>
                    </div>
                    <span className="text-white/70 text-sm">Due in 5 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-white">Review and approve new product images</span>
                    </div>
                    <span className="text-white/70 text-sm">Due in 1 week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Collaborate with Your Team?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Invite your team members and start working together to create high-converting affiliate websites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg flex items-center justify-center">
                  Start Collaborating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/docs">
                <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

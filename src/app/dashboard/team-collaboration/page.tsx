// Updated with AFFILIFY orange theme
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Settings, MessageSquare, Calendar, FileText, UserPlus, Crown, Shield, Eye, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: Date;
  joinedDate: Date;
  permissions: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  assignedTo: string[];
  dueDate: Date;
  createdDate: Date;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  type: 'create' | 'edit' | 'delete' | 'comment' | 'assign';
}

export default function TeamCollaborationPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'projects' | 'activity' | 'permissions'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = () => {
    // Mock team members
    const mockMembers: TeamMember[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@affilify.eu',
        role: 'owner',
        avatar: '/avatars/john.jpg',
        status: 'active',
        lastActive: new Date(),
        joinedDate: new Date(Date.now() - 86400000 * 30),
        permissions: ['all'],
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@affilify.eu',
        role: 'admin',
        avatar: '/avatars/sarah.jpg',
        status: 'active',
        lastActive: new Date(Date.now() - 3600000),
        joinedDate: new Date(Date.now() - 86400000 * 15),
        permissions: ['manage_websites', 'manage_analytics', 'manage_team'],
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@affilify.eu',
        role: 'editor',
        avatar: '/avatars/mike.jpg',
        status: 'active',
        lastActive: new Date(Date.now() - 7200000),
        joinedDate: new Date(Date.now() - 86400000 * 7),
        permissions: ['create_websites', 'edit_content', 'view_analytics'],
      },
      {
        id: '4',
        name: 'Emma Davis',
        email: 'emma@affilify.eu',
        role: 'viewer',
        avatar: '/avatars/emma.jpg',
        status: 'pending',
        lastActive: new Date(Date.now() - 86400000),
        joinedDate: new Date(Date.now() - 86400000 * 2),
        permissions: ['view_websites', 'view_analytics'],
      },
    ];

    // Mock projects
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Q1 Website Optimization',
        description: 'Optimize conversion rates for top-performing affiliate sites',
        status: 'active',
        progress: 65,
        assignedTo: ['2', '3'],
        dueDate: new Date(Date.now() + 86400000 * 14),
        createdDate: new Date(Date.now() - 86400000 * 10),
      },
      {
        id: '2',
        name: 'New Product Launch Campaign',
        description: 'Create affiliate sites for upcoming product launches',
        status: 'active',
        progress: 30,
        assignedTo: ['1', '2', '3'],
        dueDate: new Date(Date.now() + 86400000 * 21),
        createdDate: new Date(Date.now() - 86400000 * 5),
      },
      {
        id: '3',
        name: 'Analytics Dashboard Redesign',
        description: 'Improve user experience for analytics dashboard',
        status: 'completed',
        progress: 100,
        assignedTo: ['2'],
        dueDate: new Date(Date.now() - 86400000 * 3),
        createdDate: new Date(Date.now() - 86400000 * 20),
      },
    ];

    // Mock activities
    const mockActivities: Activity[] = [
      {
        id: '1',
        user: 'Sarah Wilson',
        action: 'created',
        target: 'Tech Gadgets Website',
        timestamp: new Date(Date.now() - 3600000),
        type: 'create',
      },
      {
        id: '2',
        user: 'Mike Johnson',
        action: 'updated',
        target: 'Q1 Website Optimization',
        timestamp: new Date(Date.now() - 7200000),
        type: 'edit',
      },
      {
        id: '3',
        user: 'John Doe',
        action: 'assigned',
        target: 'New Product Launch Campaign to Sarah Wilson',
        timestamp: new Date(Date.now() - 10800000),
        type: 'assign',
      },
      {
        id: '4',
        user: 'Sarah Wilson',
        action: 'commented on',
        target: 'Analytics Dashboard Redesign',
        timestamp: new Date(Date.now() - 14400000),
        type: 'comment',
      },
    ];

    setTeamMembers(mockMembers);
    setProjects(mockProjects);
    setActivities(mockActivities);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'editor': return <Edit className="h-4 w-4 text-green-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'on-hold': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <Plus className="h-4 w-4 text-green-600" />;
      case 'edit': return <Edit className="h-4 w-4 text-blue-600" />;
      case 'delete': return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'assign': return <UserPlus className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Team Collaboration
          </h1>
          <p className="text-gray-600 mt-2">Manage your team and collaborate on affiliate marketing projects</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Activity</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-15% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'members', label: 'Team Members', icon: Users },
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'activity', label: 'Activity', icon: MessageSquare },
            { id: 'permissions', label: 'Permissions', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Team Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        {getRoleIcon(member.role)}
                        <span className="text-sm text-gray-600 capitalize">{member.role}</span>
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500">
                        Last active: {member.lastActive.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {member.role !== 'owner' && (
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Permissions:</strong> {member.permissions.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined: {member.joinedDate.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Projects</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Assigned to: </span>
                      <span className="font-medium">
                        {project.assignedTo.map(id => 
                          teamMembers.find(m => m.id === id)?.name
                        ).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Due: </span>
                      <span className="font-medium">{project.dueDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Role Permissions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                role: 'Owner',
                icon: <Crown className="h-5 w-5 text-yellow-600" />,
                permissions: ['Full access to all features', 'Manage billing and subscription', 'Add/remove team members', 'Delete organization'],
                color: 'border-yellow-200 bg-yellow-50',
              },
              {
                role: 'Admin',
                icon: <Shield className="h-5 w-5 text-blue-600" />,
                permissions: ['Manage websites and campaigns', 'View all analytics', 'Manage team members', 'Configure integrations'],
                color: 'border-blue-200 bg-blue-50',
              },
              {
                role: 'Editor',
                icon: <Edit className="h-5 w-5 text-green-600" />,
                permissions: ['Create and edit websites', 'View assigned analytics', 'Comment on projects', 'Upload assets'],
                color: 'border-green-200 bg-green-50',
              },
              {
                role: 'Viewer',
                icon: <Eye className="h-5 w-5 text-gray-600" />,
                permissions: ['View websites and campaigns', 'View basic analytics', 'Comment on projects', 'Export reports'],
                color: 'border-gray-200 bg-gray-50',
              },
            ].map((roleInfo) => (
              <Card key={roleInfo.role} className={roleInfo.color}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {roleInfo.icon}
                    <span>{roleInfo.role}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {roleInfo.permissions.map((permission, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


import { ObjectId } from 'mongodb';
import { logger } from '@/lib/debug-logger';
import { VerifiedJWTPayload } from '@/lib/auth-strict';
import { addRelationship, deleteRelationship, userToSubject, toObject, generateZookie, Zookie } from '@/lib/zanzibar-rebac';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * Team Collaboration Service
 * Manages teams, members, projects, and enforces Zanzibar-inspired ReBAC.
 */

export interface TeamMember {
  _id?: ObjectId;
  userId: ObjectId;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending';
  addedAt: Date;
}

export interface Team {
  _id?: ObjectId;
  ownerId: ObjectId;
  name: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id?: ObjectId;
  teamId: ObjectId;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  assignedTo: ObjectId[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class TeamCollaborationService {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  /**
   * Create a new team for a user.
   * Enforces that a user can only own one team.
   */
  async createTeam(user: VerifiedJWTPayload, teamName: string, traceId?: string): Promise<{ team: Team; zookie: Zookie }> {
    logger.info('TeamCollaborationService', 'createTeam', 'Creating new team', {
      trace_id: traceId,
      user_id: user.userId,
      teamName,
    });

    const userId = new ObjectId(user.userId);

    // Check if user already owns a team
    const existingTeam = await this.db.collection('teams').findOne({ ownerId: userId });
    if (existingTeam) {
      logger.warn('TeamCollaborationService', 'createTeam', 'User already owns a team', {
        trace_id: traceId,
        user_id: user.userId,
        existingTeamId: existingTeam._id.toString(),
      });
      throw new Error('You already own a team. Delete it first to create a new one.');
    }

    const newTeam: Team = {
      ownerId: userId,
      name: teamName,
      members: [
        {
          userId,
          email: user.email,
          role: 'owner',
          status: 'active',
          addedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.db.collection('teams').insertOne(newTeam);
    newTeam._id = result.insertedId;

    // Add Zanzibar relationship: owner has 'owner' relation to team
    const zookie = await addRelationship(
      {
        object: toObject('team', result.insertedId.toString()),
        relation: 'owner',
        subject: userToSubject(user),
      },
      traceId
    );

    logger.info('TeamCollaborationService', 'createTeam', 'Team created successfully', {
      trace_id: traceId,
      teamId: result.insertedId.toString(),
      user_id: user.userId,
    });

    return { team: newTeam, zookie };
  }

  /**
   * Add a member to a team.
   * Enforces that only team owners/admins can add members.
   */
  async addTeamMember(
    user: VerifiedJWTPayload,
    teamId: string,
    memberEmail: string,
    memberRole: 'admin' | 'editor' | 'viewer',
    traceId?: string
  ): Promise<{ member: TeamMember; zookie: Zookie }> {
    logger.info('TeamCollaborationService', 'addTeamMember', 'Adding team member', {
      trace_id: traceId,
      user_id: user.userId,
      teamId,
      memberEmail,
      memberRole,
    });

    const teamObjectId = new ObjectId(teamId);
    const userId = new ObjectId(user.userId);

    // Fetch the team
    const team = await this.db.collection('teams').findOne({ _id: teamObjectId });
    if (!team) {
      logger.warn('TeamCollaborationService', 'addTeamMember', 'Team not found', {
        trace_id: traceId,
        teamId,
      });
      throw new Error('Team not found');
    }

    // Check if the user is the owner or admin of the team
    const userMember = team.members.find((m: TeamMember) => m.userId.toString() === userId.toString());
    if (!userMember || (userMember.role !== 'owner' && userMember.role !== 'admin')) {
      logger.warn('TeamCollaborationService', 'addTeamMember', 'User not authorized to add members', {
        trace_id: traceId,
        user_id: user.userId,
        teamId,
      });
      throw new Error('You do not have permission to add members to this team.');
    }

    // Check if member already exists
    const existingMember = team.members.find((m: TeamMember) => m.email === memberEmail);
    if (existingMember) {
      logger.warn('TeamCollaborationService', 'addTeamMember', 'Member already exists in team', {
        trace_id: traceId,
        teamId,
        memberEmail,
      });
      throw new Error('Member already exists in team');
    }

    // Add the new member
    const newMember: TeamMember = {
      userId: new ObjectId(), // In a real system, this would be the actual user ID from the email lookup
      email: memberEmail,
      role: memberRole,
      status: 'pending',
      addedAt: new Date(),
    };

    await this.db.collection('teams').updateOne(
      { _id: teamObjectId },
      { $push: { members: newMember } }
    );

    // Add Zanzibar relationship: member has 'memberRole' relation to team
    const zookie = await addRelationship(
      {
        object: toObject('team', teamId),
        relation: memberRole,
        subject: `user:${newMember.userId.toString()}`,
      },
      traceId
    );

    logger.info('TeamCollaborationService', 'addTeamMember', 'Team member added successfully', {
      trace_id: traceId,
      teamId,
      memberEmail,
      memberRole,
    });

    return { member: newMember, zookie };
  }

  /**
   * Remove a member from a team.
   * Enforces that only team owners can remove members.
   */
  async removeTeamMember(
    user: VerifiedJWTPayload,
    teamId: string,
    memberId: string,
    traceId?: string
  ): Promise<{ zookie: Zookie }> {
    logger.info('TeamCollaborationService', 'removeTeamMember', 'Removing team member', {
      trace_id: traceId,
      user_id: user.userId,
      teamId,
      memberId,
    });

    const teamObjectId = new ObjectId(teamId);
    const memberObjectId = new ObjectId(memberId);
    const userId = new ObjectId(user.userId);

    // Fetch the team
    const team = await this.db.collection('teams').findOne({ _id: teamObjectId });
    if (!team) {
      logger.warn('TeamCollaborationService', 'removeTeamMember', 'Team not found', {
        trace_id: traceId,
        teamId,
      });
      throw new Error('Team not found');
    }

    // Check if the user is the owner of the team
    const userMember = team.members.find((m: TeamMember) => m.userId.toString() === userId.toString());
    if (!userMember || userMember.role !== 'owner') {
      logger.warn('TeamCollaborationService', 'removeTeamMember', 'User not authorized to remove members', {
        trace_id: traceId,
        user_id: user.userId,
        teamId,
      });
      throw new Error('You do not have permission to remove members from this team.');
    }

    // Find the member to remove
    const memberToRemove = team.members.find((m: TeamMember) => m.userId.toString() === memberObjectId.toString());
    if (!memberToRemove) {
      logger.warn('TeamCollaborationService', 'removeTeamMember', 'Member not found in team', {
        trace_id: traceId,
        teamId,
        memberId,
      });
      throw new Error('Member not found in team');
    }

    // Remove the member
    await this.db.collection('teams').updateOne(
      { _id: teamObjectId },
      { $pull: { members: { userId: memberObjectId } } }
    );

    // Remove Zanzibar relationships for the member
    const zookie = await deleteRelationship(
      {
        object: toObject('team', teamId),
        relation: memberToRemove.role,
        subject: `user:${memberId}`,
      },
      traceId
    );

    logger.info('TeamCollaborationService', 'removeTeamMember', 'Team member removed successfully', {
      trace_id: traceId,
      teamId,
      memberId,
    });

    return { zookie };
  }

  /**
   * Create a project within a team.
   * Enforces that only team members can create projects.
   */
  async createProject(
    user: VerifiedJWTPayload,
    teamId: string,
    projectData: { name: string; description: string; dueDate?: Date },
    traceId?: string
  ): Promise<{ project: Project; zookie: Zookie }> {
    logger.info('TeamCollaborationService', 'createProject', 'Creating new project', {
      trace_id: traceId,
      user_id: user.userId,
      teamId,
      projectName: projectData.name,
    });

    const teamObjectId = new ObjectId(teamId);
    const userId = new ObjectId(user.userId);

    // Fetch the team
    const team = await this.db.collection('teams').findOne({ _id: teamObjectId });
    if (!team) {
      logger.warn('TeamCollaborationService', 'createProject', 'Team not found', {
        trace_id: traceId,
        teamId,
      });
      throw new Error('Team not found');
    }

    // Check if the user is a member of the team
    const userMember = team.members.find((m: TeamMember) => m.userId.toString() === userId.toString());
    if (!userMember) {
      logger.warn('TeamCollaborationService', 'createProject', 'User not a member of the team', {
        trace_id: traceId,
        user_id: user.userId,
        teamId,
      });
      throw new Error('You are not a member of this team.');
    }

    const newProject: Project = {
      teamId: teamObjectId,
      name: projectData.name,
      description: projectData.description,
      status: 'active',
      progress: 0,
      assignedTo: [userId],
      dueDate: projectData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.db.collection('projects').insertOne(newProject);
    newProject._id = result.insertedId;

    // Add Zanzibar relationship: user has 'editor' relation to project
    const zookie = await addRelationship(
      {
        object: toObject('project', result.insertedId.toString()),
        relation: 'editor',
        subject: userToSubject(user),
      },
      traceId
    );

    logger.info('TeamCollaborationService', 'createProject', 'Project created successfully', {
      trace_id: traceId,
      projectId: result.insertedId.toString(),
      teamId,
      user_id: user.userId,
    });

    return { project: newProject, zookie };
  }

  /**
   * Get all projects for a team.
   * Enforces that only team members can view projects.
   */
  async getTeamProjects(user: VerifiedJWTPayload, teamId: string, traceId?: string): Promise<Project[]> {
    logger.info('TeamCollaborationService', 'getTeamProjects', 'Fetching team projects', {
      trace_id: traceId,
      user_id: user.userId,
      teamId,
    });

    const teamObjectId = new ObjectId(teamId);
    const userId = new ObjectId(user.userId);

    // Fetch the team
    const team = await this.db.collection('teams').findOne({ _id: teamObjectId });
    if (!team) {
      logger.warn('TeamCollaborationService', 'getTeamProjects', 'Team not found', {
        trace_id: traceId,
        teamId,
      });
      throw new Error('Team not found');
    }

    // Check if the user is a member of the team
    const userMember = team.members.find((m: TeamMember) => m.userId.toString() === userId.toString());
    if (!userMember) {
      logger.warn('TeamCollaborationService', 'getTeamProjects', 'User not a member of the team', {
        trace_id: traceId,
        user_id: user.userId,
        teamId,
      });
      throw new Error('You are not a member of this team.');
    }

    const projects = await this.db.collection('projects').find({ teamId: teamObjectId }).toArray();

    logger.info('TeamCollaborationService', 'getTeamProjects', 'Team projects fetched successfully', {
      trace_id: traceId,
      teamId,
      projectCount: projects.length,
    });

    return projects as Project[];
  }
}

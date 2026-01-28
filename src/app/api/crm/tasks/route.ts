import { NextRequest, NextResponse } from 'next/server';
import Task, { ITask } from '@/lib/models/Task';
import { requirePremiumCRM, PremiumUser } from '@/lib/premium-gating';
import { logger } from '@/lib/debug-logger';
import { connectMongoose } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';

/**
 * GET /api/crm/tasks - Get all tasks for the authenticated premium user
 * Supports filtering, sorting, and pagination
 */
async function handleGET(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'GET_REQUEST_START', { requestId, userId: user.id, tier: user.tier });
    await connectMongoose();
    
    // Extract query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    logger.debug('CRM_TASKS_API', 'QUERY_PARAMS', { requestId, page, limit, status, priority, sortBy, sortOrder });

    // Build filter query
    const filter: any = { userId: new mongoose.Types.ObjectId(user.id) };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    logger.debug('CRM_TASKS_API', 'FETCHING_TASKS', { requestId, filter });

    // Fetch total count for pagination
    const total = await Task.countDocuments(filter);

    // Fetch tasks with sorting and pagination
    const tasks = await Task.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    logger.info('CRM_TASKS_API', 'TASKS_FETCHED_SUCCESS', { 
      requestId, 
      taskCount: tasks.length, 
      total,
      page,
      pages: Math.ceil(total / limit)
    });

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/tasks - Create a new task for the authenticated premium user
 */
async function handlePOST(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'POST_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    const body = await request.json();
    logger.debug('CRM_TASKS_API', 'REQUEST_BODY_PARSED', { requestId, bodyKeys: Object.keys(body) });

    // Validate required fields
    if (!body.title || !body.description) {
      logger.warn('CRM_TASKS_API', 'MISSING_REQUIRED_FIELDS', { requestId });
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    logger.debug('CRM_TASKS_API', 'CREATING_TASK_DOCUMENT', { requestId, title: body.title });

    const newTask = new Task({
      ...body,
      userId: new mongoose.Types.ObjectId(user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.debug('CRM_TASKS_API', 'SAVING_TASK_TO_DATABASE', { requestId, taskId: newTask._id });
    await newTask.save();

    logger.info('CRM_TASKS_API', 'TASK_CREATED_SUCCESS', { 
      requestId, 
      taskId: newTask._id, 
      userId: user.id,
      title: newTask.title 
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/tasks - Update an existing task
 */
async function handlePUT(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'PUT_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      logger.warn('CRM_TASKS_API', 'MISSING_TASK_ID', { requestId });
      return NextResponse.json(
        { message: 'Task ID is required for update' },
        { status: 400 }
      );
    }

    logger.debug('CRM_TASKS_API', 'UPDATING_TASK', { requestId, taskId: _id, updateKeys: Object.keys(updateData) });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const updatedTask = await Task.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(user.id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      logger.warn('CRM_TASKS_API', 'TASK_NOT_FOUND_OR_UNAUTHORIZED', { requestId, taskId: _id, userId: user.id });
      return NextResponse.json(
        { message: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_TASKS_API', 'TASK_UPDATED_SUCCESS', { requestId, taskId: _id, userId: user.id });
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/tasks - Delete a task
 */
async function handleDELETE(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'DELETE_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      logger.warn('CRM_TASKS_API', 'MISSING_DELETE_ID', { requestId });
      return NextResponse.json(
        { message: 'Task ID is required for deletion' },
        { status: 400 }
      );
    }

    logger.debug('CRM_TASKS_API', 'DELETING_TASK', { requestId, taskId: id, userId: user.id });

    const deletedTask = await Task.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!deletedTask) {
      logger.warn('CRM_TASKS_API', 'TASK_NOT_FOUND_FOR_DELETE', { requestId, taskId: id, userId: user.id });
      return NextResponse.json(
        { message: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_TASKS_API', 'TASK_DELETED_SUCCESS', { requestId, taskId: id, userId: user.id });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crm/tasks - Bulk update tasks (e.g., change status for multiple tasks)
 */
async function handlePATCH(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'PATCH_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    const body = await request.json();
    const { taskIds, updateData } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      logger.warn('CRM_TASKS_API', 'INVALID_TASK_IDS', { requestId });
      return NextResponse.json(
        { message: 'taskIds array is required' },
        { status: 400 }
      );
    }

    logger.debug('CRM_TASKS_API', 'BULK_UPDATING_TASKS', { 
      requestId, 
      taskCount: taskIds.length, 
      updateKeys: Object.keys(updateData) 
    });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const result = await Task.updateMany(
      {
        _id: { $in: taskIds.map(id => new mongoose.Types.ObjectId(id)) },
        userId: new mongoose.Types.ObjectId(user.id),
      },
      updateData,
      { runValidators: true }
    );

    logger.info('CRM_TASKS_API', 'BULK_UPDATE_SUCCESS', { 
      requestId, 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount 
    });

    return NextResponse.json({
      message: 'Tasks updated successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'PATCH_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

// Export wrapped handlers with premium gating
export const GET = requirePremiumCRM(handleGET);
export const POST = requirePremiumCRM(handlePOST);
export const PUT = requirePremiumCRM(handlePUT);
export const DELETE = requirePremiumCRM(handleDELETE);
export const PATCH = requirePremiumCRM(handlePATCH);

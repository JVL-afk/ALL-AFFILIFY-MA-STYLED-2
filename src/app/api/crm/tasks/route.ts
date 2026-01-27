import { NextRequest, NextResponse } from 'next/server';
import Task, { ITask } from '@/lib/models/Task';
import { verifyAuth } from '@/lib/auth';
import { logger } from '@/lib/debug-logger';
import { connectMongoose, isMongooseConnected } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';

// GET /api/crm/tasks - Get all tasks for the authenticated user
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'GET_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_TASKS_API', 'AUTHENTICATION_FAILED', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const tasks = await Task.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    logger.info('CRM_TASKS_API', 'TASKS_FETCHED_SUCCESS', { requestId, taskCount: tasks.length });
    return NextResponse.json(tasks);
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// POST /api/crm/tasks - Create a new task
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'POST_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_TASKS_API', 'AUTHENTICATION_FAILED_POST', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const body = await request.json();
    const newTask: ITask = new Task({
      ...body,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await newTask.save();
    logger.info('CRM_TASKS_API', 'TASK_CREATED_SUCCESS', { requestId, taskId: newTask._id });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// PUT /api/crm/tasks - Update an existing task
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'PUT_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_TASKS_API', 'AUTHENTICATION_FAILED_PUT', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: 'Task ID is required for update' }, { status: 400 });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      logger.warn('CRM_TASKS_API', 'TASK_NOT_FOUND', { requestId, taskId: _id });
      return NextResponse.json({ message: 'Task not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_TASKS_API', 'TASK_UPDATED_SUCCESS', { requestId, taskId: _id });
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// DELETE /api/crm/tasks - Delete a task
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_TASKS_API', 'DELETE_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_TASKS_API', 'AUTHENTICATION_FAILED_DELETE', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Task ID is required for deletion' }, { status: 400 });
    }

    const deletedTask = await Task.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!deletedTask) {
      logger.warn('CRM_TASKS_API', 'TASK_NOT_FOUND_FOR_DELETE', { requestId, taskId: id });
      return NextResponse.json({ message: 'Task not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_TASKS_API', 'TASK_DELETED_SUCCESS', { requestId, taskId: id });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_TASKS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

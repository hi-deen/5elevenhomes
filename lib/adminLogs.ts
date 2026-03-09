import { prisma } from './prisma';

export interface LogActivityParams {
  userId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
}

export async function logAdminActivity({
  userId,
  action,
  targetType,
  targetId,
  description,
  metadata,
  ipAddress,
}: LogActivityParams) {
  try {
    await prisma.adminActivityLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        description,
        metadata,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
    // Don't throw error to avoid breaking the main flow
  }
}

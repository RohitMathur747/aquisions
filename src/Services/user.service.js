import logger from '#config/logger.js';
import { users } from '#models/user.models.js';
import { db } from '#config/database.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (error) {
    logger.error('Error in getting Users', error);
  }
};

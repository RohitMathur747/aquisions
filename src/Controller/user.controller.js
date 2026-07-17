import logger from '#config/logger.js';
import { getAllUsers } from '#services/user.service.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting Users...');
    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrived users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

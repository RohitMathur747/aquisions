import logger from '#config/logger.js';
import { formatValidationErrror } from '#utils/format.js';
import {
  updateUserSchema,
  userIdSchema,
} from '#validations/users.validation.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/user.service.js';

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

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(validationResult.error),
      });
    }

    logger.info(`Getting user ${validationResult.data.id}...`);
    const user = await getUserById(validationResult.data.id);

    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (error) {
    logger.error('Get user by ID error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};

export const modifyUser = async (req, res, next) => {
  try {
    const idValidation = userIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(idValidation.error),
      });
    }

    const updateValidation = updateUserSchema.safeParse(req.body);
    if (!updateValidation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(updateValidation.error),
      });
    }

    const requestedUserId = idValidation.data.id;
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (
      authenticatedUser.id !== requestedUserId &&
      authenticatedUser.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to update this user' });
    }

    if (
      updateValidation.data.role &&
      authenticatedUser.role !== 'admin' &&
      authenticatedUser.id !== requestedUserId
    ) {
      return res
        .status(403)
        .json({ error: 'Only admins can update user roles' });
    }

    logger.info(`Updating user ${requestedUserId}...`);
    const updatedUser = await updateUser(
      requestedUserId,
      updateValidation.data
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Update user error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};

export const removeUser = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(validationResult.error),
      });
    }

    const requestedUserId = validationResult.data.id;
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (
      authenticatedUser.id !== requestedUserId &&
      authenticatedUser.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this user' });
    }

    logger.info(`Deleting user ${requestedUserId}...`);
    const result = await deleteUser(requestedUserId);

    res.json({
      message: 'User deleted successfully',
      result,
    });
  } catch (error) {
    logger.error('Delete user error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};

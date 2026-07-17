import {
  fetchAllUsers,
  fetchUserById,
  modifyUser,
  removeUser,
} from '#controller/user.controller.js';
import { cookies } from '#utils/cookies.js';
import { jwttoken } from '#utils/jwt.js';
import express from 'express';

const router = express.Router();

const authenticateUser = (req, res, next) => {
  const token = cookies.get(req, 'token');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decodedUser = jwttoken.verify(token);
  if (!decodedUser) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decodedUser;
  next();
};

router.get('/', authenticateUser, fetchAllUsers);
router.get('/:id', authenticateUser, fetchUserById);
router.put('/:id', authenticateUser, modifyUser);
router.delete('/:id', authenticateUser, removeUser);

export default router;

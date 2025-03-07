// routes/messageRoutes.js
import express from 'express';
import { protectEducator } from '../middlewares/authMiddleware.js';
import {
  sendMessage,
  getMessages,
  createGroup,
  getUserGroups,
} from '../controllers/messageController.js';

const router = express.Router();

// Send a message
router.post('/send', protectEducator, sendMessage);

// Get messages for a user (direct and group messages)
router.get('/:userId', protectEducator, getMessages);

// Create a group
router.post('/group', protectEducator, createGroup);

// Get all groups for a user
router.get('/groups/:userId', protectEducator, getUserGroups);

export default router;
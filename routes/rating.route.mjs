import express from 'express';

import {
  addRating,
  getAverageRating,
} from '../controllers/rating.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const ratingRouter = express.Router();

ratingRouter.post("/:targetType/:targetId", verifyToken,checkRole("owner"), addRating);
ratingRouter.get("/:targetType/:targetId/average", getAverageRating);

export default ratingRouter;

import express from 'express';

import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from '../controllers/careArticle.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const articleRouter = express.Router();

articleRouter.post("/", verifyToken, checkRole("admin"), createArticle);
articleRouter.get("/", getArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.put("/:id", verifyToken, checkRole("admin"), updateArticle);
articleRouter.delete("/:id", verifyToken, checkRole("admin"), deleteArticle);

export default articleRouter;

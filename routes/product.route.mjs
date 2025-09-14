import express from 'express';

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../controllers/product.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import upload from '../middlewares/multer.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", verifyToken, checkRole("admin", "shelter"), upload.single("image"), addProduct);
productRouter.put("/:id", verifyToken, checkRole("admin", "shelter"), updateProduct);
productRouter.delete("/:id", verifyToken, checkRole("admin", "shelter"), deleteProduct);

export default productRouter;

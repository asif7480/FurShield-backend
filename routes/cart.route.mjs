import express from 'express';

import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cart.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const cartRouter = express.Router();

cartRouter.post("/", verifyToken, checkRole("owner"), addToCart);
cartRouter.get("/", verifyToken, checkRole("owner"), getCart);
cartRouter.put("/", verifyToken, checkRole("owner"), updateCartItem);
cartRouter.delete("/item", verifyToken, checkRole("owner"), removeFromCart);
cartRouter.delete("/clear", verifyToken, checkRole("owner"), clearCart);

export default cartRouter;

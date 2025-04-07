import { Router, type Request, type Response } from "express";
import {
  addProduct,
  fetchProduct,
  ownerLogin,
  ownerSignup,
  deleteProduct,
  updateProduct,
  fetchStock,
  userDetails,
  totalProducts,
  totalStaff,
} from "../controller/ownerController";
import ownerMiddleware from "../middleware/ownerMiddleware";

const ownerRouter = Router();

ownerRouter.post("/signup", ownerSignup);
ownerRouter.post("/login", ownerLogin);
ownerRouter.get("/products", ownerMiddleware, fetchProduct);
ownerRouter.post("/add-product", ownerMiddleware, addProduct);
ownerRouter.patch("/update-product/:productId", ownerMiddleware, updateProduct);
ownerRouter.delete(
  "/delete-product/:productId",
  ownerMiddleware,
  deleteProduct
);
ownerRouter.get("/stocks", ownerMiddleware, fetchStock);
ownerRouter.get("/details", ownerMiddleware, userDetails);
ownerRouter.get("/total-products", ownerMiddleware, totalProducts);
ownerRouter.get("/total-staffs", ownerMiddleware, totalStaff);

export { ownerRouter };

import { Router, type Request, type Response } from "express";
import {
  addProduct,
  deleteProduct,
  fetchProduct,
  staffLogin,
  staffRegister,
  updateProduct,
} from "../controller/staffController";
import staffMiddleware from "../middleware/staffMiddleware";

const staffRouter = Router();

staffRouter.post("/signup", staffRegister);
staffRouter.post("/login", staffLogin);
staffRouter.post("/add-product", staffMiddleware, addProduct);
staffRouter.patch("/update-product/:productId", staffMiddleware, updateProduct);
staffRouter.delete(
  "/delete-product/:productId",
  staffMiddleware,
  deleteProduct
);
staffRouter.get("/products", staffMiddleware, fetchProduct)

export { staffRouter };

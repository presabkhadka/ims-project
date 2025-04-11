import { Router, type Request, type Response } from "express";
import {
  addProduct,
  deleteProduct,
  fetchDetails,
  fetchProduct,
  fetchStock,
  staffLogin,
  staffRegister,
  totalProductStaff,
  updateProduct,
  totalOrder,
  getSupplier,
  totalSupplier,
  createOrder,
  getOrder,
  createOrderManual,
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
staffRouter.get("/products", staffMiddleware, fetchProduct);
staffRouter.get("/stocks", staffMiddleware, fetchStock);
staffRouter.get("/details", staffMiddleware, fetchDetails);
staffRouter.get("/total-products", staffMiddleware, totalProductStaff);
staffRouter.get("/total-orders", staffMiddleware, totalOrder);
staffRouter.get("/suppliers", staffMiddleware, getSupplier);
staffRouter.get("/total-suppliers", staffMiddleware, totalSupplier);
staffRouter.get("/create-orders", staffMiddleware, createOrder);
staffRouter.get("/orders", staffMiddleware, getOrder);
staffRouter.post("/create-order", staffMiddleware, createOrderManual)

export { staffRouter };

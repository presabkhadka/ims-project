import { Router } from "express";
import {
  addProductManager,
  addSupplierManager,
  deleteProductManager,
  deleteSupplierManager,
  fetchDetailsManager,
  fetchProductManager,
  fetchStockManager,
  fetchSupplierManager,
  managerLogin,
  managerSignup,
  totalOrderManager,
  totalProductManager,
  totalSaffsManager,
  totalSupplierManager,
  updateProductManager,
  updateSupplierManager,
} from "../controller/managerController";
import managerMiddleware from "../middleware/managerMiddleware";

const managerRouter = Router();

managerRouter.post("/signup", managerSignup);
managerRouter.post("/login", managerLogin);
managerRouter.post("/add-product", managerMiddleware, addProductManager);
managerRouter.patch(
  "/update-product/:productId",
  managerMiddleware,
  updateProductManager
);
managerRouter.delete(
  "/delete-product/:productId",
  managerMiddleware,
  deleteProductManager
);
managerRouter.get("/products", managerMiddleware, fetchProductManager);
managerRouter.get("/stocks", managerMiddleware, fetchStockManager);
managerRouter.get("/details", managerMiddleware, fetchDetailsManager);
managerRouter.get("/total-product", managerMiddleware, totalProductManager);
managerRouter.get("/total-orders", managerMiddleware, totalOrderManager);
managerRouter.post("/add-supplier", managerMiddleware, addSupplierManager);
managerRouter.get("/suppliers", managerMiddleware, fetchSupplierManager);
managerRouter.patch(
  "/update-supplier/:supplierId",
  managerMiddleware,
  updateSupplierManager
);
managerRouter.delete(
  "/delete-supplier/:supplierId",
  managerMiddleware,
  deleteSupplierManager
);
managerRouter.get("/total-supplier", managerMiddleware, totalSupplierManager);
managerRouter.get("/total-staffs", managerMiddleware, totalSaffsManager)
export { managerRouter };

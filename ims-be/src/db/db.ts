import mongoose, { mongo, Types, Document } from "mongoose";

mongoose.connect(
  "mongodb+srv://imsnepal123:WtvDl56tbW4R8Qao@cluster0.gjep52q.mongodb.net/IMS"
);

const staffSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  userType: {
    type: String,
    enum: ["staff"],
  },
});

const managerSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  userType: {
    type: String,
    enum: ["manager"],
  },
});

const ownerSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  userType: {
    type: String,
    enum: ["owner"],
  },
});

const customerSchema = new mongoose.Schema({
  Name: String,
  Phone: String,
  Address: String,
  Email: String,
});

const orderSchema = new mongoose.Schema({
  Date: Date,
  Status: String,
  DeliveryMethod: String,
  CustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const productSchema = new mongoose.Schema({
  Name: String,
  Description: String,
  Category: String,
  Price: mongoose.Types.Decimal128,
  Quantity: Number,
  Available: {
    type: String,
    enum: ["In Stock", "Low in stock"],
  },
  Image: String,
});

const stockSchema = new mongoose.Schema({
  BookingDate: Date,
  Status: String,
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  PurchaseAmount: mongoose.Types.Decimal128,
});

const inventorySchema = new mongoose.Schema({
  AvailableItems: Number,
  UpdateDate: Date,
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  StockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
  },
});

const orderItemSchema = new mongoose.Schema({
  Quantity: Number,
  UnitPrice: mongoose.Types.Decimal128,
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  OrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
});

const monthlyReportSchema = new mongoose.Schema({
  TotalSales: mongoose.Types.Decimal128,
  TotalPurchase: mongoose.Types.Decimal128,
  StockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
  },
});

const notificationSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Available: { type: String, required: true },
    cleared: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
export const Stock = mongoose.model("Stock", stockSchema);
export const Order = mongoose.model("Order", orderSchema);
export const Inventory = mongoose.model("Inventory", inventorySchema);
export const MonthlyReport = mongoose.model(
  "MonthlyReport",
  monthlyReportSchema
);
export const Customer = mongoose.model("Customer", customerSchema);
export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export const Owner = mongoose.model("Owner", ownerSchema);
export const Staff = mongoose.model("Staff", staffSchema);
export const Manager = mongoose.model("Manager", managerSchema);
export const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
  Product,
  Stock,
  Order,
  Inventory,
  MonthlyReport,
  Customer,
  OrderItem,
  Owner,
  Staff,
  Manager,
  Notification,
};

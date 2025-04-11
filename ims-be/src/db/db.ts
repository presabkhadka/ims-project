import mongoose, { mongo, Types, Document } from "mongoose";

mongoose.connect(
  "mongodb+srv://imsnepal123:WtvDl56tbW4R8Qao@cluster0.gjep52q.mongodb.net/IMS"
);

const staffSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  userEmail: String,
  userPassword: String,
  userType: {
    type: String,
    enum: ["staff"],
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
  },
});

const managerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  userEmail: String,
  userPassword: String,
  userType: {
    type: String,
    enum: ["manager"],
  },
});

const ownerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
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
  Status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Cancelled"],
  },
  DeliveryMethod: {
    type: String,
    enum: ["Pickup", "Home Delivery"],
  },
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  Employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  ExternalOrderId: String,
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
  Supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
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
  TotalPrice: mongoose.Types.Decimal128,
});

const supplierSchema = new mongoose.Schema({
  Name: String,
  Phone: String,
  Email: String,
  Address: String,
});

export const Product = mongoose.model("Product", productSchema);
export const Order = mongoose.model("Order", orderSchema);
export const Customer = mongoose.model("Customer", customerSchema);
export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export const Owner = mongoose.model("Owner", ownerSchema);
export const Staff = mongoose.model("Staff", staffSchema);
export const Supplier = mongoose.model("Supplier", supplierSchema);
export const Manager = mongoose.model("Manager", managerSchema);

module.exports = {
  Product,
  Order,
  Customer,
  OrderItem,
  Owner,
  Staff,
  Supplier,
  Manager,
};

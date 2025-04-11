import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { Customer, Order, OrderItem, Product, Staff, Supplier } from "../db/db";
import axios, { responseEncoding } from "axios";
import { overwriteMiddlewareResult } from "mongoose";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const client = new OAuth2Client();

export async function staffRegister(req: Request, res: Response) {
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userName = req.body.userName;
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;
    let userType = "staff";
    if (!userName || !userEmail || !userPassword || !firstName || !lastName) {
      res.status(401).json({
        msg: "input fields cannot be left empty",
      });
      return;
    } else {
      let exitsingStaff = await Staff.findOne({
        userEmail: userEmail,
      });
      if (exitsingStaff) {
        res.status(409).json({
          msg: "staff already exists witht this email",
        });
        return;
      }
      let hashedPassword = await bcrypt.hash(userPassword, 10);
      await Staff.create({
        firstName,
        lastName,
        userName,
        userEmail,
        userPassword: hashedPassword,
        userType,
      });
    }
    res.status(200).json({
      msg: "staff created successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong whie creating the staff",
    });
  }
}

export async function staffLogin(req: Request, res: Response) {
  try {
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;
    let existingStaff = await Staff.findOne({
      userEmail,
    });

    if (!userEmail || !userPassword) {
      res.status(404).json({
        msg: "input fields are empty",
      });
      return;
    }

    if (!existingStaff) {
      res.status(404).json({
        msg: "No such staff found in our db",
      });
      return;
    }

    if (
      !existingStaff.userPassword ||
      typeof existingStaff.userPassword !== "string"
    ) {
      res.status(401).json({
        msg: "password is invalid or missing",
      });
      return;
    }

    let passwordMatch = await bcrypt.compare(
      userPassword,
      existingStaff.userPassword
    );

    if (!passwordMatch) {
      res.status(403).json({
        msg: "Invalid password",
      });
    }

    let token = jwt.sign({ userEmail }, process.env.JWT_SECRET || "defaultKey");
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "somethig went wrong at the server",
    });
  }
}

export async function addProduct(req: Request, res: Response) {
  try {
    let Name = req.body.Name;
    let Description = req.body.Description;
    let Category = req.body.Category;
    let Price = req.body.Price;
    let Quantity = req.body.Quantity;
    let Available;

    if (!Name || !Description || !Category || !Price || !Quantity) {
      res.status(400).json({
        msg: "input fields cannot be left empty",
      });
      return;
    }

    let existingProduct = await Product.findOne({
      Name,
    });

    if (existingProduct) {
      res.status(409).json({
        msg: "Product already exists try editing the product",
      });
      return;
    } else {
      if (
        Quantity <= 20 ? (Available = "Low in stock") : (Available = "In Stock")
      )
        await Product.create({
          Name,
          Description,
          Category,
          Price,
          Quantity,
          Available,
        });
      res.status(200).json({
        msg: "product created successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    let productId = req.params.productId;
    let { Name, Description, Category, Price, Quantity } = req.body;
    let status;

    let fieldsToUpdate: Record<string, any> = {};

    if (Name) fieldsToUpdate.Name = Name;
    if (Description) fieldsToUpdate.Description = Description;
    if (Category) fieldsToUpdate.Category = Category;
    if (Price) fieldsToUpdate.Price = Price;
    if (Quantity) fieldsToUpdate.Quantity = Quantity;
    if (Quantity <= 20 ? (status = "Low in stock") : (status = "In Stock")) {
      fieldsToUpdate.Available = status;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      res.status(400).json({
        msg: "no fields to update",
      });
      return;
    }

    let result = await Product.updateOne(
      { _id: productId },
      {
        $set: fieldsToUpdate,
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        msg: "product not found",
      });
      return;
    }

    res.status(200).json({
      msg: "product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    let productId = req.params.productId;

    let existingProduct = await Product.findOne({
      _id: productId,
    });

    if (!existingProduct) {
      res.status(400).json({
        msg: "no such product found in our db",
      });
      return;
    } else {
      await Product.deleteOne({
        _id: productId,
      });
      res.status(200).json({
        msg: `product ${existingProduct.Name} deleted successfully`,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function fetchProduct(req: Request, res: Response) {
  try {
    let products = await Product.find({});

    if (products.length === 0) {
      res.status(404).json({
        msg: "no products found in our db, please add some products",
      });
      return;
    } else {
      res.status(200).json({
        products,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server at the moment",
    });
  }
}

export async function fetchStock(req: Request, res: Response) {
  try {
    let stocks = await Product.find({}).select("_id Name Quantity Available");
    if (stocks.length === 0) {
      res.status(404).json({
        msg: "no products found in stock",
      });
      return;
    }
    res.status(200).json({
      stocks,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function fetchDetails(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        msg: "Authorization failed",
      });
      return;
    }
    let staff = await Staff.findOne({
      userEmail: user,
    }).select("firstName lastName userName userEmail");

    res.status(200).json({
      staff,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function totalProductStaff(req: Request, res: Response) {
  try {
    let products = await Product.find({});

    if (products.length === 0) {
      res.status(404).json({
        msg: "no products found in our db, please add some products",
      });
      return;
    } else {
      let totalProduct = products.length;
      res.status(200).json({
        totalProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server at the moment",
    });
  }
}

export async function totalOrder(req: Request, res: Response) {
  try {
    let order = await Order.find({});
    if (!order) {
      res.status(404).json({
        msg: "no orders found in our db",
      });
      return;
    }
    let totalOrder = order.length;

    res.status(200).json({
      totalOrder,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({
        msg: error.message,
      });
  }
}

export async function getSupplier(req: Request, res: Response) {
  try {
    let suppliers = await Supplier.find({});
    if (!suppliers) {
      res.status(404).json({
        msg: "no supplier found in our db",
      });
      return;
    }
    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function totalSupplier(req: Request, res: Response) {
  try {
    let suppliers = (await Supplier.find({})).length;
    if (!suppliers) {
      res.status(404).json({
        msg: "no supplier found in our db",
      });
      return;
    }
    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { data } = await axios.get(
      "https://dummyjson.com/c/deda-383d-4301-a302"
    );

    const orders = [];

    for (const item of data.orders) {
      const existingOrder = await Order.findOne({
        ExternalOrderId: item.orderId,
      });
      if (existingOrder) {
        console.log(`Order already exists for external ID: ${item.orderId}`);
        continue;
      }

      let customer = await Customer.findOne({ Email: item.customerEmail });
      if (!customer) {
        customer = await Customer.create({
          Name: item.customerName,
          Email: item.customerEmail,
          Address: "Unknown",
          Phone: "0000000000",
        });
      }

      const product = await Product.findOne({ Name: item.productName });
      if (!product) {
        console.warn(`Product not found: ${item.productName}`);
        continue;
      }

      const order = await Order.create({
        Date: new Date(),
        Status: "Pending",
        DeliveryMethod: "Home Delivery",
        Customer: customer._id,
        Employee: null,
        ExternalOrderId: item.orderId,
      });

      const orderItem = await OrderItem.create({
        Quantity: item.quantity,
        UnitPrice: item.unitPrice,
        ProductId: product._id,
        OrderId: order._id,
      });

      orders.push({
        orderId: order._id,
        customerName: customer.Name,
        productName: product.Name,
        quantity: orderItem.Quantity,
        unitPrice: orderItem.UnitPrice,
        // @ts-ignore
        totalPrice: orderItem.Quantity * orderItem.UnitPrice,
        DeliveryMethod: order.DeliveryMethod,
        Status: order.Status,
      });
    }

    res.status(200).json({
      msg: "Orders placed successfully",
      orders,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({
      msg: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    let orders = await Order.find({}).populate({
      path: "Customer",
      select: "Name",
    });
    if (!orders) {
      res.status(404).json({
        msg: "no orders found in our db",
      });
      return;
    }
    res.status(200).json({
      orders,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ msg: error.message });
    }
  }
}

export async function createOrderManual(req: Request, res: Response) {
  try {
    let user = req.user;
    if (!user) {
      res.status(401).json({
        msg: "Unauthorized access",
      });
      return;
    }
    let date = new Date();
    let Status = req.body.Status;
    let DeliveryMethod = req.body.DeliveryMethod;
    let customerName = req.body.customerName;
    let employee = await Staff.findOne({
      userEmail: user,
    });
    let Employee = employee?._id;
    let ExternalOrderId = uuidv4();
    let productName = req.body.productName;
    let product = await Product.findOne({
      Name: productName,
    });
    if (!product) {
      res.status(404).json({
        msg: "product not found in stock, please check stock and try again",
      });
      return;
    }
    let customer = await Customer.findOne({
      Name: customerName,
    });
    if (!customer) {
      await Customer.create({
        Name: customerName,
      });
    }
    let Quantity = req.body.Quantity;
    let price = product.Price;
    let productId = product?._id;

    if (!Date || !Status || !DeliveryMethod || !customerName) {
      res.status(404).json({
        msg: "input fields cannot be left empty",
      });
      return;
    }

    let order = await Order.create({
      Date: date,
      Status,
      DeliveryMethod,
      Customer: customer?._id,
      Employee,
      ExternalOrderId,
    });

    // @ts-ignore
    let totalPrice = Quantity * price;

    let orderItem = await OrderItem.create({
      Quantity,
      UnitPrice: price,
      ProductId: productId,
      OrderId: order._id,
      TotalPrice: totalPrice,
    });

    res.status(200).json({
      msg: "order created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

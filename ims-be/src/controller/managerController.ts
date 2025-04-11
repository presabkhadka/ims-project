import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { Manager, Order, Product, Staff, Supplier } from "../db/db";

dotenv.config();

export async function managerSignup(req: Request, res: Response) {
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userName = req.body.userName;
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;
    let userType = "manager";

    if (!userName || !userEmail || !userPassword || !firstName || !lastName) {
      res.status(404).json({
        msg: "input fields cannot be left empty",
      });
      return;
    }

    let existingManger = await Manager.findOne({
      userEmail,
    });

    if (existingManger) {
      res.status(409).json({
        msg: "manager already exists with this email",
      });
      return;
    } else {
      let hashedPassword = await bcrypt.hash(userPassword, 10);

      await Manager.create({
        firstName,
        lastName,
        userName,
        userEmail,
        userPassword: hashedPassword,
        userType,
      });
      res.status(200).json({
        msg: "manager created successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function managerLogin(req: Request, res: Response) {
  try {
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;

    if (!userEmail || !userPassword) {
      res.status(404).json({
        msg: "input fields cannot be left empty",
      });
      return;
    }

    let exisitngManger = await Manager.findOne({
      userEmail,
    });

    if (!exisitngManger) {
      res.status(404).json({
        msg: "no such manager found in our db",
      });
      return;
    }

    if (
      !exisitngManger.userPassword ||
      typeof exisitngManger.userPassword !== "string"
    ) {
      res.status(404).json({
        msg: "invalid password",
      });
      return;
    }

    let passwordCompare = await bcrypt.compare(
      userPassword,
      exisitngManger.userPassword
    );

    if (!passwordCompare) {
      res.status(403).json({
        msg: "invalid password",
      });
    } else {
      let token = jwt.sign(
        { userEmail },
        process.env.JWT_SECRET || "defaultKey"
      );
      res.status(200).json({
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function addProductManager(req: Request, res: Response) {
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

export async function updateProductManager(req: Request, res: Response) {
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

export async function deleteProductManager(req: Request, res: Response) {
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

export async function fetchProductManager(req: Request, res: Response) {
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

export async function fetchStockManager(req: Request, res: Response) {
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

export async function fetchDetailsManager(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        msg: "Authorization failed",
      });
      return;
    }
    let staff = await Manager.findOne({
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

export async function totalProductManager(req: Request, res: Response) {
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

export async function totalOrderManager(req: Request, res: Response) {
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

export async function addSupplierManager(req: Request, res: Response) {
  try {
    let Name = req.body.Name;
    let Phone = req.body.Phone;
    let Email = req.body.Email;
    let Address = req.body.Address;

    if (!Name || !Phone || !Email || !Address) {
      res.status(401).json({
        msg: "Input fields cannot be left empty",
      });
      return;
    }

    let existingSupplier = await Supplier.findOne({
      Email,
    });

    if (existingSupplier) {
      res.status(409).json({
        msg: "Supplier already exists with that email",
      });
      return;
    }

    await Supplier.create({
      Name,
      Phone,
      Email,
      Address,
    });

    res.status(200).json({
      msg: "supplier created successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong with the server",
    });
  }
}

export async function fetchSupplierManager(req: Request, res: Response) {
  try {
    let suppliers = await Supplier.find({});

    if (!suppliers) {
      res.status(404).json({
        msg: "no suppliers found in our db",
      });
      return;
    }

    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function updateSupplierManager(req: Request, res: Response) {
  try {
    let supplierId = req.params.supplierId;
    let { Name, Phone, Email, Address } = req.body;

    let fieldsToUpate: Record<string, any> = {};

    if (!supplierId) {
      res.status(404).json({
        msg: "no supplier id in params",
      });
      return;
    }

    if (Name) fieldsToUpate.Name = Name;
    if (Phone) fieldsToUpate.Phone = Phone;
    if (Email) fieldsToUpate.Email = Email;
    if (Address) fieldsToUpate.Address = Address;

    if (Object.keys(fieldsToUpate).length === 0) {
      res.status(404).json({
        msg: "nothing there to update",
      });
      return;
    }

    let result = await Supplier.updateOne(
      {
        _id: supplierId,
      },
      {
        $set: fieldsToUpate,
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        msg: "no such supplier found",
      });
      return;
    }

    res.status(200).json({
      msg: "supplier updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function deleteSupplierManager(req: Request, res: Response) {
  try {
    let supplierId = req.params.supplierId;
    if (!supplierId) {
      res.status(404).json({
        msg: "no supplier id passed in params",
      });
      return;
    }
    await Supplier.deleteOne({
      _id: supplierId,
    });

    res.status(200).json({
      msg: "supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server at the moment",
    });
  }
}

export async function totalSupplierManager(req: Request, res: Response) {
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

export async function totalSaffsManager(req: Request, res: Response) {
  try {
    let totalStaffs = (await Staff.find({})).length;
    if (!totalStaffs) {
      res.status(404).json({
        msg: "no staffs found in our db",
      });
      return;
    }
    res.status(200).json({
      totalStaffs,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

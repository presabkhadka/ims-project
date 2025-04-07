import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { Notification, Owner, Product, Staff } from "../db/db";

dotenv.config();

export async function ownerSignup(req: Request, res: Response) {
  try {
    let userName = req.body.userName;
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;
    let userType = "owner";

    if (!userName || !userEmail || !userPassword) {
      res.status(404).json({
        msg: "input fields cannot be left empty",
      });
      return;
    }

    let existingOwner = await Owner.findOne({
      userEmail,
    });

    if (existingOwner) {
      res.status(409).json({
        msg: "owner already exists with this email",
      });
      return;
    } else {
      let hashedPassword = await bcrypt.hash(userPassword, 10);
      await Owner.create({
        userName,
        userEmail,
        userPassword: hashedPassword,
        userType,
      });
      res.status(200).json({
        msg: "owner create successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function ownerLogin(req: Request, res: Response) {
  try {
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;

    if (!userEmail || !userPassword) {
      res.status(404).json({
        msg: "input fields cannot be left empty",
      });
      return;
    }

    let exisitngOwner = await Owner.findOne({
      userEmail,
    });

    if (!exisitngOwner) {
      res.status(404).json({
        msg: "no such owner found in our db",
      });
      return;
    }

    if (
      !exisitngOwner.userPassword ||
      typeof exisitngOwner.userPassword !== "string"
    ) {
      res.status(404).json({
        msg: "invalid password",
      });
      return;
    }

    let passwordCompare = await bcrypt.compare(
      userPassword,
      exisitngOwner.userPassword
    );
    if (!passwordCompare) {
      res.status(404).json({
        msg: "invalid password",
      });
      return;
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
        msg: `Product ${Name} already exists, Try updating it.`,
      });
      return;
    } else {
      if (
        Quantity < 20 ? (Available = "Low in stock") : (Available = "In Stock")
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

    let fieldsToUpdate: Record<string, any> = {};

    if (Name) fieldsToUpdate.Name = Name;
    if (Description) fieldsToUpdate.Description = Description;
    if (Category) fieldsToUpdate.Category = Category;
    if (Price) fieldsToUpdate.Price = Price;
    if (Quantity) fieldsToUpdate.Quantity = Quantity;

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

export async function userDetails(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        msg: "bad authorization",
      });
      return;
    }
    let userDetails = await Owner.findOne({
      userEmail: user,
    }).select("userName userEmail");
    res.status(200).json({
      userDetails,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

export async function totalProducts(req: Request, res: Response) {
  try {
    let products = await Product.find({});
    if (products.length === 0) {
      res.status(404).json({
        msg: "no products found in our db, please add some products",
      });
      return;
    } else {
      let totalProducts = products.length;
      res.status(200).json({
        totalProducts,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server at the moment",
    });
  }
}

export async function totalStaff(req: Request, res: Response) {
  try {
    let staff = await Staff.find({});
    if (!staff) {
      res.status(404).json({
        msg: "no staffs found in our db",
      });
      return;
    }
    let totalStaff = staff.length;
    res.status(200).json({
      totalStaff,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server at the moment",
    });
  }
}

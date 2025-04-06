import { response, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { Owner } from "../db/db";

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
      let token = jwt.sign(userEmail, process.env.JWT_SECRET || "defaultKey");
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

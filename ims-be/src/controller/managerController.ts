import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { Manager } from "../db/db";

dotenv.config();

export async function managerSignup(req: Request, res: Response) {
  try {
    let userName = req.body.userName;
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;
    let userType = "manager";

    if (!userName || !userEmail || !userPassword) {
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

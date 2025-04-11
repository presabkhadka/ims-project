import { type Request, type Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Manager } from "../db/db";
import "../types/index";

export default async function managerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      msg: "Token not found",
    });
    return;
  }

  try {
    let jwtPass = process.env.JWT_SECRET || "defaultKey";
    let decoded = jwt.verify(token, jwtPass);
    let managerEmail = (decoded as jwt.JwtPayload).userEmail;
    let existingManager = await Manager.findOne({
      userEmail: managerEmail,
    });
    if (!existingManager) {
      res.status(404).json({
        msg: "no such manager found in our db",
      });
      return;
    }
    req.user = managerEmail;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

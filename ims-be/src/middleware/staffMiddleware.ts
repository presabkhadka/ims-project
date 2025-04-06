import { type Request, type Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Staff } from "../db/db";
import "../types/index";

export default async function staffMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(404).json({
      msg: "no token found",
    });
    return;
  }

  try {
    let jwtPass = process.env.JWT_SECRET || "defaultKey";
    let decoded = jwt.verify(token, jwtPass);
    let userEmail = (decoded as jwt.JwtPayload).userEmail;
    let existingStaff = await Staff.findOne({
      userEmail,
    });

    if (!existingStaff) {
      res.status(404).json({
        msg: "no such staff exists in our db",
      });
      return;
    }
    req.user = userEmail;
    next();
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong at the server",
    });
  }
}

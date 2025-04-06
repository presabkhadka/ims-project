import "../types/index";
import { type Request, type Response, NextFunction } from "express";
import { Owner } from "../db/db";
import jwt, { decode } from "jsonwebtoken";

export default async function ownerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(404).json({
      msg: "Token not found",
    });
    return;
  }

  try {
    let jwtPass = process.env.JWT_SECRET || "defaultKey";
    let decoded = jwt.verify(token, jwtPass);
    let userEmail = (decoded as jwt.JwtPayload).userEmail;

    let existingOwner = await Owner.findOne({
      userEmail,
    });

    if (!existingOwner) {
      res.status(404).json({
        msg: "no such owner found in our db",
      });
      return;
    } else {
      req.user = userEmail;
      next();
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong with the server",
    });
  }
}

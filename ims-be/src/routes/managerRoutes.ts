import { Router } from "express";
import { managerLogin, managerSignup } from "../controller/managerController";

const managerRouter = Router();

managerRouter.post("/signup", managerSignup);
managerRouter.post("/login", managerLogin);

export { managerRouter };

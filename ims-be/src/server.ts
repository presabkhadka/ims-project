import express from "express";
import cors from "cors";
import { staffRouter } from "./routes/staffRoutes";
import { managerRouter } from "./routes/managerRoutes";
import { ownerRouter } from "./routes/ownerRoutes";

const port = 1212;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/staff", staffRouter);
app.use("/manager", managerRouter);
app.use("/owner", ownerRouter);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});

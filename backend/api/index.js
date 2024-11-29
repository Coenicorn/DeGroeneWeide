import { Router } from "express";

import CardsRouter from "./cards/cards.js";
import ReadersRouter from "./readers/index.js";
import AuthRouter from "./auth/index.js";
import CustomersRouter from "./customers/customers.js";

const APIRouter = Router();

APIRouter.use("/cards", CardsRouter);
APIRouter.use("/customers", CustomersRouter)
APIRouter.use("/readers", ReadersRouter);
APIRouter.use("/auth", AuthRouter);

export default APIRouter;
import { Router } from "express";

import CardsRouter from "./cards/cards.js";
import ReadersRouter from "./readers/index.js";

const APIRouter = Router();

APIRouter.use("/cards", CardsRouter);
APIRouter.use("/readers", ReadersRouter);

export default APIRouter;
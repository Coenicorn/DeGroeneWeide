import { Router } from "express";

import CardsRouter from "./cards/cards.js";

const APIRouter = Router();

APIRouter.use("/api", CardsRouter);

export default APIRouter;
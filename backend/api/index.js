import { Router } from "express";

import CardsRouter from "./cards/cards.js";

const APIRouter = Router();

APIRouter.use(CardsRouter);

export default APIRouter;
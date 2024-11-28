import { Router } from "express";

import CardsRouter from "./cards/cards.js";

const APIRouter = Router("/api");

APIRouter.use(CardsRouter);

export default APIRouter;
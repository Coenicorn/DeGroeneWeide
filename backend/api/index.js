import { Router } from "express";

import CardsRouter from "./cards/index.js";

const APIRouter = new Router("/api");

APIRouter.use(CardsRouter);

export default APIRouter;
import { Router, json } from "express";

const router = new Router();

router.use(json());

router.use("/imalive", (req, res, next) => {


});

export default router;
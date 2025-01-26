import config from "./config.js";
import { debug_log, info_log, respondwithstatus } from "./util.js";
import { rateLimit } from "express-rate-limit";

// these routes don't get checked for an API key
const publicRoutes = [
    "/api/send-reservation",
    "/api/verify-mail"
];

export function isPublicRoute(fullRouteName) {
    for (let i = 0, route; i < publicRoutes.length, route = publicRoutes[i]; i++) {
        if (fullRouteName.startsWith(route)) return true;
    }
}

export function authenticateRequest(req) {
    if (isPublicRoute(req.originalUrl)) {
        return 1;
    }

    const apiKey = req.header("x-api-key");

    if (apiKey !== config.keyAdminPanel) {
        debug_log("blocked access to route " + req.originalUrl);

        return 0;
    }

    return 1;
}

// middleware that checks if the request has access to the route
export function onlyAdminPanel(req, res, next) {
    if (authenticateRequest(req)) next();
    else respondwithstatus(res, 401, "incorrect API key");
}
import config from "./config.js";
import { info_log } from "./util.js";

// these routes don't get checked for an API key
const publicRoutes = [
    "/api/send-reservation",
    "/api/verify-email"
];

export function isPublicRoute(fullRouteName) {
    if (config.enableAPIKey == 0) return true;

    for (let i = 0, route = publicRoutes[i]; i < publicRoutes.length; i++) {
        console.log(fullRouteName);
        console.log(route);
        if (fullRouteName.startsWith(route)) return true;
    }
}

// middleware that checks if the request has access to the route
export function onlyAdminPanel(req, res, next) {
    if (isPublicRoute(req.originalUrl)) {
        next();
        return;
    }

    const apiKey = req.header("x-api-key");

    if (apiKey !== config.keyAdminPanel) {
        info_log("blocked access to route " + req.originalUrl);

        return res.status(403).send("Invalid API key");
    }

    next();
}
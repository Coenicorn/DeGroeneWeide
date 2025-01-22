import config from "./config.js";

// these routes don't get checked for an API key
const publicRoutes = [
    "/cards/getAllCards",
    "insertBooking"
];

export function isPublicRoute(routeName) {
    return publicRoutes.includes(routeName);
}

// middleware that checks if the request has access to the route
export function onlyAdminPanel(req, res, next) {
    if (isPublicRoute(req.url)) {
        next();
        return;
    }

    const apiKey = req.header("x-api-key");

    if (apiKey !== config.keyAdminPanel) {
        return res.status(403).send("Invalid API key");
    }

    next();
}
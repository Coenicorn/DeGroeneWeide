import config from "./config.js";

// these routes don't get checked for an API key
const publicRoutes = [
    "/booking/insertBooking",
    "/customers/insertCustomer"
];

export function isPublicRoute(routeName) {
    if (config.enableAPIKey == 0) return true;

    return publicRoutes.includes(routeName);
}

// middleware that checks if the request has access to the route
export function onlyAdminPanel(req, res, next) {
    console.log(req.url, isPublicRoute(req.url))
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
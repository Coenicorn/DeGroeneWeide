import config from "./config.js";

// these routes don't get checked for an API key
const publicRoutes = [
    "insertCustomer",
    "insertBooking"
];

// middleware that checks if the request has access to the route
export function onlyAdminPanel(req, res, next) {
    const apiKey = req.header("x-api-key");

    console.log(req);

    if (apiKey !== config.keyAdminPanel) {
        return res.status(403).send("Invalid API key");
    }

    next();
}
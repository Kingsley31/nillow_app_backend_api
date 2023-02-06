require('dotenv').config();

function apiAuthenticationMiddleware(req, res, next) {
    const apikey = process.env.API_KEY;

    if (apikey === req.headers.apikey) {
        return next();
    }

    res.status(401).json({ status: "error", message: "Unauthorized" });

}

module.exports = apiAuthenticationMiddleware;
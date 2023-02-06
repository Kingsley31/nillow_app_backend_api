const jwt = require('jwt-simple');
require("dotenv").config();


let verifyToken = (req, res, next) => {

    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader == 'undefined') {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized Request'
        });
    }

    const bearerToken = bearerHeader.split(' ')[1] ? bearerHeader.split(' ')[1] : "";
    try {
        var decoded = jwt.decode(bearerToken, process.env.JWT_SECRETE);
        if (decoded) {
            req.user = decoded;
            return next();
        }
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized Request'
        });

    }


    res.json({
        status: 'error',
        message: 'Unauthorized Request'
    });

};

module.exports = verifyToken;
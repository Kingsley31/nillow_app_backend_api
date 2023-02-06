require("dotenv").config();
//Connect to database
const mongoose = require('mongoose');
const mongodb_url = process.env.MONGODB_URL;

module.exports = function DbConnector() {
    this.connectionUrl = mongodb_url;
    this.properties = {
        // ssl: true,
        // sslValidate: true,
        // sslCA: `${__dirname}/rds-combined-ca-bundle.pem`
        // tls: true,
        // tlsCAFile: `${__dirname}/rds-combined-ca-bundle.pem`
    };

    this.connect = () => {
        return mongoose.connect(mongodb_url, this.properties);
    }
}
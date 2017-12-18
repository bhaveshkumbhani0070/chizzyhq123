var sql = require('mssql');

var user = process.env.user;
var password = process.env.password;
var server = process.env.server;
var database = process.env.server;

if (!user) {
    console.log('Please enter user name');
}
if (!password) {
    console.log('Please enter password');
}
if (!server) {
    console.log('Please enter server');
}
if (!database) {
    console.log('Please enter database');
}
var config = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database
        // pool: {
        //     max: 20,
        //     min: 10,
        //     idleTimeoutMillis: 3000
        // }
};
const pool = new sql.ConnectionPool(config)


module.exports = pool;
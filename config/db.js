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
    user: process.env.user, // 'holiday',
    password: process.env.password, //'97762fc4a786331a90f044485ecd11c47acced473e460191',
    server: process.env.server, //'holidaypackages.corkidnfytiw.ap-southeast-2.rds.amazonaws.com',
    database: process.env.database //'holidaypackage'
};
const pool = new sql.ConnectionPool(config)


module.exports = pool;
var sql = require('mssql');
var pool = require('../config/db');
const requ = new sql.Request(pool);

// Get all deal data for display in home page
exports.getallDeal = function(req, res) {
    pool.close();
    var dataForSearch = req.body;
    console.log('Data for search', dataForSearch)
    var date = dataForSearch.date;
    var date_from = date.split("to")[0];
    var date_to = date.split("to")[1];

    pool.connect(function(err, connection) {
        if (!err) {
            console.log('date_from', date_from, ' date_to', date_to);
            requ.query("select * from deal_dates where date_from >='" + date_from + "' and date_to<='" + date_to + "'", function(err, data) {
                if (!err) {
                    //             console.log('data', data.recordset);
                    res.send({ code: 200, status: 1, message: 'Deal data get successfully', data: data.recordset });
                    return;
                } else {
                    console.log('Error for selecting data from data base', err);
                    res.send({ code: 422, status: 0, message: 'Error for selecting data from data base' });
                    return;
                }
            })
        } else {
            console.log('Error for connection', err);
            res.send({ code: 500, status: 0, message: 'Connection Error' });
            return;
        }
    })
}

// var date = "2018-03-09 to 2018-06-30"
// var date_from = date.split("to")[0];
// var date_to = date.split("to")[1];

// pool.close();
// pool.connect(function(err, connection) {
//     if (!err) {
//         console.log('date_from', date_from, ' date_to', date_to);
//         requ.query("select * from deal_dates where date_from >='" + date_from + "' and date_to<='" + date_to + "'", function(err, data) {
//             if (!err) {
//                 console.log('data', data.recordset);
//             } else {
//                 console.log('Error for selecting data from data base', err);
//                 return;
//             }
//         })
//     } else {
//         console.log('Error for connection', err);
//     }
// })

exports.getDeparture = function(req, res) {
    pool.close();
    pool.connect(function(err, connection) {
        if (!err) {
            requ.query("select DISTINCT departure from deal_departure", function(err, cityD) {
                if (!err) {
                    console.log('Deal data get successs', cityD.recordset);
                    res.send({ code: 200, status: 1, message: 'Deal data get successfully', data: cityD.recordset });
                    return;
                } else {
                    console.log('Error for get data from departture', err);
                    res.send({ code: 422, status: 0, message: 'Error for get data from departure' });
                    return;
                }
            });
        } else {
            res.send({ code: 422, status: 0, message: 'Error for connection' });
            console.log('Error for connnection', err);
            return;
        }
    })
}


exports.getDestination = function(req, res) {
    pool.close();
    pool.connect(function(err, connection) {
        if (!err) {
            requ.query("select DISTINCT destination from deal", function(err, cityD) {
                if (!err) {
                    console.log('Destination data get successs', cityD.recordset);
                    res.send({ code: 200, status: 1, message: 'Destination data get successfully', data: cityD.recordset });
                    return;
                } else {
                    console.log('Error for get data from departture', err);
                    res.send({ code: 422, status: 0, message: 'Error for get data from destination' });
                    return;
                }
            });
        } else {
            res.send({ code: 422, status: 0, message: 'Error for connection' });
            console.log('Error for connnection', err);
            return;
        }
    })
}
var sql = require('mssql');
var pool = require('../config/db');
const requ = new sql.Request(pool);

// Get all deal data for display in home page
exports.getallDeal = function(req, res) {
    pool.close();
    console.log('Data for search', req.body.data)
        // pool.connect(function(err, connection) {
        //     if (!err) {
        //         // select d.*,ds.* from deal d right join deal_dates ds on ds.deal_id=d.id 
        //         requ.query("select d.* from deal d where d.stars=3", function(err, cityD) {
        //             if (!err) {
        //                 // description,destination,stars,nights,link,title
        //                 //console.log('cityD', cityD.recordset);
        //                 res.send({ code: 200, status: 1, message: 'Deal data get successfully', data: cityD.recordset });
        //                 return;
        //             } else {
        //                 console.log('Error for get data from deal', err);
        //                 res.send({ code: 422, status: 0, message: 'Error for get data from deal' });
        //                 return;
        //             }
        //         });
        //     } else {
        //         console.log('Error for connection with database', err);
        //         res.send({ code: 200, status: 0, message: 'Error for connection with database' });
        //         return;
        //     }
        // });
}

// var date = "2018-05-02 to 2018-05-02"
// var date_from = new Date(date.split("to")[0]);
// var date_to = new Date(date.split("to")[1]);

// pool.close();
// pool.connect(function(err, connection) {
//     if (!err) {
//         console.log('date_from', date_from, ' date_to', date_to);
//         requ.query("select * from deal_dates where date_from > '" + date_from + "'", function(err, data) {
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
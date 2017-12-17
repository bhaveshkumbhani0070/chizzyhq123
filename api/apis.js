var sql = require('mssql');
var pool = require('../config/db');
const requ = new sql.Request(pool);

// Get all deal data for display in home page
exports.getallDeal = function(req, res) {
    pool.close();
    pool.connect(function(err, connection) {
        if (!err) {
            // select d.*,ds.* from deal d right join deal_dates ds on ds.deal_id=d.id 
            requ.query("select d.* from deal d where d.stars=3", function(err, cityD) {
                if (!err) {
                    // description,destination,stars,nights,link,title
                    //console.log('cityD', cityD.recordset);
                    res.send({ code: 200, status: 1, message: 'Deal data get successfully', data: cityD.recordset });
                    return;
                } else {
                    console.log('Error for get data from deal', err);
                    res.send({ code: 422, status: 0, message: 'Error for get data from deal' });
                    return;
                }
            });
        } else {
            console.log('Error for connection with database', err);
            res.send({ code: 200, status: 0, message: 'Error for connection with database' });
            return;
        }
    });
}
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
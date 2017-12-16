
var sql = require('mssql');
var pool = require('../config/db');
const requ = new sql.Request(pool);

// Get all deal data for display in home page
exports.getallDeal=function(req,res){
    pool.connect(function(err, connection) {
            if (!err) {
            	// select d.*,ds.* from deal d right join deal_dates ds on ds.deal_id=d.id 
           		 requ.query("select d.* from deal d left join where stars=3", function(err, cityD) {
	                if (!err) {
	           				// description,destination,stars,nights,link,title
	           				 console.log('cityD',cityD.recordset);
	           				res.send({code:200,message:'Deal data get successfully',data:cityD.recordset});
	           				return;
	           			}
	           			else{
	           				res.send({code:422,message:'Error for get data from deal'});
	           				return;
	           			}
	           		});
            }
            else{
            	res.send({code:200,message:'Error for connection with database'});
	           	return;
           	}
        });
}

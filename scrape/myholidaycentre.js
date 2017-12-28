var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');
var sql = require('mssql');
//var connection = require(__dirname + '/config/db');
var pool = require('../config/db');
const requ = new sql.Request(pool);



//  deal(description,destination,stars,nights,link,title,purchase_by,agency)
// *** String ,String,int,int,String,String,String('mm/dd/yyyy')

// deal_departure(deal_id,departure,price)
// ** Int,String,Float

// deal_dates(deal_id,deal_departure_id,date_from,date_to)
// ** Int,Int,date,String('mm/dd/yyyy')

exports.holidaycenterScrape = function(req, res) {

}

function getAllUrl() {
    var url = "https://www.myholidaycentre.com.au/";
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            $('.item-tile a').each(function(i, e) {
                var data = $(this);

                if (data.attr("href").includes('http:')) {
                    console.log('this', data.attr("href"));
                } else {
                    console.log('Other Urls', data.attr("href"));
                }
            })
        } else {
            console.log('Error', err);
        }
    });
}
var child = "http://myfiji.com";
// getChildData(child);

function getChildData(child) {
    request(child, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            $('.et_pb_text_inner .element-item .item-tile a').each(function(i, e) {
                var data = $(this);
                var url = data.attr("href");
                var details = data.find('.details');

                console.log('details', details);
                //  console.log('this', data.attr("href"));
            })
        } else {
            console.log('Error', err);
        }
    });
}













/**
 * DD/MM/YYYY
 *  TO
 * MM/DD/YYYY
 */
function purchageDate(date) {
    if (date) {
        var newD = date.split("/");
        var retuData = newD[1] + '/' + newD[0] + '/' + newD[2];
        return retuData;
    } else {
        return false;
    }
}
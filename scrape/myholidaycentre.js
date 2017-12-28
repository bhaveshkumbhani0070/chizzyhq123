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
                    //getChildData(data.attr("href"));
                } else {
                    console.log('Other Urls', data.attr("href"));
                }
            })
        } else {
            console.log('Error', err);
        }
    });
}
// pool.close();
// pool.connect(function(err, connection) {
//     if (!err) {
//         var child = "http://myfiji.com";
//         getChildData(child);
//     } else {

//     }
// });

function getChildData(child) {
    request(child, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            $('.et_pb_text_inner .element-item .item-tile a').each(function(i, e) {
                var data = $(this);
                var allData = {};
                var link = data.attr("href")
                allData["link"] = link;
                allData["title"] = data.find('.details h3').text();
                var NightPrice = data.find('.details .small').text().split('$');
                allData["nights"] = parseInt(NightPrice[0]);
                allData["price"] = parseInt(NightPrice[1]);

                setTimeout(function(z) {
                    requ.query("select * from deal where link='" + link + "'", function(err, cityD) {
                        if (!err) {
                            if (cityD.recordset.length > 0) {
                                console.log('Already there', link)
                            } else {
                                ScrapeFromInner(allData, link, z);
                            }
                        } else {
                            console.log('Error for select data from deal table', err);
                        }
                    });
                }, i * 3500, i);
            })
        } else {
            console.log('Error', err);
        }
    });
}

var allData = {
        link: "https://www.myfiji.com/package/sheraton-fiji-resort-ocean-view-room-7-nights-flash-sale/"
    }
    //ScrapeFromInner(allData, 0);

function ScrapeFromInner(allData, z) {
    request(allData.link, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var departure = [];
            $('#departure-iata option').each(function(i, e) {
                var depa = $(this);
                var price = depa.attr('data-price');
                var value = depa.text();
                departure.push({
                    price: price,
                    value: value
                })
            })
            allData["departure"] = departure;

            var purchase_by = $('.book-date .date').text();
            purchase_by = purchase_by.split('Book by')[1].trim();
            allData["purchase_by"] = getDate(purchase_by)
        } else {
            console.log('Error for scrape from inner', error);
        }
    });
}








function getDate(date) {
    var d = new Date(date);
    return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
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
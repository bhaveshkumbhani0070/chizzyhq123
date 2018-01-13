var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');

var sql = require('mssql');
//var connection = require(__dirname + '/config/db');
var pool = require('../config/db');
const requ = new sql.Request(pool);


exports.virginScrape = function(req, res) {

}
pool.close();
pool.connect(function(err, connection) {
    if (!err) {
        var url = "https://travel.virginaustralia.com/au/holidays?travel_theme_nid_2=All&holiday_package_nid=All&Submit=Find%20Holidays&page=";
        // Scrap(url, 1);
    } else {
        console.log('connection error', err);
    }
})

var desti = [{ id: 3569, value: "Adelaide" },
    { id: 3575, value: "Brisbane" },
    { id: 3599, value: "Melbourne" },
    { id: 3604, value: "Perth" },
    { id: 3610, value: "Sydney" },
    { id: 3578, value: "Cairns" },
    { id: 3568, value: "Canberra" },
    { id: 3588, value: "Gold Coast" },
    { id: 3592, value: "Hobart" },
]

function Scrap(u, page) {
    var url = u + page;
    console.log('url', url);
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('.view-vah-holiday-packages-landing .view-content').children().each(function(e) {
                var data = $(this);
                if (!data.hasClass("views-row-first")) {

                    var chilUrl = "https://travel.virginaustralia.com" + data.find('.card__actions').children().attr('href');
                    var parts = chilUrl.split("/");
                    var destination = parts[parts.length - 1];

                    for (var j = 0; j < desti.length; j++) {
                        setTimeout(function(i) {
                            var url = chilUrl + "?origin_airport_nid=" + desti[i].id + "&Submit=Go&field_deal_search_type_value=flight_hotel"
                            requ.query("select * from deal where link='" + url + "'", function(err, cityD) {
                                if (!err) {
                                    if (cityD.recordset.length > 0) {
                                        console.log('Already there')
                                    } else {
                                        // childData(url, desti[i].value, destination);
                                    }
                                } else {
                                    console.log('Error for selecting url from deal');
                                }
                            });
                        }, j * 50000, j);
                    }
                }
            })
        } else {
            console.log('Error', error);
        }
    })
}


function childData(u, departure, destination) {
    //  console.log('u', u);
    request(u, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            var description = "";
            $('.vah-layout__col').children().eq(0).children().each(function(e) {
                var data = $(this);
                description = description + data;
            })

            $('.view-vah-holiday-packages .view-content').children().each(function(e) {
                var data = $(this);
                var allData = [];
                allData["destination"] = destination;
                allData["stars"] = parseInt(data.find('.star-rating__value').text());
                allData["nights"] = data.find('.vah-field-number-of-nights__value').text();
                allData["link"] = u;
                allData["title"] = data.find('.card__title').text();
                allData["purchase_by"] = data.find('.date-display-single').text(); //31/03/2018

                // insert into deal(description,destination,stars,nights,link,title,purchase_by,agency) 

                allData["departure"] = departure;
                allData["price"] = data.find('.vah-field-price__value').text();

                // insert into deal_departure(deal_id,departure,price)

                $('.field-item').each(function(e) {
                    var data = $(this);
                    var date_from = data.find('.date-display-start').text();
                    var date_to = data.find('.date-display-end').text();

                    // insert into deal_dates(deal_id,deal_departure_id,date_from,date_to)
                })
            });
        } else {
            console.log('Error');
        }
    })
}


// var samDes = [
//     { departure: "Darwin", $$hashKey: "013" },
//     { departure: "old Coast", $$hashKey: "017" },
//     { departure: "risbane", $$hashKey: "019" }
// ]
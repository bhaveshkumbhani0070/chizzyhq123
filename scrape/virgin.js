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

var url = "https://travel.virginaustralia.com/au/holidays?travel_theme_nid_2=All&holiday_package_nid=All&Submit=Find%20Holidays&page=";
// Scrap(url, 1);

function Scrap(u, page) {
    console.log('url', u);
    var url = u + page;
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('.view-vah-holiday-packages-landing .view-content').children().each(function(e) {
                var data = $(this);
                if (!data.hasClass("views-row-first")) {

                    var chilUrl = "https://travel.virginaustralia.com" + data.find('.card__actions').children().attr('href');
                    for (var i = 0; i < desti.length; i++) {
                        var url = chilUrl + "?origin_airport_nid=" + desti[i].id + "&Submit=Go&field_deal_search_type_value=flight_hotel"
                        childData(url);
                    }

                }
            })
        } else {
            console.log('Error', error);
        }
    })
}

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
var u = "https://travel.virginaustralia.com/au/holidays/broome?origin_airport_nid=3569&Submit=Go&field_deal_search_type_value=flight_hotel";
// childData(u);

function childData(u) {
    //  console.log('u', u);
    request(u, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('.view-vah-holiday-packages .view-content').children().each(function(e) {
                var data = $(this);
                console.log('text', data.find('.card__title').text());
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
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
    console.log('url', url);
    var url = u + page;
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('.view-content').each(function(e) {
                var data = $(this);
                console.log('data', data);
            })
        } else {
            console.log('Error', error);
        }
    })
}
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');
var sql = require('mssql');
//var connection = require(__dirname + '/config/db');
var pool = require('../config/db');
const requ = new sql.Request(pool);


exports.jetstarScrape = function(req, res) {

}

var url = "http://www.jetstar.com/au/en/holidays/sunshine-coast";
// startScrape(url);

function startScrape(ul) {
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            $('.product-section__btn').each(function(e) {
                var data = $(this);

                if (data.attr("href").includes('http:')) {
                    var link = data.attr('href');
                } else {
                    var link = "http://www.jetstar.com" + data.attr('href');
                }
                console.log('data', link);
            })
        } else {
            console.log('Errror', error);
        }
    })
}

// childScrape("http://www.jetstar.com/au/en/holidays");

function childScrape(link) {
    request(link, function(err, response, html) {
        if (!err) {
            var $ = cheerio.load(html);
            $('.js-va-scroll .product-section .product-section__body .thumbnail--x4 .cta__wrapper a').each(function(e) {
                var data = $(this);
                if (data.attr("href").includes('http:')) {
                    var l = data.attr('href');
                } else {
                    var l = "http://www.jetstar.com" + data.attr('href');
                }
                console.log('data', l);
            })

        }
    })
}

// childData("http://www.jetstar.com/au/en/holidays/deals");

function childData(link) {
    request(link, function(err, response, html) {
        if (!err) {
            var $ = cheerio.load(html);
            $('.packages-wrapper .package-card--x2').each(function(e) {
                var data = $(this);
                console.log('data', $('.package-card__description'));
            });
        }
    });
}
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

function callApi() {


    var json = [{
        "itemTypeCodeList": ["HTL", "FLT"],
        "purchaseDate": "2017-12-12T01:00:00.000Z",
        "itemTypeCode": "PKG",
        "leadSlotItemTypeCode": "HTL",
        "catalogCode": "TC",
        "cultureCode": "en-AU",
        "bookingSourceCode": "TC",
        "pageSize": 6,
        "absolutePage": 1,
        "locationList": [{
                "locationCode": "SYD",
                "usageDate": "2018-03-12T01:00:00.000Z"
            },
            {
                "locationCode": "MCY",
                "usageDate": "2018-03-15T01:00:00.000Z"
            }
        ],
        "participantAvailabilityList": [{
                "participantTypeCode": "ADT",
                "participantSequence": 0,
                "primaryFlag": true
            },
            {
                "participantTypeCode": "ADT",
                "participantSequence": 1,
                "primaryFlag": false
            }
        ],
        "searchType": 3,
        "itemVariationAttributeAvailabilityRequestList": [{
            "itemVariationAttributeKey": "All"
        }]
    }];

    var options = {
        url: 'https://jqprodr3xtcapi.navitaire.com/api/tc/v1/booking/itemAvailability',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: json
    };

    request(options, function(err, res, body) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('body', body.data[0].itemList);
        }
    });
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
            $('.packages-wrapper .grid .js-static-package').each(function(e) {
                var data = $(this);
                var allData = [];
                allData["title"] = data.find('.package-card__holiday-name').text();
                allData["destination"] = data.find('.package-card__destination').text().trim();
                var stars = data.find('.rating__text').text().split('out of')[0]
                stars = stars.trim().split('-')[1];
                allData["stars"] = parseInt(stars);

                // data.find('.package-card__prices .package-card__price').each(function(e) {
                //     var data = $(this);
                //     var allData = [];
                //     allData["title"]=data.attr('data-package-name');
                //     allData["destination"]=data.attr('data-destination-name');
                //     allData["price"]=data.attr('data-package-price');

                //     console.log('data', data.attr('data-package-price'));
                // })
            });
        }
    });
}


// deal(description,,stars,nights,link,,purchase_by,agency   destination,title)
// deal_departure(deal_id,departure,price)
// deal_dates(deal_id,deal_departure_id,date_from,date_to)
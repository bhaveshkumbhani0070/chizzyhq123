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

// callApi();

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
            var data = body.data[0].itemList;
            var allData = [];
            for (var i = 0; i < data.length; i++) {
                allData["title"] = data[i].descriptionShort;
                allData["description"] = data[i].descriptionLong;
                allData["price"] = data[i].maxPrice;
                console.log('all data', data[i]);
            }
            // console.log('allData',allData);
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
            var departure = $('.js-package-selection').text();
            $('.packages-wrapper .grid .js-static-package').each(function(e) {
                var data = $(this);
                // var allData = [];
                // allData["title"] = data.find('.package-card__holiday-name').text();
                // allData["destination"] = data.find('.package-card__destination').text().trim();
                var stars = data.find('.rating__text').text().split('out of')[0]
                stars = stars.trim().split('-')[1];
                // allData["stars"] = parseInt(stars);
                var description = [];
                data.find('.package-card__body ul li').each(function(e) {
                    var d = $(this);
                    description.push(d.text());
                })
                var nights = parseInt(description[1]);
                description = description.reverse()
                data.find('.package-card__prices .package-card__price').each(function(e) {
                    var data = $(this);
                    var allData = [];
                    allData["link"] = link;
                    allData["description"] = description.toString();
                    allData["title"] = data.attr('data-package-name');
                    allData["destination"] = data.attr('data-destination-name');
                    allData["price"] = data.attr('data-package-price');
                    var date = getDate(data.attr('data-package-dates')).split('-');
                    allData["nights"] = nights;
                    allData["date_from"] = date[0];
                    allData["date_to"] = date[1];
                    allData["stars"] = stars;
                    allData["purchase_by"] = date[1];
                    allData["departure"] = departure;
                    allData["agency"] = "jetstar";
                    console.log('allData', allData);
                })
            });
        }
    });
}

// deal(,,,,,   destination,title,description,,stars,link,agency,nights,purchase_by)
// deal_departure(deal_id,departure,  price)
// deal_dates(deal_id,deal_departure_id,date_from,date_to)

function getDate(d) {
    // console.log('d', d);
    var date = d.trim().split('-');
    //console.log('date', date);
    var year = new Date(date[1]).getFullYear();
    var mm = date[0].trim().split(" ");
    if (!mm[1]) {
        var toDate = new Date(date[1]);
        var from = toDate.setMonth(toDate.getMonth() - mm);
        var from = new Date(from).setMonth(mm - 1)
    } else {
        var from = date[0] + ' ' + year;
    }
    var to = date[1]

    return dateFormate(from) + '-' + dateFormate(to)
}


function dateFormate(d) {
    var date = new Date(d);
    var mm = parseInt(date.getMonth()) + 1;
    return date.getFullYear() + '/' + mm + '/' + date.getDate();
}
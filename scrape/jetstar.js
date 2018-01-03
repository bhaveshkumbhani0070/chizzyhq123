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
// pool.close();
// pool.connect(function(err, connection) {
//     if (!err) {
//         //childData("http://www.jetstar.com/au/en/holidays/deals");
//         childScrape("http://www.jetstar.com/au/en/holidays");
//     } else {

//     }
// });

// var xl = require('excel4node');

// var wb = new xl.Workbook();
// var ws = wb.addWorksheet('jetstar');
// var style = wb.createStyle({
//     font: {
//         size: 12
//     }
// });
// ws.cell(1, 1).number(200).style(style);
// ws.cell(1, 2).string('string1').style(style);

// wb.write('Jetstar.xlsx');
// var fs = require('fs');
// var data = [1, 'abc']
// fs.appendFile('Jetstar.xlsx', data, function(err) {
//     if (err) throw err;
//     console.log('Saved!');
// });

function childScrape(link) {
    request(link, function(err, response, html) {
        if (!err) {
            var $ = cheerio.load(html);
            var allLink = [];
            $('.js-va-scroll .product-section .product-section__body .thumbnail--x4 .cta__wrapper a').each(function(e) {
                var data = $(this);
                if (data.attr("href").includes('http:')) {
                    var l = data.attr('href');
                } else {
                    var l = "http://www.jetstar.com" + data.attr('href');
                }
                allLink.push(l);

            })
            for (var i = 0; i < allLink.length; i++) {
                setTimeout(function(x) {

                    childData(allLink[x]);
                }, i * 40000, i);
            }

        }
    })
}

// childData("http://www.jetstar.com/au/en/holidays/deals");

function childData(link) {
    console.log('link', link);
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
                setInterval(function() {
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
                        var price = data.attr('data-package-price');
                        var InsData = {
                            link: allData.link,
                            description: allData.description,
                            title: allData.title,
                            destination: allData.destination,
                            price: allData.price,
                            nights: allData.nights,
                            date_from: allData.date_from,
                            date_to: allData.date_to,
                            stars: allData.stars,
                            purchase_by: allData.purchase_by,
                            departure: allData.departure,
                            agency: allData.agency
                        }

                        // console.log('allData', allData.purchase_by);
                        var d = new Date(allData.purchase_by)
                        if (isNaN(d.getTime())) {
                            console.log('not valid date');
                        } else {
                            // console.log('Insert');
                            var xlData = allData.link + "\n";
                            console.log('xlData', xlData);

                            fs.appendFile('Filename.xlsx', xlData, (err) => {
                                if (err) throw err;
                                console.log('File created');
                            });

                            // SAVE()
                            function SAVE() {
                                requ.query("insert into deal(description,destination,nights,link,title,purchase_by,agency) values( '" +
                                    description.toString() + "',  '" +
                                    data.attr('data-destination-name') + "', " +
                                    nights + ",  '" +
                                    link + "',  '" +
                                    data.attr('data-package-name') + "', '" +
                                    allData.purchase_by + "','jetstar')",
                                    function(err, dealAdded) {
                                        if (!err) {
                                            requ.query("SELECT max(id) id from deal", function(err, lastIns) {
                                                if (!err) {
                                                    var deal_id = lastIns.recordset[0].id;
                                                    console.log('Inserted', deal_id);
                                                    requ.query("insert into deal_departure(deal_id,departure,price) values(  '" +
                                                        deal_id + "', '" +
                                                        departure + "',  '" +
                                                        price + "')",
                                                        function(err, addDepart) {
                                                            if (!err) {
                                                                requ.query("SELECT @@IDENTITY AS 'Identity'", function(err, lastInsDepart) {
                                                                    if (!err) {
                                                                        var deal_departure_id = lastInsDepart.recordset[0].Identity;
                                                                        console.log('dates', allData.dates);
                                                                        var date_from = allData.date_from;
                                                                        var date_to = allData.date_to;
                                                                        requ.query("insert into deal_dates(deal_id,deal_departure_id,date_from,date_to) values(  '" +
                                                                            deal_id + "',  " +
                                                                            deal_departure_id + ", '" +
                                                                            date_from + "',  '" +
                                                                            date_to + "')",
                                                                            function(err, dateIns) {
                                                                                if (!err) {
                                                                                    console.log('INserted');
                                                                                } else {
                                                                                    console.log('Error for inserting into deal date', err);
                                                                                }
                                                                            })
                                                                    } else {
                                                                        console.log('Error for select last from deal depar', err);
                                                                    }
                                                                });
                                                            } else {
                                                                console.log('Error for insert data into deal departure', err);
                                                            }
                                                        })

                                                } else {
                                                    console.log('Error for selecting last id', err);
                                                }
                                            });
                                        } else {
                                            console.log('Error for Deal', err);
                                        }
                                    });
                            }

                        }

                    })
                }, 2000);
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
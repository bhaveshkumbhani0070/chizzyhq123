var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');
var sql = require('mssql');
//var connection = require(__dirname + '/config/db');
var pool = require('../config/db');
const requ = new sql.Request(pool);

var links = [
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Sydney", //51
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Adelaide", //51
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Brisbane", //48
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Cairns", //47
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Canberra", //48
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Darwin", //47
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Hobart", //46
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Melbourne", //52
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Perth", //51
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Gold+Coast" //8,GoldCoast
]

exports.scrape = function(req, res) {
    var l = req.params.l;
    var url = links[l];
    console.log('@@@@@@@@@@@@@@', l, url);

    callScrape(url)

    function callScrape(url) {
        pool.close();
        pool.connect(function(err, connection) {
            if (!err) {
                var city = url.split("=")[1];
                for (var x = 0; x < 52; x++) {
                    setTimeout(function(y) {
                        console.log(url, y);
                        Scrap(url, y);
                        // if (y >= 51) {
                        //     if (l < 10) {
                        //         callScrape(links[l++])
                        //     } else if (l > 10) {
                        //         return;
                        //     }
                        // }
                    }, x * 20000, x);
                }
            } else {
                console.log('Connection Error', err);
                return;
            }
        });
    }
}



function Scrap(u, y) {
    var url = u + "&page=" + y;
    console.log('url', url);
    var departure = u.split("=")[1];
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            var allData = [];
            $('a.clearfix').each(function(x) {
                var data = $(this);
                var package = data.find("h3.product-package").text();
                var traveldates = [];
                var date = data.find(".product-travel-dates").text().split(":")[1].split(',');
                for (var i = 0; i < date.length; i++) {
                    traveldates.push({ traveldates: getDate(date[i]) })
                }
                var newUrl = "https://www.flightcentre.com.au" + data.attr("href");
                var star = 0.0;
                data.find('.product-star-rating i').each(function() {
                    var st = $(this);
                    if (st.hasClass("icon-star")) {
                        star = parseFloat(star) + 1.0
                    }
                    if (st.hasClass("icon-star-half")) {
                        star = parseFloat(star) + 0.5;
                    }
                    if (st.hasClass("self-rated-whole")) {
                        star = parseFloat(star) + 1.0
                    }
                });

                var sendData = {
                    url: newUrl,
                    departure: departure,
                    package: package,
                    dates: traveldates,
                    star: star
                }

                //After Scrapping main page, it will go for child page scrape 
                setTimeout(function(y) {
                    ScrapInnerData(newUrl, sendData, y);
                }, x * 1500, x);


            });
        } else {
            console.log('Error');
        }
    });
}

function ScrapInnerData(url, alldata, y) {
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('.product-info-left p .label').each(function(ele) {
                var data = $(this);
                alldata[data.text()] = data.next().text();
            });
            alldata["price"] = $('.price').attr("content");
            alldata["purchase_by"] = $('.priceValidUntil').attr("content");

            var whatNext = $('.product-checkbox-icon').next().next();
            var whatNextData = [];
            whatNext.children().each(function(i) {
                var data = $(this);
                whatNextData.push(data.text());
            })
            alldata[$('.product-checkbox-icon').next().text()] = whatNextData;

            requ.query("select * from deal where link='" + alldata.url + "'", function(err, cityD) {
                if (!err) {
                    //   console.log('data', cityD.recordset)
                    if (cityD.recordset.length > 0) {
                        console.log('Already there')
                    } else {
                        var description = alldata["What's Included?"].toString() || "";
                        var destination = alldata.Destination || "";
                        var stars = parseInt(alldata.star) || 0;
                        var nights = parseInt(alldata.Duration) || 0;
                        var link = alldata.url || "";
                        var title = alldata.package || "";
                        var purchase_by = alldata.purchase_by || "";
                        requ.query("insert into deal(description,destination,stars,nights,link,title,purchase_by) values('" +
                            description + "','" +
                            destination + "','" +
                            stars + "','" +
                            nights + "','" +
                            link + "','" +
                            title + "','" +
                            purchase_by + "')",
                            function(err, dealAdded) {
                                if (!err) {
                                    requ.query("SELECT @@IDENTITY AS 'Identity'", function(err, lastIns) {
                                        if (!err) {
                                            var deal_id = lastIns.recordset[0].Identity;
                                            var departure = alldata.departure || "";
                                            var price = parseFloat(alldata.price) || 0.0;
                                            requ.query("insert into deal_departure(deal_id,departure,price) values('" +
                                                deal_id + "','" +
                                                departure + "','" +
                                                price + "')",
                                                function(err, addDepart) {
                                                    if (!err) {
                                                        requ.query("SELECT @@IDENTITY AS 'Identity'", function(err, lastInsDepart) {
                                                            if (!err) {
                                                                var deal_departure_id = lastIns.recordset[0].Identity;
                                                                for (var i = 0; i < alldata.dates.length; i++) {
                                                                    var date = alldata.dates[i].traveldates;
                                                                    var from = date.split('-')[0];
                                                                    var to = date.split('-')[1];
                                                                    requ.query("insert into deal_dates(deal_id,deal_departure_id,date_from,date_to) values('" + deal_id + "','" + deal_departure_id + "','" + from + "','" + to + "')",
                                                                        function(err, dateIns) {
                                                                            if (!err) {
                                                                                console.log('INserted');
                                                                            } else {
                                                                                console.log('Error for inserting into deal date', err);
                                                                                return;
                                                                            }
                                                                        })
                                                                }
                                                            } else {
                                                                console.log('Error for identity', err);
                                                            }
                                                        });
                                                    } else {
                                                        console.log('Error for adding into deal_departure');
                                                        return;
                                                    }
                                                })

                                        } else {
                                            console.log('error for select into deal id', err);
                                            return;
                                        }
                                    });
                                } else {
                                    console.log('Error for insert into deal', err);
                                    return;
                                }
                            });
                    }

                } else {
                    console.log('Error', err);
                }
            });
        } else {
            console.log('Error', error);
        }
    });
}

// First time it will check json file is empty or not
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

//Get date from two date 
/**
 * if date is like 20 February - 6 March 2018 it will return
 *  20/2/2018-6/3/2018
 * here this data is From to To
 */
function getDate(d) {
    var date = d.trim().split('-')
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

// Return date in format of dd/mm/yyyy
function dateFormate(d) {
    var date = new Date(d);
    var mm = parseInt(date.getMonth()) + 1;
    return mm + '/' + date.getDate() + '/' + date.getFullYear();
}



// var finalData = [];
// finalData.push(alldata);
// //Here first read file file 
// fs.readFile(path, function(err, d) {
//     if (isEmptyObject(d)) {
//         var json = finalData;
//     } else {
//         var json = JSON.parse(d)
//         json = json.concat(finalData)
//     }
//     console.log('alldata', y);
//     //after read file append new data in old
//     fs.writeFile(path, JSON.stringify(json, null, 4))
// })
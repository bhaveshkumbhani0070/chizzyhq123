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

// start();

function start() {
    pool.close();
    pool.connect(function(err, connection) {
        if (!err) {
            console.log('Connected');
            var url = "https://travel.virginaustralia.com/au/holidays?travel_theme_nid_2=All&holiday_package_nid=All&Submit=Find%20Holidays&page=";
            // for (var i = 0; i < 7; i++){

            // }
            // Scrap(url, 1);
        } else {
            console.log('connection error', err);
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

function Scrap(u, page) {
    var url = u + page;
    console.log('url', url);
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            var offset=0;
            $('.view-vah-holiday-packages-landing .view-content').children().each(function(e) {
                var data = $(this);                    
                setTimeout(function(){
                    if (!data.hasClass("views-row-first")) {
                        var chilUrl = "https://travel.virginaustralia.com" + data.find('.card__actions').children().attr('href');
                        var parts = chilUrl.split("/");
                        var destination = parts[parts.length - 1];
                        for (var j = 0; j < desti.length; j++) {
                            setTimeout(function(i) {
                                var url = chilUrl + "?origin_airport_nid=" + desti[i].id + "&Submit=Go&field_deal_search_type_value=flight_hotel"
                                // console.log('url',url);
                                 childData(url, desti[i].value, destination);
                            }, j * 150000, j);
                        }
                    }
                    else{
                        console.log('this is first');
                    }
                }, 150000 + offset);    
                offset += 5000;
            })
        } else {
            console.log('Error', error);
        }
    })
}

function childData(u, departure, destination) {
    console.log('u', u);
    request(u, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            var description = "";
            $('.vah-layout__col').children().eq(0).children().each(function(e) {
                var data = $(this);
                description = description + data.text();
            })
            description=description.replace(/'/g, "");
            var offset=0;
            $('.view-vah-holiday-packages .view-content').children().each(function(e) {
                var data = $(this);
                setTimeout(function(){
                    var allData = [];
                    var stars = parseInt(data.find('.star-rating__value').text());
                    var nights = data.find('.vah-field-number-of-nights__value').text();
                    var title = data.find('.card__title').text();
                    title=title.replace(/'/g, "");
                    var purchase_by = purchageDate(data.find('.date-display-single').text()); //31/03/2018
                    var price = data.find('.vah-field-price__value').text();
                    var dates = [];
                    $('.field-item').each(function(e) {
                        var data = $(this);
                        dates.push({
                            date_from: purchageDate(data.find('.date-display-start').text()),
                            date_to: purchageDate(data.find('.date-display-end').text())
                        })
                    })                                      
                    requ.query("select * from deal where agency='virginaustralia' and price='"+price+"'  and title='" + title + "'", function(err, cityD) {
                        if (!err) {
                            if (cityD.recordset.length > 0) {
                                console.log('Already there',title)
                            } else {
                                 // console.log(title);
                                // saveOrNot()
                                function saveOrNot(){  
                                    requ.query("insert into deal(description,destination,stars,nights,link,title,purchase_by,agency) values('" +
                                        description + "','" +
                                        destination + "'," +
                                        parseInt(stars) + "," +
                                        parseInt(nights) + ",'" +
                                        u + "','" +
                                        title + "','" +
                                        purchase_by + "','virginaustralia')",
                                        function(err, dealAdded) {
                                            if (!err) {
                                                console.log('deal added');
                                                requ.query("SELECT max(id) id from deal", function(err, lastIns) {
                                                    if (!err) {
                                                        var deal_id = lastIns.recordset[0].id;
                                                        console.log('deal_id',deal_id);
                                                        requ.query("insert into deal_departure(deal_id,departure,price) values('" +
                                                            deal_id + "','" +
                                                            departure + "','" +
                                                            price + "')",
                                                            function(err, addDepart) {
                                                                if (!err) {
                                                                    console.log('deal departure added');
                                                                    requ.query("SELECT max(id) id from deal_departure", function(err, lastInsDepart) {
                                                                        if (!err) {
                                                                            var deal_departure_id = lastInsDepart.recordset[0].id;
                                                                            console.log('deal_departure_id',deal_departure_id);
                                                                            for (var i = 0; i < dates.length; i++) {
                                                                                var from = dates[i].date_from;
                                                                                var to = dates[i].date_to;
                                                                                requ.query("insert into deal_dates(deal_id,deal_departure_id,date_from,date_to) values('" +
                                                                                 deal_id + "','" + 
                                                                                 deal_departure_id + "','" + 
                                                                                 from + "','" + 
                                                                                 to + "')",
                                                                                    function(err, dateIns) {
                                                                                        if (!err) {
                                                                                            console.log('INserted');
                                                                                        } else {
                                                                                            console.log('Error for inserting into deal date', err);
                                                                                        }
                                                                                    })
                                                                            }
                                                                        } else {
                                                                            console.log('Error for select id')
                                                                        }
                                                                    })
                                                                } else {
                                                                    console.log('Error for Inset into deal_departure', err);
                                                                }
                                                            });
                                                    } else {
                                                        console.log('Error for select Deal', err);
                                                    }
                                                });
                                            } else {
                                                console.log('Error for Insert Deal', err);
                                            }
                                        });  
                                }      
                            }
                        } else {
                            console.log('Error for selecting url from deal',err);
                        }
                    });
                }, 8000 + offset);    
                offset += 4000; 
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

function purchageDate(date) {
    if (date) {
        var newD = date.split("/");
        var retuData = newD[1] + '/' + newD[0] + '/' + newD[2];
        return retuData;
    } else {
        return false;
    }
}
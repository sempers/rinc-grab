/**
 * Created by Rookie on 16.04.2017.
 */
var _ = require("underscore");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var results = [];
var START = 1;
var END = 84;
var COUNTER = 0;

function renderPage() {
    results = _.sortBy(results, 'id');
    var content ="<html><head></head><body>\r\n";
    for (var i =0; i<results.length; i++) {
        content += results[i].html + "\r\n";
    }
    content  += "</body></html>";
    fs.writeFileSync("all_guesta.html", content, 'utf-8');
    console.log("OK!");
}

function requestPage() {
    var self = this;

    request.get("http://rinc.narod.ru/gb/" + self.i, {},
        function (error, response, body) {
            if (!error && body) {
                var $ = cheerio.load(body);
                console.log("page " + self.i + " grabbed");
                COUNTER++;
                var re = /^entryID(\d+)$/;
                var divs = $('.report-spam-target');
                divs.each(function (j, div) {
                    var id = $(div).attr('id');
                    results.push({
                        id: +(re.exec(id)[1]),
                        html: '<div class="entry">' + $(div).html() + '</div>'
                    });
                });
                if (COUNTER >= END){
                    renderPage();
                }
            } else {
                console.log("error loading page " + self.i);
            }
        });
}


for (var i = START; i <= END; i++) {
    setTimeout(requestPage.bind({i: i}), i * 500);
}


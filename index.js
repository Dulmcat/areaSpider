/* 
 * 爬取行政区划,并解析存JSON
 */

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

(() => {
    const xzqhUrl = 'http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/';
    getUrl(xzqhUrl);
})();

function getUrl(url) {
    request({
        url: url,
    }, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            console.log('-----获得网页入口数据-----');
            let $ = cheerio.load(body);
            let list = $('.center_list_contlist li').eq(0).find('a').attr('href').trim().slice(2);
            let lastest = url + list;
            console.log('-----获得最新发布网址-----');
            console.log(lastest);
            console.log('-----开始解析网页内容-----');
            analysePage(lastest);
        } else {
            console.log('+++++粗错啦！++++++', err, 'code: ' + res.statusCode);
            return false;
        }
    });
}

function analysePage(url) {
    request({
        url: url,
    }, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            let $ = cheerio.load(body);
            let province = [];
            let city = [];
            let area = [];
            $('.TRS_PreAppend p').each(function(idx, ele){
                console.log(idx);
                var all = $(this).find('span').text().trim().replace(/\s/g,"")
                if(all.match(/.0{4}/)){
                    province.push(all)
                } else if(all.match(/.0{2}/)) {
                    city.push(all);
                } else {
                    area.push(all);
                }
            });
            console.log(area);
            fs.writeFile('./txt.txt', codes, (err) => {
                console.log(err);
            });
            
        } else {
            console.log('+++++粗错啦！++++++', err, 'code: ' + res.statusCode);
            return false;
        }
    })
}
var express = require('express');
var model = require('./StockModel');
let querystring = require('querystring');
let url = require('url');
var router = express.Router();

let stockModel = model();

router.get('/hq', async(req, res) => {
    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);
    
    let list = await stockModel.getStockList(params.page);
    for (let i = 0; i < list.length; i++) {
        list[i].open = await stockModel.getOpen(list[i].code);
        list[i].close = await stockModel.getClose(list[i].code);
        list[i].volume = await stockModel.getVolume(list[i].code);
        list[i].high = await stockModel.getHigh(list[i].code);
        list[i].low = await stockModel.getLow(list[i].code);
        list[i].amplitude = stockModel.calAmplitude(list[i].high, list[i].low);
    }
    res.json(list);
})

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// 获取某股日K数据
router.get('/s', async(req, res) => {
    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);

    let list = await stockModel.getKList(params.code);
    res.json(list);
});

// 获取用户历史交易数据
router.get('/history', async(req, res) => {
    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);

    let list = await stockModel.getHistory(params.userid);
    res.json(list);
});

// 获取用户自选
router.get('/optional', async(req, res) => {
    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);

    let list = await stockModel.getOptional(params.userid);
    for (let i = 0; i < list.length; i++) {
        list[i].price = stockModel.getOpen(list[i].code);
        list[i].volume = stockModel.getVolume(list[i].code);
    }
    res.json(list);
});

// 获取用户持仓
router.get('/position', async(req, res) => {
    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);

    let list = await stockModel.getPosition(params.userid);
    for (let i = 0; i < list.length; i++) {
        list[i].price = stockModel.getOpen(lsit[i].code);
    }
    res.json(list);
})

module.exports = router;
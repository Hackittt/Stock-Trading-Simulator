const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const url = require('url');
const model = require('../controller/taskService');

router.use(express.json());
router.use(express.urlencoded({extended : true}));

let stockModel = model();

router.get('/', function(req, res, next) {
    console.log(req.body);
    res.render('index', { title: 'Express' });
});

// 获取行情
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
});

// 筛选器
router.get('/sizer', async(req, res) => {
    let body = req.body;
    for (let i = 0; i < body.length; i++) {
        if (!('name' in body[i])) {
            res.status(400).send('Bad Request: Invalid parameters');
        } if ('low' in body[i] && typeof body[i].low != 'number') {
            res.status(400).send('Bad Request: Invalid parameters');
        } if ('high' in body[i] && typeof body[i].high != 'number') {
            res.status(400).send('Bad Request: Invalid parameters');
        }
    }

    let list = await stockModel.sizer(body);
    res.json(list);
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
});

module.exports = router;
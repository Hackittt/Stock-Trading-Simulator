const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const url = require('url');
const Singleton = require('../controller/taskService');

router.use(express.json());
router.use(express.urlencoded({extended : true}));

let stockModel = Singleton();

// 获取行情
router.get('/hq', async(req, res) => {

    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);
    if (!params.page) {
        params.page = 1;
    }
    
    let list = await stockModel.getStockList(params.page);

    const promises = list.map(async item => {
        item.open = await stockModel.getOpen(item.code);
        item.close = await stockModel.getClose(item.code);
        item.volume = await stockModel.getVolume(item.code);
        item.high = await stockModel.getHigh(item.code);
        item.low = await stockModel.getLow(item.code);
        item.amplitude = stockModel.calAmplitude(item.high, item.low);
        if (req.user.email) {
            item.isOptional = await stockModel.isOptional(req.user.email, item.code);
        } else {
            item.isOptional = false;
        }
        return item;
    })

    Promise.all(promises)
    .then(updatedList => {
        res.json(updatedList);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    })
});

// 筛选器
router.post('/sizer', async(req, res) => {
    let body = req.body;
    if (!body.length) {
        res.status(400).send('Bad Request: Invalid parameters');
        return;
    }

    for (let i = 0; i < body.length; i++) {
        if (!('name' in body[i])) {
            res.status(400).send('Bad Request: Invalid parameters');
            return;
        } if ('low' in body[i] && typeof body[i].low != 'number') {
            body[i].low = body[i].low ? parseInt(body[i].low) : -1e18;
        } if ('high' in body[i] && typeof body[i].high != 'number') {
            body[i].high = body[i].high ? parseInt(body[i].high) : 1e18;
        }
    }

    let list = await stockModel.sizer(body);
    for (let i = 0; i < list.length; i++) {
        list[i].name = await stockModel.getStockName(list[i].code);
        list[i].amplitude = stockModel.calAmplitude(list[i].high, list[i].low);
    }
    res.json(list);
});

// 获取某股日K数据
router.get('/s', async(req, res) => {
    let arg = url.parse(req.url).query;
    let params = querystring.parse(arg);
    if (!param.code) {
        res.status(400).send('Bad Request: Invalid parameters');
        return;
    }

    let list = await stockModel.getKList(params.code);
    res.json(list);
});

// 获取用户历史交易数据
router.get('/history', async(req, res) => {
    let list = await stockModel.getHistory(req.user.email);
    res.json(list);
});

// 获取用户自选列表
router.get('/optional', async(req, res) => {
    let optional = await stockModel.getOptional(req.user.email);
    let codeArray = optional[0].codeArray;
    let list = [];
    for (let i = 0; i < codeArray.length; i++) {
        list[i] = {};
        list[i].code = codeArray[i];
        }

    const promises = list.map(async item => {
        item.open = await stockModel.getOpen(item.code);
        item.close = await stockModel.getClose(item.code);
        item.volume = await stockModel.getVolume(item.code);
        item.high = await stockModel.getHigh(item.code);
        item.low = await stockModel.getLow(item.code);
        item.amplitude = stockModel.calAmplitude(item.high, item.low);
        if (req.user.email) {
            item.isOptional = await stockModel.isOptional(req.user.email, item.code);
        } else {
            item.isOptional = false;
        }
        return item;
    })

    Promise.all(promises)
    .then(updatedList => {
        res.json(updatedList);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    })
});

// 获取用户持仓
router.get('/position', async(req, res) => {
    let position = await stockModel.getPosition(req.user.email);
    let list = [];
    for (let i = 0; i < position.length; i++) {
        list[i] = {};
        list[i].code = position[i].code;
    }

    const promises = list.map(async (item) => {
        item.name = await stockModel.getStockName(item.code);
        item.price = await stockModel.getClose(item.code);
        item.open = await stockModel.getOpen(item.code);
        item.close = await stockModel.getClose(item.code);
        item.volume = await stockModel.getVolume(item.code);
        item.high = await stockModel.getHigh(item.code);
        item.low = await stockModel.getLow(item.code);
        item.amplitude = stockModel.calAmplitude(item.high, item.low);
        item.count = await stockModel.getPositionCount(req.user.email, item.code);
        item.cost = await stockModel.getPositionCost(req.user.email, item.code);
        return item;
    })

    Promise.all(promises)
    .then(updatedList => {
        res.json(updatedList);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    })
});

// 添加自选
router.post('/addoptional', async(req, res) => {
    if (!req.body.code) {
        res.status(400).send('Bad Request: Invalid parameters');
        return;
    }

    let code = req.body.code;
    let result = await stockModel.addOptional(req.user.email, code);
    res.json(result);
});

// 删除自选
router.post('/deloptional', async(req, res) => {
    if (!req.body.code) {
        res.status(400).send('Bad Request: Invalid parameters');
        return;
    }

    let code = req.body.code;
    let result = await stockModel.deleteOptional(req.user.email, code);
    res.json(result);
});

// 交易
router.post('/exchange', async(req, res) => {
    if (!req.body.count || !req.body.code) {
        res.status(400).send('Bad Request: Invalid parameters');
        return;
    }

    let count = parseInt(req.body.count);
    let code = req.body.code;
    let cost = await stockModel.getClose(code);
    let remain = await stockModel.getFund(req.user.email);
    console.log(remain);
    if (remain + count * cost < 0) {
        res.json(false);
        return;
    }
    let result = await stockModel.modifyPosition(req.user.email, code, count, count < 0 ? 0 : count * cost);
    if (result) {
        await stockModel.modifyFund(req.user.email, -count * cost);
    }
    res.json(true);
});

// 获取股票总数
router.get('/stockscount', async(req, res) => {
    let count = await stockModel.getStockCount();
    res.json(count);
});

// // 获取用户资金
// router.post('/userfund', async(req, res) => {
//     let remain = await stockModel.getFund(req.user.email);
//     res.json(remain);
// })

module.exports = router;
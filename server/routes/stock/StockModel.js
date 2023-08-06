const { default: mongoose } = require('mongoose');
const CustomQueue = require('./CustomQueue');
const axios = require('axios');

const queue = new CustomQueue(1);
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

class StockModel {
    constructor() {
        this.dataLicence = '2ab8ed1b964913334';
        this.token = 'token=0693b69e800f4083c3b95d6e558bd400ee6826e7';
        mongoose.connect('mongodb://127.0.0.1/test');
        this.MAXCOUNT = 400;
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error'));
        this.stockSchema = null;
        this.k_listSchema = null;
        this.historySchema = null;
        this.positionSchema = null;
        this.optionalSchema = null;
        this.fundSchema = null;
            // 股票
            this.stockSchema = mongoose.Schema({
                name : String,              // 股票名
                code : {type : String, unique : true},              // 代码
                position : Array,           // 所属板块
                market : String,            // 上市市场
                principal : String,         // 主承销商
                rdate : Date,               // 成立日期
                addr : String,              // 注册地址
                rprice : String,            // 注册资本
                desc : String               // 公司简介
                // high : Number,              // 今日最高价
                // low : Number,               // 昨日最低价
                // current : Number,           // 现价
                // turnover : Number,          // 换手率
                // amplitude : Number,         // 振幅
                // amount : Number,            // 成交额
                // outstanding_shares : Number, // 流通股
            });

            // 日K
            this.k_listSchema = mongoose.Schema({
                code : {type : String, index : true},   // 股票代码
                date : {type : Date, index : true},     // 日期
                open : Number,   // 开盘价
                close : Number,  // 收盘价
                high : Number,   // 最高价
                low : Number,    // 最低价
                volume : Number,  // 成交量
            });

            // 交易记录
            this.historySchema = mongoose.Schema({
                date : {type : Date, default : Date.now()},      // 时间
                useid : {type : String, index : true}, // 用户ID
                code : String,    // 股票代码
                type : String,    // 交易类型
                count : Number,   // 交易数量
                cost : Number     // 交易价格
            });

            // 持仓
            this.positionSchema = mongoose.Schema({
                userid : {type : String, index : true},  // 用户id
                code : String,    // 股票代码
                count : Number,   // 数量
                cost : Number     // 持仓成本
            });
            
            // 自选
            this.optionalSchema = mongoose.Schema({
                userid : {type : String, index : true},         // 用户id
                codeArray : [String]     // 股票代码 
            });

            // 用户资金
            this.fundSchema = mongoose.Schema({
                userid : {type : String, index : true},
                fund : Number
            })
        this.stock = mongoose.model('stock', this.stockSchema);
        this.k_list = mongoose.model('k_list', this.k_listSchema);
        this.history = mongoose.model('history', this.historySchema);
        this.position = mongoose.model('position', this.positionSchema);
        this.optional = mongoose.model('optional', this.optionalSchema);
        this.fund = mongoose.model('fund', this.fundSchema);

        this.start();
        this.render();
    }

    // 初始化
    async start() {
        // 初始化股票列表
        await this.initStock();

        // 获取公司
        await this.stock.find().sort('code').then(async res => {
            for (let i = 0; i < res.length; i++) {
                await sleep(10);
                queue.add(async () => {
                    await axios.get('http://api.mairui.club/hscp/gsjj/' + res[i].code.slice(2) + '/' + this.dataLicence)
                    .then(response => {
                        const body = response.data;

                        if (body.Message) {
                            return console.log(res[i].code + ' no data');
                        }

                        res[i].addr = body.addr;
                        res[i].market = body.market;
                        res[i].rdate = body.rdate;
                        res[i].rprice = body.rprice;
                        res[i].principal = body.principal;
                        res[i].desc = body.desc;

                        let arr = body.idea.split(',');
                        for (let j = 0; j < arr.length; j++) {
                            res[i].position[j] = arr[j];
                        }

                        return res[i].save();
                    })
                    .then(result => {
                        console.log(result);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });
            }
        });

        // 获取历史数据
        await this.stock.find().sort('code').then(async res => {
            for (let i = 0; i < this.MAXCOUNT; i++) {
                queue.add(async () => {
                    await this.initStockHistory(res[i].code);
                });
            }
        });
    }

    // 同步数据
    render() {
        let date = new Date();

        // 更新当日日线数据
        this.stock.find().then(res => {
            for (let i = 0; i < this.MAXCOUNT; i++) {
                queue.add(async () => {
                    await this.updataDaily(res[i].code);
                });
            }
        });

        let delta = 0;
        if (date.getHours() >= 15) {
            delta = 86400000;
        }
        setTimeout(() => {
            this.render();
        }, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 5) - date + delta);
    }

    // 初始化股票列表
    async initStock() {
        axios.get('http://api.mairui.club/hslt/list/' + this.dataLicence)
        .then(response => {
            const body = response.data;
            for (let i = 0; i < body.length; i++) {
            let stock = new this.stock();
            stock.name = body[i].mc;
            stock.code = body[i].jys + body[i].dm;
            stock.save().then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    // 初始化历史数据
    async initStockHistory(code) {
        axios.get('https://api.tiingo.com/tiingo/daily/' + code.slice(2) + '/prices?' + this.token + '&startDate=2022-1-1&endDate=2023-8-4')
        .then(res => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
                let kval = new this.k_list();
                kval.code = code;
                kval.date = data[i].date;
                kval.open = data[i].open;
                kval.close = data[i].close;
                kval.high = data[i].high;
                kval.low = data[i].low;
                kval.volume = data[i].volume;
                kval.save().then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            }
        });
    }

    // 更新日线数据
    async updateDaily(code) {
        axios.get('https://api.tiingo.com/tiingo/daily/' + code.slice(2) + '/prices?' + this.token)
        .then(res => {
            let data = res.data;
            let kval = new this.k_list();
            kval.code = code;
            kval.date = data.date;
            kval.open = data.open;
            kval.close = data.close;
            kval.high = data.high;
            kval.low = data.low;
            kval.volume = data.volume;
            kval.save().then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
        })
    }

    // 获取股票列表(一页三十个)
    async getStockList(page) {
        let res = await this.stock.find().sort('code').skip((page - 1) * 30).limit(30).lean();
        return res;
    }

    // 获取某股日K
    async getKList(code) {
        console.log(typeof(code));
        let res = await this.k_list.find({code : code}).sort('date');
        return res;
    }

    // 获取当日开盘价
    async getOpen(code) {
        let res = await this.k_list.find({code : code}).sort('date').limit(1);
        if (!res.length) {
            return null;
        }
        return res[0].open;
    }

    // 获取当日成交量
    async getVolume(code) {
        let res = await this.k_list.find({code : code}).sort('date').limit(1);
        if (!res.length) {
            return null;
        }
        return res[0].volume;
    }

    // 获取当日成交量
    async getVolume(code) {
        let res = await this.k_list.find({code : code}).sort('date').limit(1);
        if (!res.length) {
            return null;
        }
        return res[0].volume;
    }

    // 获取当日最高价
    async getHigh(code) {
        let res = await this.k_list.find({code : code}).sort('date').limit(1);
        if (!res.length) {
            return null;
        }
        return res[0].high;
    }

    // 获取当日最低价
    async getLow(code) {
        let res = await this.k_list.find({code : code}).sort('date').limit(1);
        if (!res.length) {
            return null;
        }
        return res[0].low;
    }

    // 获取昨日收盘价
    async getClose(code) {
        let res = await this.k_list.find({code : code}).sort('date').limit(2);
        if (res.length == 1 || !res.length) {
            return null;
        } else {
            return res[1].close;
        }
    }

    // 获取历史交易记录
    async getHistory(userid) {
        let res = await this.history.find({userid : userid}).sort('date');
        return res;
    }

    // 获取用户持仓
    async getPosition(userid) {
        let res = await this.position.find({userid : userid}).sort('code');
        return res;
    }

    // 修改持仓
    async modifyPosition(userid, code, count, cost = 0) {
        let old = await this.position.find({userid : userid, code : code});
        let position = new this.position();
        position.userid = userid;
        position.code = code;
        position.count = position.cost = 0;
        if (old.length) {
            position.count = old[0].count;
            position.cost = old[0].cost;
        }
        if (position.count < 0) {
            return false;
        }

        if (count > 0) {
            position.count += count;
            position.cost += cost;
        } else {
            position.cost = position.cost * ((position.count + count) / position.count);
        }
        position.save().then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
        return true;
    }

    // 获取用户自选
    async getOptional(userid) {
        let res = await this.optional.find({userid : userid}).sort('code');
        return res;
    }

    // 添加自选
    async addOptional(userid, code) {
        await this.optional.updateOne(
            {userid : userid},
            {$pull : {codeArray : code}}
        );
    }

    // 删除自选
    async addOptional(userid, code) {
        await this.optional.updateOne(
            {userid : userid},
            {$push : {codeArray : code}}
        );
    }

    // 计算振幅
    calAmplitude(high, low) {
        if (!high || !low) {
            return null;
        }
        return (high - low) / low * 100;
    }
};


let res = null;
let Singleton = function() {
    if (res === null) {
        res = new StockModel();
    }
    return res;
}

module.exports = Singleton;
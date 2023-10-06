const mongoose = require('mongoose');
const axios = require('axios');
const CustomQueue = require('../utils/CustomQueue'); 

const queue = new CustomQueue(8);

class StockModel {
    constructor() {
        this.token = 'token=5d79204ced17131a710c6d0e58163796eb999e1e';
        this.dataLicence = '2ab8ed1b964913334';
        this.MAXCOUNT = 20;

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
                userid : {type : String, index : true}, // 用户ID
                code : String,    // 股票代码
                type : String,    // 交易类型
                count : Number,   // 交易数量
                cost : Number     // 交易价格
            });

            // 持仓
            this.positionSchema = mongoose.Schema({
                userid : {type : String, index : true},  // 用户id
                code : {type : String, index : true},    // 股票代码
                count : {type : Number, default : 0},   // 数量
                cost : {type : Number, default : 0}     // 持仓成本
            });
            this.positionSchema.index({userid : 1, code : 2},{unique : true});
            
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

        return;
        this.start();
        this.render();
    }

    // 初始化
    async start() {
        // 初始化股票列表
        await this.initStock();
        // 获取历史数据
        await this.stock.find().sort('code').then(async res => {
            for (let i = 0; i < res.length; i++) {
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
            for (let i = 0; i < Math.min(this.MAXCOUNT, res.length); i++) {
                if (res[i]) { //确保 res[i] 存在
                    queue.add(async () => {
                        await this.updateDaily(res[i].code);
                    });
                }
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
        axios.get('https://api.tiingo.com/iex?' + this.token)
        .then(response => {
            const body = response.data;
            for (let i = 0; i < body.length && i < this.MAXCOUNT; i++) {
            let stock = new this.stock();
            stock.code = body[i].ticker;
            stock.save().then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
                return;
            });
            }

            this.stock.find().then(res => {
            for (let i = 0; i < res.length; i++) {
                axios.get('http://api.mairui.club/hscp/gsjj/' + res[i].code + '/' + this.dataLicence)
                .then(response => {
                    if (!response.data.name) {
                        return;
                    }
                    res[i].name = response.data.name;
                    res[i].save().then(result => {
                        console.log(result);
                    }).catch(error => {
                        console.log(error);
                    })
                })
                .catch(error => {
                    console.log(error);
                })
            }
        })
    }).catch(error => console.log(error));

    }

    // 初始化历史数据
    async initStockHistory(code) {
        axios.get('https://api.tiingo.com/tiingo/daily/' + code + '/prices?' + this.token + '&startDate=2023-8-1&endDate=2023-9-8')
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
        axios.get('https://api.tiingo.com/tiingo/daily/' + code + '/prices?' + this.token)
        .then(res => {
            let data = res.data[0];
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

    // 筛选器
    async sizer(param) {
        let laster = await this.k_list.find().sort({'date' : -1}).limit(1);
        let date = laster[0].date;

        let res = this.k_list.find({'date' : date});
        for (let i = 0; i < param.length; i++) {
            let low, high;
            if (!('low' in param[i])) {
                low = -1e18;
            } else {
                low = param[i].low;
            }
            if (!('high' in param[i])) {
                high = 1e18;
            } else {
                high = param[i].high;
            }
            res = res.find({$and : [
                {[param[i].name] : {$gt : low}},
                {[param[i].name] : {$lt : high}}
            ]});
        }

        res = await res.find().lean();
        return res;
    }

    // 获取某股日K
    async getKList(code) {
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
        if (old.length) {
            position = old[0];
        }
 
        if (position.count + count < 0) {
            return false;
        }

        if (count > 0) {
            position.count += count;
            position.cost += cost;
        } else {
            position.count += count;
            position.cost = position.cost * ((position.count + count) / position.count);
        }
        console.log(position.cost);
        position.save().then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
            return false;
        });

        let history = new this.history();
        history.code = code;
        history.userid = userid;
        history.count = count;
        history.type = count > 0 ? "in" : "out";
        history.cost = -cost;
        history.save().then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });

        return true;
    }

    // 创建用户自选
    async createOptional(userid) {
        let isExist = await this.optional.count({userid : userid});
        if (isExist === 0) {
            let newUser = new this.optional();
            newUser.userid = userid;
            newUser.save().then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    // 获取用户自选
    async getOptional(userid) {
        await this.createOptional(userid);

        let res = await this.optional.find({userid : userid});
        return res;
    }

    // 添加自选
    async addOptional(userid, code) {
        await this.createOptional(userid);

        let exist = await this.isOptional(userid, code);
        if (exist) {
            return false;
        }

        let res = await this.optional.updateOne(
            {userid : userid},
            {$push : {codeArray : code}}
        );
        console.log(res);
        return res;
    }

    // 删除自选
    async deleteOptional(userid, code) {
        await this.createOptional(userid);

        let res = await this.optional.updateOne(
            {userid : userid},
            {$pull : {codeArray : code}}
        );
        return res;
    }

    // 计算振幅
    calAmplitude(high, low) {
        if (!high || !low) {
            return null;
        }
        return (high - low) / low * 100;
    }

    // 获取股票名称
    async getStockName(code) {
        let res = await this.stock.find({code : code});
        return res[0].name;
    }

    // 获取股票总量
    async getStockCount() {
        let res = await this.stock.count();
        return res;
    }

    // 股票是否属于用户自选
    async isOptional(userid, code) {
        let res = await this.optional.find({userid : userid, codeArray : code});
        if (res.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // 获取持股数
    async getPositionCount(userid, code) {
        let isExist = await this.position.count({userid : userid, code : code});
        if (!isExist) {
            return 0;
        }

        let res = await this.position.find({userid : userid, code : code});
        return res[0].count;
    }

    // 获取持股成本
    async getPositionCost(userid, code) {
        let isExist = await this.position.count({userid : userid, code : code});
        if (!isExist) {
            return 0;
        }

        let res = await this.position.find({userid : userid, code : code});
        return res[0].cost;
    }


    // 初始化用户资金
    async createFund(userid) {
        let isExist = await this.fund.count({userid : userid});
        if (isExist === 0) {
            let newUser = new this.fund();
            newUser.userid = userid;
            newUser.fund = 1e6;
            newUser.save().then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    // 获取剩余资金
    async getFund(userid) {
        await this.createFund(userid);

        let res = await this.fund.find({userid : userid});
        console.log(res);
        return res[0].fund;
    }

    // 修改资金
    async modifyFund(userid, count) {
        await this.createFund(userid);

        let list = await this.fund.find({userid : userid});
        let fund = list[0];
        fund.fund += count;
        fund.save().then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
    }
};


let res = null;
function Singleton(){
    if (res === null) {
        res = new StockModel();
    }
    return res;
}

module.exports = {Singleton};
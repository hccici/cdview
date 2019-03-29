// 用mockjs模拟生成数据
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块
let dataDir = path.join(__dirname, '/data'); //文件路径，__dirname为当前运行js文件的目录
//这里要用同步读取文件的方法，不然还没读取到就已经被抛出去了，导致出错
let files = fs.readdirSync(dataDir, 'utf-8') //获得['city2.json',...]
let dataSet = {};//结果集
files.forEach(item => {
    let fileName = item.substring(0, item.indexOf('.')); //去掉.json
    let fileAddr = path.join(__dirname, '/data/' + item);//json地址
    let fileObject;
    if (fileName=='china_simplify'){
         fileObject = JSON.parse(fs.readFileSync(fileAddr, 'utf-8').substring(1));//这个china1.json有问题，第一个字符编辑器看不到但实际上是有的，所以要删掉
    } else {
         fileObject = JSON.parse(fs.readFileSync(fileAddr, 'utf-8'));//同步读取文件，读取时，下面的代码被阻塞，string-》obje
    }

    dataSet[fileName] = fileObject;
})

module.exports = () => {
    return dataSet;
};
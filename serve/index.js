/**
 * Created by GiantX on 2017/6/2.
 */
var app = require('express')() // 创建express服务
var bodyParser = require('body-parser'); // 请求主体解析模块
var fs = require('fs'); // 文件操作模块

app.use(require('cors')()) // 跨域模块
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const PORT = 8001;

// 产品
const product = [];


for (var i = 1; i < 20; i++) {

    product.push({
        id: i + 1,
        name: '产品' + i,
        classify: '服装' + i,
        storename: '东风超市' + i,
        price: 15.2 + i,
        pcs: 5 + i,
        volume: 25 + i,
        weight: 12 + i,
        unit: '个',
        number: 12 + i,
        pics: [{
            name: '外包装',
            size: '155k',
            suffix: 'jpg',
            url: 'assets/images/card/1.jpg'
        }, {
            name: '外包装',
            size: '155k',
            suffix: 'jpg',
            url: 'assets/images/card/1.jpg'
        }, {
            name: '外包装',
            size: '155k',
            suffix: 'jpg',
            url: 'assets/images/card/1.jpg'
        }]
    })
}



app.get('/api/bootstrapTable', function(req, res) {
    res.json({ data: product, page: '<select><option value="10">10 条/页</option><option value="20">20 条/页</option></select><span class="disabled">上一页</span> <span class="me">1</span> <span data-page="2">2</span> <span data-page="2">下一页</span> 第 <input type="text" class="page_input" name="custompage" size="3" data-pagenum="2"> 页 共 17 条' })
    console.log('获取bootstrap-table数据')

})


function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            break;
        }
    }
}

app.listen(PORT, function() {
    console.log('Api服务器开启,正在监听 http://localhost:' + PORT)
})

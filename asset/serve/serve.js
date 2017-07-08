const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const Users = require('./user.js');

let _Users = Users.Users;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
  res.send('模拟用服务器');
  console.log(now() + '"/" 收到请求.')
})

// 获取列表
app.get('/users', (req, res) => {
  let {page, pageSize, name} = req.query;
  pageSize = pageSize || 10;
  page = page || 1;
  let mockUsers = _Users.filter(user => !(name && user.name.indexOf(name) === -1));
  let total = mockUsers.length;
  mockUsers = mockUsers.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1));
  setTimeout(() => {
    res.json({
      code: 200,
      data: {
        total: total,
        users: mockUsers
      }
    });
  }, 1000);
  console.log(now() + '获取列表: ', req.query);
})

// 删除,批量删除
app.delete('/users/:id', (req, res) => {
  let {id} = req.params;
  ids = id.split(',').map(item => Number(item));
  _Users = _Users.filter(u => !ids.includes(u.id));
  setTimeout(() => res.json({code: 200, data: 'success'}), 1000);
  console.log(now() + '删除: ', req.params);
})

// 更新
app.put('/users/:id', (req, res) => {
  let {id} = req.params;
  id = Number(id)
  _Users.forEach((u, i) => {
    if (u.id === id) {
      Object.assign(_Users[i], req.body);
      return false;
    }
  });
  setTimeout(() => res.json({code: 200, data: 'success'}), 1000);
  console.log(now() + '更新: ', req.body);
})

// 新增
app.post('/users', (req, res) => {
  let data = req.body;
  data['id'] = ++_Users[_Users.length].id
  _Users.push(data);
  setTimeout(() => res.json({code: 200, data: 'success'}), 1000);
  console.log(now() + '新增: ', req.body);
})

app.listen(80, () => console.log(now() + '服务器启动于 http://localhost:80'))


function now() {
  return new Date().toLocaleString() + ' ';
}

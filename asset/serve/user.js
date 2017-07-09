const Mock = require('mockjs');
const Users = [];

for (let i = 0; i < 80; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.increment(),
        name: Mock.Random.cname(),
        addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        birth: Mock.Random.date(),
        gender: Mock.Random.character('男女')
    }));
}

exports.Users =  Users;

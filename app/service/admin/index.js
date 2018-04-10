'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
class IndexService extends Service {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async login(params) {
    let returnData = {};
    const data = await this.app.mysql.get('blog_user', {userName: params.userName});
    if (!data) {
      returnData = {
        tag: 'msgError',
        msg: '用户不存在'
      };
    } else {
      if (data.password !== crypto.createHash('md5').update(params.password).digest('hex').toLowerCase()) {
        returnData = {
          tag: 'msgError',
          msg: '密码错误'
        };
      } else {
        this.ctx.session.userId = data.id;
        const row = {
          id: data.id,
          lastLogin: new Date()
        };
        const updateResult =  await this.app.mysql.update('blog_user', row);
        console.log(updateResult)
        if (updateResult.affectedRows === 1) {
          returnData = {
            tag: 'msgData',
            msg: '登录成功',
            data: {
              roleId: data.roleId,
              id: data.id,
              name: data.name,
              userName: data.userName
            }
          };
        } else {
          returnData = {
            tag: 'msgError',
            msg: '未知错误'
          };
        }
      }
    }
    return returnData;
  }
}

module.exports = IndexService;

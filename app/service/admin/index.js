'use strict';

const Service = require('egg').Service;

class IndexService extends Service {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async login(params) {
    let returnData = {};
    const data = await this.app.mysql.get('blog_user', {userName: params.userName});
    if (data.length === 0) {
      returnData = {
        tag: 'msgError',
        msg: '用户不存在'
      };
    } else {
      if (data.password !== params.password) {
        returnData = {
          tag: 'msgError',
          msg: '密码错误'
        };
      } else {
        this.ctx.session.userId = params.id;
        const row = {
          id: params.id,
          last_login: new Date()
        };
        const updateResult =  await this.app.mysql.update('blog_user', row);
        if (updateResult.affectedRows === 1) {
          returnData = {
            tag: 'msgSuccess',
            msg: '登录成功'
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

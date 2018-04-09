'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async login() {
    const {ctx, service} = this;
    ctx.validate({
      userName: {type: 'string'},
      password: {type: 'string'}
    });
    ctx.body = await service.admin.index.login(ctx.request.body);
  }
}

module.exports = IndexController;

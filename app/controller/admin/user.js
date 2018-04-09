'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx, service } = this;
    let params = {};
    params.limit = ctx.request.query.limit ? ctx.request.query.limit : 10;
    params.page = ctx.request.query.page ? ctx.request.query.page : 0;
    params.username = ctx.request.query.username ? ctx.request.query.username : '';
    ctx.body = await service.admin.user.index(params);
  }
  async show() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.user.show(ctx.params);
  }
  async create() {
    const { ctx, service } = this;
    ctx.validate({
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      sex: {
        type: 'string'
      }
    }, ctx.request.body);
    delete ctx.request.body.id;
    ctx.body = await service.admin.user.create(ctx.request.body);
  }
  async destroy() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.user.destroy(ctx.params);
  }
  async update() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      },
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      sex: {
        type: 'string'
      }
    }, ctx.request.body);
    ctx.body = await service.admin.user.update(ctx.request.body);

  }
}

module.exports = UserController;

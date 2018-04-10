'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx, service } = this;
    let params = {};
    params.limit = ctx.request.query.limit ? ctx.request.query.limit : 10;
    params.page = ctx.request.query.page ? Number(ctx.request.query.page) -1 : 0;
    if (params.page < 0) {
      params.page = 0;
    }
    params.keyword = ctx.request.query.keyword ? ctx.request.query.keyword : '';
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
      userName: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      sex: {
        type: 'string'
      },
      roleId: {
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
        type: 'number'
      },
      userName: {
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

'use strict';

const Controller = require('egg').Controller;

class TagController extends Controller {
  async index() {
    const { ctx, service } = this;
    let params = {};
    params.limit = ctx.request.query.limit ? ctx.request.query.limit : 10;
    params.page = ctx.request.query.page ? (ctx.request.query.page-1) : 0;
    params.keyword = ctx.request.query.keyword ? ctx.request.query.keyword : '';
    ctx.body = await service.admin.tag.index(params);
  }
  async show() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.tag.show(ctx.params);
  }
  async create() {
    const { ctx, service } = this;
    ctx.validate({
      name: {
        type: 'string'
      }
    }, ctx.request.body);
    delete ctx.request.body.id;
    ctx.body = await service.admin.tag.create(ctx.request.body);
  }
  async destroy() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.tag.destroy(ctx.params);
  }
  async update() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'number'
      },
      name: {
        type: 'string'
      }
    }, ctx.request.body);
    ctx.body = await service.admin.tag.update(ctx.request.body);
  }
}

module.exports = TagController;

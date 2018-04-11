'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  async index() {
    const {ctx, service} = this;
    let params = {};
    params.limit = ctx.request.query.limit ? ctx.request.query.limit : 1000;
    params.page = ctx.request.query.page ? ctx.request.query.page : 0;
    params.name = ctx.request.query.name ? ctx.request.query.name : '';
    ctx.body = await service.admin.category.index(params);
  }
  async show() {
    const {ctx, service} = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.category.show(ctx.params);
  }
  async create() {
    const {ctx, service} = this;
    ctx.validate({
      name: {
        type: 'string'
      },
      index: {
        type: 'string'
      }
    }, ctx.request.body);
    delete ctx.request.body.id;
    ctx.body = await service.admin.category.create(ctx.request.body);
  }
  async destroy() {
    const {ctx, service} = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.category.destroy(ctx.params);
  }
  async update() {
    const {ctx, service} = this;
    ctx.validate({
      id: {
        type: 'number'
      },
      name: {
        type: 'string'
      },
      name: {
        type: 'string'
      }
    }, ctx.request.body);
    ctx.body = await service.admin.category.update(ctx.request.body);
  }
}

module.exports = CategoryController;

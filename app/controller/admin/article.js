'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async index() {
    const { ctx, service } = this;
    let params = {};
    params.limit = ctx.request.query.limit ? ctx.request.query.limit : 10;
    params.page = ctx.request.query.page ? ctx.request.query.page : 0;
    params.keyword = ctx.request.query.keyword ? ctx.request.query.keyword : '';
    ctx.body = await service.admin.article.index(params);
  }
  async show() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.article.show(ctx.params);
  }
  async create() {
    const { ctx, service } = this;
    ctx.validate({
      title: {
        type: 'string'
      },
      categoryId: {
        type: 'number'
      }
    }, ctx.request.body);
    delete ctx.request.body.id;
    ctx.body = await service.admin.article.create(ctx.request.body);
  }
  async destroy() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.admin.article.destroy(ctx.params);
  }
  async update() {
    const { ctx, service } = this;
    ctx.validate({
      id: {
        type: 'number'
      },
      title: {
        type: 'string'
      },
      categoryId: {
        type: 'number'
      }
    }, ctx.request.body);
    ctx.body = await service.admin.article.update(ctx.request.body);
  }
}

module.exports = ArticleController;

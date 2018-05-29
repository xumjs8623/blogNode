'use strict';
const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async index() {
    let params = {};
    params.limit = 10;
    params.page = 0;
    this.ctx.body = await this.service.home.article.index(params);
  }
  async show() {
    const {ctx, service} = this;
    ctx.validate({
      id: {
        type: 'string'
      }
    }, ctx.params);
    ctx.body = await service.home.article.show(ctx.params);
  }
}
module.exports = ArticleController;

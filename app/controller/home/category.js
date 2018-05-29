'use strict';
const Controller = require('egg').Controller;

class CategoryController extends Controller {
  async index() {
    let params = {};
    params.limit = 10;
    params.page = 0;
    this.ctx.body = await this.service.home.category.index(params);
  }
}
module.exports = CategoryController;

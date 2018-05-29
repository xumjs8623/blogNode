'use strict';
const Controller = require('egg').Controller;

class TagController extends Controller {
  async index() {
    let params = {};
    params.limit = 10;
    params.page = 0;
    this.ctx.body = this.service.home.tag.index(params);
  }
}
module.exports = TagController;

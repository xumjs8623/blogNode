'use strict';
const Service = require('egg').Service;

class TagService extends Service {
  async index() {
    let sqlStr = `SELECT * FROM blog_tag LIMIT ?, ? ORDER BY id DESC`;
    const result = await this.app.mysql.query(sqlStr, [Number(params.limit) * Number(params.page), Number(params.limit)]);
    return {
      tag: 'dataSuccess',
      data: result
    }
  }
}

module.exports = TagService;

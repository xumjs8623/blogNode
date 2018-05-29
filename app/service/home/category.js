'use strict';
const Service = require('egg').Service;

class CatergoryService extends Service {
  async index(params) {
    let sqlStr = `SELECT * FROM blog_category ORDER BY id DESC LIMIT ?,?`;
    const result = await this.app.mysql.query(sqlStr, [Number(params.limit) * Number(params.page), Number(params.limit)]);
    return {
      tag: 'dataSuccess',
      data: result
    }
  }
}

module.exports = CatergoryService;

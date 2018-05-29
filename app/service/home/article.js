'use strict';
const Service = require('egg').Service;

class ArticleService extends Service {
  async index(params) {
    let sqlStr = `SELECT * FROM blog_article ORDER BY id DESC LIMIT ?, ?`;
    const result = await this.app.mysql.query(sqlStr, [Number(params.limit) * Number(params.page), Number(params.limit)]);
    return {
      tag: 'dataSuccess',
      data: result
    };
  }
  show (params) {
    let sqlStr = `SELECT * FROM blog_article WHERE id = ?`;
    const result = this.app.mysql.query(sqlStr, [params.id]);
    return {
      tag: 'dataSuccess',
      data: result
    };
  }
}

module.exports = ArticleService;

'use strict';
const Service = require('egg').Service;

class ArticleService extends Service {
  async index(params) {
    let sqlStr = `SELECT t1.*, t2.name AS categoryName FROM blog_article t1 LEFT JOIN blog_category t2 ON t1.categoryId = t2.id ORDER BY id DESC LIMIT ?, ?`;
    const result = await this.app.mysql.query(sqlStr, [Number(params.limit) * Number(params.page), Number(params.limit)]);
    return {
      tag: 'dataSuccess',
      data: result
    };
  }
  async show (params) {
    let sqlStr = `SELECT t1.*, t2.name AS categoryName, group_concat(t4.name) AS tagIds, group_concat(t4.id) AS tagNames FROM blog_article t1 ` +
    `LEFT JOIN blog_category t2 ON t1.categoryId = t2.id ` +
    `LEFT JOIN blog_tag_article t3 ON t1.id = t3.articleId ` +
    `LEFT JOIN blog_tag t4 ON t3.tagId = t4.id ` +
    `WHERE t1.id = ? `+
    `group by t1.id `;
    const result = await this.app.mysql.query(sqlStr, [params.id]);
    let data = {};
    if (result.length === 1) {
      data = result[0];
    }
    return {
      tag: 'dataSuccess',
      data: data
    };
  }
}

module.exports = ArticleService;

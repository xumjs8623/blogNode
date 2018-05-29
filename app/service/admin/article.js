'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {
  /* 根据关键词，搜索文章
    @parmas {string} limit 显示条数
    @params {string} page 页码
    @params {string} name 分类名称
  */
  async index(params) {
    let sqlStr = `SELECT t1.*, group_concat(t3.name) AS tagNames, group_concat(t3.id) AS tagIds ` +
    `FROM blog_article t1 ` +
    `LEFT JOIN blog_tag_article t2 ON t1.id = t2.articleId `+
    `LEFT JOIN blog_tag t3 ON t2.tagId = t3.id `+
    `WHERE t1.title like ? group by t1.id LIMIT ?, ?; `;
    let sqlCount = `SELECT COUNT(t1.id) AS num FROM blog_article t1 WHERE t1.title like ? group by t1.id`;
    const result = await this.app.mysql.query(sqlStr, [`%${params.keyword}%`, Number(params.limit) * Number(params.page), Number(params.limit)])
    const count = await this.app.mysql.query(sqlCount, [`%${params.keyword}%`]);
    return {
      tag: 'dataSuccess',
      data: result,
      total: count[0].num
    };
  }
  /* 根据id，进行单条搜索
    @params {string} id 分类id
  */
  async show(params) {
    let sqlStr = `SELECT t1.*, group_concat(t3.name) AS tagNames, group_concat(t3.id) AS tagIds FROM blog_article t1 ` +
      `LEFT JOIN blog_tag_article t2 ON t1.id = t2.articleId `+
      `LEFT JOIN blog_tag t3 ON t2.tagId = t3.id `+
      `WHERE t1.id = ? group by t1.id`;
    const result = await this.app.mysql.query(sqlStr, [params.id]);
    let categoryArr = [];
    const categoryResult = await this.app.mysql.query(`SELECT * FROM blog_category`);
    let findCategoryId = (id) => {
      for (let x in categoryResult) {
        if(String(categoryResult[x].id) === String(id)) {
          categoryArr.unshift(categoryResult[x].id);
          findCategoryId(categoryResult[x].pid);
        }
      }
    }
    // 执行递归函数
    findCategoryId(result[0].categoryId);
    result[0]['categoryArr'] = categoryArr;
    return {
      tag: 'dataSuccess',
      data: result[0]
    };
  }
  async create(params) {
    // 新增文章
    let insertData = {};
    insertData.categoryId = params.categoryId;
    insertData.desc = params.desc;
    insertData.content = params.content;
    insertData.title = params.title;
    insertData.createTime = new Date();
    const result = await this.app.mysql.insert('blog_article', insertData);
    // 新增标签和文章的关联关系

    // const tagResult = await this.app.mysql.insert('blog_tag_article', [])
    if (result.affectedRows === 1) {
      let tagArticle = [];
      for (let i = 0, len = params.tags.length; i < len; i++) {
        tagArticle.push({tagId: params.tags[i], articleId: result.insertId});
      }
      let tagArticleResult = await this.app.mysql.insert('blog_tag_article', tagArticle);
      return {
        tag: 'msgSuccess',
        msg: '新增成功'
      }
    } else {
      return {
        tag: 'msgError',
        msg: '新增失败'
      }
    }
  }
  async destroy(params) {
    const result = await this.app.mysql.delete('blog_article', {
      id: params.id.split(',')
    });
    if (result.affectedRows !== 0) {
      return {
        tag: 'msgSuccess',
        msg: '删除成功'
      };
    } else {
      return {
        tag: 'msgError',
        msg: '删除失败'
      }
    }
  }
  async update(params) {
    const result = await this.app.mysql.update('blog_article', params);
    if (result.affectedRows === 1) {
      return {
        tag: 'msgSuccess',
        msg: '更新成功'
      };
    } else {
      return {
        tag: 'msgError',
        msg: '更新失败'
      }
    }
  }
}

module.exports = ArticleService;

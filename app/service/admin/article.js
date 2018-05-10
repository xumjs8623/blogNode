'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {
  /* 根据关键词，搜索文章
    @parmas {string} limit 显示条数
    @params {string} page 页码
    @params {string} name 分类名称
  */
  async index(params) {
    let sqlStr = `SELECT t1.*, t3.name AS tagName, t3.id AS tagId ` +
    `FROM blog_article t1 ` +
    `LEFT JOIN blog_tag_article t2 ON t1.id = t2.articleId `+
    `LEFT JOIN blog_tag t3 ON t2.tagId = t3.id `+
    `WHERE t1.title like ? LIMIT ?, ?`;
    const result = await this.app.mysql.query(sqlStr, [`%${params.keyword}%`, Number(params.limit) * Number(params.page), Number(params.limit)]);
    const count = await this.app.mysql.query(`SELECT COUNT(id) AS num FROM blog_article WHERE 'title' like '%${params.keyword}%'`);
    for (let i = result.length - 1; i >= 0; i--) {
      // 首先判断本身有没有tag数据
      // 如果有的话，那么先把tag数据放入自己的tags数组中
      if (result[i].tagId) {
        // 有tag数据，并且本身自己就有tags数组了，那么将自己的本身的推入原有tags数组
        if (result[i].hasOwnProperty('tags')) {
          result[i].tags.unshift({tagName: result[i].tagName, tagId: result[i].tagId});
        } else {
          // 有tag数据，但是本身没有tags数组，那么将本身作为第一个元素放入tags数组
          result[i].tags = [{tagName: result[i].tagName, tagId: result[i].tagId}];
        }
      } else {
        // 该处不会出现当前元素没有tagID，但是当前元素前后出现通一个文章下有tagID的情况，所以可以直接设置为空
        // 如果没有，那么设置tags数组为空数组
        result[i].tags = [];
      }
      // 判断与前一个元素id是否一致，一致的话，说明有多个tags
      // 如果一致，把当前的tags数组到前一个元素里面
      if (i > 0 && result[i].id === result[i-1].id) {
        result[i-1].tags = result[i].tags;
        console.log(result[i-1]);
        result.splice(i, 1);
      } else {
        delete result[i].tagId;
        delete result[i].tagName;
      }
    }
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
    let sqlStr = `SELECT t1.*, t3.name AS tagName, t3.id AS tagId FROM blog_article t1 ` +
      `LEFT JOIN blog_tag_article t2 ON t1.id = t2.articleId `+
      `LEFT JOIN blog_tag t3 ON t2.tagId = t3.id `+
      `WHERE t1.id = ?`;
    const result = await this.app.mysql.query(sqlStr, [params.id]);
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].tagId) {
        if (result[i].hasOwnProperty('tags')) {
          result[i].tags.unshift({tagName: result[i].tagName, tagId: result[i].tagId})
        } else {
          result[i].tags = [{tagName: result[i].tagName, tagId: result[i].tagId}];
        }
      } else {
        result[i].tags = [];
      }
      if (i > 0) {
        result[i-1].tags = result[i].tags;
        result.splice(i, 1);
      } else {
        delete result[i].tagId;
        delete result[i].tagName;
      }
    }
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
    console.log(result)
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
      where: { id: params.id.split(',') }
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

'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  /* 根据关键词，搜索分类 
    @parmas {string} limit 显示条数
    @params {string} page 页码
    @params {string} name 分类名称
  */
  async index(params) {
    const result = await this.app.mysql.query(`SELECT * FROM blog_category WHERE 'name' like '%${params.name}%' LIMIT ${Number(params.limit) * Number(params.page)}, ${Number(params.limit)}`);
    const count = await this.app.mysql.query(`SELECT COUNT(id) AS num FROM blog_category WHERE 'name' like '%${params.name}%'`);
    return {
      tag: 'dataSuccess',
      data: result,
      total: count[0].num
    }
  }
  /* 根据id，进行单条搜索 
    @params {string} id 分类id
  */
  async show(params) {
    const result = await this.app.mysql.query('SELECT * FROM blog_category WHERE id = ?', [params.id]);
    return {
      tag: 'dataSuccess',
      data: result[0]
    };
  }
  async create(params) {
    // 检测重复
    const repeatResult = await this.app.mysql.find('blog_category', {
      where: {name: params.name}
    });
    if (repeatResult) {
      return {
        tag: 'msgError',
        msg: '分类名称已经存在'
      }
    }
    // 新增分类
    const result = await this.app.mysql.insert('blog_category', params);
    if (result.affectedRows === 1) {
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
    const articleCount = await this.app.mysql.find('blog_article', {
      where: {category_id: params.id.split(',')}
    });
    if (articleCount) {
      return {
        tag: 'msgError',
        msg: '该分类下存在文章，无法删除'
      };
    }
    const result = await this.app.mysql.delete('blog_category', {
      where: {id: params.id.split(',')}
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
    const result = await this.app.mysql.update('blog_category', params);
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

module.exports = CategoryService;

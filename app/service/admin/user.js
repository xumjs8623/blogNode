'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
class UserService extends Service {
  /* 根据关键词，搜索用户
    @parmas {string} limit 显示条数
    @params {string} page 页码
    @params {string} name 分类名称
  */
  async index(params) {
    const result = await this.app.mysql.query(`SELECT * FROM blog_user WHERE (userName like '%${params.keyword}%' OR name like '%${params.keyword}%' OR mobile like '%${params.keyword}%') AND deleteTag is null LIMIT ${Number(params.limit) * Number(params.page)}, ${Number(params.limit)}`);
    const count = await this.app.mysql.query(`SELECT COUNT(id) AS num FROM blog_user WHERE (userName like '%${params.keyword}%' OR name like '%${params.keyword}%' OR mobile like '%${params.keyword}%') AND deleteTag is null`);
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
    const result = await this.app.mysql.query('SELECT * FROM blog_user WHERE id = ?', [params.id]);
    return {
      tag: 'dataSuccess',
      data: result[0]
    };
  }
  async create(params) {
    // 检测重复
    // const repeatResult = await this.app.mysql.find('blog_user', {
    //   where: { username: params.name }
    // });
    // if (repeatResult) {
    //   return {
    //     tag: 'msgError',
    //     msg: '分类名称已经存在'
    //   }
    // }
    // 新增用户
    params.password = crypto.createHash('md5').update(params.password).digest('hex').toLowerCase();
    const result = await this.app.mysql.insert('blog_user', params);
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
    let upateData = {
      id: params.id,
      deleteTag: 1,
      deleteTime: new Date()
    }
    const result = await this.app.mysql.update('blog_user', upateData);
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
    // 如果密码小于32位，说明前端修改过密码，不然就是加密后的密码 无需猜测加密
    if (params.password.length < 32) {
      params.password = crypto.createHash('md5').update(params.password).digest('hex').toLowerCase();
    }
    const result = await this.app.mysql.update('blog_user', params);
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

module.exports = UserService;

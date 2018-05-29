'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  /** --------------------前台------------------------ */
  // 获取文章列表
  router.get('/home/article', controller.home.article.index);
  // 获取文章详情
  router.get('/home/article/:id', controller.home.article.show);
  // 获取分类
  router.get('/home/category', controller.home.category.index);
  // 获取标签
  router.get('/home/tag', controller.home.tag.index);
  /** --------------------后台------------------------ */
  // 后台用户登录
  router.post('/login', controller.admin.index.login);
  // 分类管理
  router.resources('category', '/admin/category', controller.admin.category);
  // 标签管理
  router.resources('tag', '/admin/tag', controller.admin.tag);
  // 用户管理
  router.resources('user', '/admin/user', controller.admin.user);
  // 文章管理
  router.resources('article', '/admin/article', controller.admin.article);
};

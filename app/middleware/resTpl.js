'use strict';
// 对于返回的数据进行状态码添加
module.exports = () => {
  return async (ctx, next) => {
    await next();
    if (ctx.body && ctx.body.tag) {
      switch (ctx.body.tag) {
        case 'msgError':
          ctx.body.code = 0;
          break;
        case 'msgSuccess':
          ctx.body.code = 1;
          break;
        case 'dataSuccess':
          ctx.body.code = 1;
          break;
        case 'dataError':
          ctx.body.code = 0;
          break;
        case 'logout':
          ctx.body.code = -1;
          break;
        default:
          ctx.body.code = 1;
      }
    }
  }
};

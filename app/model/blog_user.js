const { STRING, INTEGER, DATE } = app.Sequelize;

const User = app.model.define('blog_user', {
  login: STRING,
  name: STRING(30),
  password: STRING(32),
  age: INTEGER,
  last_sign_in_at: DATE,
  created_at: DATE,
  updated_at: DATE,
});

User.findByLogin = async function(login) {
  return await this.findOne({
    where: {
      login: login
    }
  });
}

User.prototype.logSignin = async function() {
  await this.update({ last_sign_in_at: new Date() });
}

return User;
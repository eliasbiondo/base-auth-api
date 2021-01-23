const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    User.init({
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      birthday: DataTypes.DATE,
      profile_img: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      permission_level: DataTypes.INTEGER
    }, {
      sequelize,
      freezeTableName: true,
      tableName: 'Users'
    })
  }
}

module.exports = User;
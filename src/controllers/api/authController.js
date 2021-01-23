const User = require("../../models/User");
const fieldsValidator = require("../../helpers/fieldsValidator");

module.exports = {
  async store(req, res) {
    const { valid_fields, invalid_fields } = await fieldsValidator(req.body, [
      "username",
      "email",
      "password",
      "full_name",
      `${req.body.birthday ? "birthday" : undefined}`,
      `${req.body.profile_img ? "profile_img" : undefined}`,
    ]);

    console.log(valid_fields)

    if (invalid_fields.length > 0) {
      return res.status(400).json({ code: 400, error: { invalid_fields } });
    }

    const { username, email, password, full_name, birthday, profile_img } = valid_fields;

    User.create(valid_fields)


  },
};

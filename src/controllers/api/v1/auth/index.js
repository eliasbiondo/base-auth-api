const fieldsValidator = require("../../../../helpers/fieldsValidator");

module.exports = {
  async store(req, res) {
    // Validanting inputs
    const fields = fieldsValidator(req.body, [
      "username",
      "email",
      "password",
      "full_name",
      `${req.body.birthday || req.body.birthday == '' ? "birthday" : undefined}`, // It'll only be validated if declared in the request body
      `${req.body.profile_img || req.body.profile_img == '' ? "profile_img" : undefined}`, // It'll only be validated if declared in the request body
    ]);

    console.log(fields.valid)

    // Returning an error response, detailing the reason for the refusal if there's one or more invalid fields
    if (Object.keys(fields.invalid).length > 0) {
      return res
        .status(400)
        .json({ status: 400, error: { invalid_fields: fields.invalid } });
    }

    
  },
};

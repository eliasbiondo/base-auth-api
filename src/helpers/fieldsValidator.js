const regexExpressions = require("./regexExpressions");

module.exports = async (fields = {}, toVerify = []) => {
  let response = {
    valid_fields: {},
    invalid_fields: [],
  };

  let { username, email, password, full_name, birthday, profile_img } = fields;

  if (toVerify.includes("username")) {
    if (username) {
      if (!regexExpressions.alphanumeric.test(username)) {
        response.invalid_fields.push({
          field: "username",
          reason: "invalid character",
          message: "Please note only alphanumeric characters are accepted.",
        });
      } else if (username.length < 6) {
        response.invalid_fields.push({
          field: "username",
          reason: "too short",
          message: "The 'username' field must be between 6 and 16 characters.",
        });
      } else if (username.length > 16) {
        response.invalid_fields.push({
          field: "username",
          reason: "too large",
          message: "The 'username' field must be between 6 and 16 characters.",
        });
      } else {
        username = username.toLowerCase();
        response.valid_fields.username = username;
      }
    } else {
      response.invalid_fields.push({ field: "username", reason: "no username provided" });
    }
  }

  if (toVerify.includes("email")) {
    if (email) {
      if (!regexExpressions.email.test(email)) {
        response.invalid_fields.push({
          field: "email",
          reason: "invalid email address",
          message:
            "Please use the following email format: example@example.com.",
        });
      } else {
        email = email.toLowerCase();
        response.valid_fields.email = email;
      }
    } else {
      response.invalid_fields.push({ field: "email", reason: "no email provided" });
    }
  }

  if (toVerify.includes("password")) {
      if (password) {
        if(!regexExpressions.password.test(password)) {
            response.invalid_fields.push({
                field: "password",
                reason: "invalid password",
                message: "The 'password' field must be between 8 and 10 characters and contains at least one lowercase character, one uppercase character, one special character (!,@,#,$,&,*) and one number."
            })
        } else {
            response.valid_fields.password = password;
        }
      } else {
        response.invalid_fields.push({ field: "password", reason: "no password provided" });
      }
  }

  if (toVerify.includes("full_name")) {
      if (full_name) {
        
        if (regexExpressions.name.test(full_name)) {

            const splittedFullName = full_name.toLowerCase().split(' ')

            if (splittedFullName.length < 2 || splittedFullName[1] == '') {
                response.invalid_fields.push({
                    field: "full_name",
                    reason: "only first name provided",
                    message: "The 'full_name' field must have at least two separate names."
                })
            } else {

                let formatedFullName = []

                splittedFullName.forEach((name) => {

                    if (!name) {
                        return
                    }

                    formatedFullName.push(name[0].toUpperCase() + name.slice(1)); 
                })

                full_name = formatedFullName.join(' ')

                response.valid_fields.full_name = full_name;
            }

        } else {
            
            response.invalid_fields.push({
                field: "full_name",
                reason: "invalid character",
                message: "The 'full_name' field only supports letters and space characters."
            })

        }
        
      } else {
        response.invalid_fields.push({ field: "full_name", reason: "no full_name provided" });
      }
  }

  if (toVerify.includes("birthday")) {
    if(!Number.isInteger(birthday)) {
        response.invalid_fields.push({ field: "birthdat", reason: "invalid format", message: "The 'birthday' field must contain a timestamp (integer number)" });
    } else {
        response.valid_fields.birthday = birthday;
    }
  }

  if (toVerify.includes("profile_img")) {
    if(!regexExpressions.url.test(profile_img)) {
        response.invalid_fields.push({ field: "profile_img", reason: "invalid format", message: "The 'profile_img' field must contain a URL" });
    } else {
        response.valid_fields.profile_img = profile_img;
    }
  }

  return response;
};

const regexExpressions = require("./regexExpressions");

module.exports = (fields = {}, required = []) => {
    
    let object = {
        valid_fields: {

        },
        invalid_fields: {

        }
    }

    let {username, email, password, full_name, birthday, profile_img} = fields;

    if ( required.includes("username") ) {


        if (!username) {
            object.invalid_fields.username = {
                reason: "null value",
                message:"The 'username' field cannot be empty."
            };
        } else if ( username.length < 8 ) {
            object.invalid_fields.username = {
                reason: "too short",
                message:"The 'username' field must be between 8 and 12 characters."
            };
        } else if ( username.length > 12 ) {
            object.invalid_fields.username = {
                reason: "too large",
                message:"The 'username' field must be between 8 and 12 characters."
            };
        } else if (!regexExpressions.isAlphanumeric.test(username)) {
            object.invalid_fields.username = {
                reason: "invalid character",
                message:"The 'username' field only accepts alphanumeric characters (a-Z,0-9)."
            };
        } else {
            username = username.toLowerCase();
            object.valid_fields.username = username;
        }


    }

    if ( required.includes("email") ) {


        if (!email) {
            object.invalid_fields.email = {
                reason: "null value",
                message:"The 'email' field cannot be empty."
            };
        } else if (!regexExpressions.isEmail.test(email)) {
            object.invalid_fields.email = {
                reason: "invalid format",
                message:"The 'email' field must have the following format: example@example.com"
            };
        } else {
            email = email.toLowerCase();
            object.valid_fields.email = email;
        }
        
        
    }

    if ( required.includes("password") ) {


        if (!password) {
            object.invalid_fields.password = {
                reason: "null value",
                message:"The 'password' field cannot be empty."
            };
        } else if ( password.length < 8 ) {
            object.invalid_fields.password = {
                reason: "too short",
                message:"The 'password' field must be between 8 and 16 characters."
            };
        } else if ( password.length > 16 ) {
            object.invalid_fields.password = {
                reason: "too large",
                message:"The 'password' field must be between 8 and 16 characters."
            };
        } else if ( password.includes(' ') ) {
            object.invalid_fields.password = {
                reason: "invalid character",
                message:"The 'password' field only accepts lowercase characters, uppercase characters, numbers and special chars (!, @, #, $, %, ^, &, *)."
            };
        } else if ( !regexExpressions.isValidPassword.test(password) ) {
            object.invalid_fields.password = {
                reason: "invalid password",
                message:"The 'password' field must be at least one lowercase character, one uppercase character, one number and one special char (!, @, #, $, %, ^, &, *)."
            };
        } else {
            object.valid_fields.password = password;
        }


    }

    if (required.includes("full_name")) {


        const splittedFullName = full_name.toLowerCase().split(' ')

        if (!full_name) {
            object.invalid_fields.full_name = {
                reason: "null value",
                message:"The 'full_name' field cannot be empty."
            };
        } else if (!regexExpressions.isAlphabetic.test(full_name)) {
            object.invalid_fields.full_name = {
                reason: "invalid character",
                message:"The 'full_name' field only supports alphabetic characters (letters and spaces)."
            };
        } else if (splittedFullName.length < 2 || splittedFullName[1] == '') {
            object.invalid_fields.full_name = {
                reason: "no last name provided",
                message:"The 'full_name' field must have at least two separated names. Eg: Luke Skywalker"
            };
        } else {

            let formattedFullName = []

            splittedFullName.forEach((name) => {
                if (!name) {
                    return
                }
                formattedFullName.push(name[0].toUpperCase() + name.slice(1)); 
            })

            full_name = formattedFullName.join(' ')
            object.valid_fields.full_name = full_name;

        }


    }

    if ( required.includes("birthday") ) {

        if (!birthday) {
            object.invalid_fields.birthday = {
                reason: "null value",
                message:"The 'birthday' field cannot be empty."
            };
        } else if(!Number.isInteger(birthday)) {
            object.invalid_fields.birthday = {
                reason: "invalid format",
                message:"The 'birthday' field must contain a timestamp (interger number)."
            };
        } else {
            object.valid_fields.birthday = birthday;
        }
    }

    if ( required.includes("profile_img") ) {

        if (!profile_img) {
            object.invalid_fields.profile_img = {
                reason: "null value",
                message:"The 'profile_img' field cannot be empty."
            };
        } else if(!regexExpressions.isURL.test(profile_img)) {
            object.invalid_fields.profile_img = {
                reason: "invalid format",
                message:"The 'profile_img' field must have to be a URL. Eg: http://example.com/image.jpg"
            };
        } else {
            object.valid_fields.profile_img = profile_img;
        }
    }

    return object;
}
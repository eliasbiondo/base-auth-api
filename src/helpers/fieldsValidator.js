const regexExpressions = require("./regexExpressions");

module.exports = (fields = {}, required = []) => {
    
    let object = {
        valid: {

        },
        invalid: {

        }
    }

    let {username, email, password, full_name, birthday, profile_img} = fields;

    if ( required.includes("username") ) {


        if (!username) {
            object.invalid.username = {
                reason: "null value",
                message:"The 'username' field cannot be empty."
            };
        } else if ( username.length < 8 ) {
            object.invalid.username = {
                reason: "too short",
                message:"The 'username' field must be between 8 and 12 characters."
            };
        } else if ( username.length > 12 ) {
            object.invalid.username = {
                reason: "too large",
                message:"The 'username' field must be between 8 and 12 characters."
            };
        } else if (!regexExpressions.isAlphanumeric.test(username)) {
            object.invalid.username = {
                reason: "invalid character",
                message:"The 'username' field only accepts alphanumeric characters (a-Z,0-9)."
            };
        } else {
            username = username.toLowerCase();
            object.valid.username = username;
        }


    }

    if ( required.includes("email") ) {


        if (!email) {
            object.invalid.email = {
                reason: "null value",
                message:"The 'email' field cannot be empty."
            };
        } else if (!regexExpressions.isEmail.test(email)) {
            object.invalid.email = {
                reason: "invalid format",
                message:"The 'email' field must have the following format: example@example.com"
            };
        } else {
            email = email.toLowerCase();
            object.valid.email = email;
        }
        
        
    }

    if ( required.includes("password") ) {


        if (!password) {
            object.invalid.password = {
                reason: "null value",
                message:"The 'password' field cannot be empty."
            };
        } else if ( password.length < 8 ) {
            object.invalid.password = {
                reason: "too short",
                message:"The 'password' field must be between 8 and 16 characters."
            };
        } else if ( password.length > 16 ) {
            object.invalid.password = {
                reason: "too large",
                message:"The 'password' field must be between 8 and 16 characters."
            };
        } else if ( password.includes(' ') ) {
            object.invalid.password = {
                reason: "invalid character",
                message:"The 'password' field only accepts lowercase characters, uppercase characters, numbers and special chars (!, @, #, $, %, ^, &, *)."
            };
        } else if ( !regexExpressions.isValidPassword.test(password) ) {
            object.invalid.password = {
                reason: "invalid password",
                message:"The 'password' field must be at least one lowercase character, one uppercase character, one number and one special char (!, @, #, $, %, ^, &, *)."
            };
        } else {
            object.valid.password = password;
        }


    }

    if (required.includes("full_name")) {


        const splittedFullName = full_name.toLowerCase().split(' ')

        if (!full_name) {
            object.invalid.full_name = {
                reason: "null value",
                message:"The 'full_name' field cannot be empty."
            };
        } else if (!regexExpressions.isAlphabetic.test(full_name)) {
            object.invalid.full_name = {
                reason: "invalid character",
                message:"The 'full_name' field only supports alphabetic characters (letters and spaces)."
            };
        } else if (splittedFullName.length < 2 || splittedFullName[1] == '') {
            object.invalid.full_name = {
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
            object.valid.full_name = full_name;

        }


    }

    if ( required.includes("birthday") ) {

        if (!birthday) {
            object.invalid.birthday = {
                reason: "null value",
                message:"The 'birthday' field cannot be empty."
            };
        } else if(!Number.isInteger(birthday)) {
            object.invalid.birthday = {
                reason: "invalid format",
                message:"The 'birthday' field must contain a timestamp (interger number)."
            };
        } else {
            object.valid.birthday = birthday;
        }
    }

    if ( required.includes("profile_img") ) {

        if (!profile_img) {
            object.invalid.profile_img = {
                reason: "null value",
                message:"The 'profile_img' field cannot be empty."
            };
        } else if(!regexExpressions.isURL.test(profile_img)) {
            object.invalid.profile_img = {
                reason: "invalid format",
                message:"The 'profile_img' field must have to be a URL. Eg: http://example.com/image.jpg"
            };
        } else {
            object.valid.profile_img = profile_img;
        }
    }

    return object;
}
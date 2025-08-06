const Joi = require('joi')

const userSignUp = Joi.object({
    name: Joi.string().min(4).max(60).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: Joi.string()
        .pattern(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$#!?&.]{8,40}/,
            'Password pattern'
        )
        .required(),
    role: Joi.string().valid('user', 'author', 'contributor').required(),
});

const loginUser = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: Joi.string()
        .pattern(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,40}/,
            'Password pattern'
        )
        .required(),
});

exports.validateUserSignup = async (data) => {
    try {
        const value = await userSignUp.validateAsync(data);
        return { value };
    } catch (err) {
        return { err };
    }
};

exports.validateUserLogin = async (data) => {
    try {
        const value = await loginUser.validateAsync(data);
        return { value };
    } catch (err) {
        return { err };
    }
};
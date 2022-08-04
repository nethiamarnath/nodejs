var Joi = require('joi');

function validateUser(user) {
    const JoiSchema = Joi.object({

        f_name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        l_name: Joi.string()
            .min(3)
            .max(10)
            .required(),
        email: Joi.string()
            .email()
            .min(5)
            .max(50)
            .required(),

        dept_name: Joi.string()
            .min(3)
            .max(10)
            .optional(),
        emp_id: Joi.number()
            .min(1)
            .max(20)
            .optional(),
        dept_id: Joi.number()
            .min(1)
            .max(5)
            .optional(),
        title: Joi.string()
            .min(3)
            .max(10)
            .optional(),
        salary: Joi.number()
            .min(5)
            .max(100000)
            .optional(),
        password: Joi.string()
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/) //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
            .required()
    }).options({ abortEarly: false });

    return JoiSchema.validate(user)
}

function login_validation(user) {
    const JoiLogin = Joi.object({
        email: Joi.string()
            .email()
            .min(5)
            .max(50)
            .required(),
        password: Joi.string()
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/) //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
            .required()
    }).options({ abortEarly: false })
    return JoiLogin.validateAsync(user)
}
module.exports = { validateUser, login_validation }
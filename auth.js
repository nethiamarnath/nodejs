var bcrypt = require('bcryptjs');
const { json } = require('express');
const config = require('../knexfile').development
const knex = require('knex')(config)
const validate = require('../controllers/validation')
const jwt = require('jsonwebtoken');
const { DESTRUCTION } = require('dns');
const token = require('crypto').randomBytes(64).toString('hex')
const dotenv = require('dotenv').config()
const employeeData = require('../repo/Dataemployee')



//generating salt for hashing the value
const salt = bcrypt.genSaltSync(10)

//generating Hashed password
async function Hash(password, salted) {
    const result = await bcrypt.hash(password, salted)
    return result
}
//generating access_token
async function generate_Token(email) {
    const accesstoken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
    return accesstoken
}
async function generate_Rtoken(email) {
    const rtoken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' })
    return rtoken
}
exports.add_Password = async function(st) {
    const result = validate.login_validation(st)
    if (!result)
        res.status(404).send("type check email or password");
    else {
        const hashed = await Hash(st.password, salt)
        if (hashed.error)
            console.log(error)
        else {
            knex.transaction(async(trx) => {
                const [employees] = await Promise.all([
                    trx('employees').where('email', '=', st.email).update({ password: hashed, salt_key: salt })
                ])
            })
        }
    }
}
exports.login = async function(st, res) {
    const hashedpassword = await Hash(st.password, st.salt)
    if (hashedpassword == st.hashedpassword) {
        const token = await generate_Token(st.email)
        const r_token = await generate_Rtoken(st.email)
        knex.transaction(async(trx) => {
            const [acces_token] = await Promise.all([
                trx('access_token').insert({ access_token: token, email: st.email, refresh_token: r_token })
            ])
        })
        return { token, r_token }

    } else {
        res.status(400).send("entered wrong password or email")
    }
}
exports.verify_Token = async function(st) {
    const decode = jwt.verify(st.token, process.env.ACCESS_TOKEN_SECRET);
    return decode
}
exports.check_Rtoken = async function(st, res) {
    try {
        const decode = jwt.verify(st.rtoken, process.env.REFRESH_TOKEN_SECRET);
        if (decode.email) {
            const aToken = await generate_Token(decode.email)
            await knex('access_token').where('refresh_token', '=', st.rtoken).update({ 'access_token': aToken })
            return aToken
        }
    } catch (Error) {
        if (Error.name === 'JsonWebTokenError') {
            res.status(401).send({ error: 'invalid token' });
        } else if (Error.name === "TokenExpiredError") {
            await employeeData.deleteRefreshToken(st)
            res.status(401).send("TokenExpired")
        } else {
            console.log("error")
        }
    }
}
var employeeData = require('../repo/Dataemployee')
var page = require('../repo/page')
var token = require('../repo/jwt')
const { json } = require('express')
const verify = require('./auth')
const config = require('../knexfile').development
const knex = require('knex')(config)



exports.getemployeeData = async function(req, res) {
    //let body = req.body
    const resultdata = await employeeData.getdeatilsEmployee()
    console.log(resultdata);
    //res.status(200).send(resultdata)
}
exports.postemployeeData = async function(req, res) {
    let body = req.body
    const resultdata = await employeeData.postdetailsEmployee(body)
    res.send(resultdata)

}
exports.postfulldetails = async function(req, res) {
    let body = req.body
    const st = {
        f_name: body.f_name,
        l_name: body.l_name,
        email: body.email,
        dept_name: body.dept_name,
        emp_id: body.emp_id,
        dept_id: body.dept_id,
        title: body.title,
        salary: body.salary,
        password: body.password
    }
    await employeeData.postFullDetails(st)
    res.status(200).send("data successfull inserted")
        // res.send("data inserted")
}
exports.updatetitles = async function(req, res) {
    await employeeData.updateTitles()
    res.status(200).send("Data Updated")
        //res.send(resultdata)
}
exports.deleteuser = async function(req, res) {
    await employeeData.deleteUser()
    res.status(200).send("Data Deleted")
}
exports.getfulldetails = async function(req, res) {
    const resultdata = await employeeData.getfullDetails()
    res.status(200).send(resultdata)
}
exports.getonetime = async function(req, res) {
    let body = req.body
    const resultdata = await page.getOneline(body)
    res.send(resultdata)
}
exports.gettoken = async function(req, res) {
    let body = req.body
    const resultdata = await token.getToken(body)
    res.send(resultdata)
}
exports.updatepassword = async function(req, res) {
    let body = req.body
    st = {
        email: body.email,
        password: body.password,
        updatepassword: body.updatepassword
    }
    const oldpass = verify.authen(st.password)
    const newpass = verify.authen(st.updatepassword)
        //verify.authen(st.password)
    st.password = oldpass
    st.updatePassword = newpass
    const resultdata = await employeeData.updatePassword(st)
    res.send(resultdata)
}
exports.getauthdata = async function(req, res) {
    let body = req.body
    st = {
        email: body.email,
        password: body.password
    }
    var user = await employeeData.getuserdata(st)
    st.hashedpassword = user.password
    st.salt = user.salt_key
    const resultdata = await verify.login(st, res)
    res.status(200).send(resultdata)
}
exports.getencrypt = async function(req, res) {
    let body = req.body
    st = {
        email: body.email,
        password: body.password
    }
    const hasheddata = await verify.add_Password(st)
}
exports.Token_verify = async function(req, res) {
    let body = req.body
    st = {
        token: body.token
    }
    try {
        const token_gen = await verify.verify_Token(st)
        if (token_gen) {
            const email = await employeeData.getreqdata(st)
            st.email = token_gen.email
            const resultdata = await employeeData.getuserdata(st)
            res.status(200).send(resultdata)
        } else {
            res.send("user does not exist in db")
        }
    } catch (Error) {
        if (Error.name === 'JsonWebTokenError') {
            res.status(401).send({ error: 'invalid token' });
        } else if (Error.name === "TokenExpiredError") {
            res.status(406).send("TokenExpired")
        } else {
            console.log("error")
        }
    }
}
exports.Rtoken_verify = async function(req, res) {
    let body = req.body
    st = {
        rtoken: body.rtoken
    }
    const resultdata = await verify.check_Rtoken(st, res)
    res.send(resultdata)
}
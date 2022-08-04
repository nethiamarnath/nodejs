var express = require('express')
const config = require('../knexfile').development
const knex = require('knex')(config)
var promise = require('promise');
const { response } = require('express');
const validate = require('../controllers/validation')
    //var encrypt = require('bcrypt')
const verify = require('../controllers/auth')




//get method for employee details

exports.getdeatilsEmployee = async function() {
    return new promise(async function(resolve, reject) {
        return await knex.select('*').from('employees')
            .then((rows) => { resolve(rows) })
            .catch((error) => { reject(error) })
    })
}

//post method to insert data of each and every employees

exports.postFullDetails = function(st) {
    // validating the input given by the user
    const result = validate.validateUser(st)
        //console.log(result);
    if (result.error)
        console.log(result);
    else {
        knex.transaction(async(trx) => {
            //encrypting password field
            const hashedPassword = verify.authen(st.password)
                //the array consist of tables in db 
            const [employees, departments, dept_emp, titles, salaries] = await Promise.all([
                trx('employees').insert({ f_name: st.f_name, l_name: st.l_name, email: st.email, password: hashedPassword }),
                trx('departments').insert({ dept_name: st.dept_name }),
                trx('dept_emp').insert({ emp_id: st.emp_id, dept_id: st.dept_id }),
                trx('titles').insert({ emp_id: st.emp_id, title: st.title }),
                trx('salaries').insert({ emp_id: st.emp_id, salary: st.salary })
            ])
        })
    }
}

//to update data in the employees
exports.updateTitles = function() {
        //return new Promise(function(resolve, reject) { //im not returning any data into post man 
        knex.transaction(async(trx) => {
            await trx('dept_emp').where('id', '=', '5').update({ 'emp_id': 5 })
            trx.commit()
        })
    }
    //to delete the user with user id=*
exports.deleteUser = function() {
    knex.transaction(async(trx) => {
        await trx('employees').where('id', '=', '6').del()
        trx.commit()
    })
}
exports.getuserdata = async function(st) {
    return new promise(async function(resolve, reject) {
        await knex.select('*').from('employees').where('email', '=', st.email).first()
            .then((rows) => { resolve(rows) })
            .catch((error) => { reject(error) })
    })
}
exports.getreqdata = async function(st) {
    return new promise(async function(resolve, reject) {
        await knex.select('email').from('access_token').where('access_token', '=', st.token).first()
            .then((rows) => { resolve(rows) })
            .catch((error) => { reject(error) })
    })
}
exports.deleteRefreshToken = async function(st) {
    return new promise(async function(resolve, reject) {
        await knex('access_token').where('refresh_token', '=', st.rtoken).del()
            .then((rows) => { resolve(rows) })
            .catch((error) => { reject(error) })
    })
}













//get the entire employee details present in database regarding the employee
exports.getfullDetails = async function() {
        return new promise(async function(resolve, reject) {
            return await knex.select('e.id', 'de.emp_id', 'de.dept_id', 'd.dept_name', 't.title', 'e.f_name', 'e.l_name', 's.salary')
                .from('employees AS e')
                .join('departments AS d', function() {
                    this
                        .on('e.id', '=', 'd.id')
                })
                .join('dept_emp AS de', function() {
                    this
                        .on('e.id', '=', 'de.id')
                })
                .join('titles AS t', function() {
                    this
                        .on('e.id', '=', 't.id')
                })
                .join('salaries AS s', function() {
                    this
                        .on('e.id', '=', 's.id')
                })

            .then((rows) => { resolve(rows) })
                .catch((error) => { reject(error) })
        })

    }
    //to update the password of user using the email 
exports.updatePassword = function(st) {

        knex.transaction(async(trx) => {
            const crt = await trx('employees').where('email', '=', st.email, 'password', '=', st.password)
                // if (crt)
                //     await trx('employees').where('email', '=', st.email).update({ 'password': st.updatepassword })
                // else
                //     return console.log("error");
        })

    }
    //method to verify the entered email and password is crt 
exports.getAuthdata = function(st) {
    return new promise(async function(resolve, reject) {
        return await knex.select('*').from('employees').where({ password: st.password, email: st.email }) //, ('password', '=', hashedPassword)
            .then((rows) => { resolve(rows) })
            .catch((error) => { reject(error) })
    })
}



//knex.select('*').from('employees').where('email', '=', st.email).andwhere('password', '=', hashedPassword)



// exports.postdetailsEmployee = async function(body) {
//     await knex.transaction(async(trx) => {
//             const [employees, departments, ] = await Promise.all([
//                     trx('employees').insert({ f_name: 'James', l_name: 'matrix', email: 'james@gamil.com' }),
//                     trx('movies').insert({ name: 'Matrix' }),
//                 ])
//                 // await trx('users_movies').insert({ userId: user.id, movieId: movie.id })
//         })
//         // const st = {
//         //     f_name: body.f_name,
//         //     l_name: body.l_name,
//         //     email: body.email
//         // }
//         // return new promise(async function(resolve, reject) {
//         //     knex.transaction(async(trx) => {
//         //         await trx.insert(st).into('employees')
//         //         return await trx.select('*').from('employees')
//         //             .then((rows) => { resolve(rows) })
//         //             .catch((error) => { reject(error) })
//         //     })
//         // })
// }
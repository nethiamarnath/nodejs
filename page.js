var express = require('express')
const config = require('../knexfile').development
const knex = require('knex')(config)
var promise = require('promise');
const paginate = require('express-paginate')
exports.getOneline = async function(body) {
    //const resultpage=5
    var per_page = body.per_page || 5
    var page = body.page || 1
    if (page < 1) page = 1;
    var offset = (page - 1) * per_page
    return Promise.all([
            await knex('employees')
            .clone()
            .count('* as count')
            .first(),
            await knex('employees')
            .offset(offset)
            .limit(per_page)
        ]).then(([total, rows]) => {
            const { count } = total;
            paginate.total = parseInt(count, 10)
            paginate.per_page = per_page
            paginate.offset = offset
            paginate.to = offset + rows.length
            paginate.last_page = Math.ceil(count / per_page)
            paginate.currentpage = page
            paginate.from = offset
            paginate.data = rows
            return paginate.data
        })
        .catch((error) => { reject(error) })


}
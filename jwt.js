var express = require('express')
const config = require('../knexfile').development
const knex = require('knex')(config)
var promise = require('promise');
const jwt = require('jsonwebtoken')
const token = require('crypto').randomBytes(64).toString('hex')
const dotenv = require('dotenv').config()


exports.getToken = async function(body) {
    const username = body.username
    const user = { name: username }
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    return accesstoken
}
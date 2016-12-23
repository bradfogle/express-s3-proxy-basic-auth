'use strict'
const express = require('express')
const s3Proxy = require('s3-proxy')
const basicAuth = require('basic-auth')
const app = express();

var username = process.env.USERNAME
var password = process.env.PASSWORD
var s3_access_key = process.env.S3_ACCESS_KEY
var s3_secret_key = process.env.S3_SECRET_KEY
var s3_bucket = process.env.S3_BUCKET


app.set('port', (process.env.PORT || 5000));

var auth = function (req, res, next) {

    console.log('Authenticating!')

    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
        return res.sendStatus(401)
    }

    var user = basicAuth(req)

    if (!user || !user.name || !user.pass) {
        return unauthorized(res)
    }

    if (user.name === username && user.pass === password) {
        return next()
    } else {
        return unauthorized(res)
    }
}

app.get('/*', auth, s3Proxy({
    bucket: 's3_bucket',
    accessKeyId: s3_access_key,
    secretAccessKey: s3_secret_key,
    overrideCacheControl: 'max-age=100000'
}))

app.listen(app.get('port'), function () {
    console.log('App listening on port', app.get('port'))
})



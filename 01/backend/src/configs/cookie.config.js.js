const config = require('./env')

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    path: '/refresh-token'
}

const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

module.exports = { REFRESH_COOKIE_OPTIONS, REFRESH_COOKIE_MAX_AGE }
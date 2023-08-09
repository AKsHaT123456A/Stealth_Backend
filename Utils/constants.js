const constants = { PORT: 3000 ,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    TOKEN_EXPIRATION:'15m',
    APP_ID:process.env.APP_ID,
    APP_SECRET:process.env.APP_SECRET,
    PASSWORD:process.env.password,
}

module.exports = constants;
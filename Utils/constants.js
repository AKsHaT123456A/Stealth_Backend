require("dotenv").config();

const constants = { PORT: 3000 ,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    TOKEN_EXPIRATION:'15m',
    APP_ID:process.env.APP_ID,
    APP_SECRET:process.env.APP_SECRET,
    PASSWORD:process.env.password,
    TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN,
    TWILIO_ACCOUNT_SID:process.env.TWILIO_ACCOUNT_SID,
    TWILIO_PHONE_NUMBER:process.env.TWILIO_PHONE_NUMBER,
    BLOCK_DURATION:process.env.BLOCK_DURATION,
    MAX_FAILED_ATTEMPTS :process.env.MAX_FAILED_ATTEMPTS,
    MONGODB:process.env.MONGDB,
    DB_MAX_POOL_SIZE:10,
    TWILIO_API_SECRET:process.env.TWILIO_API_SECRET,
    TWILIO_API_KEY:process.env.TWILIO_API_KEY,
    pass:process.env.pass,
    TEST_EMAIL:process.env.TEST_EMAIL
}

module.exports = constants;
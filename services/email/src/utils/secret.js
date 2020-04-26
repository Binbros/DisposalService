const { config } = require ('dotenv')

config()

module.exports = {frontUrl : process.env.FRONT_URL}
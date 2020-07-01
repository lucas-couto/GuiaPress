const Sequelize = require('sequelize')
const {db} = require('../.env')

const connection = new Sequelize(db.database, db.username, db.password, db.config)

module.exports = connection
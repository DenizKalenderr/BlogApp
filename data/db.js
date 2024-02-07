//const { Client } = require('pg');
const config = require("../config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    dialect: 'postgres',
    host: config.db.host,
    define: {
        timestamps: false
    }
});

async function connect(){
try{
    await sequelize.authenticate();
    console.log("baglandi");
}
catch(err){
    console.log("baglanti hatasi",err);
}
}

connect();
module.exports = sequelize;


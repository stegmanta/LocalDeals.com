const sql = require('mssql');
//pull in config from other file as needed
const dotenv = require('dotenv');
dotenv.config();
const config = require('config')
// const config = require('C:\\Users\\tae\\Desktop\\SQL server config for now\\config.js');
// async function
async function executeQuery(aQuery) {
    const connection = await sql.connect(config.get('config.DB'));
    let result = await connection.query(aQuery);
    return result.recordset;
} 

module.exports = {executeQuery:executeQuery};
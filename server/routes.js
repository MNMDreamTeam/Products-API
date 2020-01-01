require('dotenv').config();

const pg = require('pg');
const pgClient = new pg.Client({
    user: 'neilcrothers',
    host: 'localhost',
    database: 'sdc_products',
    port: 5432
})
pgClient.connect();

const getListOfProducts = (req, callback) => {
    const page = parseInt(req.query.page) || '1';
    const count = parseInt(req.query.count) || '5';
    let start = 1;
    let end = 5;
    
    start = ((Number(page) - 1) * Number(count)) + 1;
    end = (start + Number(count)) - 1;

    pgClient.query(`SELECT * FROM product_info WHERE product_id BETWEEN ${start} AND ${end}`)
        .then(result => {
            callback(result.rows);
        }).catch((err) => {
            if (err){
                console.log(err);
            }
        });
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.product_id);

    pgClient.query(`SELECT * FROM product_info WHERE product_id = ${id}` )
        .then(result => {
            res.send(result.rows);
        }).catch((err, result) => {
            if (err){
                console.log(err);
            }
        });
}

module.exports = {
    getListOfProducts,
    getUserById
}
require('dotenv').config();

const pg = require('pg');
const pgClient = new pg.Client({
    user: 'neilcrothers',
    host: 'localhost',
    database: 'sdc_products',
    port: 5432
})
pgClient.connect();

const getUserById = (req, res) => {
    const id = parseInt(req.params.product_id);

    pgClient.query(`SELECT * FROM product_info WHERE product_id = ${id}` )
        .then(res => {
            console.log(res.rows);
        }).catch((err, result) => {
            if (err){
                console.log(err);
            }
            console.log('success');
        });
}

module.exports = {
    getUserById
}
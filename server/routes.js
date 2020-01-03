require('dotenv').config({path: '/Users/neilcrothers/ghrbld06/nkcsdc/.env'});

const pg = require('pg');
const pgClient = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
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


    const query1 = pgClient.query(`SELECT * FROM product_info WHERE product_id = ${id};`)
        .then(result => {
            return (result.rows);
        }).catch((err, result) => {
            if (err){
                console.log(err);
            }
        });

    const query2 = pgClient.query(`SELECT feature, value FROM features WHERE product_id = ${id};`)
        .then(result => {
            return (result.rows);
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        })

    Promise.all([query1, query2])
        .then((promises) => {
            // console.log('---', promises[0], '***', promises[1])
            promises[0][0].features = promises[1];
            res.send(promises[0][0])
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
}

module.exports = {
    getListOfProducts,
    getUserById
}
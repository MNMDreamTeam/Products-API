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

const getProductById = (req, res) => {
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
            promises[0][0].features = promises[1];
            res.send(promises[0][0]);
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
}

const getStylesById = async (req, res) => {
    const id = parseInt(req.params.product_id);
    var styleId = [];

    const queryStyles = await pgClient.query(`SELECT * FROM styles WHERE product_id = ${id};`)
        .then(result => {
            for (let i = 0; i < result.rows.length; i++){
                styleId.push(result.rows[i].style_id);
            }
            console.log(styleId);
            return (result.rows, styleId);
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        })

    var queries = [];
    // var counter = 0;
    for (let i = 0; i < styleId.length; i++){
        queries.push(pgClient.query(`SELECT photos.thumbnail_url, photos.url FROM photos WHERE style_id = ${styleId[i]}`))
        //console.log(styleId[i]);
            // .then(result => {
            //     console.log('counter', counter, 'i', i);
            //     counter ++;
            //     // return queries;
            // }).catch((err) => {
            //     if (err) {
            //         console.log(err);
            //     }
            // })
    }
    

    var photosQuery = [];

    Promise.all(queries)
        .then((promises) => {
            //console.log('queries', queries);
            // console.log('promises', promises);
            for (let i = 0; i < promises.length; i++){
                console.log(promises[i].rows);
                photosQuery.push(promises[i].rows);
            }
            console.log('photosQuery', photosQuery);
            return photosQuery;
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        })
}

const getRelatedById = (req, res) => {
    const id = parseInt(req.params.product_id);

    pgClient.query(`SELECT related_product_id FROM related WHERE product_id = ${id};`)
        .then(result => {
            var relatedArr = [];
            for (let i = 0; i < result.rows.length; i++){
                relatedArr.push(result.rows[i].related_product_id);
            }
            res.send(relatedArr);
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        })
}

module.exports = {
    getListOfProducts,
    getProductById,
    getStylesById,
    getRelatedById
}
require('dotenv').config({path: '/Users/neilcrothers/ghrbld06/nkcsdc/.env'});

const pg = require('pg');
const pgClient = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});
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
        });

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
            stylesObj = result.rows;
            return (stylesObj, styleId);
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        });

    var queries = [];
    var skusArr = [];
    for (let i = 0; i < styleId.length; i++){
        queries.push(pgClient.query(`SELECT photos.thumbnail_url, photos.url FROM photos WHERE style_id = ${styleId[i]}`));
        skusArr.push(pgClient.query(`SELECT skus.size, skus.quantity FROM skus WHERE style_id = ${styleId[i]}`));
    }
    

    var photosQuery = [];
    var skusQuery = {};
    await Promise.all(queries)
        .then((promises) => {
            for (let i = 0; i < promises.length; i++){
                if (promises[i].rows.length > 0){
                    photosQuery.push(promises[i].rows);
                }
            }
            return Promise.all(skusArr)
        }).then((skusPromise) => {
            for (let j = 0; j < skusPromise.length; j++){
                for (let k = 0; k < skusPromise[j].rows.length; k++){
                    skusQuery[skusPromise[j].rows[k].size] = skusPromise[j].rows[k].quantity;
                }
            }
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        });

    var allPromises = {};
    var resultArr = [];
    Promise.all(stylesObj)
        .then((finalResult) => {
            allPromises.product_id = finalResult[0].product_id;
            for(let i in finalResult) {
                delete finalResult[i].product_id;
                finalResult[i].photos = photosQuery[i] || [];
                finalResult[i].skus = skusQuery;
                resultArr.push(finalResult[i]);
            }
            allPromises.results = resultArr;
            res.send(allPromises);
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        });
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
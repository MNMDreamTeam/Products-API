const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./routes')
const port = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, Postgres API' })
})

app.get('/products/list', (req, res) => {
    db.getListOfProducts(req, (result) => {
        res.send(result);
    });
})

app.get('/products/:product_id', db.getProductById);

app.get('/products/:product_id/styles', db.getStylesById);

app.get('/products/:product_id/related', db.getRelatedById);

app.listen(port, () => {
    console.log(`api on http://localhost:${port}`);
})
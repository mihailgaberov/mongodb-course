var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

app.get('/', function (req, res, next) {
    res.render('movies', { 'movies': ['m1', 'm2', 'm3', 'm4'] });
});

MongoClient.connect('mongodb://localhost:27017/movies-collection', function (err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function (req, res, next) {
        res.render('movies', {});
    });

    app.post('/add-movie', function (req, res, next) {
        var title = req.body.title;
        var year = req.body.year;
        var imdb = req.body.imdb;

        if ((title == '') || (year == '') || (imdb == '')) {
            next('Please fill all fields.');
        } else {miha
            db.collection('movies').insertOne(
                { 'title': title, 'year': year, 'imdb': imdb },
                function (err, r) {
                    assert.equal(null, err);
                    res.send("Document inserted with _id: " + r.insertedId);
                }
            );
        }
    });

    app.use(errorHandler);

    var server = app.listen(3000, function () {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});

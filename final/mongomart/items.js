/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";
        var db = this.db;
        var categories = [];
        
        var cursor = db.collection('item').aggregate([
            { $match: { category: { $exists: true } } },
            { $project: {
                category: 1
            } },
            { $group: {
                _id: "$category",
                num: {
                    $sum: 1
                }
            } },
            { $sort: { _id: 1 } }
        ] );

        cursor.forEach(
            function(doc) {
              categories.push(doc);
            },
            function(err) {
                var total = categories.reduce((accumulator, currentValue) => 
                    accumulator + currentValue.num, 0);
                var category = {
                    _id: "All",
                    num: total
                };
                categories.unshift(category);
                callback(categories);
                assert.equal(err, null);
            }
        );
    }

    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";
        var db = this.db;
        var pageItems = [];
        category = category === "All" ? { $exists: true } : category;

        var cursor = db.collection('item').aggregate([
            { $match: { category } },
            { $sort: { _id: 1 } },
            { $skip: page * itemsPerPage },
            { $limit: itemsPerPage }
        ] );

        cursor.forEach(
            function(doc) {
              pageItems.push(doc);
            },
            function(err) {
                callback(pageItems);
                assert.equal(err, null);
            }
        );
    }

    this.getNumItems = function(category, callback) {
        "use strict";
        var db = this.db;
        var searchToken = category === "All" ? {} : { category };
        var numItems = db.collection('item').find(searchToken).count();

        numItems.then((numItems) => {
            callback(numItems);
        });
    }

    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";
        var db = this.db;

        var itemsFound = [];
        var cursor = db.collection('item').aggregate([
          { $match: { $text: { $search: query } } },
          { $sort: { _id: 1 } },
          { $skip: page * itemsPerPage },
          { $limit: itemsPerPage }
        ] );

      cursor.forEach(
          function(doc) {
            itemsFound.push(doc);
          },
          function(err) {
              callback(itemsFound);
              assert.equal(err, null);
          }
      );
    }

    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var db = this.db;
        var numItemsPromise = db.collection('item').find({ $text: { $search: query } }).count()

        numItemsPromise.then((numItems) => {
          callback(numItems);
        });
    }

    this.getItem = function(itemId, callback) {
        "use strict";
        var db = this.db;

        var cursor = db.collection('item').find({ _id: itemId });
        
        cursor.forEach(
          function(doc) {
            callback(doc);
          },
          function(err) {
              assert.equal(err, null);
          }
      );
    }

    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        var doc = this.db.collection("item").update({ _id: itemId },
          { $addToSet: { 
              reviews: reviewDoc
            } 
          });
        doc.reviews = [reviewDoc];
        callback(doc);
    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;

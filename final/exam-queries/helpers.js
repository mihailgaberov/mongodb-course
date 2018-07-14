/*
* TODO-lab1A
*
* LAB #1A: Implement the getCategories() method.
*
* Write an aggregation query on the "item" collection to return the
* total number of items in each category. The documents in the array
* output by your aggregation should contain fields for "_id" and "num".
*
* HINT: Test your mongodb query in the shell first before implementing
* it in JavaScript.
*
* In addition to the categories created by your aggregation query,
* include a document for category "All" in the array of categories
* passed to the callback. The "All" category should contain the total
* number of items across all categories as its value for "num". The
* most efficient way to calculate this value is to iterate through
* the array of categories produced by your aggregation query, summing
* counts of items in each category.
*
* Ensure categories are organized in alphabetical order before passing
* to the callback.
*
*/

db.item.aggregate([
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
] ).pretty()


/*
* TODO-lab1B
*
* LAB #1B: Implement the getItems() method.
*
* Create a query on the "item" collection to select only the items
* that should be displayed for a particular page of a given category.
* The category is passed as a parameter to getItems().
*
* Use sort(), skip(), and limit() and the method parameters: page and
* itemsPerPage to identify the appropriate products to display on each
* page. Pass these items to the callback function.
*
* Sort items in ascending order based on the _id field. You must use
* this sort to answer the final project questions correctly.
*
* Note: Since "All" is not listed as the category for any items,
* you will need to query the "item" collection differently for "All"
* than you do for other categories.
*
*/

db.item.aggregate([
    { $match: { category: "*" } },
    { $limit: 5 },
    { $skip: 1 },
    { $sort: { _id: 1 } }
] ).pretty()
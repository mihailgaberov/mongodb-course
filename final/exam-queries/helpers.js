db.item.aggregate([
    { $match: { category: { $exists: true } } },
    { $project: {
        title: 1, category: 1
    } },
    { $group: {
        _id: { category: "$category" },
        count: {
            $sum: 1
        }
    } },
    { $sort: { _id: 1 } }
] ).pretty()
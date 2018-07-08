db.companies.aggregate([
    { $match: { funding_rounds: { $exists: true, $ne: [ ] } } },
    { $project: {
        funding_rounds: 1, founded_year: 1, name: 1,
        fundings: { $size: "$funding_rounds" }
    } },
    { $match: { fundings: { $gte: 5 } } },
    { $match: { founded_year: 2004 } },
    { $unwind: "$funding_rounds" },
    { $group: {
        _id: { company: "$name" },
        avg_raised: {
            $avg: "$funding_rounds.raised_amount"
        }
    } },
    { $sort: { avg_raised: 1 } }
] ).pretty()
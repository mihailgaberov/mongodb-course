db.companies.aggregate( [
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { relationships: 1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: {
        _id: {
            perm: "$relationships.person.permalink",
            "is_past": { $eq: [ "$relationships.is_past", false ] }
        },
        un: { $push:  { person: "$relationships.person.permalink" } },
    } },
    { $unwind: "$un" },
    { $group: {
        _id: {
            perm: "$un.person",
        },
        count: { $sum: 1 }
    } },
    { $sort: { count: -1 } }
] ).pretty()

db.companies.aggregate( [
    { $group: {
        _id: { person: "$relationships.person.permalink"},
        companies: { $push: "$name" }
    } },
    { $sort: { "_id.person": 1 } }
] ).pretty()


db.companies.aggregate( [
    { $group: {
        _id: { company: "$name"},
        persons: { $push: "$relationships.person.permalink" }
    } },
    { $sort: { "_id.company": 1 } }
] ).pretty()


db.companies.aggregate( [
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { relationships: 1, _id: 1 } },
    { $unwind: "$relationships" },
    { $group: {
        _id: "$name",
        rels: {
          $addToSet: "$relationships.person"
        }
    } },
    { $unwind: "$rels" },
    { $group: {
        _id: "$rels.person",
        count: { $sum: 1 }
    } },
    { $sort: { count: -1 } }
] ).pretty()
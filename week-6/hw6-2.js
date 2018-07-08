db.grades.aggregate([
    { $unwind: "$scores" },
    {$match: {"scores.type": { $ne: "quiz" }}},
    { $project: { scores: 1, _id: 0, class_id: 1 } },
    { $group: {
        _id: { 
            class_id: "$class_id" 
          },
           average_students_perf: { 
             $avg: "$scores.score" 
           }
    } },
    { $sort: { average_students_perf: -1 } }  
]).pretty()
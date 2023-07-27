const mongodb = require('mongodb');

const mongoClient= mongodb.MongoClient;

let db;

const mongoConnect = async(cb)=>
{
    try
    {
     const client = await mongoClient.connect('mongodb+srv://asif:Asif6070@atlascluster.iko5pu8.mongodb.net/chatapp?retryWrites=true&w=majority')
     console.log("CONNECTED");
     db=client.db();
     cb();     
    }
     catch(error)
     {
        console.log(error);
    }
}

const getDb = () =>
{
 if(db)
 {
    return db;
 }
 throw new Error("NO DATBASE FOUND");
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

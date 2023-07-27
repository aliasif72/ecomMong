const getDb = require('../util/database').getDb;
const mongodb=require('mongodb');
 
class Product{
    constructor(title, imageUrl, price, description, id)
    {
      this.title=title;
      this.price=price;
      this.imageUrl=imageUrl;
      this.description=description;
      this._id=id;
        }

      save()
      {
         const db = getDb();
         let dbOp;
         if(this._id)
         {
          dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this.id)},{$set : this})
         }
         else{
         dbOp = db.collection('products').insertOne(this);
         }
         return dbOp
         .then(result=>console.log(result)) 
         .catch(err=>console.log(err));
      
    }

      
    static fetchAll()
      {
        const db = getDb();
        return db.collection('products')
        .find().toArray()
        .then(result=>console.log(result)) 
        .catch(err=>console.log(err));
      }

      static findById(id)
      {
        const db = getDb();
        return db.collection('products')
        .findOne({ _id: new mongodb.ObjectId(id)}).next()
        .then(result=>console.log(result)) 
        .catch(err=>console.log(err));
      }
}
module.exports = Product;
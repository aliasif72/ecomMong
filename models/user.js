const mongodb=require('mongodb');
const getDb = require('../util/database').getDb;
 
class User{
    constructor(name,email, cart , id)
    {
      this.name=name;
      this.email=email;
      this.cart= cart; // {items : []}
      this._id=id;
        }

      save()
      {
         const db = getDb();
         return db.collection('users')
         .insertOne(this)
         .then(result=>console.log(result)) 
         .catch(err=>console.log(err));
      }
      
      addToCart(product)
      {
        // const cartProduct=this.cart.items.findIndex(ele=>
        //   {
        //     return ele._id == product._id;
        //   });
          const updatedCart= {items : [{ productId : new mongodb.ObjectId(product._id) , quantity:1 }] };
          return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            { $set: {cart : updatedCart}})
      }

        static findById(id)
      {
        const db = getDb();
        return db.collection('users')
        .findOne({ _id: new mongodb.ObjectId(id)})
         .then(result=>
          {console.log(result)
          return result }) 
        .catch(err=>console.log(err));
      }
}
module.exports = User;
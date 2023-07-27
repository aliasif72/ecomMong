const mongodb=require('mongodb');
const { getProducts } = require('../controllers/admin');
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
        const currProductIndex=this.cart.items.findIndex(ele=>
          {
            return ele.productId.toString() === product._id.toString();
          });
          let newQuantity = 1;
          const currCart = [...this.cart.items];
          if(currProductIndex >= 0)
          {
          newQuantity= this.cart.items[currProductIndex].quantity +1;
          currCart[currProductIndex].quantity = newQuantity;
          }
          else
          {
            currCart.push( { productId : new mongodb.ObjectId(product._id) , quantity: newQuantity} )
          }
          const updatedCart= currCart;
          return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            { $set: {cart : updatedCart}})
      }

       getCart()
       {
         const db = getDb();
         const productsIds= this.cart.items.map(ele=>
          {
            return ele.productId;
          })
         return db.collection('products')
         .find({_id : { $in : productsIds }}).toArray()
         .then(products=>
          {
            return products.map(ele=>
              {
                 return {...ele, quantity : 
                  this.cart.items.find(id=>
                    {
                      return id.productId.toString()===ele._id.toString();
                    }).quantity
              }
            })
          })
       } 


       deleteItemFromCart(productId)
       {
            const updatedCart= this.cart.items.filter(ele=>
              {
                return ele.productId.toString() !== productId.toString();
              })
              const db = getDb();
              return db.collection('users').updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                { $set: {cart : { items : updatedCart}}})
       }

      addOrder()
      {
        const db=getDb();
        return this.getCart().then(products=>{
          const order={
            items : products,
            user: {
              _id: new mongodb.ObjectId(this._id),
              name:this.name,
            }
          }
          return db.collection('orders').insertOne(order)
        })
        .then(result=>
          {
            this.cart = {items: [] };
            return db.collection('users').updateOne(
              {_id: new mongodb.ObjectId(this._id)},
              { $set: {cart : { items : [] } } } );
     })
      }
      
       getOrder()
       {
        const db = getDb();
         return db.collection('orders').find({'user._id' : new mongodb.ObjectId(this._id) }).toArray()
       }f


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
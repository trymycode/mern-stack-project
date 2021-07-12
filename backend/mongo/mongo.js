const MongoClient = require('mongodb').MongoClient;

const getProduct = async (req, res, next) =>{
const client = new MongoClient(url);
let products;
try{
    await client.connect();
    const db= client.db();
    products = await db.collection('products').find().toArray();
    

}catch(error){
    return res.json({message:"Count not retrive products"})
}
client.close();
res.json(products);
}
const createProduct = async (req, res, next) =>{
   const newProduct ={
       name: req.body.name,
       price: req.body.price
   } 
    const client = new MongoClient(url);
    try{
        await client.connect();
        const db = client.db();
        const result = db.collection('products').insertOne(newProduct);
        
    }catch(error){
        return res.json({message:"Could not store data"})
    }

    // close db connection
    client.close();

    // send result

    res.json(newProduct)

}

exports.createProduct = createProduct;
exports.getProduct = getProduct;
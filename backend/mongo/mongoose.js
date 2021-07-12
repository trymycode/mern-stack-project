const mongoose = require('mongoose');
const Product = require("../models/product");
// connect backend with data base
const url ="mongodb+srv://ImitaSingha:AF0opguAlOJd4EP5@cluster0.wkn3w.mongodb.net/products_test?retryWrites=true&w=majority";
mongoose.connect(url, { user: process.env.MONGO_USER, pass: process.env.MONGO_PASSWORD, useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log("connection failed!",err)
})
const createProduct = async (req, res, next)=>{
    const createdProduct = new Product({
        name: req.body.name,
        price:req.body.price
    });
    const result = await createdProduct.save();
   res.json(result);
}
const getProducts = async (req, res, next)=>{
    const products = await Product.find().exec();
    res.json(products);
}
exports.createProduct = createProduct;
exports.getProducts = getProducts;
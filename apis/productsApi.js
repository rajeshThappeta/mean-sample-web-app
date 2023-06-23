//create mini-express app
const exp=require('express');
const productApp=exp.Router()

//Product routes
productApp.get('/products',(req,res)=>{
    let productsCollection=req.app.get('productsCollection')
    res.send({message:"all products"})
})



//export
module.exports=productApp;
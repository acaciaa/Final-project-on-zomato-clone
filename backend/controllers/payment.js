//installed using npm and including the external modules
const Razorpay=require('razorpay');
//importing the crypto librabry
const crypto = require('crypto');
const shortid = require('shortid');
const Transactions= require('../models/transaction')

//id and secret from personal razorpay account
const instance=new Razorpay({
    key_id:"rzp_test_JYXEggK9Ae6IpQ",
    key_secret:"WG5daRG9of5qOMGQ38hSd4Np"
})

exports.saveTransaction=(req,res)=>{
    console.log("saving transaction!!")

    // Defining the algorithm
    const generated_signature=crypto.createHmac('sha256',instance.key_secret)
    generated_signature.update(req.body.razorpay_order_id+"|"+req.body.razorpay_payment_id)

    // Creating the digest in hex encoding
    if(req.body.razorpay_signature==generated_signature.digest('hex')){
        console.log("creating transaction object")
        //save transaction to collection
        //using a constructor function with  new keyword
       const transaction= new Transactions({
            transaction_id: req.body.razorpay_payment_id,
            transaction_amount: req.body.razorpay_amount
        });
        transaction.save(function(err, transaction) {
            if(err){
                console.log(error);
                return res.status(500).send("some problem occured",error)
            }
            console.log("transaction saved to db")
            res.send({transaction: transaction});
    })
  }
}

//using async/await with a request handler
exports.createOrder =async (req,res)=>{
    console.log("payment initiated")
    const options={
        amount:req.body.amount*100,
        currency: "INR", 
        receipt: shortid.generate(),
        notes: {  
            key1: "value3",  
            key2: "value2" 
       }
    }
    try{
        const response=await instance.orders.create(options)
        console.log(response)
        res.json(response)
    }catch(error){
        console.log(error)
    }
}
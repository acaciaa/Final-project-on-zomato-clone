//we import the module of mealtype
const MealTypes = require('../models/mealtype')
//file system,which is  very useful functionality to access and interact with the fs
const fs=require('fs')

exports.getAllMealTypes=(req,res)=>{
    MealTypes.find()
    .then(result=>{
        res.status(200).json({
            message:"restaurants fetched successfully",
            data:result
         })
        })
       .catch(
           error=>{
            res.status(500).json({
                message:"DB error",
                error:error
            })
           })
       
}
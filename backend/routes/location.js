//include express in our application which is  a framework
const express=require('express')
const locationController= require('../controllers/location')

//specify the path
const router=express.Router()
router.get('',locationController.getAllLocations)

module.exports=router;
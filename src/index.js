import dotenv from 'dotenv'
import express from 'express'
import connectdb from './db/index.js'
import {app} from './app.js'


dotenv.config({
  path : './.env'
})



connectdb()
.then(()=>{
  app.on("error" , (error)=>{
    console.log("Application not able to Connect to Database" ,error);
    throw error;
  })
})
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
  console.log(`Server is listening on Port ${process.env.PORT}`)
  console.log(`Server running on the port ${process.env.PORT}`)
})
})
.catch((error)=>{console.log("MONGO DB connection failed !! " , error)})



















//Since Database is in another continent therefor we are using async await and also try catch block
//IFFE 
/*
;(async()=>{
  try {
   await  mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   app.on("error",(error)=>{
    console.log("Application not able to connect to Database",error)
    throw error
   })
   app.listen(process.env.PORT , ()=>{
    console.log(`App is listening on Port ${process.env.PORT}`)
   })
  } catch (error) {
    console.log("ERROR" , error)
  }
})()
  */
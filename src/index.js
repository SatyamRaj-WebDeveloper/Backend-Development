import dotenv from 'dotenv'
import express from 'express'
import connectdb from './db/index.js'
const app = express()

dotenv.config({
  path : './env'
})



connectdb()



















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
import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret :process.env.CLOUDINARY_API_SECRET,
})


const uploadOnCloudinary = async(FilePath)=>{
    //uploading the file to the cloudinary cloud after the file is already saved on our server 
    //here --> FilePath = path of the file which is already on our server
   try{
   if(!FilePath) return null
  const response = await  cloudinary.uploader.upload(FilePath ,{
    resource_type : 'auto'
   })
   
   //file uploaded successfully 
  //  console.log("File Uploaded on Cloudinary" , response.url)
  fs.unlinkSync(FilePath)
  
   return response;

   }catch (error){
    if(fs.existsSync(FilePath))
     fs.unlinkSync(FilePath)
    console.log("File Could not be Uploaded" , error.message)
     return null //removes the file that is temporarily saved on our server if the file was not uploaded in the above if block
     
   }
}

export {uploadOnCloudinary}
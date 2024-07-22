import {asynchandler} from '../utils/asynchandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asynchandler(async (req,res)=>{
    //get user details
    //validation
    //check if user already exist : username ,email
    //check for images , basically avatar since required in Schema
    //upload the images in cloudinary
    //create user object - create entry in DB
    //remove password and refresh token fields
    //check for user creation on basis of response
    //return response

const {username,fullname,email,password } =req.body

if([fullname,username,email,password].some((item)=>{
    return item ?.trim()===''
})){
    throw new ApiError ( 400, "All fields are required")
}
const existeduser = await User.findOne({
    $or : [{email} , {username}]
})

if(existeduser){
    throw  new ApiError(409,"User already exist , please Check username or email")
}

const avatarlocalPath = req.files ?.avatar[0]?.path
// const coverimagelocalpath = req.files ?.coverimage[0]?.path
let coverimagelocalpath ;
if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
    coverimagelocalpath = req.files.coverimage[0].path
}
console.log(req.files)
console.log(avatarlocalPath)

if(!avatarlocalPath){
    throw new ApiError ( 400, "Avatar file is required")
}

const avatar =  await uploadOnCloudinary(avatarlocalPath)
const coverimage = await uploadOnCloudinary(coverimagelocalpath)

if(!avatar){
    throw new ApiError ( 400, "Avatar file is required")
}

const user = await User.create({
    fullname,
    avatar : avatar.url,
     coverimage : coverimage?.url || "",
     email,
     password,
     username : username
})
  
 const userCreated = await User.findById(user._id).select(
    "-password -refreshTokens"
 )
 if(!userCreated){
    throw new ApiError(500,"Something went wrong while regsistering the user")
 }

 return res.status(201).json(
    new ApiResponse(200, userCreated , "User registered Successfully")
 )


})

export {registerUser,}
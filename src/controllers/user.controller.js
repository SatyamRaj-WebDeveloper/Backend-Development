import {asynchandler} from '../utils/asynchandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshTokens = async(userId) =>{
    try {
       const user =  await User.findById(userId)
       if(user){
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
       await  user.save({validateBeforeSave : false})
       return {accessToken , refreshToken}
       }
    }catch (error) {
        throw new ApiError(500 ,"Something went wrong while generating access and refresh token")
    }
}

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

const loginUser = asynchandler(async (req,res)=>{
    //req body--> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookies

    const {email , username , password} = req.body
    
    if(!username && !email){
        throw new ApiError(400 , "Username or email is required")
    }
     
    const user = await User.findOne({
        $or : [{email} , {username}]
    })
  
    if(!user){
    throw new ApiError(404 , "User does not exist")
    }
  const validPassword = await  user.isPasswordCorrect(password)

  if(!validPassword){
    throw new ApiError(401 , "Invalid Credentials")
  }

   const {accessToken ,refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser =await User.findById(user._id).select("-password -refreshToken")
    
   const options = {
    httpOnly : true,
    secure : true
   }

   return res
   .status(200)
   .cookie("accessToken" , accessToken ,options)
   .cookie("refreshToken" , refreshToken , options)
   .json(
    new ApiResponse(
        200,
        {
            user : loggedInUser , accessToken,refreshToken
        },
        "User logged in Successfully"
    )
   )

})


const logoutUser = asynchandler(async (req,res)=>{

  await   User.findByIdAndUpdate(req.user._id , {
       $set: {refreshToken : undefined} 
    },
{
    new : true
}
)
const options ={
    httpOnly : true,
    secure :true,
}
res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200 , {},"User logged Out "))
})

const refreshAccessToken = asynchandler(async (req,res)=>{
  try {
     const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
     if(!incomingRefreshToken){
      throw new ApiError(401 , "Unauthorized Token")
     }
    const decodedToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
   const user = await User.findById(decodedToken?._id)
   if(!user){
      throw new ApiError(401 , "Invalid Refresh Token")
     }
     if(incomingRefreshToken !== user?.refreshToken){
       throw new ApiError(401 ,"Refresh Token is expired or used")
     }
 const {accessToken , newrefreshToken} =  await generateAccessAndRefreshTokens(user._id)
     const options = {
      httpOnly :true,
      secure : true
     }
      
    return res 
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(
      new ApiResponse(
             200,
      {accessToken, refreshToken:newrefreshToken},
      "Access Token Refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid Refresh  Token")
  }

})




export {registerUser,loginUser,logoutUser,refreshAccessToken}

import {asynchandler} from '../utils/asynchandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'



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

const changeCurrentPassword = asynchandler(async (req,res)=>{
    const {oldPassword , newPasword} = req.body

    const user = User.findById(req.user?._id)
     const correctPassword = await  user.isPasswordCorrect(oldPassword)
     if(!correctPassword){
        throw new ApiError(400 , "Invalid Previous Password")
     }
     user.password = newPasword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json (new ApiResponse(
        200,
        {},
        "Password Changed Successfully"
    ))

})

const getCurrentUser = asynchandler(async (req,res)=>{
    return res 
    .status(200)
    .json ( new ApiResponse(200 , req.user , "Current User Fetched Successfully"))
})

const updateAccount = asynchandler(async(req,res)=>{
    const {fullname , username , email} =req.body;
    if(!fullname || !email){
        throw new ApiError(400 , "All Fields are required")
    }
   const user = await  User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullname,
                username,
                email
            }
        },
        {new:true}
    ).select("-password")

    res.status(200)
    .json(new ApiResponse(
        200,
        user,
        "Account Details Updated"
    ))

})

const avatarUpdate = asynchandler(async (req,res)=>{
   const avatarLocalPath = req.file?.path
   if(!avatarLocalPath){
    throw new ApiError(400 ,"Avatar file is missing")
   }
   const avatar = uploadOnCloudinary(avatarLocalPath)
   if(!avatar.url){
throw new ApiError(400,"Error while uploading avatar")
   }
   
 const user =  await User.findByIdAndUpdate(req.user?._id,
    {
        $set :{
            avatar : avatar.url
        }
    },{new:true}
   )
   return res
   .status(200)
   .json(new ApiResponse(200
    ,user,"Avtar Image Updated Successfully"
   ))

})

const coverimageUpdate = asynchandler(async (req,res)=>{
   const coverimageLocalPath = req.file?.path
   if(!coverimageLocalPath){
    throw new ApiError(400 ,"coverimage file is missing")
   }
   const coverimage = uploadOnCloudinary(coverimageLocalPath)
   if(!coverimage.url){
throw new ApiError(400,"Error while uploading coverimage")
   }
   
  const user =  await User.findByIdAndUpdate(req.user?._id,
    {
        $set :{
            coverimage : coverimage.url
        }
    },{new:true}
   )

   return res
   .status(200)
   .json(new ApiResponse(200
    ,user,"Cover Image Updated Successfully"
   ))

})

const getUserChannelProfile = asynchandler(async (req,res)=>{
      const {username}= req.params;

      if (!(username?.trim())) {
        throw new ApiError(400 , "Username is missing")
      }
      const channel = await User.aggregate([
        {
            $match :{
                username
            }
        },{
           $lookup :{
            from : "subscriptions",
            localField : "_id",
            foreignField : "channnel",
            as : "subscribers"
           }
        },
        {
            $lookup :{
                from : "subscriptions",
            localField : "_id",
            foreignField : "Subscriber",
            as : "subscribed-To"
            }
        },
        {
            $addFields :{
                subscriberCount : {
                    $size : "$subscribers"
                },
                subscribedToCount : {
                    $size : "$subscribed-To"
                },
                isSubscribed :{
                    $cond :{
                        if : {$in : [req.user?._id , "$subscriber.Subscriber"]},
                        then : true ,
                        else : false
                    }
                }
            }
        },
        {
            $project :{
                fullname : 1 ,
                username : 1,
                subscriberCount : 1 ,
                subscribedToCount : 1,
                isSubscribed :1,
                avatar :1,
                coverimage:1,
                email:1,
                createdAt:1,
            }
        }
      ])
      console.log(channel)

      if(!(channel?.length)){
        throw new ApiError(404 , "channel does not exists")
      }
      return res
      .status(200)
      .json(new ApiResponse ( 
        200,
        channel[0],
        "User Channel fetched Successfully"
      ))
})

const getWatchHistory = asynchandler(async(req,res)=>{
  const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from : "videos",
                localField : "watcHistroy",
                foreignField:"_id",
                as : "watchHistroy",
                pipeline : [
                    {
                        $lookup :{
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline :[
                                {
                                    $project :{
                                        watchHistroy:1,
                                        owner : 1,
                                        username : 1,
                                        fullname : 1 ,
                                        avatar : 1,
                                        coverimage : 1,
                                        email : 1,
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $addFields : {
                            owner : {
                                $first : "$owner",
                            }
                        }
                    }
                ]
            }
        }
    ])
    console.log(user)
    if(!user){
        throw new ApiError(404 , "User was not found")
    }
    return res
    .status ( 200)
    .json (new ApiResponse (200 , user[0].watchHistroy , "Watch History fetched Successfully "))
})





export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccount,
    avatarUpdate,
    coverimageUpdate,
    getUserChannelProfile,
    getWatchHistory,
}

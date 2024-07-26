import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
   const pageNumber = parseInt(page , 10);
   const pagesize = parseInt(limit , 10);

   const filter ={};
   if(query){
    filter.title = {$regex : query , $options : 'i'}
   }
   if(userId){
    filter.owner = userId;
   }

   const sort = {};
   if(sortBy){
    sort[sortBy] = sortType === 'desc' ? -1 : -1;
   }

   const skip = (pageNumber - 1) * pagesize;

   const videos =await Video.find(filter)
   .sort(sort)
   .skip(skip)
   .limit(pagesize)

   const totalCount = await Video.countDocuments(filter) ; 

   return res
   .status(200)
   .json(new ApiResponse(200 , totalCount ,  pageNumber , 
    pagesize , videos,
    "Video found Successfully"
   ))
})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, Description} = req.body
    // TODO: get video, upload to cloudinary, create video
    try {
        if(!(title || Description)){
            throw new ApiError(400 , "Title and Description are required")
        }
       const videoFileLocalPath = req.file?.path 
       if(!videoFileLocalPath){
        throw new ApiError(404 , "Video File Path not found")
       }
       const video  = await  uploadOnCloudinary(videoFileLocalPath,"video")
       if(!video.url){
          throw new ApiError(400 , "Could not upload ")
       }
       const newVideo = new Video({
        title ,
        Description,
        videoUrl:video.url,
        publicId : video.public_id,
        duration : duration,
       })

       await video.save();
        
       return res
       .status(200)
       .json(new ApiResponse(200 , newVideo , "Video Uploaded Successfully"))

    } catch (error) {
        throw new ApiError(400 , "No Video to upload")
    }
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await  Video.findById(videoId)
    if(!video){
        throw new ApiError(404 , "Video File not found")
    }
    return res
    .status(200)
    .json(new ApiResponse( 200 , video , "Video Found Successfully "))
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description , thumbnail} = req.body
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findByIdAndUpdate(videoId , {
        $set : {
            title : title,
            Description : description,
            thumbnail : thumbnail,
        },
        // {
        //     new : true
        // }
    })
    if(!video){
        throw new ApiError(404 , "NO Video was Found to update")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , video , "Video uploaded Successfully"))


})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
   const deletedVideo = await Video.findByIdAndDelete(videoId)
   if(!deleteVideo){
    throw new ApiError(404 , "Video not deleted")
   }
   return res
   .status(200)
   .json(new ApiResponse(200 , deletedVideo , "Video deleted Successfully"))
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params
   const video =  await Video.findById(videoId)
   if(!video){
    throw new ApiError(404 , "Video not found ")
   }
   
   video.isPublished = !video.isPublished
   
   await video.save()

   return res
   .status(200)
   .json(new ApiResponse(200 , video , "Video publish status toggled successfully"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {Video} from '../models/video.model.js'

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId){
        throw new ApiError(404 ,"Invalid Video Id")
    }
    const skip = (page-1)*parseInt(limit,10);
   const comments = await Comment.find({ video : videoId})
   .skip(skip)
   .limit(parseInt(limit,10));


   return res
   .status(200)
   .json(new ApiResponse(200 , comments , "fetched Comments Successfully"))
        
})

const addComment = asynchandler(async (req, res) => {
    // TODO: add a comment to a video
    const  {videoId} =req.params
    const {content} = req.body
    
    if (!content) {
        throw new ApiError(401 , "Add a comment To Add")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404 , "Video Not Found")
    }
    const userId = req.user._id;
    const comment = new Comment({
        content,
        video : videoId,
        owner : userId,
    })
    
    await comment.save();
   
    return res
    .status(200)
    .json(new ApiResponse(200 , comment , "Comment added Successfully"))
})

const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;
    const {newComment} = req.body;
    const userId = req.user._id;

    if(!commentId){
        throw new ApiError(404 , "Comment not found to Update")
    }
    const comment  = await Comment.findByIdAndUpdate(
        {_id:commentId, owner :userId},
        {$set : {content : newComment}},
        {new :true}
    )
    if(!comment){
        throw new ApiError(400 , "New Comment is necessary to Update previous one")
    }
   
    return res
    .status(200)
    .json(new ApiResponse(200 , comment , "Comment Updated Successfully"))
})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const user = req.user._id;
    const {CommentToDelete,videoId} =req.params;

    if(!(user&&videoId)){
        throw new ApiError(404 , "Invalid User or video not found")
    }
    const comment = await Comment.findByIdAndDelete(
        {_id : CommentToDelete , owner : user , video : videoId }  
    )
    if(!comment){
        throw new ApiError(404 , "Comment to delete was not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , comment , "Comment Deleted Successfull"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }

import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const toggleVideoLike = asynchandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user._id;

    if(!videoId){
        throw new ApiError(400 , "Invalid Video Id")
    }
    if(!userId){
        throw new ApiError(404 , "No user found")
    }
    const liked = await Like.findOne(videoId) 
    if(!liked){
        const like = new Like ({
           video:  videoId,
           likedBy: userId,
        })
        await like.save()

        return res
        .status(200)
        .json(new ApiResponse(200 , like , "Liked Successfully"))
    }else{

        await liked.deleteOne()
         
        return res
        .status(200)
        .json(new ApiResponse(200  , "UnLiked Successfully"))
        
    }

})

const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id;
    
    
    if(!commentId || !userId){
        throw new ApiError(404 , "Invalid User or Comment")
    }

    const LikeonComment = await Like.findOne(commentId)

    if(!LikeonComment){
        const like = new Like ({
            comment : commentId,
            likedBy : userId,
        })

        await like.save()
        
        return res
        .status(200)
        .json(new ApiResponse(200 , like ,"Liked Comment Successfully"))
        
    }else {
       await LikeonComment.deleteOne()

       return res
       .status(200)
       .json(new ApiResponse(200 , "Comment Disliked Successfully"))
    }


})

const toggleTweetLike = asynchandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id;
    
    if(!tweetId){
        throw new ApiError(404 , "Invalid  Tweet Id")
    }
    if(!userId){
        throw new ApiError(404 ,"Invalid User Id")
    }
    const LikedTweet = await Like.findOne(
        {likedBy:userId , tweet : tweetId}
    )
    if(!LikedTweet){
        const like = new Like({
            tweet : tweetId ,
            likedBy : userId,
        })
         await like.save();

         return res
         .status(200)
         .json(new ApiResponse(200 , like , "Liked tweet Successfully"))
    }else{
        await LikedTweet.deleteOne()
          
        return res
        .status(200)
        .json(new ApiResponse(200 ,null, "Unliked Successfully"))
         
    }

}
)

const getLikedVideos = asynchandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(404 ,"Invalid User")
    }
    const likedVideos = await Like.find({likedBy:userId}).populate('video')

    if(!likedVideos || likedVideos === 0){
        throw new ApiResponse(200 ,[], "No Liked Videos found")
    }else{
        throw new ApiResponse(200 , likedVideos , "fetched Liked Videos Successfully")
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
import mongoose, { isValidObjectId } from "mongoose"
import {tweets} from "../models/tweets.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"
// import { UploadStream } from "cloudinary"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {Content} = req.body;
    const userId = req.user._id;
    if(!Content){
        throw new ApiError(400 , "Write a Tweet to Add")
    }
    if(!userId){
        throw new ApiError(400 , "Invalid user")
    }

    const Text = new tweets ({
        content: Content , 
        owner : userId,
    })
    
    await Text.save();

     return res
     .status(200)
     .json(new ApiResponse(200 , Text , "Tweet Created Successfully"))
})

const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(404 , "No user Found")
    }
    
    const owner = await User.findById(userId)
    
    const message = await tweets.find({owner : owner})
     
    return res
    .status(200)
    .json(new ApiResponse(200 , message , "User Tweets fetched Successfully"))

})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {newTweet}  = req.body;
    const userId = req.user._id;
    const {tweetId} = req.params;
    const Text = await tweets.findByIdAndUpdate( 
        {
          _id:tweetId , owner : userId
        },
        {
            $set: {content : newTweet}
        },
        {
            new : true,
        }
    )
    await Text.save()
    
    return res
    .status(200)
    .json(new ApiResponse(200 , Text , "Tweet Updated Successfully"))
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params ;
    const userId = req.user._id;
    if(!tweetId){
        throw new ApiError(404 , "Tweet Not Found")
    }
    if(!userId){
        throw new ApiError(404 ,"User not found");
    }

    const deletedTweet = await tweets.findByIdAndDelete(
        {_id:tweetId , owner : userId},
    )

    return res
    .status(200)
    .json(new ApiResponse(200 , deletedTweet , "Tweet deleted Successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
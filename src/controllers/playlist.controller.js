
import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import { populate } from "dotenv"
import { Video } from "../models/video.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description){
    throw new ApiError(400 , "Write the name and description of the playlist")
    }   

    const owner = req.user._id
    if(!owner){
        throw new ApiError(404 ,"No user found")
    }
    const play = new Playlist (
        {
            name : name ,
            description : description,
            owner : owner,
        }
    )
        
    await play.save()

    return res
    .status(200)
    .json(new ApiResponse(200 , play , "Created Playlist Successfully"))

})

const getUserPlaylists = asynchandler(async (req, res) => {
    //TODO: get user playlists
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(404 , "Invalid User Id, did not get in database ");
    }
    const UsersPlayList = await Playlist.find({owner : userId})

    if(!UsersPlayList || UsersPlayList?.length === 0){
        throw new ApiError(404 , "No PlayList found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , UsersPlayList , "Playlist Found Successfully"))
})

const getPlaylistById = asynchandler(async (req, res) => {
    //TODO: get playlist by id
    const {playlistId} = req.params;
    const userId = req.user._id;
    if(!playlistId){
        throw new ApiError(400 , "Invalid PLaylist Id")
    }
    const playlist = await Playlist.findById(
        {_id:playlistId ,owner : userId},
        
    )
    if(!playlist){
        throw new ApiError(404 ,"No Playlist Found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , playlist , "Fetched Playlist Successfully"))
    
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    //TODO : add a video to a playlist
    const {playlistId} = req.params;
    const videoFile = req.files?.video[0]
    const {title, description} = req.body;
    const userId = req.user._id;

  
    try {
        if(!playlistId){
            throw new ApiError(401 ,"Invalid playlistId or VideoId")
        }
        
        const videoFileLocalPath = videoFile?.path
        
        if(!videoFileLocalPath){
            throw new ApiError(404 ,"No video found to add to the playlist");
        }
    
        const video = await uploadOnCloudinary(videoFileLocalPath , "video")
        
        if(!video){
            throw new ApiError(404 , "Video was not recieved from cloudinary")
        }else if(!video.url){
            throw new ApiError(404 , 'Video URL not found')
        }
    
        const newVideo = await new Video({
            videoFile : video.url,
            title,
            Description : description,
            duration : video.duration,
        
        })
        
        const userplaylist = await Playlist.findByIdAndUpdate(
            {_id:playlistId , owner:userId},
            {$set:
                {videos:newVideo}
            },
            {new:true}
        )
        
        if(!userplaylist){
            throw new ApiError(404 , "No Playlist Found")
        }
         console.log(userplaylist)
        
        
        await userplaylist.save(newVideo)
        
        return res
        .status(200)
        .json(new ApiResponse(200 , userplaylist , "video added Successfully"))
    } catch (error) {
        console.log(error.message)
        throw new ApiError(400 , "Could not complete video add to playlist")
    }

})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const userId = req.user._id;
    if(!playlistId && !videoId){
        throw new ApiError(401 , "PlaylistId and videoId are required")
    }
    if(!userId){
        throw new ApiError(404 ,"User not found")
    }
    const playlist =await Playlist.findOne({_id:playlistId , owner :userId})
    if(!playlist){
        throw new ApiError(404 ,"Could not find playlist")
    }

    playlist.deleteOne({
        videos : videoId
    })

    
    

    return res
    .status(200)
    .json(new ApiResponse(200 , playlist , "Video Deleted Successfully"))

})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const userId = req.user._id;
    if(!playlistId){
        throw new ApiError(401 , "Invalid Playlist id")
    }
    if(!userId){
        throw new ApiError(400 ,"Invalid User Id")
    }
    const deletedPlaylist = await Playlist.findOne(
        {_id:playlistId , owner : userId},
    )
    console.log(deletedPlaylist)
    if(!deletedPlaylist) {
        throw new ApiError(404 , "No Playlist Found with the given Playlist Id ")
    }
    await Playlist.deleteOne(deletedPlaylist);

    return res
    .status(200)
    .json(new ApiResponse(200 , deletedPlaylist , "Playlist deleted Successfully" ))
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const userId =req.user._id;
    //TODO: update playlist
    if(!playlistId){
        throw new ApiError(400 ,"Invalid PlayList Id ");
    }
    if(!name || !description){
        throw new ApiError(401 ,"name or description required to update")
    }
    if(!userId){
        throw new ApiError(401 ,"User not found")
    }
    const playlist = await Playlist.findByIdAndUpdate(
        {_id:playlistId , owner : userId},
        {
            $set :{
                name : name,
                description : description,
            }
        }
    )
    await playlist.save();

    return res
    .status(201)
    .json(new ApiResponse(200 , playlist , "Playlist Updated Successfully"));
    
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

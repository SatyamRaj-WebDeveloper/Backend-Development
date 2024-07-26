import { Schema } from "mongoose";
import mongoose from "mongoose";

const tweetSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    content:{
        type : String,
    }
},{timestamps:true})

export const tweets = mongoose.model("Tweet" , tweetSchema)
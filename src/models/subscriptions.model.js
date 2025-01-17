import mongoose ,{ Schema } from "mongoose";

const SubscriptionSchema = new Schema({
    Subscriber :{
        type : Schema.Types.ObjectId, //one who is Subscribing
        ref : "User"
    },
    channel:{
        type : Schema.Types.ObjectId, // the one who is being Subscribed
        ref : "User"
    }
},{timestamps:true})



export const Subscription =  mongoose.model("Subscription" , SubscriptionSchema)
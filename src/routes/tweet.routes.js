import mongoose,{Router} from "mongoose";
import {createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from '../controllers/tweet.controller.js'
import { Verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createtweet").post(Verifyjwt , createTweet)
router.route("/getUserTweets").get(Verifyjwt , getUserTweets)
router.route("/tweets/:tweetId").post(Verifyjwt , updateTweet)
router.route("/tweets/:tweetId").delete(Verifyjwt , deleteTweet)

export default router;

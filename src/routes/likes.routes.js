import { Router } from "express";
import {toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos} from '../controllers/Likes.controller.js'
import {Verifyjwt} from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/Likes/Video/:videoId').post(Verifyjwt , toggleVideoLike)
router.route('/Likes/Comments/:commentId').post(Verifyjwt , toggleCommentLike)
router.route("/Likes/getLikedvideos").get(Verifyjwt , getLikedVideos)
router.route("/Likes/Tweets/:tweetId").post(Verifyjwt , toggleTweetLike)


export default router;

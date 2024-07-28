import { Router } from "express";
import { Verifyjwt } from "../middlewares/auth.middleware.js";
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from  '../controllers/video.controller.js'
import { upload } from "../middlewares/multr.middleware.js";

    
const router = Router()

router.route("/All-videos").get(Verifyjwt , getAllVideos)
router.route("/updateVideo/:videoId").post(Verifyjwt , updateVideo)
router.route("/upload/PublishVideo").post( Verifyjwt ,upload.fields([{
    name : "video",
    maxCount : 1,
}]), publishAVideo)
router.route("/getVideo/:videoId").get(Verifyjwt , getVideoById)
router.route("/deleteVideo/:videoId").delete(Verifyjwt , deleteVideo)
router.route("/toggleStatus/:videoId").post(Verifyjwt , togglePublishStatus)

export default router;
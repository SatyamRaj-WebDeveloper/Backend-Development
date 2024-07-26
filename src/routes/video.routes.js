import { Router } from "express";
import { Verifyjwt } from "../middlewares/auth.middleware.js";
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from  '../controllers/video.controller.js'

    
const router = Router()

router.route("/All-videos").get(Verifyjwt , getAllVideos)
router.route("/updateVideo").post(Verifyjwt , updateVideo)
router.route("/PublishVideo").post( upload.field([
    {
        name: "video",
        maxCount : 1
    }
])  ,Verifyjwt , publishAVideo)
router.route("/getVideo").get(Verifyjwt , getVideoById)
router.route("/deleteVideo").delete(Verifyjwt , deleteVideo)
router.route("toggleStatus").post(Verifyjwt , togglePublishStatus)

export default router;
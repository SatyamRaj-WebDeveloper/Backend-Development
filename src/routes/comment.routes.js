import { Router } from "express";
import { getVideoComments, 
    addComment, 
    updateComment,
     deleteComment} from '../controllers/comment.controller.js'
import { Verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/videos/:videoId/comments").get(Verifyjwt , getVideoComments)
router.route("/videos/:videoId/comments").post(Verifyjwt , addComment)
router.route("/:commentId").post(Verifyjwt , updateComment)
router.route("/:videoId/:commentToDelete").delete(Verifyjwt , deleteComment)

export default router

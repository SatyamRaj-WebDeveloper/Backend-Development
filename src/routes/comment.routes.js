import { Router } from "express";
import { getVideoComments, 
    addComment, 
    updateComment,
     deleteComment} from '../controllers/comment.controller'
import { Verifyjwt } from "../middlewares/auth.middleware";

const router = Router()

router.route("/videos/:videoId/comments").get(Verifyjwt , getVideoComments)
router.route("/videos/:videoId/comments").post(Verifyjwt , addComment)
router.route("/comments/:commentId").post(Verifyjwt , updateComment)
router.route("/videos/:videoId/comments/:commentToDelete").delete(Verifyjwt , deleteComment)

export default router

import {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controller.js"
import { Router } from "express"
import {Verifyjwt} from '../middlewares/auth.middleware.js'
import { upload } from "../middlewares/multr.middleware.js";


const router = Router();

router.route("/createplaylist").post(Verifyjwt , createPlaylist);
router.route("/UserPlaylist").post(Verifyjwt , getUserPlaylists);
router.route("/get/Playlist/:playlistId").get(Verifyjwt , getPlaylistById)
router.route("/add/:playlistId").post(Verifyjwt,upload.fields([{
    name :"video",
    maxCount : 1
}]) , addVideoToPlaylist);
router.route("/remove/:playlistId/:videoId").delete(Verifyjwt , removeVideoFromPlaylist);
router.route("/delete/:playlistId").delete(Verifyjwt , deletePlaylist);
router.route("/update/:playlistId").post(Verifyjwt , updatePlaylist);


export default router
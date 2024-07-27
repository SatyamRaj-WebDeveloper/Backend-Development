import {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controller.js"
import { Router } from "express"
import {Verifyjwt} from '../middlewares/auth.middleware.js'


const router = Router();

router.route("/createplalist").post(Verifyjwt , createPlaylist);
router.route("/UserPlaylist/users:userId").post(Verifyjwt , getUserPlaylists);
router.route("/playlist/get/Playlist:playlistId").get(Verifyjwt , getPlaylistById)
router.route("/playlist/add/:playlistId/:videoId").post(Verifyjwt , addVideoToPlaylist);
router.route("/playlist/remove/:playlistId/:videoId").delete(Verifyjwt , removeVideoFromPlaylist);
router.route("/playlist/delete/:playlistId").delete(Verifyjwt , deletePlaylist);
router.route("/playlist/update/:playlistId").post(Verifyjwt , updatePlaylist);


export default router
import {Router} from 'express'
import { avatarUpdate, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, refreshAccessToken, registerUser, updateAccount,coverimageUpdate } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multr.middleware.js'
import { loginUser } from '../controllers/user.controller.js'
import { logoutUser } from '../controllers/user.controller.js'
import { Verifyjwt } from '../middlewares/auth.middleware.js'


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverimage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes 
router.route("/logout").post(Verifyjwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(Verifyjwt , changeCurrentPassword)
router.route("/current-user").post(Verifyjwt , getCurrentUser);
router.route('/update-Account').patch(Verifyjwt , updateAccount);
router.route('/avatar').patch(Verifyjwt , upload.single("avatar"),avatarUpdate)
router.route('/cover-image').patch(Verifyjwt , upload.single("coverimage"), coverimageUpdate)
router.route('/c/:username').get(Verifyjwt ,getUserChannelProfile)
router.route("/history").get(Verifyjwt , getWatchHistory)
                    
export default router
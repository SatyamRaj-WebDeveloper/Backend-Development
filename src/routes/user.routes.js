import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js'
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
                    
export default router
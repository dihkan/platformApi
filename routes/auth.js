import express from 'express'
import {postLoginController} from '../controllers/authController.js'
const router = express.Router()



router.post("/login" , postLoginController)


export default router;
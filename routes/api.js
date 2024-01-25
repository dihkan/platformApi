import express from 'express'
import {postUserId,
        getUserId, 
        getUsersByCountryCity,
        insertUser, 
        updateUser} from '../controllers/userController.js'
import {getInviteId,
        getInvites, 
        createInvitation, 
        updateInvitation,
        deleteInvitation} from '../controllers/inviteController.js'

import {tokenControl} from '../middleware/tokenMiddleware.js'

const router = express.Router()
// user routes
router.get('/user/get' , tokenControl, getUserId) 
router.post('/user/get' , tokenControl, postUserId) 
router.post('/user/getUsers' ,tokenControl, getUsersByCountryCity) 
router.put('/user/insert' ,tokenControl, insertUser) 
router.patch('/user/update' ,tokenControl, updateUser) 
// router.delete('/user/delete' ,tokenControl, deleteUser) 

// invite routes
router.get('/invite/get' , tokenControl, getInvites) 
router.post('/invite/get' , tokenControl, getInviteId) 
router.put('/invite/insert' ,tokenControl, createInvitation) 
router.patch('/invite/update' ,tokenControl, updateInvitation) 
router.delete('/invite/update' ,tokenControl, deleteInvitation) 



export default router;                       

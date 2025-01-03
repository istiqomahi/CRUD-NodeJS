import express from "express"; /** 1 */
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controller/Users.js"; //4
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router(); /** 2 */

router.get('/users', verifyUser, adminOnly,getUsers); //5
router.get('/users/:id', verifyUser, adminOnly,getUserById);
router.post('/users', verifyUser, adminOnly,createUser);
router.patch('/users/:id', verifyUser, adminOnly,updateUser);
router.delete('/users/:id', verifyUser, adminOnly,deleteUser);

export default router; /** 3 */
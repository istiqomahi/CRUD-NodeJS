import express from "express";
import{Me,Login, logOut} from "../controller/Auth.js";

const router = express.Router();

router.get('/me', Me);
router.post('/Login', Login);
router.delete('/logOut', logOut);

export default router;
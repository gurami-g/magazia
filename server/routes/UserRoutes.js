import express from 'express';
import { getUser, getUserData, logOut, loginUser, updatePassword, updateUserData } from '../controllers/UserController.js';

const UserRoutes = express.Router();

UserRoutes.post('/login', loginUser);
UserRoutes.post('/logout', logOut);
UserRoutes.get('/getuser', getUser);

UserRoutes.get("/getuserdata", getUserData);
UserRoutes.put("/updateuser", updateUserData);
UserRoutes.put("/updatepassword", updatePassword);

export default UserRoutes;

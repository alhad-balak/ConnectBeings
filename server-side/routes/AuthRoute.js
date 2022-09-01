import express from 'express';
import { loginUser, registerUser } from '../controllers/AuthController.js';

const router = express.Router()
router.get('/', async (req, res) => { res.send('Auth route') })
// router.route('/register').post(async(req, res)=>{ res.send("Register") })
router.post('/register', registerUser)
router.post('/login', loginUser)


export default router
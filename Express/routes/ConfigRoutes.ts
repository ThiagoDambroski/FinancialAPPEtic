import { Router } from 'express';
import configsController from '../controller/ConfigController';

const router = Router()

router.post("/post/:userId",configsController.post)
router.get("/getAll",configsController.getAll)


export default router
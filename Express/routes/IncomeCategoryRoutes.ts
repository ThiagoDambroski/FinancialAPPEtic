import {Router} from 'express';
import incomeCategoryController from '../controller/IncomeCategoryController';

const router = Router();

router.post("/post/:configId",incomeCategoryController.post)
router.get("/get",incomeCategoryController.getAll)


export default router;
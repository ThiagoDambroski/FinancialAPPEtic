import {Router} from 'express';
import savingsController from '../controller/SavingsController';

const router = Router();

router.post("/post/:configId",savingsController.post)
router.get("/get",savingsController.getAll)


export default router;
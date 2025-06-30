import {Router} from 'express';
import investmentsController from '../controller/InvestmentsController';

const router = Router();

router.post("/post/:configId",investmentsController.post)
router.get("/get",investmentsController.getAll)


export default router;
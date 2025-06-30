import {Router} from 'express';
import PagamentCategoryController from '../controller/PagamentCategoryController';

const router = Router();

router.post("/post",PagamentCategoryController.post)
router.get("/get",PagamentCategoryController.getAll)


export default router;
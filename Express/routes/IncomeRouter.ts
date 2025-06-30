import { Router } from 'express';
import IncomeController from '../controller/IncomeController';

const router = Router();

router.get("/getAll", IncomeController.getAll);
router.get("/getByAccount/:accountId",IncomeController.getByAccount)
router.post("/post/:accountId", IncomeController.post);
router.delete("/delete/:incomeId",IncomeController.deleteIncome)
router.put("/put/:incomeId",IncomeController.put)


export default router;
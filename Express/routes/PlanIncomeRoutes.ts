import { Router } from 'express';
import planIncomeController from '../controller/PlanIncomeController';

const router = Router();

router.post("/post/:accountId", planIncomeController.post);


router.post("/postIncome/:planId", planIncomeController.postIncomeFromPlan);

router.get("/get", planIncomeController.getAll);

router.get("/getByAccount/:accountId", planIncomeController.getPlanIncomesByAccount);


router.put("/put/:planId", planIncomeController.put);


router.delete("/delete/:planId", planIncomeController.delete);

export default router;

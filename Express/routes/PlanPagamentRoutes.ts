import {Router} from 'express';
import planPagamentController from '../controller/PlanPagamentController';

const router = Router();

router.post("/post/:accountId",planPagamentController.post)
router.post("/postPagament/:planId",planPagamentController.postPagament)
router.get("/get",planPagamentController.getAll)
router.get("/getByAccount/:accountId",planPagamentController.getByAccount)
router.delete("/delete/:planId", planPagamentController.deletePlanPagament);
router.put("/put/:planId",planPagamentController.put)


export default router;
import { Router } from 'express';
import PagamentController from '../controller/PagamentController';

const router = Router();

router.get("/getAll", PagamentController.getAll);
router.get("/getByAccount/:accountId",PagamentController.getByAccount)
router.post("/post/:accountId", PagamentController.post);
router.put("/put/:pagamentId",PagamentController.put)
router.delete("/delete/:pagamentId",PagamentController.remove)


export default router;

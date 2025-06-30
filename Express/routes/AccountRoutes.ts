import { Router } from 'express';
import AccountController from '../controller/AccountController';

const router = Router();

router.post("/post/:userId", AccountController.post);
router.get("/getAll", AccountController.getAll);
router.get("/getById/:accountId",AccountController.getById)
router.get("/getAllOperations/:accountId",AccountController.getAllOperations)
router.get("/getByUser/:userId", AccountController.getByUser);

export default router;
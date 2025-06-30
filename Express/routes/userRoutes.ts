import { Router } from 'express';
import userController from '../controller/UserController';

const router = Router();

router.post("/post", userController.createUser);
router.get("/getAll", userController.getAllUser);
router.get("/getById/:id", userController.getUserById);
router.get("/getByName/:username", userController.getUserByName);
router.get("/getTotalMoney/:id", userController.getTotalMoney);
router.put("/put/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

export default router;

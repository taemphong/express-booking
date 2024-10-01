import { Router } from "express";
import * as newController from './new.controller.js';
import isAdmin from "../Middleware/admin.js";
const router = Router();

router.post('/postnew', isAdmin,newController.createNewsController);
router.patch('/updatenew/:news_id',  isAdmin,newController.updateNewsController);
router.delete('/deletenew/:news_id', isAdmin, newController.deleteNewsController);
router.get('/getnew/:news_id',newController.getNewsByIdController);

export default router;
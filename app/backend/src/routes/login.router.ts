import * as express from 'express';
import { LoginController } from '../controllers';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/', LoginController.doLogin);
router.get('/validate', auth, LoginController.validateLogin);

export default router;

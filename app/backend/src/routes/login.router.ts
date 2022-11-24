import * as express from 'express';
import LoginController from '../controllers';

const router = express.Router();

router.post('/', LoginController.doLogin);

export default router;

import * as express from 'express';
import { MatchController } from '../controllers';
import auth from '../middlewares/auth';

const router = express.Router();

router.get('/', MatchController.findMatches);
router.post('/', auth, MatchController.createInProgressMatch);

export default router;

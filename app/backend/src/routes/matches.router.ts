import * as express from 'express';
import { MatchController } from '../controllers';
import auth from '../middlewares/auth';

const router = express.Router();

router.patch('/:id/finish', auth, MatchController.setMatchAsFinished);
router.patch('/:id', auth, MatchController.updateMatchGoals);
router.post('/', auth, MatchController.createInProgressMatch);
router.get('/', MatchController.findMatches);

export default router;

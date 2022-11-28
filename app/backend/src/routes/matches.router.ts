import * as express from 'express';
import { MatchController } from '../controllers';

const router = express.Router();

router.get('/', MatchController.findMatches);

export default router;

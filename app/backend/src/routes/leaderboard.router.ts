import * as express from 'express';
import { LeaderboardController } from '../controllers';

const router = express.Router();

router.get('/home', LeaderboardController.getHomeLeaderboard);

export default router;

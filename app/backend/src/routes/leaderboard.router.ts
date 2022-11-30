import * as express from 'express';
import { LeaderboardController } from '../controllers';

const router = express.Router();

router.get('/home', LeaderboardController.getHomeLeaderboard);
router.get('/away', LeaderboardController.getAwayLeaderboard);

export default router;

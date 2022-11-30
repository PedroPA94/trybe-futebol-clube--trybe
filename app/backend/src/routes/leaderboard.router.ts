import * as express from 'express';
import { LeaderboardController } from '../controllers';

const router = express.Router();

router.get('/home', LeaderboardController.getHomeLeaderboard);
router.get('/away', LeaderboardController.getAwayLeaderboard);
router.get('/', LeaderboardController.getFullLeaderboard);

export default router;

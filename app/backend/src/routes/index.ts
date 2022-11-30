import * as express from 'express';
import leaderboardRouter from './leaderboard.router';
import loginRouter from './login.router';
import matchesRouter from './matches.router';
import teamsRouter from './teams.router';

const router = express.Router();

router.use('/login', loginRouter);
router.use('/teams', teamsRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboard', leaderboardRouter);

export default router;

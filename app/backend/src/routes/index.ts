import * as express from 'express';
import leaderboardsRouter from './leaderboards.router';
import loginRouter from './login.router';
import matchesRouter from './matches.router';
import teamsRouter from './teams.router';

const router = express.Router();

router.use('/login', loginRouter);
router.use('/teams', teamsRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboards', leaderboardsRouter);

export default router;

import { RequestHandler } from 'express';
import { LeaderboardService } from '../services';

export default class LeaderboardController {
  public static getHomeLeaderboard: RequestHandler = async (_req, res) => {
    const homeLeaderboard = await LeaderboardService.getHomeLeaderboard();
    res.status(200).json(homeLeaderboard);
  };
}

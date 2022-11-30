import { RequestHandler } from 'express';
import { LeaderboardService } from '../services';

export default class LeaderboardController {
  public static getHomeLeaderboard: RequestHandler = async (_req, res) => {
    const homeLeaderboard = await LeaderboardService.getHomeLeaderboard();
    res.status(200).json(homeLeaderboard);
  };

  public static getAwayLeaderboard: RequestHandler = async (_req, res) => {
    const awayLeaderboard = await LeaderboardService.getAwayLeaderboard();
    res.status(200).json(awayLeaderboard);
  };

  public static getFullLeaderboard: RequestHandler = async (_req, res) => {
    const fullLeaderboard = await LeaderboardService.getFullLeaderboard();
    res.status(200).json(fullLeaderboard);
  };
}

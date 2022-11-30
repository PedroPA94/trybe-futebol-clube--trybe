import MatchesModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import { ILeaderboard, ITeamMatches } from '../interfaces';
import LeaderboardGenerator from '../utils/LeaderboardGenerator';

export default class LeaderboardService {
  private static async getTeamMatches(homeOrAway: 'home' | 'away'): Promise<ITeamMatches[]> {
    const homeOrAwayMatches = `${homeOrAway}Matches`;
    const teamsAndMatches = await TeamModel.findAll(
      {
        include:
          {
            model: MatchesModel,
            as: homeOrAwayMatches,
            where:
              { inProgress: false },
          },
      },
    );
    return teamsAndMatches as ITeamMatches[];
  }

  public static async getHomeLeaderboard(): Promise<ILeaderboard[]> {
    const homeTeams = await LeaderboardService.getTeamMatches('home');
    const homeLeaderboard: ILeaderboard[] = LeaderboardGenerator
      .createLeaderboard(homeTeams, 'home');
    return homeLeaderboard;
  }

  public static async getAwayLeaderboard(): Promise<ILeaderboard[]> {
    const awayTeams = await LeaderboardService.getTeamMatches('away');
    const awayLeaderboard: ILeaderboard[] = LeaderboardGenerator
      .createLeaderboard(awayTeams, 'away');
    return awayLeaderboard;
  }
}

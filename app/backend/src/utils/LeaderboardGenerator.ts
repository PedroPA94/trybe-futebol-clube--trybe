import { ILeaderboard, ITeamMatches } from '../interfaces';
import TeamStatsGetter, { HomeOrAway } from './TeamStatsGetter';

export default class LeaderboardGenerator {
  public static createLeaderboard(teams: ITeamMatches[], homeOrAway: HomeOrAway)
    : ILeaderboard[] {
    const unsortedLeaderboard: ILeaderboard[] = [];

    teams.forEach((team) => {
      const teamStats = TeamStatsGetter.getTeamStats(team, homeOrAway);
      unsortedLeaderboard.push(teamStats);
    });

    return LeaderboardGenerator.sortLeaderboard(unsortedLeaderboard);
  }

  public static joinHomeAndAwayLeaderboards(
    homeLeaderboard: ILeaderboard[],
    awayLeaderboard: ILeaderboard[],
  )
    : ILeaderboard[] {
    const joinedLeaderboards: ILeaderboard[] = [];

    homeLeaderboard.forEach((homeStats) => {
      const awayStats = awayLeaderboard.find(({ name }) => name === homeStats.name);
      const joinedStats = TeamStatsGetter.createJoinedTeamStats(homeStats, awayStats);
      joinedLeaderboards.push(joinedStats);
    });

    return LeaderboardGenerator.sortLeaderboard(joinedLeaderboards);
  }

  private static sortLeaderboard(leaderboard: ILeaderboard[]): ILeaderboard[] {
    // sort baseado em https://dev.to/markbdsouza/js-sort-an-array-of-objects-on-multiple-columns-keys-2bj1
    const sortedLeaderboard = leaderboard.sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn
    ));
    return sortedLeaderboard;
  }
}

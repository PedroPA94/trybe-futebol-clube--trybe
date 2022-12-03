import { ILeaderboard, IMatch, ITeamMatches } from '../interfaces';

type TeamGoals = {
  goalsBalance: number
  goalsFavor: number
  goalsOwn: number
};

type TeamGames = {
  totalGames: number
  totalVictories: number
  totalDraws: number
  totalLosses: number
};

export type HomeOrAway = 'home' | 'away';

export default class TeamStatsGetter {
  public static getTeamStats(team: ITeamMatches, homeOrAway: HomeOrAway)
    : ILeaderboard {
    const matches = homeOrAway === 'home' ? 'homeMatches' : 'awayMatches';
    const teamGoals = TeamStatsGetter.getTeamGoals(team[matches] as IMatch[], homeOrAway);
    const teamGames = TeamStatsGetter.getTeamGames(team[matches] as IMatch[], homeOrAway);
    const totalPoints = TeamStatsGetter.getTeamPoints(teamGames);
    const efficiency = TeamStatsGetter.getEfficiency(totalPoints, teamGames.totalGames);

    return {
      name: team.teamName,
      totalPoints,
      ...teamGames,
      ...teamGoals,
      efficiency,
    };
  }

  private static getTeamGoals(matches: IMatch[], homeOrAway: HomeOrAway): TeamGoals {
    const homeTeamGoals = matches.reduce((acc, cur) => acc + cur.homeTeamGoals, 0);
    const awayTeamGoals = matches.reduce((acc, cur) => acc + cur.awayTeamGoals, 0);
    const goalsFavor = homeOrAway === 'home' ? homeTeamGoals : awayTeamGoals;
    const goalsOwn = homeOrAway === 'home' ? awayTeamGoals : homeTeamGoals;
    const goalsBalance = goalsFavor - goalsOwn;
    return {
      goalsBalance,
      goalsFavor,
      goalsOwn,
    };
  }

  private static getTeamGames(matches: IMatch[], homeOrAway: HomeOrAway): TeamGames {
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;

    matches.forEach((match) => {
      const matchResult = TeamStatsGetter.checkMatchResult(match, homeOrAway);
      if (matchResult === 'victory') totalVictories += 1;
      else if (matchResult === 'draw') totalDraws += 1;
      else totalLosses += 1;
    });

    const totalGames = totalVictories + totalDraws + totalLosses;

    return {
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
    };
  }

  private static checkMatchResult(match: IMatch, homeOrAway: HomeOrAway): string {
    const { homeTeamGoals, awayTeamGoals } = match;
    if (homeTeamGoals === awayTeamGoals) return 'draw';
    if (homeOrAway === 'home') {
      return (homeTeamGoals > awayTeamGoals) ? 'victory' : 'loss';
    }
    return (homeTeamGoals < awayTeamGoals) ? 'victory' : 'loss';
  }

  private static getTeamPoints(teamGames: TeamGames): number {
    const { totalVictories: victories, totalDraws: draws } = teamGames;
    return victories * 3 + draws;
  }

  private static getEfficiency(points: number, games: number): string {
    return ((points / (games * 3)) * 100).toFixed(2);
  }

  public static createJoinedTeamStats(homeStats: ILeaderboard, awayStats?: ILeaderboard) {
    const joinedStats = this.joinTeamStats(homeStats, awayStats);

    const { totalPoints, totalGames } = joinedStats;
    joinedStats.efficiency = TeamStatsGetter.getEfficiency(totalPoints, totalGames);

    return joinedStats;
  }

  private static joinTeamStats(homeStats: ILeaderboard, awayStats?: ILeaderboard): ILeaderboard {
    const joinedStats = homeStats;

    if (awayStats) {
      Object.entries(joinedStats).forEach(([key, value]): void => {
        if (typeof value === 'number') {
          (<number>joinedStats[key]) += <number>awayStats[key];
        }
      });
    }

    return joinedStats;
  }
}

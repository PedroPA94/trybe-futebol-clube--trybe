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

type HomeOrAway = 'home' | 'away';

export default class LeaderboardGenerator {
  private static getTeamGoals(matches: IMatch[], homeOrAway: HomeOrAway): TeamGoals {
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      if (homeOrAway === 'home') {
        goalsFavor += match.homeTeamGoals;
        goalsOwn += match.awayTeamGoals;
      } else {
        goalsFavor += match.awayTeamGoals;
        goalsOwn += match.homeTeamGoals;
      }
    });
    const goalsBalance = goalsFavor - goalsOwn;
    return {
      goalsBalance,
      goalsFavor,
      goalsOwn,
    };
  }

  private static checkMatchResult(match: IMatch, homeOrAway: HomeOrAway): string {
    const { homeTeamGoals, awayTeamGoals } = match;
    if (homeTeamGoals === awayTeamGoals) return 'draw';
    if (homeOrAway === 'home') {
      if (homeTeamGoals > awayTeamGoals) return 'victory';
      return 'loss';
    }
    if (homeTeamGoals < awayTeamGoals) return 'victory';
    return 'loss';
  }

  private static getTeamGames(matches: IMatch[], homeOrAway: HomeOrAway): TeamGames {
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;

    matches.forEach((match) => {
      const matchResult = LeaderboardGenerator.checkMatchResult(match, homeOrAway);
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

  private static getTeamPoints(teamGames: TeamGames): number {
    const { totalVictories: victories, totalDraws: draws } = teamGames;
    const totalPoints = victories * 3 + draws;
    return totalPoints;
  }

  private static getTeamStats(team: ITeamMatches, homeOrAway: HomeOrAway)
    : ILeaderboard {
    const matches = homeOrAway === 'home' ? 'homeMatches' : 'awayMatches';
    const teamGoals = LeaderboardGenerator.getTeamGoals(team[matches] as IMatch[], homeOrAway);
    const teamGames = LeaderboardGenerator.getTeamGames(team[matches] as IMatch[], homeOrAway);
    const totalPoints = LeaderboardGenerator.getTeamPoints(teamGames);
    const efficiency = ((totalPoints / (teamGames.totalGames * 3)) * 100).toFixed(2);

    return {
      name: team.teamName,
      totalPoints,
      ...teamGames,
      ...teamGoals,
      efficiency,
    };
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

  public static createLeaderboard(teams: ITeamMatches[], homeOrAway: HomeOrAway)
    : ILeaderboard[] {
    const unsortedLeaderboard: ILeaderboard[] = [];

    teams.forEach((team) => {
      const teamStats = LeaderboardGenerator.getTeamStats(team, homeOrAway);
      unsortedLeaderboard.push(teamStats);
    });

    return LeaderboardGenerator.sortLeaderboard(unsortedLeaderboard);
  }
}

import IMatch from './IMatch';
import ITeam from './ITeam';

export interface ITeamMatches extends ITeam {
  homeMatches?: IMatch[]
  awayMatches?: IMatch[]
}

// export interface ITeamAwayMatches extends ITeam {
//   awayMatches: IMatch[]
// }

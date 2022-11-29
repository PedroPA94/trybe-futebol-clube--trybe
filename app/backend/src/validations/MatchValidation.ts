import MatchesModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import { IMatch } from '../interfaces';

export default class MatchValidation {
  public static validateInProgressQuery(query: string): boolean {
    if (query === 'true') return true;
    if (query === 'false') return false;
    throw new Error('Invalid query');
  }

  private static async validateTeamsExist(...teams: number[]): Promise<void> {
    const promises = teams.map((team) => TeamModel.findByPk(team));
    const teamsInDatabase = await Promise.all(promises);

    if (teamsInDatabase.some((team) => team === null)) {
      throw new Error('There is no team with such id!');
    }
  }

  private static async validateMatchExist(matchId: number): Promise<void> {
    const validMatch = await MatchesModel.findByPk(matchId);
    if (!validMatch) throw new Error('Match does not exist');
  }

  public static async validateNewMatchInputs(newMatch: IMatch): Promise<void> {
    const { homeTeam, awayTeam } = newMatch;
    if (homeTeam === awayTeam) {
      throw new Error('It is not possible to create a match with two equal teams');
    }
    await MatchValidation.validateTeamsExist(homeTeam, awayTeam);
  }

  public static async validateMatchPatch(patchData: Record<string, number | boolean>, id: number)
    : Promise<void> {
    await MatchValidation.validateMatchExist(id);

    if (!('homeTeamGoals' in patchData) && !('awayTeamGoals' in patchData)
      && !('inProgress' in patchData)) {
      throw new Error('Incorrect fields to update');
    }
  }
}

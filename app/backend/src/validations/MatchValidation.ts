import TeamModel from '../database/models/TeamModel';
import { IMatch } from '../interfaces';

export default class MatchValidation {
  public static validateInProgressQuery(query: string): boolean {
    if (query === 'true') return true;
    if (query === 'false') return false;
    throw new Error('Invalid query');
  }

  private static async validateTeamsExist(homeTeam: number, awayTeam: number): Promise<void> {
    const teams = [homeTeam, awayTeam];
    const promises = teams.map((team) => TeamModel.findByPk(team));
    const teamsInDatabase = await Promise.all(promises);

    if (teamsInDatabase.some((team) => team === null)) {
      throw new Error('There is no team with such id!');
    }
  }

  public static async validateNewMatchInputs(newMatch: IMatch): Promise<void> {
    const { homeTeam, awayTeam } = newMatch;
    if (homeTeam === awayTeam) {
      throw new Error('It is not possible to create a match with two equal teams');
    }
    await MatchValidation.validateTeamsExist(homeTeam, awayTeam);
  }
}

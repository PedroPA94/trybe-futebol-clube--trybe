import MatchesModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import { IMatch } from '../interfaces';
import MatchValidation from '../validations/MatchValidation';

export default class MatchService {
  public static async findMatches(query?: string): Promise<IMatch[]> {
    let matches = await MatchesModel.findAll({
      include: [
        { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    if (query) {
      const inProgress = MatchValidation.validateInProgressQuery(query);
      matches = matches.filter((match) => match.inProgress === inProgress);
    }

    return matches;
  }

  public static async createInProgressMatch(newMatch: IMatch): Promise<IMatch> {
    await MatchValidation.validateNewMatchInputs(newMatch);
    const createdMatch = await MatchesModel.create({ ...newMatch, inProgress: true });
    return createdMatch;
  }

  public static async updateMatch(updateData: Record<string, number | boolean>, id: number)
    : Promise<void> {
    await MatchValidation.validateMatchPatch(updateData, id);
    await MatchesModel.update({ ...updateData }, { where: { id } });
  }
}

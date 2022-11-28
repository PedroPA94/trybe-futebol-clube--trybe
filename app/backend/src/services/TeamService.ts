import TeamModel from '../database/models/TeamModel';
import ITeam from '../interfaces/ITeam';

export default class TeamService {
  public static async findAll(): Promise<ITeam[]> {
    const teams: ITeam[] = await TeamModel.findAll();
    return teams;
  }

  public static async findById(id: number): Promise<ITeam> {
    const team: ITeam | null = await TeamModel.findByPk(id);
    if (!team) throw new Error('Team not found');
    return team;
  }
}

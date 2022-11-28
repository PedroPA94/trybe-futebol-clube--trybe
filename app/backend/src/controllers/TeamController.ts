import { RequestHandler } from 'express';
import { ITeam } from '../interfaces';
import { TeamService } from '../services';

export default class TeamController {
  public static findAll: RequestHandler = async (_req, res) => {
    const teams: ITeam[] = await TeamService.findAll();
    res.status(200).json(teams);
  };

  public static findById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const team: ITeam = await TeamService.findById(Number(id));
    res.status(200).json(team);
  };
}

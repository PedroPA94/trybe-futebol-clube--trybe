import { RequestHandler } from 'express';
import { IMatch } from '../interfaces';
import { MatchService } from '../services';

export default class MatchController {
  public static findMatches: RequestHandler = async (req, res) => {
    const { inProgress } = req.query;
    const matches = await MatchService.findMatches(inProgress as string | undefined);
    res.status(200).json(matches);
  };

  public static createInProgressMatch: RequestHandler = async (req, res) => {
    const newMatch: IMatch = req.body;
    const createdMatch = await MatchService.createInProgressMatch(newMatch);
    res.status(201).json(createdMatch);
  };

  public static setMatchAsFinished: RequestHandler = async (req, res) => {
    const { id } = req.params;
    await MatchService.updateMatch({ inProgress: false }, Number(id));
    res.status(200).json({ message: 'Finished' });
  };

  public static updateMatchGoals: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const goalsToUpdate: Record<string, number> = req.body;
    await MatchService.updateMatch({ ...goalsToUpdate }, Number(id));
    res.status(200).json({ message: 'Score updated' });
  };
}

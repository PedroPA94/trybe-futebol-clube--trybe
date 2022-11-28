import { RequestHandler } from 'express';
import { MatchService } from '../services';

export default class MatchController {
  public static findMatches: RequestHandler = async (req, res) => {
    const { inProgress } = req.query;
    const matches = await MatchService.findMatches(inProgress as string | undefined);
    res.status(200).json(matches);
  };
}

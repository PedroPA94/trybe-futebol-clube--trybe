export default class MatchValidation {
  public static validateInProgressQuery(query: string): boolean {
    if (query === 'true') return true;
    if (query === 'false') return false;
    throw new Error('Invalid query');
  }
}

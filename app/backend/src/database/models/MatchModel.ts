import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';
import TeamModel from './TeamModel';

class MatchesModel extends Model {
  declare id: number;
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: INTEGER,
  },
  homeTeam: {
    allowNull: false,
    type: INTEGER,
    field: 'home_team',
  },
  homeTeamGoals: {
    allowNull: false,
    type: INTEGER,
    field: 'home_team_goals',
  },
  awayTeam: {
    allowNull: false,
    type: INTEGER,
    field: 'away_team',
  },
  awayTeamGoals: {
    allowNull: false,
    type: INTEGER,
    field: 'away_team_goals',
  },
  inProgress: {
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamModel.belongsTo(MatchesModel, { foreignKey: 'home_team', as: 'home_team' });
TeamModel.belongsTo(MatchesModel, { foreignKey: 'away_team', as: 'away_team' });

MatchesModel.hasMany(TeamModel, { foreignKey: 'id' });

export default MatchesModel;

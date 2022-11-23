import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';

class TeamModel extends Model {
  declare id: number;
  declare teamName: string;
}

TeamModel.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: INTEGER,
  },
  teamName: {
    allowNull: false,
    field: 'team_name',
    type: STRING,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default TeamModel;

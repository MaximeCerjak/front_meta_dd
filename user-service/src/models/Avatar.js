import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Avatar = sequelize.define('Avatar', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  walkFileId: { type: DataTypes.INTEGER, field: 'walk_file_id', references: { model: 'files', key: 'id' }, allowNull: false },
  idleFileId: { type: DataTypes.INTEGER, field: 'idle_file_id', references: { model: 'files', key: 'id' }, allowNull: false },
}, {
  tableName: 'avatars',         
  freezeTableName: true,      
  createdAt: 'created_at',  
  updatedAt: 'updated_at',
});

export default Avatar;

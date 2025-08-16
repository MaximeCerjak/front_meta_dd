import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Avatar from './Avatar.js';

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    avatarId: { type: DataTypes.INTEGER, references: { model: Avatar, key: 'id' }, allowNull: true, field: 'avatar_id' },
},
{
    tableName: 'users',
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
}); 

User.belongsTo(Avatar, { foreignKey: 'avatar_id', as: 'avatar' });

Avatar.hasOne(User, { foreignKey: 'avatar_id', as: 'user' });

export default User;

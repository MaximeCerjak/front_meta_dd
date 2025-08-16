import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Grid = sequelize.define('Grid', {
    data: { type: DataTypes.JSON, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
{
    tableName: 'grids',
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Grid;

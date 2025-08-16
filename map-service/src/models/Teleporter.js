import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Grid from './Grid.js';
import Map from './Map.js';

const Teleporter = sequelize.define('Teleporter', {
    identifier: { type: DataTypes.STRING, allowNull: false },
    source_grid_id: { type: DataTypes.INTEGER, references: { model: Grid, key: 'id' }, allowNull: false },
    destination_map_id: { type: DataTypes.INTEGER, references: { model: Map, key: 'id' }, allowNull: false },
    destination_position: { type: DataTypes.JSON, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
{
    tableName: 'teleporters',
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Teleporter.belongsTo(Grid, { foreignKey: 'source_grid_id', as: 'sourceGrid' });
Teleporter.belongsTo(Map, { foreignKey: 'destination_map_id', as: 'destinationMap' });

Grid.hasMany(Teleporter, { foreignKey: 'source_grid_id', as: 'teleporters' });
Map.hasMany(Teleporter, { foreignKey: 'destination_map_id', as: 'teleporters' });

export default Teleporter;

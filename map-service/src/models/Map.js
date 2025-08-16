import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Map = sequelize.define('Map', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    layerFileIds: { field: "layer_file_ids", type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    jsonFileId: { field: "json_file_id", type: DataTypes.INTEGER, allowNull: false },
    metadata: { type: DataTypes.JSON, defaultValue: {} },
}, {
    tableName: 'maps',
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Map;
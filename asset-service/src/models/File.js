import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const File = sequelize.define('File', {
    filename: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    scope: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.TEXT, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    dimensions: { type: DataTypes.STRING },
    frameWidth: { type: DataTypes.INTEGER, allowNull: true },
    frameHeight: { type: DataTypes.INTEGER, allowNull: true }, 
    description: { type: DataTypes.TEXT }, 
    uploaded_by: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
    tableName: 'files',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (file) => {
            file.created_at = new Date();
            file.updated_at = new Date();
        },
        beforeUpdate: (file) => {
            file.updated_at = new Date();
        }
    }
});

export default File;

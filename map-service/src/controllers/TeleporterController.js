import Teleporter from '../models/Teleporter.js';

export const createTeleporter = async (req, res) => {
    const { identifier, source_grid_id, destination_map_id, destination_position } = req.body;

    try {
        const teleporter = await Teleporter.create({
            identifier,
            source_grid_id,
            destination_map_id,
            destination_position,
        });
        res.status(201).json({ message: 'Teleporter created successfully.', teleporter });
    } catch (error) {
        res.status(500).json({ message: 'Error creating teleporter.', error: error.message });
    }
};

export const getTeleportersByGrid = async (req, res) => {
    const { grid_id } = req.params;

    try {
        const teleporters = await Teleporter.findAll({ where: { source_grid_id: grid_id } });
        res.status(200).json(teleporters);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving teleporters.', error: error.message });
    }
};

export const updateTeleporter = async (req, res) => {
    const { id } = req.params;
    const { identifier, source_grid_id, destination_map_id, destination_position } = req.body;

    try {
        const teleporter = await Teleporter.findByPk(id);
        if (!teleporter) {
            return res.status(404).json({ message: 'Teleporter not found.' });
        }

        await teleporter.update({
            identifier,
            source_grid_id,
            destination_map_id,
            destination_position,
        });
        res.status(200).json({ message: 'Teleporter updated successfully.', teleporter });
    } catch (error) {
        res.status(500).json({ message: 'Error updating teleporter.', error: error.message });
    }
};

export const deleteTeleporter = async (req, res) => {
    const { id } = req.params;

    try {
        const teleporter = await Teleporter.findByPk(id);
        if (!teleporter) {
            return res.status(404).json({ message: 'Teleporter not found.' });
        }

        await teleporter.destroy();
        res.status(200).json({ message: 'Teleporter deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting teleporter.', error: error.message });
    }
};
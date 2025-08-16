import Grid from '../models/Grid.js';

export const createGrid = async (req, res) => {
    const { data } = req.body;

    try {
        const grid = await Grid.create({ data });
        res.status(201).json({ message: 'Grid created successfully.', grid });
    } catch (error) {
        res.status(500).json({ message: 'Error creating grid.', error: error.message });
    }
};

export const getGrid = async (req, res) => {
    try {
        const grid = await Grid.findOne();
        if (!grid) {
            return res.status(404).json({ message: 'Grid not found.' });
        }
        res.json(grid);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grid.', error: error.message });
    }
};

export const updateGrid = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const grid = await Grid.findByPk(id);
        if (!grid) {
            return res.status(404).json({ message: 'Grid not found.' });
        }
        grid.data = data;
        await grid.save();
        res.json({ message: 'Grid updated successfully.', grid });
    } catch (error) {
        res.status(500).json({ message: 'Error updating grid.', error: error.message });
    }
};

export const deleteGrid = async (req, res) => {
    const { id } = req.params;

    try {
        const grid = await Grid.findByPk(id);
        if (!grid) {
            return res.status(404).json({ message: 'Grid not found.' });
        }
        await grid.destroy();
        res.json({ message: 'Grid deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting grid.', error: error.message });
    }
};
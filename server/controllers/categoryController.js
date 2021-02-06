const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort('description').populate('user', 'name email')
        return res.json({ ok: true, categories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const getCategoryByID = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({ok:false, err: {message: "The category doesn't exists"}})
        }
        res.json({ ok: true, category });
    } catch (err) {
        return res.status(500).json({ ok: false, err });
    }
};

const addCategory = async (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res
            .status(400)
            .json({ ok: false, err: { message: "The category's description is not provided" } });
    }

    const { _id } = req.user;

    try {
        let category = await Category.findOne({ description });
        if (category) {
            return res.status(409).json({ ok: false, err: { message: 'That category already exists' } });
        }

        category = new Category({ description, user: _id });
        
        await category.save();
        res.json({ ok: true, category });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { description } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { description },
            { new: true, runValidators: true }
        );
        res.json({ ok: true, category });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        await Category.findByIdAndDelete(id);
        res.json({ ok: true, message: 'Successfully deleted' });
    } catch (err) {
        res.status(500).json({ ok: false, err });
    }
};

module.exports = {
    getCategories,
    getCategoryByID,
    addCategory,
    updateCategory,
    deleteCategory,
};

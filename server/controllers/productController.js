const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    //all products populating user and category
    //paginated
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    try {
        const products = await Product.find({ available: true })
            .skip(from)
            .limit(limit)
            .populate('user', 'name email')
            .populate('category', 'description');
        res.json({ ok: true, products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const getProductByID = async (req, res) => {
    //populate user and category
    const id = req.params.id;
    try {
        const product = await Product.findById(id)
            .populate('user', 'name email')
            .populate('category', 'description');

        if (!product) {
            return res.status(404).json({ ok: false, err: { message: "The product doesn't exists" } });
        }

        res.json({ ok: true, product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const createProduct = async (req, res) => {
    //category, user
    const { _id } = req.user;
    const { name, price, description, category, available } = req.body;

    try {
        const product = new Product({
            name,
            price: Number(price),
            description,
            category,
            available: available,
            user: _id,
        });
        await product.save();
        res.status(201).json({ ok: true, product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, price, description, category, available } = req.body;
    const updatedProduct = { name, price: Number(price) || undefined, description, category, available };

    try {
        const product = await Product.findByIdAndUpdate(id, updatedProduct, {
            new: true,
            omitUndefined: true,
        });
        if (!product) {
            return res.status(404).json({ ok: false, err: { message: "The product doesn't exists" } });
        }
        res.json({ ok: true, product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

const deleteProduct = async (req, res) => {
    //just change the available field (to false)
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(id, { available: false }, { new: true });
        if (!product) {
            console.log(product);
            console.log('no product');
            return res.status(404).json({ ok: false, err: { message: "The product doesn't exists" } });
        }
        res.json({ ok: true, message: 'The product is no more available', product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: true, err });
    }
};

const searchProducts = async (req, res) => {
    const search = req.params.search;
    if (!search) {
        return res.status(400).json({ ok: false, err: { message: "You haven't provide a search term" } });
    }
    const regex = new RegExp(search, 'i')
    try {
        const products = await Product.find({ name: regex }).populate('category', 'description');
        res.json({ ok: true, products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
};

module.exports = {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
};

const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const upload = (req, res) => {
    if (!req.files) {
        return res.status(400).json({ ok: false, err: { message: 'There is no files' } });
    }

    const { type, id } = req.params; //type: is an user or a product image, and the project/user's id
    const validTypes = ['user', 'product'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: `The allowed types are ${validTypes.join(', ')}. You send ${type}` },
        });
    }

    const file = req.files.file;
    const filenameSplitted = file.name.split('.');
    const extension = filenameSplitted[filenameSplitted.length - 1];
    const allowedExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowedExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `The allowed extensions are ${allowedExtensions.join(
                    ', '
                )}. You send a '${extension}' file.`,
            },
        });
    }

    const newFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}s/${newFileName}`, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        //here the image is uploaded successfully
        if (type === 'user') {
            updateUserImage(id, res, newFileName);
        } else {
            updateProductImage(id, res, newFileName);
        }
    });
};

const updateUserImage = async (id, res, filename) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            deleteFile(filename, 'users');
            return res.status(404).json({ ok: false, err: { message: "the user doesn't esxists" } });
        }

        deleteFile(user.img, 'users');

        user.img = filename;
        await user.save();
        res.json({ ok: true, user, img: filename });
    } catch (err) {
        deleteFile(filename, 'users');
        return res.status(500).json({ ok: false, err });
    }
};

const updateProductImage = async (id, res, filename) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            deleteFile(filename, 'products');
            return res.status(404).json({ ok: false, err: { message: "The product doesn't exists" } });
        }

        if (product.img) {
            deleteFile(product.img, 'products');
        }

        product.img = filename;
        await product.save();
        res.json({ ok: true, product, img: filename });
    } catch (err) {
        console.log(err);
        deleteFile(filename, 'products');
        return res.status(500).json({ ok: false, err });
    }
};

const deleteFile = (filename, type) => {
    const imagePath = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

module.exports = {
    upload,
};

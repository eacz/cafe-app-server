const fs = require('fs');
const path = require('path');

const getImage = (req, res) => {
    const { type, img } = req.params;

    const imgPath = path.resolve(__dirname, `../../uploads/${type}s/${img}`);
    const noImagePath = path.resolve(__dirname, '../assets/default.png');

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.sendFile(noImagePath);
    }
};

module.exports = { getImage };

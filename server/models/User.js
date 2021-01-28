const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} is an invalid role',
};

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles,
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userOBJ = user.toObject();
    delete userOBJ.password;

    return userOBJ;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} should be unique' });

module.exports = mongoose.model('User', userSchema);

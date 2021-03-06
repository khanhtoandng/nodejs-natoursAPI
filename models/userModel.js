const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name!']
    },
    email:{
        type: String,
        require: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo:{
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guide'],
        default: 'user'
    },
    password:{
        type: String,
        require: [true, 'Please provide a password!'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please provide a password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Password are not the same!"
        }
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save',  function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;

    next();
});

userSchema.pre('/^find/', function(next) {
    this.find({ active: true });
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(this.passwordChangeAt.getTimestamp / 10, 10);

        return JWTTimestamp < changedTimestamp;
    };

    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
}



const User = mongoose.model('User', userSchema);

module.exports = User;
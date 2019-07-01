const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    UserName: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
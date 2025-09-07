const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    links: { type: String }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    education: { type: String},
    skills: [{ type: String }],
    projects: [projectSchema],
    work: [{ type: String }],
    links: [{ type: String }],
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

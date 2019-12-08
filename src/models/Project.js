/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
    serviceid: String,
    repoid: String,
}, { timestamps: true });

mongoose.model('Project', projectSchema);

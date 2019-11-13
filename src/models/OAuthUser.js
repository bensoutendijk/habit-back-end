import mongoose, { Schema } from 'mongoose';

const oauthUserSchema = new Schema({
    user: {
        username: {
            type: String,
            required: true,
        },
        userid: {
            type: Number,
            required: true,
        },
    },
    tokens: {
        accessToken: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        expiresAt: {
            type: Number,
            required: true,
        },
    },
    provider: String,
}, { timestamps: true });

mongoose.model('OAuthUser', oauthUserSchema);

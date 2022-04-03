import mongoose from "mongoose";

const Schema = mongoose.Schema;

const parkLocationSchema = new Schema({
    park_name: {
        type: String,
        required: true
    },
    number_of_park_spots: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    park_spaces: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParkSpace'
        }
    ],
    country: {
        type: String,
        required: true
    },
    post_code: {
        type: String
    }
})

export const ParkLocation = mongoose.model('parkLocation', parkLocationSchema);

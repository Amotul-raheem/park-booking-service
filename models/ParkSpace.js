import mongoose from "mongoose";

const Schema = mongoose.Schema;

const parkSpaceSchema = new Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkLocation'
    },
    space_name: {
        type: String,
        required: true
    }
})

export const ParkSpace = mongoose.model('parkSpace', parkSpaceSchema);

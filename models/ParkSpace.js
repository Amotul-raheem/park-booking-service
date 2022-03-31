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
    },
    //todo remove as we need to know when a spot is available in future dates other than a point in time
    // some changes will need to be made in the script project.
    space_available: {
        type: Boolean,
        required: true
    }
})

export const ParkSpace = mongoose.model('parkSpace', parkSpaceSchema);

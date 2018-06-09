"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const UserSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.set('versionKey', false);


// Define the sport place schema
const SportPlaceSchema  = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
    },
    coordinates: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    activities: {
        type: [String]
    }
});

SportPlaceSchema.set('versionKey', false);
SportPlaceSchema.set('timestamps', true);


// Define the event schema
const EventSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    activity: {
        type: String,
        required: true
    },
    sportPlace: {
        type: Schema.Types.ObjectId,
        ref: 'SportPlace',
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

EventSchema.set('versionKey', false);
EventSchema.set('timestamps', true);







// Define the movie schema
const MovieSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    synopsis: String,
    runtime: Number,
    mpaa_rating: String,
    year: {
        type: Number,
        required: true
    },
    posters: {
            thumbnail: String,
            profile: String,
            detailed: String,
            original: String
        }
});

MovieSchema.set('versionKey', false);
MovieSchema.set('timestamps', true);





// Export the models
module.exports.User = mongoose.model('User', UserSchema);
module.exports.SportPlace = mongoose.model('SportPlace', SportPlaceSchema);
module.exports.Event = mongoose.model('Event', EventSchema);


module.exports.Movie = mongoose.model('Movie', MovieSchema);
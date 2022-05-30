const { Schema, model } = require('mongoose');

// create user schema 
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address!'],
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            // reference to Thought model
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            // reference to self
            ref: 'User'
        }
    ]
},
{
    toJSON: {
        // allow schema to use virtuals
        virtuals: true
    },
    id: false
});

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// create User model using userSchema
const User = model('User', userSchema);

module.exports = User;
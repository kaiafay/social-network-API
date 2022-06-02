const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getThoughts(req, res) {
        Thought.find({})
          .select('-__v')
          .sort({ createdAt: -1 })
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.status(500).json(err));
    },
};

module.exports = thoughtController;
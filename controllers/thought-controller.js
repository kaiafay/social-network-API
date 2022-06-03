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

    // get single thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
          .select('-__v')
          .then(dbThoughtData => {
              if(!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this ID.' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(500).json(err));
    },

    // create a thought
    createThought(req, res) {
        Thought.create(req.body)
          .then(dbThoughtData => {
              return User.findOneAndUpdate(
                  { _id: req.body.userId },
                  { $push: { thoughts: dbThoughtData._id }},
                  { new: true }
              );
          })
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'Thought created but no user found with this ID.' });
                  return;
              }
              res.json({ message: 'Thought created.' });
          })
          .catch(err => res.status(400).json(err));
    },

    // update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true})
          .then(dbThoughtData => {
              if(!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this ID.' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(500).json(err));
    },

    // delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndRemove({ _id: params.thoughtId })
          .then(dbThoughtData => {
              if(!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this ID.' });
                  return;
              }

            //   remove thought from user
            return User.findOneAndUpdate({ thoughts: params.thoughtId }, { $pull: { thoughts: params.thoughtId }}, { new: true });
          })
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'Thought deleted but no user found with this ID.'});
                  return;
              }
              res.json({ message: 'Thought deleted.' });
          })
          .catch(err => res.status(500).json(err));
    },

    // add a reaction to a thought
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $addToSet: { reactions: body }}, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this ID.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    // remove reaction from a thought
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId }}}, { new: true, runValidators: true})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this ID.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports = thoughtController;
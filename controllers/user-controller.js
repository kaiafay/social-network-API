const { User, Thought } = require('../models');

const userController = {
    // get all users
    getUsers(req, res) {
        User.find({})
          .select('-__v')
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(500).json(err));
    }
};
const { User, Thought } = require('../models');

const userController = {
    // get all users
    getUsers(req, res) {
        User.find({})
          .select('-__v')
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(500).json(err));
    },

    // get single user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
          .populate({
              path: 'friends',
              select: '-__v'
          })
          .populate({
              path: 'thoughts',
              select: '-__v'
          })
          .select('-__v')
          .then(dbUserData => {
            //   if no user found, send error
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID.' }); 
                return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    }
};
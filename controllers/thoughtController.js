const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID! '});
      }
      
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      
      await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: thought._id }}
      );

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: { thoughtText: req.body.thoughtText} }, // ensures only thought text is being changed
        { runValidators: true, new: true },
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID! '});
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {

      const thought = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId },
      );

      await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: req.params.thoughtId } },
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID! '});
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res,) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true },
      );
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true },
      );
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
}
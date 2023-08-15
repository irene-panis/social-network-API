const { Schema, model } = require('mongoose');

const reactionSchema = Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: new Schema.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const thoughtSchema = Schema({
  thoughtText: {
    type: String,
    required: true, 
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema]
});

thoughtSchema
  .virtual('reactionCount')
  .get(function() {
    return this.reactions.length;
  });

thoughtSchema
  .virtual('formatThoughtDate')
  .get(function() {
    return this.createdAt.toLocaleString();
  });

reactionSchema
  .virtual('formatReactionDate')
  .get(function() {
    return this.createdAt.toLocaleString();
  });

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
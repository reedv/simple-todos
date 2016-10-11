/**
 * Created by reedvilanueva on 10/10/16.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/* The special thing about collections in Meteor is that they can be accessed from
 both the server and the client, making it easy to write view logic without having
 to write a lot of server code. They also update themselves automatically */
export const Tasks = new Mongo.Collection('tasks');


if (Meteor.isServer) {
  // This code only runs on the server

  // Once we '$meteor remove autopublish', we need to specify what the server sends to the client
  //   (good for retaining privacy-sensitive data in a collection)
  Meteor.publish('tasks', function tasksPublication() {
    // Only publish tasks that are public or belong to the current user
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

// After '$meteor remove insecure', all client-side database permissions have been revoked.
//   Now we need to rewrite some parts of our app to use methods.
Meteor.methods({
  //  Methods should be defined in code that is executed on the client AND the server

  'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // We can assign any properties to the task object, such as the time created,
    //   since we don't ever have to define a schema for the collection.
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.private && (task.owner !== this.userId)) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    // The remove function takes one argument, a selector that determines which
    //   item to remove from the collection.
    Tasks.remove(taskId);
    // 'this' is bound to the monoDB obj. in the single task template (represented in 'task.html')
  },

  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { checked: setChecked } });
    // The update function on a collection takes two arguments. The first is a
    //   selector that identifies a subset of the collection, and the second is
    //   an update parameter that specifies what should be done to the matched objects.
  },

  // method to set current 'task' template instance to private
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },

});

/*
 So why do we want to define our methods on the client and on the server? We do this
 to enable a feature we call optimistic UI.

 When you call a method on the client using Meteor.call, two things happen in parallel:

 1. The client sends a request to the server to run the method in a secure environment,
    just like an AJAX request would work.
 2. A simulation of the method runs directly on the client to attempt to predict the
    outcome of the server call using the available information

 What this means is that a newly created task actually appears on the screen before the
 result comes back from the server. */


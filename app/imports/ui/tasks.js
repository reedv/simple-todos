/**
 * Created by reedvilanueva on 10/10/16.
 */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import './task.html';


Template.task.helpers({
  isOwner() {
    // check that the current 'task' template instance owner matches the userId trying to access it
    return this.owner === Meteor.userId();
  },
});


Template.task.events({
  // for a 'task' template 'click' event listener, with this CSS selector, is registered,
  //   toggle the checked property.
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },

  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },

  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});



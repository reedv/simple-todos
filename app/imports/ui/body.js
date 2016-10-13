/**
 * Created by reedvilanueva on 10/10/16.
 */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';  // A ReactiveDict is like a normal JS object with keys and values, but with built-in reactivity.
import { Tasks } from '../api/tasks.js';
import './tasks.js';
import './body.html'


Template.body.onCreated(function bodyOnCreated() {
  // ReactiveDict is the like a collection, but is not synced with the server like collections are.
  //   This makes a ReactiveDict a convenient place to store temporary UI state like the checkbox above.
  this.state = new ReactiveDict();

  // explicity subscribe to the 'tasks' collection (see app/imports/api/tasks.js)
  Meteor.subscribe('tasks')
});


/* The body section can be referenced in your JavaScript with Template.body.
Think of it as a special "parent" template, that can include the other child templates.*/
/* You can pass data into templates from your JavaScript code by defining helpers. */
Template.body.helpers({
  tasks() {
    const instance = Template.instance();

    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // else return all tasks by the largest (most recent) createdAt date
    return Tasks.find({}, { sort: { createdAt: -1} });  // find returns cursor to place in collection
  },

  incompleteCount() {
    // count all the checked tasks in the Tasks collection
    return Tasks.find({ checked: { $ne: true } }).count();
  },

});

Template.body.events({
  // For event listeners, the keys describe the event to listen for, and the
  //   values are the matching CSS selector event handlers that are called when the event happens.
  'submit .new-task'(event) {
    // The event handler gets an argument called event that has some information
    //   about the event that was triggered. In this case event.target is our form element,
    //   and we can get the value of our input with event.target.text.value.

    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const priority = target.priority.value;

    // Insert a task obj. into the 'tasks' collection
    Meteor.call('tasks.insert', text, priority);

    // Clear form for next input
    target.text.value = '';
  },

  // event handler to update the ReactiveDict variable when checkboxes checked/unchecked
  'change .hide-completed input'(event, instance) {
    // event handler takes two arguments, the second of which is the same template
    //   instance which was this in the Template.body.onCreated() callback
    instance.state.set('hideCompleted', event.target.checked);
  },

});

/**
 * Created by reedvilanueva on 10/10/16.
 */

import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import './tasks.js';
import './body.html'

/* The body section can be referenced in your JavaScript with Template.body.
Think of it as a special "parent" template, that can include the other child templates.*/
/* You can pass data into templates from your JavaScript code by defining helpers. */
Template.body.helpers({
  tasks() {
    // return all tasks by the largest (most recent) createdAt date
    return Tasks.find({}, { sort: { createdAt: -1} });  // find returns cursor to place in collection
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

    // Insert a task obj. into the 'tasks' collection
    Tasks.insert({
      // We can assign any properties to the task object, such as the time created,
      //   since we don't ever have to define a schema for the collection.
      text,
      createdAt: new Date(), // current time
    });

    // Clear form for next input
    target.text.value = '';
  },

});

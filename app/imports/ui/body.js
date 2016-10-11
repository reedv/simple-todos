/**
 * Created by reedvilanueva on 10/10/16.
 */

import { Template } from 'meteor/templating';
import './body.html'

/* The body section can be referenced in your JavaScript with Template.body.
Think of it as a special "parent" template, that can include the other child templates.*/
Template.body.helpers({

  /* You can pass data into templates from your JavaScript code by defining helpers.
  In the code below, we defined a helper called tasks on Template.body that returns an array.
  Inside the body tag of the HTML, we can use {{#each tasks}} to iterate over the array and
  insert a task template for each value. Inside the #each block, we can display the text property
  of each array item using {{text}}. */
  tasks: [
    { text: 'This is task 1' },
    { text: 'This is task 2' },
    { text: 'This is task 3' },
  ]
});

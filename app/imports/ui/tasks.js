/**
 * Created by reedvilanueva on 10/10/16.
 */

import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import './task.html';



Template.task.events({
  // for a 'task' template 'click' event listener, with this CSS selector, is registered,
  //   toggle the checked property.
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this._id, {
      $set: { checked: ! this.checked },
    });
    // The update function on a collection takes two arguments. The first is a
    //   selector that identifies a subset of the collection, and the second is
    //   an update parameter that specifies what should be done to the matched objects.
  },

  'click .delete'() {
    // The remove function takes one argument, a selector that determines which
    //   item to remove from the collection.
    Tasks.remove(this._id);
    // 'this' is bound to the monoDB obj. in the single task template (represented in 'task.html')
  },

});



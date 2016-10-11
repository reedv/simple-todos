/**
 * Created by reedvilanueva on 10/10/16.
 */


import { Mongo } from 'meteor/mongo';

/* The special thing about collections in Meteor is that they can be accessed from
 both the server and the client, making it easy to write view logic without having
 to write a lot of server code. They also update themselves automatically */
export const Tasks = new Mongo.Collection('tasks');



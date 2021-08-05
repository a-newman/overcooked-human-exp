// Persistent network connection that will be used to transmit real-time data
var socket = io();

// global variable to save data from game
var gameData;

// placeholder for a callback that can be added by other scripts
var onEndGame = false;
// class that handles what subtask we are on
const taskController = new TaskController(socket);

/* * * * * * * * * * * * * * * *
 * Setup functions *
 * * * * * * * * * * * * * * * */

$(function () {
  // this must happen AFTER the DOM is rendered!
  taskController.reset();
});

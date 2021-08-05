// Persistent network connection that will be used to transmit real-time data
var socket = io();

// global variable to save data from game
var gameData;

// placeholder for a callback that can be added by other scripts
var onEndGame = false;
// class that handles what subtask we are on
const taskController = new TaskController(socket);

/* * * * * * * * * * * * * * * *
 * Button click event handlers *
 * * * * * * * * * * * * * * * */

$(function () {
  // this must happen AFTER the DOM is rendered!
  taskController.reset();
});

$(function () {
  $("#create").click(function () {
    params = arrToJSON($("#game-params-form").serializeArray());
    console.log("params", params);
    params.layouts = [params.layout];
    data = {
      params: params,
      game_name: "overcooked_recorder",
      create_if_not_found: false,
    };
    socket.emit("create", data);
    $("#waiting").show();
    $("#join").hide();
    $("#join").attr("disabled", true);
    $("#create").hide();
    $("#create").attr("disabled", true);
    $("#instructions").hide();
    $("#tutorial").hide();
  });
});

$(function () {
  $("#join").click(function () {
    socket.emit("join", {});
    $("#join").attr("disabled", true);
    $("#create").attr("disabled", true);
  });
});

$(function () {
  $("#leave").click(function () {
    socket.emit("leave", {});
    $("#leave").attr("disabled", true);
  });
});

/* * * * * * * * * * * * *
 * Socket event handlers *
 * * * * * * * * * * * * */

window.intervalID = -1;
window.spectating = true;

/* * * * * * * * * * * * * *
 * Game Key Event Listener *
 * * * * * * * * * * * * * */

function enable_key_listener() {
  $(document).on("keydown", function (e) {
    let action = "STAY";
    switch (e.which) {
      case 37: // left
        action = "LEFT";
        break;

      case 38: // up
        action = "UP";
        break;

      case 39: // right
        action = "RIGHT";
        break;

      case 40: // down
        action = "DOWN";
        break;

      case 32: //space
        action = "SPACE";
        break;

      default:
        // exit this handler for other keys
        return;
    }
    e.preventDefault();
    socket.emit("action", { action: action });
  });
}

function disable_key_listener() {
  $(document).off("keydown");
}

/* * * * * * * * * * *
 * Utility Functions *
 * * * * * * * * * * */

var arrToJSON = function (arr) {
  let retval = {};
  for (let i = 0; i < arr.length; i++) {
    elem = arr[i];
    key = elem["name"];
    value = elem["value"];
    retval[key] = value;
  }
  return retval;
};

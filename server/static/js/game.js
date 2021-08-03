class Game {
  constructor(title, p1Name, p2Name, gameLength, socket, layout) {
    this.title = title;
    this.p1Name = p1Name;
    this.p2Name = p2Name;
    this.gameLength = gameLength;
    this.socket = socket;
    this.layout = layout;
  }

  load() {
    // set the game title
    $("#game-title").text(this.title);

    // make the correct params visible in the UI
    $("#player-1-name").text(this.p1Name);
    $("#player-2-name").text(this.p2Name);
    $("#game-duration").text(this.gameLength);

    // clear the game visuals
    $("#overcooked").empty();
    $("#game-over").hide();
    $("#lobby").hide();
    $("#waiting").hide();
    $("#error-exit").hide();

    // show the create button
    $("#create").show();
    $("#create").attr("disabled", false);

    // set the correct callback on the "create" button
    $("#create").off("click").click(this.start.bind(this));

    // turn off next button until game is over
    $("#next").hide();
    $("#next").attr("disabled", true);

    // show game
    $("#game").show();

    // set the correct socket callbacks
    this.socket.off();
    this.socket.on("waiting", this.wait.bind(this));
    this.socket.on("creation_failed", this.creationFailed.bind(this));
    this.socket.on("start_game", this.startGame);
    this.socket.on("reset_game", this.resetGame.bind(this));
    this.socket.on("state_pong", this.statePong.bind(this));
    this.socket.on("end_game", this.endGame.bind(this));
    this.socket.on("end_lobby", this.endLobby.bind(this));
  }

  start() {
    const params = {
      playerZero: this.p1Name,
      playerOne: this.p2Name,
      layout: this.layout,
      gameTime: this.gameLength,
    };
    console.log("params", params);
    const data = {
      params: params,
      game_name: "overcooked_recorder",
      create_if_not_found: false,
    };
    this.socket.emit("create", data);

    // show relevant buttons
    $("#waiting").show();
    $("#create").hide();
    $("#create").attr("disabled", true);
  }

  wait(data) {
    // Show game lobby
    $("#error-exit").hide();
    $("#waiting").hide();
    $("#game-over").hide();
    $("#overcooked").empty();
    $("#lobby").show();
    $("#create").hide();
    $("#create").attr("disabled", true);
    if (!data.in_game) {
      // Begin pinging to join if not currently in a game
      if (window.intervalID === -1) {
        window.intervalID = setInterval(function () {
          socket.emit("join", {});
        }, 1000);
      }
    }
  }

  creationFailed(data) {
    // Tell user what went wrong
    let err = data["error"];
    $("#overcooked").empty();
    $("#lobby").hide();
    $("#waiting").hide();
    $("#create").show();
    $("#create").attr("disabled", false);
    $("#overcooked").append(
      `<h4>Sorry, game creation code failed with error: ${JSON.stringify(
        err
      )}</>`
    );
  }

  startGame(data) {
    // Hide game-over and lobby, show game title header
    if (window.intervalID !== -1) {
      clearInterval(window.intervalID);
      window.intervalID = -1;
    }
    const graphics_config = {
      container_id: "overcooked",
      start_info: data.start_info,
    };
    window.spectating = data.spectating;
    $("#error-exit").hide();
    $("#overcooked").empty();
    $("#game-over").hide();
    $("#lobby").hide();
    $("#waiting").hide();
    $("#create").hide();
    $("#create").attr("disabled", true);
    $("#game-title").show();

    if (!window.spectating) {
      enable_key_listener();
    }

    graphics_start(graphics_config);
  }

  resetGame(data) {
    graphics_end();
    if (!window.spectating) {
      disable_key_listener();
    }

    $("#overcooked").empty();
    $("#reset-game").show();
    setTimeout(function () {
      $("reset-game").hide();
      const graphics_config = {
        container_id: "overcooked",
        start_info: data.state,
      };
      if (!window.spectating) {
        enable_key_listener();
      }
      graphics_start(graphics_config);
    }, data.timeout);
  }

  statePong(data) {
    // Draw state update
    drawState(data["state"]);
  }

  endGame(data) {
    // Hide game data and display game-over html
    graphics_end();
    if (!window.spectating) {
      disable_key_listener();
    }
    $("#game-title").hide();
    $("#game-over").show();

    // Game ended unexpectedly
    if (data.status === "inactive") {
      $("#error-exit").show();
    }

    $("#next").show();
    $("#next").attr("disabled", false);

    // Save the game data globally so that it can be referenced
    // after game end
    // TODO: does this still work?
    gameData = data;
  }

  endLobby() {
    // Hide lobby
    $("#lobby").hide();
    $("#join").show();
    $("#join").attr("disabled", false);
    $("#create").show();
    $("#create").attr("disabled", false);
    $("#leave").hide();
    $("#leave").attr("disabled", true);

    // Stop trying to join
    clearInterval(window.intervalID);
    window.intervalID = -1;
  }
}

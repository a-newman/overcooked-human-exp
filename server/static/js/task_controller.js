CONFIG_PATH = "static/configs/";
DEFAULT_CONFIG = CONFIG_PATH + "default.json";

class TaskController {
  constructor(socket, configFile) {
    if (!configFile) {
      configFile = DEFAULT_CONFIG;
    }
    this.configFile = configFile;
    console.log("loading data from", this.configFile);
    this.socket = socket;
    this.isLoaded = false;

    // load a config file
    $.getJSON(this.configFile)
      .done(
        function (config) {
          this.taskProgression =
            this.constructTaskProgressionFromConfig(config);
          console.log("taskProgression", this.taskProgression);
          this.isLoaded = true;
          this.reset();
        }.bind(this)
      )
      .fail(function (jqxhr, textStatus, error) {
        const errMessage = textStatus + ", " + error;
        console.log("Error loading experiment config file: ", errMessage);
      });
  }

  constructTaskProgressionFromConfig(config) {
    const taskProgression = [];
    taskProgression.push(new InstructionsSubtask());
    taskProgression.push(new DemoQuestionsSubtask());
    taskProgression.push(new TutorialSubtask());
    config.games.forEach((playerNames, iPartner) => {
      // push some game subtasks
      for (var iGame = 0; iGame < config.nGamesPerPartner; iGame++) {
        var title = `Partner ${iPartner + 1}, Game ${iGame + 1}`;
        taskProgression.push(
          new GameSubtask({
            title: title,
            p1Name: playerNames[0],
            p2Name: playerNames[1],
            gameLength: config.nSecondsPerGame,
            layout: config.layout,
            socket: this.socket,
          })
        );
      }
      // push a question subtask
      taskProgression.push(new PartnerQuestionsSubtask());
    });
    taskProgression.push(new SubmitSubtask());
    return taskProgression;
  }

  reset() {
    if (!this.isLoaded) {
      return;
    }
    console.log("resetting");

    // hide subtasks
    $(".subtask").hide();

    // prep next button
    $("#next").click(
      function () {
        console.log("clicking next");
        this.advance();
      }.bind(this)
    );

    this.curSubTask = -1;
    this.advance();
  }

  advance() {
    this.curSubTask++;
    console.log("advancing", this.curSubTask, "/", this.taskProgression.length);

    if (this.curSubTask >= this.taskProgression.length - 1) {
      $("#next").hide();
      $("#next").attr("disabled", true);
    }
    $(".subtask").hide();
    const curSubTask = this.taskProgression[this.curSubTask];
    console.log("curSubTask", curSubTask);

    curSubTask.load();
  }
}

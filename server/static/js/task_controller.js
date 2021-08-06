CONFIG_PATH = "static/configs/";
DEFAULT_CONFIG = "default.json";

class TaskController {
  constructor(socket) {
    const urlParams = new URLSearchParams(window.location.search);
    this.configFile = urlParams.get("config");
    if (!this.configFile) {
      this.configFile = DEFAULT_CONFIG;
    }

    const configPath = CONFIG_PATH + this.configFile;
    console.log("loading data from", configPath);
    this.socket = socket;
    this.isLoaded = false;

    // load a config file
    $.getJSON(configPath)
      .done(
        function (config) {
          // set taskProgression
          this.taskProgression =
            this.constructTaskProgressionFromConfig(config);
          console.log("taskProgression", this.taskProgression);
          // initialize data
          this.data = new Array(this.taskProgression.length).fill({});
          this.isLoaded = true;
          this.reset();
        }.bind(this)
      )
      .fail(
        function (jqxhr, textStatus, error) {
          const errMessage = `Could not load config file ${this.configFile}, failed with error: ${error}`;
          $(".subtask").hide();
          $("#error-message").text(errMessage);
          $("#error-message").show();
        }.bind(this)
      );
  }

  constructTaskProgressionFromConfig(config) {
    const taskProgression = [];
    taskProgression.push(new OverviewSubtask(config.games.length));
    taskProgression.push(new DemoQuestionsSubtask());
    taskProgression.push(new InstructionsSubtask());
    const tutorialGame = new GameSubtask({
      title: "Tutorial",
      p1Name: "human",
      p2Name: "None",
      gameLength: config.nSecondsPerTutorial,
      layout: "simple",
      socket: this.socket,
    });
    taskProgression.push(new TutorialSubtask(tutorialGame));
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

    // hide subtasks
    $(".subtask").hide();

    // hide errors
    $("#error-messsage").hide();

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
    $("#error-message").hide();

    if (this.curSubTask >= 0) {
      const oldTask = this.taskProgression[this.curSubTask];
      const { data, error } = oldTask.getData();
      if (error) {
        $("#error-message").text(error);
        $("#error-message").show();
        return;
      } else if (data) {
        this.data[this.curSubTask] = data;
      }
    }
    console.log("this.data", this.data);

    // proceed with advancing
    this.curSubTask++;
    console.log("advancing", this.curSubTask, "/", this.taskProgression.length);

    if (this.curSubTask >= this.taskProgression.length - 1) {
      $("#next").hide();
      $("#next").attr("disabled", true);
    }
    $(".subtask").hide();
    const curSubTask = this.taskProgression[this.curSubTask];

    curSubTask.load();
  }
}

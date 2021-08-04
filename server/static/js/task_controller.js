class TaskController {
  constructor(socket) {
    this.socket = socket;
    this.data = {
      layout: "simple",
      gameLength: 3,
    };
    this.config = {
      games: [
        ["human", "sac_self_play_simple_0"],
        ["human", "sac_self_play_simple_1"],
      ],
      nGamesPerPartner: 1,
      nSecondsPerGame: 3,
      layout: "simple",
    };
    this.taskProgression = this.constructTaskProgressionFromConfig(this.config);
    console.log("taskProgression", this.taskProgression);
    this.curSubTask = 0;

    $(".subtask").hide();
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
    console.log("resetting");
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

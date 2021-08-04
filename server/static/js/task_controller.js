class TaskController {
  constructor(socket) {
    this.socket = socket;
    this.data = {
      layout: "simple",
      gameLength: 3,
    };
    this.taskProgression = [
      new InstructionsSubtask(),
      new DemoQuestionsSubtask(),
      new TutorialSubtask(),
      new GameSubtask({
        title: "Game 1",
        p1Name: "human",
        p2Name: "sac_self_play_simple_0",
        gameLength: this.data.gameLength,
        socket: this.socket,
        layout: this.data.layout,
      }),
      new PartnerQuestionsSubtask(),
      new GameSubtask({
        title: "Game 2",
        p1Name: "human",
        p2Name: "sac_self_play_simple_1",
        gameLength: this.data.gameLength,
        socket: this.socket,
        layout: this.data.layout,
      }),
      new PartnerQuestionsSubtask(),
      new SubmitSubtask(),
    ];

    this.curSubTask = 0;

    $(".subtask").hide();
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

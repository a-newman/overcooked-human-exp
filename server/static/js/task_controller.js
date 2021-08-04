class TaskController {
  constructor(socket) {
    this.socket = socket;
    this.data = {
      layout: "simple",
      gameLength: 3,
    };
    this.taskProgression = [
      "instructions",
      "demoQuestions",
      "tutorial",
      "game1",
      "questions1",
      "game2",
      "questions2",
      "submit",
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
    console.log("advancing", this.curSubTask);
    $(".subtask").hide();
    const newSubTask = this.taskProgression[this.curSubTask];
    console.log("newSubTask", newSubTask);

    switch (newSubTask) {
      case "instructions":
        $("#instructions").show();
        break;
      case "demoQuestions":
        $("#demoQuestions").show();
        break;
      case "tutorial":
        $("#tutorial").show();
        break;
      case "game1":
        var title = "Game 1";
        var p1Name = "human";
        var p2Name = "sac_self_play_simple_0";
        let game1 = new Game(
          title,
          p1Name,
          p2Name,
          this.data.gameLength,
          this.socket,
          this.data.layout
        );

        game1.load();

        break;
      case "questions1":
        $("#partnerQuestions").show();
        break;
      case "game2":
        title = "Game 2";
        p1Name = "human";
        p2Name = "sac_self_play_simple_1";
        let game2 = new Game(
          title,
          p1Name,
          p2Name,
          this.data.gameLength,
          this.socket,
          this.data.layout
        );

        game2.load();

        break;
      case "questions2":
        $("#partnerQuestions").show();
        break;
      case "selectPartner":
        $("#selectPartner").show();
        break;
      case "finalGame":
        $("#game").show();
        break;
      case "submit":
        $("#submit").show();
        break;
    }
  }
}

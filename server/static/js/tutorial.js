class TutorialSubtask {
  constructor(gameSubtask) {
    this.gameSubtask = gameSubtask;
  }

  load() {
    // show tutorial instructions
    $("#tutorial").show();
    this.gameSubtask.load();
  }

  getData() {
    return this.gameSubtask.getData();
  }
}

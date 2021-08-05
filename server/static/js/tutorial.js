class TutorialSubtask {
  load() {
    // show instructions
    $("#tutorial").show();
  }

  getData() {
    // TODO: get and valdiate real data
    const data = { placeholder: "game data for tutorial" };
    return { data };
  }
}

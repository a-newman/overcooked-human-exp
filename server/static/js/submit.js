class SubmitSubtask {
  load() {
    $("#submit").show();
  }

  getData() {
    // TODO: get and valdiate real data
    const data = { placeholder: "game data for submit" };
    return { data };
  }
}

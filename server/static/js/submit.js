class SubmitSubtask {
  load() {
    $("#submit").show();
  }

  getData() {
    // TODO: get and valdiate real data
    // const data = { placeholder: "game data for submit" };
    const data = {
      feedbackLength: $("#feedback-length").val(),
      feedbackBugs: $("#feedback-bugs").val(),
      feedbackAdditional: $("#feedback-additional").val(),
    }
    return { data };
  }
}


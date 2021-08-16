class SubmitSubtask {
  load() {
    $("#submit").show();
  }

  getData() {

    const data = {
      feedbackLength: $("#feedback-length").val(),
      feedbackBugs: $("#feedback-bugs").val(),
      feedbackAdditional: $("#feedback-additional").val(),
    }
    return { data };
  }
}


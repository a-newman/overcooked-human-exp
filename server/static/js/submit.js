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


$(function() {
  $('#submit-button').click(function () {

    const params = new URLSearchParams(window.location.search)

    const hitId = params.get("hitId")
    const workerId = params.get("workerId")
    const assignmentId = params.get("assignmentId")
    const submitUrl = params.get("turkSubmitTo") + '/mturk/externalSubmit'

    
    var form = $("#submit-form");
    // addHiddenField(form, "hitId", hitId);
    // addHiddenField(form, "workerId", workerId);
    // addHiddenField(form, "assignmentId", assignmentId);


    var results = {
      data: this.data,
    };


    console.log(results);

    // addHiddenField(form, "results", JSON.stringify(results));

    // $("#submit-form").attr("action", submitUrl);
    // $("#submit-form").attr("method", "POST");
    // $("#submit-form").submit();
  });
});

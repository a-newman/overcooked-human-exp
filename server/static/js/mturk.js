function parseURLQuery() {
    const params = new URLSearchParams(window.location.search)

    mturkConfig.assignmentId = params.get('assignmentId');
};

function addHiddenField(form, name, value) {
    // form is a jQuery object, name and value are strings
    var input = $("<input type='hidden' name='" + name + "' value=''>");
    input.val(value);
    form.append(input);
}

function onEndGame() {
  // hide extra buttons
  $("#instructions").hide();
  $("#create").hide();
}

$(function() {
    $('#submit').click(function () {
      const params = new URLSearchParams(window.location.search)

      const hitId = params.get("hitId")
      const workerId = params.get("workerId")
      const assignmentId = params.get("assignmentId")
      const submitUrl = params.get("turkSubmitTo")


      var form = $("#submit-form");
      addHiddenField(form, "hitId", hitId);
      addHiddenField(form, "workerId", workerId);
      addHiddenField(form, "assignmentId", assignmentId);


      var feedback = {
        feedback_1: $("#feedback-1").val(),
        feedback_2: $("#feedback-2").val(),
        feedback_3: $("#feedback-3").val(),
      }

      var results = {
        feedback: feedback,
        data: gameData,
      };

      addHiddenField(form, "results", JSON.stringify(results));

      $("#submit-form").attr("action", submitUrl);
      $("#submit-form").attr("method", "POST");
      $("#submit-form").submit();
    });
});

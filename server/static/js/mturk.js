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

$(function() {
    $('#submit').click(function () {
      const params = new URLSearchParams(window.location.search)

      const submitUrl = params.get("turkSubmitTo")
      const assignmentId = params.get("assignmentId")
      const workerId = params.get("workerId")
      const hitId = params.get("hitId")

      var form = $("#submit-form");
      addHiddenField(form, "assignmentId", assignmentId);
      addHiddenField(form, "workerId", workerId);
      addHiddenField(form, "hitId", hitId);

      var results = {
          data: gameData,
      };

      addHiddenField(form, "results", JSON.stringify(results));

      $("#submit-form").attr("action", submitUrl);
      $("#submit-form").attr("method", "POST");
      $("#submit-form").submit();
    });
});

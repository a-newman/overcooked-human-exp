class DemoQuestionsSubtask {
  load() {
    // show instructions
    $("#demoQuestions").show();
  }

  getData() {
    // TODO: get and validate the real data
    const data = { placeholder: "demographic data" };
    const errorMessage = "Please fill in the questions";
    return { data, error: errorMessage };
  }
}

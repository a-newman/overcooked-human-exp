class PartnerQuestionsSubtask {
  load() {
    // show instructions
    $("#partnerQuestions").show();
  }

  getData() {
    // TODO: get and valdiate real data
    const data = { placeholder: "game data for partnerquestions" };
    return { data };
  }
}

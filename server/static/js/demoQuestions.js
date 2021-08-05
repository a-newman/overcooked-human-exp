class DemoQuestionsSubtask {
  load() {
    // show instructions
    $("#demoQuestions").show();
  }

  getData() {
    // TODO: get and validate the real data

    var gender = $("input[type='radio'][name='gender']:checked").val();
    const age = $("input[type='radio'][name='age']:checked").val();

    if(gender === "SelfDescribe") {
      const genderDetails = $("#describegender").val();

      //if left empty
      if(!genderDetails) {
        var errorMessage = "Please fill in the questions";
      }

      gender = {gender: gender, selfdescribe: genderDetails }
    }

    if(!gender || !age) {
      var errorMessage = "Please fill in the questions";
    }

    const data = { 
      age: age,
      gender: gender, 
    };


    return { data, error: errorMessage };
  }
}

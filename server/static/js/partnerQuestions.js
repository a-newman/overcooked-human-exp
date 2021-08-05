class PartnerQuestionsSubtask {
  load() {
    // show instructions
    $("#partnerQuestions").show();
  }

  getData() {

    var errorMessage;

    const helpful = $("input[type='radio'][name='helpful']:checked").val();
    const competent = $("input[type='radio'][name='competent']:checked").val();
    const enjoy = $("input[type='radio'][name='enjoy']:checked").val();
    const humanlike = $("input[type='radio'][name='humanlike']:checked").val();
    const efficient = $("input[type='radio'][name='efficient']:checked").val();
    const flexible = $("input[type='radio'][name='flexible']:checked").val();
    const predictable = $("input[type='radio'][name='predictable']:checked").val();




    if(!helpful || !competent || !enjoy || !humanlike || !efficient || !flexible || !predictable) {
      errorMessage = "Please answer all of the questions";
    } else { //clear selections
      $('input[name=helpful]').attr('checked',false);
      $('input[name=competent]').attr('checked',false);
      $('input[name=enjoy]').attr('checked',false);
      $('input[name=humanlike]').attr('checked',false);
      $('input[name=efficient]').attr('checked',false);
      $('input[name=flexible]').attr('checked',false);
      $('input[name=predictable]').attr('checked',false);
    }

    const data = {
      helpful: helpful,
      competent: competent, 
      enjoy: enjoy,
      humanlike: humanlike,
      efficient: efficient,
      flexible: flexible,
      predictable: predictable,
    }


    return { data, error: errorMessage };
  }
}

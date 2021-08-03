class TaskController {
  constructor() {
    this.data = {
      games: [['human', 'sac_self_play_simple_0'], ['human', 'sac_self_play_simple_1']],
      layout: 'simple',
      gameLength: 60
    }
    this.taskProgression = ['instructions', 'demoQuestions', 'tutorial', 'game1', 'questions1', 'game2', 'questions2', 'selectPartner', 'finalGame', 'submit']
    this.curSubTask = 0

    $(".subtask").hide()
  }

  reset() {
    console.log("resetting");
    this.curSubTask = -1;
    this.advance();
  }

  advance() {
    this.curSubTask++
    console.log("advancing", this.curSubTask)
    $(".subtask").hide()
    const newSubTask = this.taskProgression[this.curSubTask]
    console.log("newSubTask", newSubTask)

    switch (newSubTask) {
      case 'instructions':
        $('#instructions').show()
        break;
      case 'demoQuestions':
        $('#demoQuestions').show()
        break;
      case 'tutorial':
        $('#tutorial').show()
        break;
      case 'game1':
        $('#game').show()
        break;
      case 'questions1':
        $('#partnerQuestions').show()
        break;
      case 'game2':
        $('#game').show()
        break;
      case 'questions2':
        $('#partnerQuestions').show()
        break;
      case 'selectPartner':
        $("#selectPartner").show()
        break;
      case 'finalGame':
        $('#game').show()
        break;
      case 'submit':
        $('#submit').show()
        break;
    }
  }
}

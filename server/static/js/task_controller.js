CONFIG_PATH = "static/configs/";
DEFAULT_CONFIG = "default.json";


class TaskController {
  constructor(socket) {
    const urlParams = new URLSearchParams(window.location.search);
    this.configFile = urlParams.get("config");
    if (!this.configFile) {
      this.configFile = DEFAULT_CONFIG;
    }

    const configPath = CONFIG_PATH + this.configFile;
    console.log("loading data from", configPath);
    this.socket = socket;
    this.isLoaded = false;

    // load a config file
    $.getJSON(configPath)
      .done(
        function (config) {
          // set taskProgression
          this.taskProgression =
            this.constructTaskProgressionFromConfig(config);
          console.log("taskProgression", this.taskProgression);
          // initialize data
          this.data = new Array(this.taskProgression.length).fill({});
          config.path = this.configFile;
          config.gameOrder = this.allGames;
          this.data.push(config);
          this.isLoaded = true;
          this.reset();
        }.bind(this)
      )
      .fail(
        function (jqxhr, textStatus, error) {
          const errMessage = `Could not load config file ${this.configFile}, failed with error: ${error}`;
          $(".subtask").hide();
          $("#error-message").text(errMessage);
          $("#error-message").show();
        }.bind(this)
      );
  }

  constructTaskProgressionFromConfig(config) {
    const taskProgression = [];
    taskProgression.push(new OverviewSubtask(config.games.length));
    taskProgression.push(new DemoQuestionsSubtask());
    taskProgression.push(new InstructionsSubtask());

    const tutorialGame = new GameSubtask({
      title: "Tutorial",
      p1Name: "human",
      p2Name: "None",
      gameLength: config.nSecondsPerTutorial,
      layout: "simple_single_agent",
      socket: this.socket,
      gameType: "tutorial",
    });
    taskProgression.push(new TutorialSubtask(tutorialGame));

    console.log('here')
    this.allGames = config.games.slice();
    console.log(this.allGames)
    this.shuffle(this.allGames);
    console.log(this.allGames)
    this.allGames.forEach((playerNames, iPartner) => {
      // push some game subtasks
      for (var iGame = 0; iGame < config.nGamesPerPartner; iGame++) {
        var title = `Partner ${iPartner + 1}, Game ${iGame + 1}`;
        taskProgression.push(
          new GameSubtask({
            title: title,
            p1Name: playerNames[0],
            p2Name: playerNames[1],
            gameLength: config.nSecondsPerGame,
            layout: config.layout,
            socket: this.socket,
            partnerNum: iPartner + 1,
            totalPartners: config.games.length,
            gameType: "overcooked_recorder",
          })
        );
      }
      // push a question subtask
      taskProgression.push(new PartnerQuestionsSubtask());
    });
    taskProgression.push(new SubmitSubtask());
    return taskProgression;
  }

  reset() {
    if (!this.isLoaded) {
      return;
    }

    // hide subtasks
    $(".subtask").hide();

    // hide errors
    $("#error-messsage").hide();

    // prep next button
    $("#next").click(
      function () {
        console.log("clicking next");
        this.advance();
      }.bind(this)
    );

    this.curSubTask = -1;
    this.advance();
  }

  advance() {
    $("#error-message").hide();

    if (this.curSubTask >= 0) {
      const oldTask = this.taskProgression[this.curSubTask];
      const { data, error } = oldTask.getData();
      if (error) {
        $("#error-message").text(error);
        $("#error-message").show();
        return;
      } else if (data) {
        this.data[this.curSubTask] = data;
      }
    }
    console.log("this.data", this.data);

    // proceed with advancing
    this.curSubTask++;
    console.log("advancing", this.curSubTask, "/", this.taskProgression.length);
 
    if (this.curSubTask >= this.taskProgression.length - 1) {
      $("#next").hide();
      $("#next").attr("disabled", true);
      $("#submission-button").show();

      $("#submission-button").click(
        function () {
          this.submit()
        }.bind(this)
      );
  
    }
    $(".subtask").hide();
    const curSubTask = this.taskProgression[this.curSubTask];

    curSubTask.load();
  }

  submit() {
    //get data from final subtask
    $("#error-message").hide();
    $("#loading-section").show();

    if (this.curSubTask >= 0) {
      const oldTask = this.taskProgression[this.curSubTask];
      const { data, error } = oldTask.getData();
      if (error) {
        $("#error-message").text(error);
        $("#error-message").show();
        return;
      } else if (data) {
        this.data[this.curSubTask] = data;
      }
    }

    //post data

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

    const params = new URLSearchParams(window.location.search)

    const hitId = params.get("hitId")
    const workerId = params.get("workerId")
    const assignmentId = params.get("assignmentId")
    const submitUrl = params.get("turkSubmitTo") + '/mturk/externalSubmit'

    
    var form = $("#submit-form");
    addHiddenField(form, "hitId", hitId);
    addHiddenField(form, "workerId", workerId);
    addHiddenField(form, "assignmentId", assignmentId);

    var results = {
      data: this.data,
    };

    console.log(results);

    addHiddenField(form, "results", JSON.stringify(results));

    $("#submit-form").attr("action", submitUrl);
    $("#submit-form").attr("method", "POST");
    $("#submit-form").submit();

  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

}




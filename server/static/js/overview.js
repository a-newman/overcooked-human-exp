class OverviewSubtask {
  constructor(numPartners) {
    this.numPartners = numPartners;
  }

  load() {
    // show instructions
    $(".num-partners").text(this.numPartners);
    $("#overview").show();
  }

  getData() {
    // no-op
    return {};
  }
}

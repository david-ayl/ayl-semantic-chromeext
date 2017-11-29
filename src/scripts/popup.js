

$(document).on("click", "#launch-semantic", function() {



  $(".loader-container").addClass("loading");
  $("#launch-semantic").hide();


  chrome.tabs.getSelected(null, function(tab) {
    var tablink = tab.url;
    tablink = encodeURIComponent(tablink);

    $.get("http://ai.ayl.io/call?url=" + tablink, function(data) {

      data = JSON.parse(data);
      $(".loader-container").removeClass("loading");
      $("#result-wrapper").show();


      display_keywords(data.keywords);
      display_emotions(data.emotions);
      display_concepts(data.concepts);
      display_entities(data.entities);
      display_taxonomy(data.taxonomy);

    })
      .done(function() {

        $("[data-percent]").each(function() {

          if (isVisible($(this)) && ! $(this).hasClass("hascount")) {
            countTo($(this))
          }

        })

      });


  });


})

.on("scroll", function() {

  $("[data-percent]").each(function() {

    if (isVisible($(this)) && ! $(this).hasClass("hascount")) {
      countTo($(this))
    }

  })

})

.on("click", ".moon_line", function() {

  $("body").removeClass("light_theme").addClass("dark_theme");

})

.on("click", ".sun_line", function() {

  $("body").removeClass("dark_theme").addClass("light_theme");

})

.on("click", ".color_switcher_line.blue_color", function() {

  $("body").removeClass("orange_theme").addClass("blue_theme");

})

.on("click", ".color_switcher_line.orange_color", function() {

  $("body").removeClass("blue_theme").addClass("orange_theme");

});




var display_keywords = function(keywords) {

  keywords = keywords.slice(0, 5);

  $("#keywords .result-wrapper").empty();

  for(var i in keywords) {
    var resultText = keywords[i].text;
    var resultRelevance = keywords[i].relevance;
    resultRelevance = percent(resultRelevance, "");
    var resultSentiment;
    if(keywords[i].hasOwnProperty("sentiment")) {
      resultSentiment = keywords[i].sentiment.type;
    }
    else {
      resultSentiment = "";
    }
    var result_line = $("<div class='item'><div class='item_line' data-smiley-color='" + resultSentiment + "'><span class='item_title'>" + resultText + "&nbsp;:</span><span class='item_result' data-percent='" + resultRelevance + "'>0</span><span class='percent_line'></span></div><div class='sentiment_line'><span class='item_sentiment' data-smiley='" + resultSentiment + "'>" + resultSentiment + " sentiment</span></div></div>");
    $("#keywords .result_wrapper").append(result_line);
  }

}

var display_emotions = function(emotions) {

  if(emotions == "unsupported-text-language") {
    var result_line = $("<div class='item'><span class='item_title'>Unsuppored text language</span></div>");
    $("#emotions .result_wrapper").append(result_line);
  }
  else{
    $("#emotions .result_wrapper").empty();

    for(prop in emotions) {
      var result = percent(emotions[prop], "");
      var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + prop + "&nbsp;:</span><span class='item_result' data-percent='" + result + "'>0</span><span class='percent_line'></span></div></div>");
      $("#emotions .result_wrapper").append(result_line);
    };
  }

}

var display_concepts = function(concepts) {

  if(concepts == "unsupported-text-language") {
    var result_line = $("<div class='item'><span class='item_title'>Unsuppored text language</span></div>");
    $("#concepts .result_wrapper").append(result_line);
  }
  else{
    concepts = concepts.slice(0, 5);

    $("#concept .result-wrapper").empty();

    for(var i in concepts) {
      var resultText = concepts[i]["text"];
      var resultRelevance = concepts[i]["relevance"];
      resultRelevance = percent(resultRelevance, "");
      var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + resultText + "&nbsp;:</span><span class='item_result' data-percent='" + resultRelevance + "'>0</span><span class='percent_line'></span></div></div>");
      $("#concepts .result_wrapper").append(result_line);
    }
  }

}

var display_entities = function(entities) {

  if(entities.length == 0) {
    var result_line = $("<div class='item'><span class='item_title'>Unable to retrieve entities</span></div>");
    $("#entities .result_wrapper").append(result_line);
  }
  else{
    entities = entities.slice(0, 5);

    $("#entities .result-wrapper").empty();

    for(var i in entities) {
      var resultText = entities[i].text;
      var resultRelevance = entities[i].relevance;
      resultRelevance = percent(resultRelevance, "");
      var resultSentiment = entities[i].sentiment.type
      var result_line = $("<div class='item'><div class='item_line' data-smiley-color='" + resultSentiment + "'><span class='item_title'>" + resultText + "&nbsp;:</span><span class='item_result' data-percent='" + resultRelevance + "'>0</span><span class='percent_line'></span></div><div class='sentiment_line'><span class='item_sentiment' data-smiley='" + resultSentiment + "'>" + resultSentiment + " sentiment</span></div></div>");
      $("#entities .result_wrapper").append(result_line);
    }
  }

}

var display_taxonomy = function(taxonomy) {

  $("#taxonomy .result-wrapper").empty();

  for(var i in taxonomy) {
    var resultLabel = taxonomy[i].label;
    var resultScore = taxonomy[i].score;
    resultScore = percent(resultScore, "");
    var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + resultLabel + "&nbsp;:</span><span class='item_result' data-percent='" + resultScore + "'>0</span><span class='percent_line'></span></div></div>");
    $("#taxonomy .result_wrapper").append(result_line);
  }

}


var percent = function(number, unit) {

  if(number.match(/^[+-]?\d+(\.\d+)?$/)) {
    var _unit;
    if (typeof unit !== "undefined") {
      _unit = unit;
    }

    var res = Number(number);
    res = res * 100;
    res = res.toFixed(2);
    return res + _unit;
  }
  else {
    return number
  }

}

var countTo = function(target) {

  if($(target).hasClass("done") || $(target).hasClass("iscounting")) {
    return
  }

  var start = 0;
  var to = $(target).attr("data-percent");

  var count = setInterval(function() {

    $(target).addClass("iscounting");

    if(start > to) {
      $(target).removeClass("iscounting").addClass("done");
      $(target).closest(".item_line").next(".sentiment_line").addClass("show");
      clearInterval(count);
    }

    $(target).next(".percent_line").width(start + "px");
    $(target).text(start + "%");

    start ++;

  }, 10);

  count;

}

var isVisible = function(el) {

  var win = $(window);

  var viewport = {
    top : win.scrollTop(),
    left : win.scrollLeft()
  };

  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();

  var bounds = el.offset();
  bounds.right = bounds.left + el.outerWidth();
  bounds.bottom = bounds.top + el.outerHeight();

  return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

}

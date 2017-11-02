/*     http://ai.ayl.io/call?url=ENCODED */

$(document).on("click", "#launch-semantic", function() {

  $(".loader-container").addClass("loading");
  $("#launch-semantic").hide();

  chrome.tabs.getSelected(null, function(tab) {
    var tablink = tab.url;
    tablink = encodeURIComponent(tablink);

    $.get("http://ai.ayl.io/call?url=" + tablink, function(data) {

      data = JSON.parse(data);
      console.log(data);
      $(".loader-container").removeClass("loading");
      $("#result-wrapper").show();

      display_emotions(data.emotions);
      display_concepts(data.concepts);
      display_entities(data.entities);
      display_taxonomy(data.taxonomy);
      display_keywords(data.keywords);
    });

  });

})


var display_emotions = function(emotions) {

  if(emotions == "unsupported-text-language") {
    var result_line = $("<div class='item'><span class='item_title'>Unsuppored text language</span></div>");
    $("#emotions .result_wrapper").append(result_line);
  }
  else{
    $("#emotions .result_wrapper").empty();

    for(prop in emotions) {
      var result = percent(emotions[prop], "%");
      var result_line = $("<div class='item'><span class='item_title " + prop + "'>" + prop + ":</span><span class='item_result'>" + result + "</span></div>");
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
      resultRelevance = percent(resultRelevance, "%");
      var result_line = $("<div class='item'><span class='item_title'>" + resultText + ":</span><span class='item_result'>" + resultRelevance + "</span></div>");
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
      resultRelevance = percent(resultRelevance, "%");
      var resultSentiment = entities[i].sentiment.type
      var result_line = $("<div class='item'><span class='item_title'>" + resultText + ":</span><span class='item_result'>" + resultRelevance + "</span><span class='item_title'>Sentiment :</span><span class='item_result'>" + resultSentiment + "</span></div>");
      $("#entities .result_wrapper").append(result_line);
    }
  }

}

var display_taxonomy = function(taxonomy) {

  $("#taxonomy .result-wrapper").empty();

  for(var i in taxonomy) {
    var resultLabel = taxonomy[i].label;
    var resultScore = taxonomy[i].score;
    resultScore = percent(resultScore, "%");
    var result_line = $("<div class='item'><span class='item_title'>" + resultLabel + ":</span><span class='item_result'>" + resultScore + "</span></div>");
    $("#taxonomy .result_wrapper").append(result_line);
  }

}

var display_keywords = function(keywords) {

  keywords = keywords.slice(0, 5);

  $("#keywords .result-wrapper").empty();

  for(var i in keywords) {
    var resultText = keywords[i].text;
    var resultRelevance = keywords[i].relevance;
    resultRelevance = percent(resultRelevance, "%");
    var resultSentiment;
    if(keywords[i].hasOwnProperty("sentiment")) {
      resultSentiment = keywords[i].sentiment.type;
    }
    else {
      resultSentiment = "";
    }
    var result_line = $("<div class='item'><span class='item_title'>" + resultText + ":</span><span class='item_result'>" + resultRelevance + "</span><span class='item_title'>Sentiment :</span><span class='item_result'>" + resultSentiment + "</span></div>");
    $("#keywords .result_wrapper").append(result_line);
  }

}
/*

relevance
:
"0.92615"
sentiment
:
{mixed: "1", score: "-0.336171", type: "negative"}
text
:
"tax"
*/
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

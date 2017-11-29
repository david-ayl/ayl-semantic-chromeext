

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
    var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + resultText + "&nsbp;:</span><span class='item_result' data-percent='" + resultRelevance + "'>0</span><span class='percent_line'></span></div><div class='sentiment_line'><span class='item_sentiment' data-smiley='" + resultSentiment + "'>" + resultSentiment + " sentiment</span></div></div>");
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
      var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + prop + "&nsbp;:</span><span class='item_result' data-percent='" + result + "'>0</span><span class='percent_line'></span></div></div>");
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
      var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + resultText + "&nsbp;:</span><span class='item_result' data-percent='" + resultRelevance + "'>0</span><span class='percent_line'></span></div></div>");
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
      var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + resultText + "&nsbp;:</span><span class='item_result' data-percent='" + resultRelevance + "'>0</span><span class='percent_line'></span></div><div class='sentiment_line'><span class='item_sentiment' data-smiley='" + resultSentiment + "'>" + resultSentiment + " sentiment</span></div></div>");
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
    var result_line = $("<div class='item'><div class='item_line'><span class='item_title'>" + resultLabel + "&nsbp;:</span><span class='item_result' data-percent='" + resultScore + "'>0</span><span class='percent_line'></span></div></div>");
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
      $(target).next(".percent_line").width(start + "px");
      $(target).removeClass("iscounting").addClass("done");
      $(target).closest(".item_line").next(".sentiment_line").addClass("show");
      clearInterval(count);
    }

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

var datas = {
  "sentiment": {
    "mixed": "1",
    "score": "0.188308",
    "type": "positive"
  },
  "taxonomy": [{
    "score": "0.874802",
    "label": "news"
  }, {
    "score": "0.468079",
    "label": "art"
  }, {
    "score": "0.468079",
    "label": "entertainment/visual"
  }, {
    "score": "0.468079",
    "label": "art"
  }, {
    "score": "0.468079",
    "label": "design/painting"
  }, {
    "score": "0.463647",
    "label": "society/crime/personal"
  }, {
    "score": "0.463647",
    "label": "offense/assault"
  }],
  "emotions": {
    "anger": "0.141698",
    "joy": "0.589403",
    "fear": "0.108393",
    "sadness": "0.451681",
    "disgust": "0.488457"
  },
  "entities": [{
    "relevance": "0.800864",
    "count": "3",
    "type": "Person",
    "sentiment": {
      "score": "0.608894",
      "type": "positive"
    },
    "text": "President Trump"
  }, {
    "relevance": "0.704928",
    "count": "3",
    "type": "JobTitle",
    "sentiment": {
      "score": "-0.565407",
      "type": "negative"
    },
    "text": "president"
  }, {
    "relevance": "0.528732",
    "count": "2",
    "type": "Organization",
    "sentiment": {
      "mixed": "1",
      "score": "0.0170736",
      "type": "positive"
    },
    "text": "Senate"
  }, {
    "count": "2",
    "sentiment": {
      "score": "-0.36715",
      "type": "negative"
    },
    "disambiguated": {
      "yago": "http://yago-knowledge.org/resource/Juergen_Teller",
      "subType": [],
      "dbpedia": "http://dbpedia.org/resource/Juergen_Teller",
      "name": "Juergen Teller",
      "freebase": "http://rdf.freebase.com/ns/m.04lkcz"
    },
    "text": "Juergen Teller",
    "relevance": "0.519048",
    "type": "Person"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "yago": "http://yago-knowledge.org/resource/Vladimir_Putin",
      "name": "Vladimir Putin",
      "freebase": "http://rdf.freebase.com/ns/m.08193",
      "opencyc": "http://sw.opencyc.org/concept/Mx4rP6u207ArEdiUkQACs4vPnA",
      "subType": ["Politician", "MartialArtist", "PoliticalAppointer", "TVActor"],
      "dbpedia": "http://dbpedia.org/resource/Vladimir_Putin"
    },
    "text": "President Vladimir V. Putin",
    "relevance": "0.45059",
    "type": "Person"
  }, {
    "relevance": "0.427325",
    "count": "1",
    "type": "Person",
    "sentiment": {
      "type": "neutral"
    },
    "text": "Alex M. Azar II"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "subType": ["MilitaryPerson"],
      "dbpedia": "http://dbpedia.org/resource/Eli_Lilly",
      "name": "Eli Lilly",
      "freebase": "http://rdf.freebase.com/ns/m.073jn9"
    },
    "text": "Eli Lilly",
    "relevance": "0.40822",
    "type": "Person"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.princealwaleed.net",
      "yago": "http://yago-knowledge.org/resource/Al-Waleed_bin_Talal",
      "name": "Al-Waleed bin Talal",
      "freebase": "http://rdf.freebase.com/ns/m.02zsbw",
      "subType": ["CompanyShareholder"],
      "dbpedia": "http://dbpedia.org/resource/Al-Waleed_bin_Talal",
      "geo": "23.643722222222223 46.67885833333333"
    },
    "text": "Prince Alwaleed bin Talal",
    "relevance": "0.401209",
    "type": "Person"
  }, {
    "relevance": "0.393255",
    "count": "1",
    "type": "FieldTerminology",
    "sentiment": {
      "score": "-0.506572",
      "type": "negative"
    },
    "text": "Bank regulators"
  }, {
    "count": "1",
    "sentiment": {
      "score": "0.453897",
      "type": "positive"
    },
    "disambiguated": {
      "website": "http://www.whitehouse.gov/",
      "yago": "http://yago-knowledge.org/resource/Barack_Obama",
      "name": "Barack Obama",
      "freebase": "http://rdf.freebase.com/ns/m.02mjmr",
      "subType": ["Politician", "President", "Appointer", "AwardWinner", "Celebrity", "PoliticalAppointer", "U.S.Congressperson", "USPresident", "TVActor"],
      "dbpedia": "http://dbpedia.org/resource/Barack_Obama"
    },
    "text": "Barack Obama",
    "relevance": "0.390536",
    "type": "Person"
  }, {
    "count": "1",
    "sentiment": {
      "score": "0.885051",
      "type": "positive"
    },
    "disambiguated": {
      "website": "http://www.andrewrosssorkin.com/",
      "subType": [],
      "dbpedia": "http://dbpedia.org/resource/Andrew_Ross_Sorkin",
      "name": "Andrew Ross Sorkin",
      "freebase": "http://rdf.freebase.com/ns/m.04_16s2"
    },
    "text": "Andrew Ross Sorkin",
    "relevance": "0.39022",
    "type": "Person"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.law.harvard.edu/faculty/directory/index.html?id=82",
      "yago": "http://yago-knowledge.org/resource/Elizabeth_Warren",
      "name": "Elizabeth Warren",
      "freebase": "http://rdf.freebase.com/ns/m.01qh39",
      "subType": ["FilmActor"],
      "dbpedia": "http://dbpedia.org/resource/Elizabeth_Warren"
    },
    "text": "Senator Elizabeth Warren",
    "relevance": "0.383874",
    "type": "Person"
  }, {
    "relevance": "0.370885",
    "count": "1",
    "type": "FieldTerminology",
    "sentiment": {
      "type": "neutral"
    },
    "text": "World War II"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.nyc.gov/",
      "yago": "http://yago-knowledge.org/resource/New_York_City",
      "name": "New York City",
      "freebase": "http://rdf.freebase.com/ns/m.02_286",
      "subType": ["PoliticalDistrict", "GovernmentalJurisdiction", "PlaceWithNeighborhoods", "WineRegion", "FilmScreeningVenue"],
      "dbpedia": "http://dbpedia.org/resource/New_York_City",
      "geo": "40.71666666666667 -74.0",
      "geonames": "http://sws.geonames.org/5128581/"
    },
    "text": "New York",
    "relevance": "0.356517",
    "type": "City"
  }, {
    "relevance": "0.356455",
    "count": "1",
    "type": "JobTitle",
    "sentiment": {
      "type": "neutral"
    },
    "text": "secretary"
  }, {
    "relevance": "0.355867",
    "count": "1",
    "type": "Crime",
    "sentiment": {
      "score": "-0.874804",
      "type": "negative"
    },
    "text": "assault"
  }, {
    "relevance": "0.351144",
    "count": "1",
    "type": "FieldTerminology",
    "sentiment": {
      "type": "neutral"
    },
    "text": "health and human services"
  }, {
    "count": "1",
    "sentiment": {
      "score": "-0.485069",
      "type": "negative"
    },
    "disambiguated": {
      "website": "http://www.queensbp.org",
      "yago": "http://yago-knowledge.org/resource/Queens",
      "name": "Queens",
      "freebase": "http://rdf.freebase.com/ns/m.0ccvx",
      "subType": ["AdministrativeDivision", "GovernmentalJurisdiction", "PlaceWithNeighborhoods", "USCounty"],
      "dbpedia": "http://dbpedia.org/resource/Queens"
    },
    "text": "Queens",
    "relevance": "0.347629",
    "type": "City"
  }, {
    "relevance": "0.347208",
    "count": "1",
    "type": "Person",
    "sentiment": {
      "type": "neutral"
    },
    "text": "Rubén Darío"
  }, {
    "count": "1",
    "sentiment": {
      "score": "0.608894",
      "type": "positive"
    },
    "disambiguated": {
      "website": "http://www.morallaw.org",
      "yago": "http://yago-knowledge.org/resource/Roy_Moore",
      "name": "Roy Moore",
      "freebase": "http://rdf.freebase.com/ns/m.0g131b",
      "subType": ["Judge", "MilitaryPerson", "FilmWriter"],
      "dbpedia": "http://dbpedia.org/resource/Roy_Moore"
    },
    "text": "Roy S. Moore",
    "relevance": "0.345668",
    "type": "Person"
  }, {
    "count": "1",
    "sentiment": {
      "score": "0.770084",
      "type": "positive"
    },
    "disambiguated": {
      "yago": "http://yago-knowledge.org/resource/Audra_McDonald",
      "name": "Audra McDonald",
      "freebase": "http://rdf.freebase.com/ns/m.04hq31",
      "subType": ["Actor", "MusicalArtist", "AwardNominee", "AwardWinner", "FilmActor", "TheaterActor", "TVActor"],
      "dbpedia": "http://dbpedia.org/resource/Audra_McDonald",
      "musicBrainz": "http://zitgist.com/music/artist/485ae838-05a9-49d0-9421-6ccfb203f17b"
    },
    "text": "Audra McDonald",
    "relevance": "0.345545",
    "type": "Person"
  }, {
    "relevance": "0.345218",
    "count": "1",
    "type": "Company",
    "sentiment": {
      "type": "neutral"
    },
    "text": "Company"
  }, {
    "relevance": "0.344083",
    "count": "1",
    "type": "Facility",
    "sentiment": {
      "type": "neutral"
    },
    "text": "Oval Office"
  }, {
    "count": "1",
    "sentiment": {
      "score": "-0.307839",
      "type": "negative"
    },
    "disambiguated": {
      "website": "http://www.usa.gov/",
      "yago": "http://yago-knowledge.org/resource/United_States",
      "name": "United States",
      "freebase": "http://rdf.freebase.com/ns/m.09c7w0",
      "opencyc": "http://sw.opencyc.org/concept/Mx4rvVikKpwpEbGdrcN5Y29ycA",
      "subType": ["Location", "Region", "AdministrativeDivision", "GovernmentalJurisdiction", "FilmEditor"],
      "dbpedia": "http://dbpedia.org/resource/United_States",
      "ciaFactbook": "http://www4.wiwiss.fu-berlin.de/factbook/resource/United_States"
    },
    "text": "United States",
    "relevance": "0.342824",
    "type": "Country"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "yago": "http://yago-knowledge.org/resource/Judenrat",
      "freebase": "http://rdf.freebase.com/ns/m.0h3lb",
      "dbpedia": "http://dbpedia.org/resource/Judenrat",
      "name": "Judenrat"
    },
    "text": "Jewish council",
    "relevance": "0.335548",
    "type": "Organization"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.cnn.com/",
      "yago": "http://yago-knowledge.org/resource/CNN",
      "name": "CNN",
      "freebase": "http://rdf.freebase.com/ns/m.0gsgr",
      "subType": ["Broadcast", "AwardWinner", "RadioNetwork", "TVNetwork"],
      "dbpedia": "http://dbpedia.org/resource/CNN"
    },
    "text": "CNN",
    "relevance": "0.334599",
    "type": "Company"
  }, {
    "relevance": "0.333832",
    "count": "1",
    "type": "Company",
    "sentiment": {
      "score": "0.678333",
      "type": "positive"
    },
    "text": "DealBook"
  }, {
    "relevance": "0.333637",
    "count": "1",
    "type": "Company",
    "sentiment": {
      "type": "neutral"
    },
    "text": "Rolling Stone"
  }, {
    "relevance": "0.332583",
    "count": "1",
    "type": "Person",
    "sentiment": {
      "score": "-0.315082",
      "type": "negative"
    },
    "text": "Joe Hagan"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.president.gov.by/en/",
      "yago": "http://yago-knowledge.org/resource/Belarus",
      "name": "Belarus",
      "freebase": "http://rdf.freebase.com/ns/m.0163v",
      "opencyc": "http://sw.opencyc.org/concept/Mx4rvVjw35wpEbGdrcN5Y29ycA",
      "subType": ["Location", "GovernmentalJurisdiction"],
      "dbpedia": "http://dbpedia.org/resource/Belarus",
      "ciaFactbook": "http://www4.wiwiss.fu-berlin.de/factbook/resource/Belarus"
    },
    "text": "Russia",
    "relevance": "0.330844",
    "type": "Country"
  }, {
    "count": "1",
    "sentiment": {
      "score": "0.628132",
      "type": "positive"
    },
    "disambiguated": {
      "website": "http://www.joshgroban.com/",
      "yago": "http://yago-knowledge.org/resource/Josh_Groban",
      "name": "Josh Groban",
      "freebase": "http://rdf.freebase.com/ns/m.02bc74",
      "subType": ["Composer", "MusicalArtist", "AwardNominee", "BroadcastArtist", "Celebrity", "MusicalGroupMember", "TVActor"],
      "dbpedia": "http://dbpedia.org/resource/Josh_Groban",
      "musicBrainz": "http://zitgist.com/music/artist/12be5b16-915f-44bc-978a-8ddfab235b79"
    },
    "text": "Josh Groban",
    "relevance": "0.328029",
    "type": "Person"
  }, {
    "relevance": "0.326745",
    "count": "1",
    "type": "JobTitle",
    "sentiment": {
      "type": "neutral"
    },
    "text": "co-founder and editor"
  }, {
    "relevance": "0.325527",
    "count": "1",
    "type": "Person",
    "sentiment": {
      "score": "0.45851",
      "type": "positive"
    },
    "text": "Anita"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.aberdeennews.com/",
      "freebase": "http://rdf.freebase.com/ns/m.099mq7",
      "dbpedia": "http://dbpedia.org/resource/The_American_News",
      "name": "The American News"
    },
    "text": "American news",
    "relevance": "0.32459",
    "type": "PrintMedia"
  }, {
    "relevance": "0.32421",
    "count": "1",
    "type": "Person",
    "sentiment": {
      "score": "0.271796",
      "type": "positive"
    },
    "text": "Miranda"
  }, {
    "relevance": "0.320915",
    "count": "1",
    "type": "Organization",
    "sentiment": {
      "type": "neutral"
    },
    "text": "Cases Fund"
  }, {
    "relevance": "0.315901",
    "count": "1",
    "type": "Person",
    "sentiment": {
      "score": "0.45851",
      "type": "positive"
    },
    "text": "Burt Swerdin"
  }, {
    "relevance": "0.315004",
    "count": "1",
    "type": "Facility",
    "sentiment": {
      "score": "0.453897",
      "type": "positive"
    },
    "text": "National Gallery"
  }, {
    "relevance": "0.313536",
    "count": "1",
    "type": "FieldTerminology",
    "sentiment": {
      "type": "neutral"
    },
    "text": "media outlets"
  }, {
    "relevance": "0.313417",
    "count": "1",
    "type": "PrintMedia",
    "sentiment": {
      "score": "0.885051",
      "type": "positive"
    },
    "text": "Times"
  }, {
    "relevance": "0.31262",
    "count": "1",
    "type": "Country",
    "sentiment": {
      "score": "-0.587495",
      "type": "negative"
    },
    "text": "Australia"
  }, {
    "count": "1",
    "sentiment": {
      "type": "neutral"
    },
    "disambiguated": {
      "website": "http://www.nytimes.com",
      "yago": "http://yago-knowledge.org/resource/The_New_York_Times",
      "name": "The New York Times",
      "freebase": "http://rdf.freebase.com/ns/m.07k2d",
      "subType": ["Organization", "Company", "AwardPresentingOrganization", "AwardWinner", "CompanyShareholder", "Newspaper"],
      "dbpedia": "http://dbpedia.org/resource/The_New_York_Times"
    },
    "text": "The New York Times",
    "relevance": "0.312428",
    "type": "PrintMedia"
  }, {
    "relevance": "0.312428",
    "count": "1",
    "type": "Quantity",
    "sentiment": {
      "type": "neutral"
    },
    "text": "10 percent"
  }, {
    "relevance": "0.312428",
    "count": "1",
    "type": "Quantity",
    "sentiment": {
      "type": "neutral"
    },
    "text": "150 years"
  }],
  "concepts": [{
    "yago": "http://yago-knowledge.org/resource/Vladimir_Putin",
    "text": "Vladimir Putin",
    "opencyc": "http://sw.opencyc.org/concept/Mx4rP6u207ArEdiUkQACs4vPnA",
    "dbpedia": "http://dbpedia.org/resource/Vladimir_Putin",
    "freebase": "http://rdf.freebase.com/ns/m.08193",
    "relevance": "0.970792"
  }, {
    "website": "http://www.georgewbushlibrary.gov",
    "yago": "http://yago-knowledge.org/resource/George_W._Bush",
    "text": "George W. Bush",
    "opencyc": "http://sw.opencyc.org/concept/Mx4rwRWtUpwpEbGdrcN5Y29ycA",
    "musicBrainz": "http://zitgist.com/music/artist/06564917-bdd2-4fb6-bcdc-be9e0c04f7ac",
    "dbpedia": "http://dbpedia.org/resource/George_W._Bush",
    "freebase": "http://rdf.freebase.com/ns/m.09b6zr",
    "relevance": "0.80858"
  }, {
    "website": "http://www.princealwaleed.net",
    "yago": "http://yago-knowledge.org/resource/Al-Waleed_bin_Talal",
    "text": "Al-Waleed bin Talal",
    "dbpedia": "http://dbpedia.org/resource/Al-Waleed_bin_Talal",
    "freebase": "http://rdf.freebase.com/ns/m.02zsbw",
    "relevance": "0.775714",
    "geo": "23.643722222222223 46.67885833333333"
  }, {
    "website": "http://www.whitehouse.gov/",
    "yago": "http://yago-knowledge.org/resource/Barack_Obama",
    "text": "Barack Obama",
    "dbpedia": "http://dbpedia.org/resource/Barack_Obama",
    "freebase": "http://rdf.freebase.com/ns/m.02mjmr",
    "relevance": "0.67638"
  }, {
    "website": "http://www.thebill.com",
    "yago": "http://yago-knowledge.org/resource/The_Bill",
    "text": "The Bill",
    "opencyc": "http://sw.opencyc.org/concept/Mx4rvVt245wpEbGdrcN5Y29ycA",
    "dbpedia": "http://dbpedia.org/resource/The_Bill",
    "freebase": "http://rdf.freebase.com/ns/m.01lvjl",
    "relevance": "0.640109"
  }, {
    "relevance": "0.638565",
    "text": "Andrew Ross Sorkin",
    "website": "http://www.andrewrosssorkin.com/",
    "dbpedia": "http://dbpedia.org/resource/Andrew_Ross_Sorkin",
    "freebase": "http://rdf.freebase.com/ns/m.04_16s2"
  }, {
    "website": "http://www.clintonlibrary.gov/",
    "yago": "http://yago-knowledge.org/resource/Bill_Clinton",
    "text": "Bill Clinton",
    "opencyc": "http://sw.opencyc.org/concept/Mx4rwQBp5JwpEbGdrcN5Y29ycA",
    "musicBrainz": "http://zitgist.com/music/artist/a11bd200-7f0b-43a6-b7fe-4ea04929a42b",
    "dbpedia": "http://dbpedia.org/resource/Bill_Clinton",
    "freebase": "http://rdf.freebase.com/ns/m.0157m",
    "relevance": "0.610648"
  }, {
    "website": "http://www.whitehouse.gov/administration/president_obama/",
    "yago": "http://yago-knowledge.org/resource/President_of_the_United_States",
    "text": "President of the United States",
    "opencyc": "http://sw.opencyc.org/concept/Mx4rwQBS0ZwpEbGdrcN5Y29ycA",
    "dbpedia": "http://dbpedia.org/resource/President_of_the_United_States",
    "freebase": "http://rdf.freebase.com/ns/m.060d2",
    "relevance": "0.5703"
  }],
  "keywords": [{
    "relevance": "0.944275",
    "text": "President Trump",
    "sentiment": {
      "score": "0.608894",
      "type": "positive"
    }
  }, {
    "relevance": "0.908341",
    "text": "Alex M. Azar",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.90732",
    "text": "President Vladimir V.",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.889498",
    "text": "New York Times",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.886819",
    "text": "young black men",
    "sentiment": {
      "score": "0.453897",
      "type": "positive"
    }
  }, {
    "relevance": "0.885557",
    "text": "Christian antiwar protesters",
    "sentiment": {
      "score": "-0.307839",
      "type": "negative"
    }
  }, {
    "relevance": "0.884346",
    "text": "National Gallery portrait",
    "sentiment": {
      "score": "0.453897",
      "type": "positive"
    }
  }, {
    "relevance": "0.884093",
    "text": "Neediest Cases Fund",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.882956",
    "text": "Roy S. Moore",
    "sentiment": {
      "score": "0.608894",
      "type": "positive"
    }
  }, {
    "relevance": "0.881945",
    "text": "all-new DealBook newsletter",
    "sentiment": {
      "score": "0.678333",
      "type": "positive"
    }
  }, {
    "relevance": "0.881326",
    "text": "American news media",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.880174",
    "text": "Senator Elizabeth Warren",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.878202",
    "text": "columnist Andrew Ross",
    "sentiment": {
      "score": "0.885051",
      "type": "positive"
    }
  }, {
    "relevance": "0.876854",
    "text": "Burt Swerdin volunteer",
    "sentiment": {
      "score": "0.45851",
      "type": "positive"
    }
  }, {
    "relevance": "0.873234",
    "text": "Rolling Stone co-founder",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.869419",
    "text": "Prince Alwaleed bin",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.838842",
    "text": "Mr. Trump",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.818061",
    "text": "Senate vote",
    "sentiment": {
      "score": "-0.574747",
      "type": "negative"
    }
  }, {
    "relevance": "0.817798",
    "text": "World War",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.814717",
    "text": "middle class",
    "sentiment": {
      "score": "0.401601",
      "type": "positive"
    }
  }, {
    "relevance": "0.814555",
    "text": "steep increases",
    "sentiment": {
      "score": "-0.498039",
      "type": "negative"
    }
  }, {
    "relevance": "0.81392",
    "text": "embattled campaign",
    "sentiment": {
      "score": "0.608894",
      "type": "positive"
    }
  }, {
    "relevance": "0.813815",
    "text": "party lines",
    "sentiment": {
      "score": "-0.557868",
      "type": "negative"
    }
  }, {
    "relevance": "0.81341",
    "text": "new owner",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.813086",
    "text": "Wall Street",
    "sentiment": {
      "score": "-0.506572",
      "type": "negative"
    }
  }, {
    "relevance": "0.81236",
    "text": "Eli Lilly",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.81219",
    "text": "human services",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.811312",
    "text": "Frenchwoman’s internet",
    "sentiment": {
      "score": "-0.874804",
      "type": "negative"
    }
  }, {
    "relevance": "0.810516",
    "text": "Bank regulators",
    "sentiment": {
      "score": "-0.506572",
      "type": "negative"
    }
  }, {
    "relevance": "0.809114",
    "text": "Democratic senators",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.80826",
    "text": "code talkers",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.808138",
    "text": "Senate seat",
    "sentiment": {
      "score": "0.608894",
      "type": "positive"
    }
  }, {
    "relevance": "0.807857",
    "text": "joyous season",
    "sentiment": {
      "score": "0.927968",
      "type": "positive"
    }
  }, {
    "relevance": "0.807476",
    "text": "Times colleagues",
    "sentiment": {
      "score": "0.885051",
      "type": "positive"
    }
  }, {
    "relevance": "0.807299",
    "text": "unscripted comment",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.80704",
    "text": "Arab world",
    "sentiment": {
      "score": "-0.874804",
      "type": "negative"
    }
  }, {
    "relevance": "0.806915",
    "text": "sexual impropriety",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.803858",
    "text": "pop stars",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.803843",
    "text": "right way",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.803206",
    "text": "fashion world",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.802505",
    "text": "new life",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.801613",
    "text": "Joe Hagan",
    "sentiment": {
      "score": "-0.315082",
      "type": "negative"
    }
  }, {
    "relevance": "0.799919",
    "text": "Barack Obama",
    "sentiment": {
      "score": "0.453897",
      "type": "positive"
    }
  }, {
    "relevance": "0.799806",
    "text": "Oval Office",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.798611",
    "text": "Sticky Fingers",
    "sentiment": {
      "score": "0.424675",
      "type": "positive"
    }
  }, {
    "relevance": "0.798303",
    "text": "foreign agents",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.796889",
    "text": "Audra McDonald",
    "sentiment": {
      "score": "0.770084",
      "type": "positive"
    }
  }, {
    "relevance": "0.79679",
    "text": "Juergen Teller",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.796229",
    "text": "Western businessmen",
    "sentiment": {
      "type": "neutral"
    }
  }, {
    "relevance": "0.796054",
    "text": "major business",
    "sentiment": {
      "score": "0.885051",
      "type": "positive"
    }
  }]
}

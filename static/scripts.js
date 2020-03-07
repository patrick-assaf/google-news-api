function google_news() {

    var html = '<div id="top-elements"><div id="carousel"></div><div id="cloud"></div></div>';
    html += '<div><h1 class="title"><b>CNN</b></h1><div class="headlines" id="cnn"></div></div>';
    html += '<div><h1 class="title"><b>Fox News</b></h1><div class="headlines" id="fox"></div></div>';

    document.getElementById("main").innerHTML = html;

    // List of words
    var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#cloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
    svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
            .data(words)
        .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .style('fill', 'black')
            .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

    var cnnObj;
    var cnnURL = '/cnn-headlines';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", cnnURL, false);
    try {
        xmlhttp.send();
    }
    catch(sendError) {
        alert(sendError.message);
    }

    if(xmlhttp.status == 404){
        alert("Error: Unable to load file");
    }
    else if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
            cnnObj = JSON.parse(xmlhttp.responseText);
        }
        catch(parseError) {
            alert("Error: Could not parse JSON file");
        }
    }

    var cnn_content = '';
    var cnn_count = 0;
    var cnn = cnnObj.headlines.articles;
    var j = 0;
    while(cnn_count < 4) {
        if(cnn[j].description != null || cnn[j].content != null || cnn[j].urlToImage != null
            || cnn[j].author != null || cnn[j].title != null || cnn[j].url != null
            || cnn[j].publishedAt != null || cnn[j].source != null) {
            cnn_content += '<div class="card"><a href="' + cnnObj.headlines.articles[j].url + '" target="_blank">';
            cnn_content += '<img src="' + cnnObj.headlines.articles[j].urlToImage + '">';
            cnn_content += '<div class="container"><h4><b>' + cnnObj.headlines.articles[j].title + '</b></h4>'
            cnn_content += '<p>' + cnnObj.headlines.articles[j].description +'</p></div></a></div>';
            cnn_count += 1;
            j += 1;
        }
        else {
            j += 1;
        }
    }
    document.getElementById("cnn").innerHTML = cnn_content;

    var foxObj;
    var foxURL = '/fox-headlines';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", foxURL, false);
    try {
        xmlhttp.send();
    }
    catch(sendError) {
        alert(sendError.message);
    }

    if(xmlhttp.status == 404){
        alert("Error: Unable to load file");
    }
    else if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
            foxObj = JSON.parse(xmlhttp.responseText);
        }
        catch(parseError) {
            alert("Error: Could not parse JSON file");
        }
    }

    var fox_content = '';
    var fox_count = 0;
    var fox = foxObj.headlines.articles;
    var i = 0;
    while(fox_count < 4) {
        if(fox[i].description != null || fox[i].content != null || fox[i].urlToImage != null
            || fox[i].author != null || fox[i].title != null || fox[i].url != null
            || fox[i].publishedAt != null || fox[i].source != null) {
            fox_content += '<div class="card"><a href="' + foxObj.headlines.articles[i].url + '" target="_blank">';
            fox_content += '<img src="' + foxObj.headlines.articles[i].urlToImage + '">';
            fox_content += '<div class="container"><h4><b>' + foxObj.headlines.articles[i].title + '</b></h4>'
            fox_content += '<p>' + foxObj.headlines.articles[i].description +'</p></div></a></div>';
            fox_count += 1;
            i += 1;
        }
        else {
            i += 1;
        }
    }
    document.getElementById("fox").innerHTML = fox_content;

    var slideObj;
    var selectObj = [5];
    var index = 0;
    var slideURL = "/slide-headlines";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", slideURL, false);
    try {
        xmlhttp.send();
    }
    catch(sendError) {
        alert(sendError.message);
    }

    if(xmlhttp.status == 404){
        alert("Error: Unable to load file");
    }
    else if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
            slideObj = JSON.parse(xmlhttp.responseText);
            getSlides();
        }
        catch(parseError) {
            alert(parseError);
        }
    }

    function getSlides() {
        var slide_count = 0;
        var  i = 1;
        var articles = slideObj.headlines.articles;
        while(slide_count < 5) {
            if(articles[i].description == null || articles[i].content == null || articles[i].urlToImage == null
                || articles[i].author == null || articles[i].title == null || articles[i].url == null
                || articles[i].publishedAt == null || articles[i].source == null) {
                    i += 1;
            }
            else {
                selectObj[slide_count] = slideObj.headlines.articles[i];
                slide_count += 1;
                i += 1;
            }
        }
        console.log(selectObj);
        showSlides();
    }

    function showSlides() {
        var slide = '';
        slide += '<img src="' + selectObj[index].urlToImage + '">';
        document.getElementById("carousel").innerHTML = slide;
        if(index == 4) {
            index = 0;
        }
        else {
            index += 1;
        }
        setTimeout(showSlides, 5*1000);
    }
}
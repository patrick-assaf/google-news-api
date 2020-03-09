
var status_change = 0;

function google_news() {

    if(document.getElementById("google-btn").className !== "selected") {
        
        document.getElementById("google-btn").className = "selected";
        document.getElementById("search-btn").className = "not-selected";

        var html = '<div id="top-elements"><div id="carousel"></div><div id="cloud"></div></div>';
        html += '<div><h1 class="title"><b>CNN</b></h1><div class="headlines" id="cnn"></div></div>';
        html += '<div><h1 class="title"><b>Fox News</b></h1><div class="headlines" id="fox"></div></div>';

        document.getElementById("main").innerHTML = html;

        var cloudObj;
        var cloudURL = '/word-cloud';

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", cloudURL, false);
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
                cloudObj = JSON.parse(xmlhttp.responseText);
            }
            catch(parseError) {
                alert(parseError);
            }
        }

        var myWords = [];
        var keys = Object.keys(cloudObj.cloud);
        var x = 0;
        for(var word in cloudObj.cloud) {
            myWords[x] = {word: keys[x], size: cloudObj.cloud[word]*(14-cloudObj.cloud[word])};
            x += 1;
        }

        var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 370 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#cloud").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })
        .on("end", draw);
        layout.start();

        function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
                .data(words)
            .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
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
                alert(parseError);
            }
        }

        var cnn_content = '';
        var cnn_count = 0;
        var cnn = cnnObj.headlines.articles;
        var j = 0;
        while(cnn_count < 4) {
            if(cnn[j].description != null && cnn[j].content != null && cnn[j].urlToImage != null
                && cnn[j].author != null && cnn[j].title != null && cnn[j].url != null
                && cnn[j].publishedAt != null && cnn[j].source != null) {
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
                alert(parseError);
            }
        }

        var fox_content = '';
        var fox_count = 0;
        var fox = foxObj.headlines.articles;
        var i = 0;
        while(fox_count < 4) {
            if(fox[i].description != null && fox[i].content != null && fox[i].urlToImage != null
                && fox[i].author != null && fox[i].title != null && fox[i].url != null
                && fox[i].publishedAt != null && fox[i].source != null) {
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
        var slideURL = "/slide-headlines";

        var index = 0;

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
            showSlides();
        }

        function showSlides() {
            if(document.getElementById("google-btn").className === "selected" && status_change !== 1) {
                var slide = '';
                slide += '<a href="' + selectObj[index].url + '" target="_blank"><img src="' + selectObj[index].urlToImage + '">';
                slide += '<div class="img-write"><h3 id="img-title"></h3><p id="img-txt"></p></div></a>';

                if(document.getElementById("carousel") !== null) {
                    document.getElementById("carousel").innerHTML = slide;
                }
                if(document.getElementById("img-title") !== null) {
                    document.getElementById("img-title").innerHTML = selectObj[index].title;
                }
                if(document.getElementById("img-txt") !== null) {
                    document.getElementById("img-txt").innerHTML = selectObj[index].description;
                }

                if(index == 4) {
                    index = 0;
                }
                else {
                    index += 1;
                }
                setTimeout(showSlides, 5*1000);
            }
            else {
                status_change = 0;
                if(document.getElementById("google-btn").className === "selected") {
                    google_news();
                }
            }
        }
    }
}

function search_page() {

    if(document.getElementById("search-btn").className !== "selected") {

        status_change = 1;

        document.getElementById("google-btn").className = "not-selected";
        document.getElementById("search-btn").className = "selected";

        var html = '<form id="form" name="form" onsubmit="search();return false">';
        html += '<div>Keyword<span style="color:red;">&nbsp;*&nbsp;</span>&nbsp;&nbsp;&nbsp;';
        html += '<input autocomplete="off" type="text" id="keyword" name="keyword" required />';
        html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;From<span style="color:red;">&nbsp;*&nbsp;</span>';
        html += '&nbsp;&nbsp;&nbsp;<input type="date" id="from" name="from" required />';
        html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To<span style="color:red;">&nbsp;*&nbsp;</span>';
        html += '&nbsp;&nbsp;&nbsp;<input type="date" id="to" name="to" required /></div>';
        html += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Category  &nbsp;&nbsp;&nbsp;';
        html += '<select name="category" id="category" onchange="get_sources(this)">';
        html += '<option value="all" selected>All</option><option value="business">Business</option>';
        html += '<option value="entertainment">Entertainment</option><option value="general">General</option>';
        html += '<option value="health">Health</option><option value="science">Science</option>';
        html += '<option value="sports">Sports</option><option value="technology">Technology</option></select>';
        html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Source  &nbsp;&nbsp;&nbsp;';
        html += '<select name="source" id="source">';
        html += '<option value="all" selected>All</option></select></div>';
        html += '<div><input class="button" type="submit" value="Search"/>&nbsp;&nbsp;&nbsp;';
        html += '<input class="button" type="button" value="Clear" onclick="refresh()"/></div></form>';

        document.getElementById("main").innerHTML = html;
        document.getElementById("keyword").focus();

        var today = new Date();
        var last_week = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

        document.getElementById("to").valueAsDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        document.getElementById("from").valueAsDate = last_week;

        get_sources(document.getElementById('category'));
    }
}

function get_sources(category) {
    var value = category.value;
    var jsonObj;
    var URL = "/sources";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", URL, false);
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
            jsonObj = JSON.parse(xmlhttp.responseText);
        }
        catch(parseError) {
            alert(parseError);
        }
    }

    var src = {};

    if(value !== 'all') {
        for (var source in jsonObj.sources.sources) {
            if(jsonObj.sources.sources[source].category === value) {
                src[jsonObj.sources.sources[source].name] = jsonObj.sources.sources[source].id;
            }
        }
    }
    else {
        for (var source in jsonObj.sources.sources) {
            src[jsonObj.sources.sources[source].name] = jsonObj.sources.sources[source].id;
        }
    }

    document.getElementById("source").innerHTML = '<option value="all" selected>All</option>';

    for(var source in src) {
        var x = document.getElementById("source");
        var option = document.createElement("option");
        option.text = source;
        option.value = src[source];
        x.add(option);
    }
}

function search() {

    if(document.getElementById("to").value < document.getElementById("from").value) {
        alert('Incorrect time');
        return;
    }

    var queryObj;

    var keyword = document.getElementById('keyword').value;
    var from_date = document.getElementById('from').value;
    var to_date = document.getElementById('to').value;
    var category = document.getElementById('category').value;
    var source = document.getElementById('source').value;
    var queryURL = '/query?keyword=' + keyword + '&from=' + from_date + '&to=' + to_date + '&category=' + category + '&source=' + source;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", queryURL, false);
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
            queryObj = JSON.parse(xmlhttp.responseText);
        }
        catch(parseError) {
            alert(parseError);
        }
    }

    console.log(queryObj);

}

function refresh() {
    document.getElementById("search-btn").className = "not-selected";
    search_page();
}
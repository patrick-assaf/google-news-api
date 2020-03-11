
var timer;
var queryObj;

function isvalid(value) {
    return (value !== null && value !== '' && value !== undefined);
}

function cutoff(string) {
    var char = 80;
    if(string.length <= 80) {
        return string;
    }
    else {
        while(string[char] !== ' ' && char < 90) {
            char += 1;
        }
        return string.substring(0, char);
    }
}

async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function google_news() {
    if(document.getElementById("google-btn").className !== "selected") {
        
        document.getElementById("google-btn").className = "selected";
        document.getElementById("search-btn").className = "not-selected";

        var html = '<div id="top-elements"><div id="carousel"></div><div id="cloud"></div></div>';
        html += '<div><h1 class="title"><b>CNN</b></h1><div class="headlines" id="cnn"></div></div>';
        html += '<div><h1 class="title"><b>Fox News</b></h1><div class="headlines" id="fox"></div></div>';

        document.getElementById("main").innerHTML = html;

        var cloudURL = '/word-cloud';
        var cloudObj = getData(cloudURL);

        cloudObj.then((cloudObj) => {

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
        });

        var cnnURL = '/cnn-headlines';
        var cnnObj = getData(cnnURL);

        cnnObj.then((cnnObj) => {

            var cnn_content = '';
            var cnn_count = 0;
            var cnn = cnnObj.headlines.articles;
            var j = 0;
            while(cnn_count < 4) {
                if(isvalid(cnn[j].description) && isvalid(cnn[j].content) && isvalid(cnn[j].urlToImage)
                    && isvalid(cnn[j].author) && isvalid(cnn[j].title) && isvalid(cnn[j].url)
                    && isvalid(cnn[j].publishedAt) && isvalid(cnn[j].source)) {
                    cnn_content += '<div class="card"><a href="' + cnnObj.headlines.articles[j].url + '" target="_blank">';
                    cnn_content += '<img alt="" src="' + cnnObj.headlines.articles[j].urlToImage + '">';
                    cnn_content += '<div class="container"><h4><b>' + cnnObj.headlines.articles[j].title + '</b></h4>'
                    cnn_content += '<p>' + cnnObj.headlines.articles[j].description.replace(/</g, " ") +'</p></div></a></div>';
                    cnn_count += 1;
                    j += 1;
                }
                else {
                    j += 1;
                }
            }
            document.getElementById("cnn").innerHTML = cnn_content;
        });

        var foxURL = '/fox-headlines';
        var foxObj = getData(foxURL);

        foxObj.then((foxObj) => {

            var fox_content = '';
            var fox_count = 0;
            var fox = foxObj.headlines.articles;
            var i = 0;
            while(fox_count < 4) {
                if(isvalid(fox[i].description) && isvalid(fox[i].content) && isvalid(fox[i].urlToImage)
                    && isvalid(fox[i].author) && isvalid(fox[i].title) && isvalid(fox[i].url)
                    && isvalid(fox[i].publishedAt) && isvalid(fox[i].source)) {
                    fox_content += '<div class="card"><a href="' + foxObj.headlines.articles[i].url + '" target="_blank">';
                    fox_content += '<img alt="" src="' + foxObj.headlines.articles[i].urlToImage + '">';
                    fox_content += '<div class="container"><h4><b>' + foxObj.headlines.articles[i].title + '</b></h4>'
                    fox_content += '<p>' + foxObj.headlines.articles[i].description.replace(/</g, " ") +'</p></div></a></div>';
                    fox_count += 1;
                    i += 1;
                }
                else {
                    i += 1;
                }
            }
            document.getElementById("fox").innerHTML = fox_content;
        });

        var slideURL = "/slide-headlines";
        var selectObj = [5];
        var index = 0;
        
        var slideObj = getData(slideURL);

        slideObj.then((slideObj) => {

            var slide_count = 0;
            var  i = 1;
            var articles = slideObj.headlines.articles;
            while(slide_count < 5) {
                if(isvalid(articles[i].description) && isvalid(articles[i].content) && isvalid(articles[i].urlToImage)
                    && isvalid(articles[i].author) && isvalid(articles[i].title) && isvalid(articles[i].url)
                    && isvalid(articles[i].publishedAt) && isvalid(articles[i].source)) {
                        selectObj[slide_count] = slideObj.headlines.articles[i];
                        slide_count += 1;
                        i += 1;
                }
                else {
                    i += 1;
                }
            }

            showSlides();
    
            function showSlides() {
                var slide = '';
                slide += '<a href="' + selectObj[index].url + '" target="_blank"><img alt="" src="' + selectObj[index].urlToImage + '">';
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
                timer = setTimeout(showSlides, 5*1000);
            }
        });        
    }
}

function search_page() {
    if(document.getElementById("search-btn").className !== "selected") {

        clearTimeout(timer);

        document.getElementById("google-btn").className = "not-selected";
        document.getElementById("search-btn").className = "selected";

        var html = '<div><form id="form" name="form" onsubmit="search();return false">';
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
        html += '<input class="button" type="button" value="Clear" onclick="refresh()"/></div></form></div>';
        html += '<div id="query-results"></div>';

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
    var URL = "/sources";

    var jsonObj = getData(URL);

    jsonObj.then((jsonObj) => {

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
    });
}

function search() {
    if(document.getElementById("to").value < document.getElementById("from").value) {
        alert('Incorrect time');
        return;
    }

    var keyword = document.getElementById('keyword').value;
    var from_date = document.getElementById('from').value;
    var to_date = document.getElementById('to').value;
    var category = document.getElementById('category').value;
    var source = document.getElementById('source').value;
    var queryURL = '/query?keyword=' + keyword + '&from=' + from_date + '&to=' + to_date + '&category=' + category + '&source=' + source;

    queryObj = getData(queryURL);

    queryObj.then((queryObj) => {

        if(queryObj.error) {
            var msg = queryObj.error.slice(queryObj.error.search("message")+11, queryObj.error.search("}")-1);
            alert(msg);
            return;
        }
    
        var page = '';
        var query = queryObj.query.articles;
        var count = 0;
        var max = 15;
        var i;
        if(queryObj.query.articles.length === 0) {
            document.getElementById("query-results").innerHTML = '<div><p>No results</p></div>';
            return;
        }
        else if(queryObj.query.articles.length < 15) {
            max = queryObj.query.articles.length;
        }

        for(i = 0; i < queryObj.query.articles.length; i++) {
            if(count >= max) {
                break;
            }
            else if(isvalid(query[i].description) && isvalid(query[i].content) && isvalid(query[i].urlToImage) 
                && isvalid(query[i].author) && isvalid(query[i].title) && isvalid(query[i].url) 
                && isvalid(query[i].publishedAt) && isvalid(query[i].source)) {
                if(count >= 5) {
                    page += '<div class="hidden-row"><div class="query-card" id="' + i + '" onclick="expand(this.id)">';
                }
                else {
                    page += '<div class="card-row"><div class="query-card" id="' + i + '" onclick="expand(this.id)">';
                }
                page += '<img alt="" src="' + query[i].urlToImage + '">';
                page += '<div class="query-container">';
                page += '<h3><b>' + query[i].title + '</b></h3>';
                page += '<p>' + cutoff(query[i].description).replace(/</g, " ") + ' ...' + '</p></div></div></div>';
                count += 1;
            }
        }
    
        if(queryObj.query.articles.length > 0 && count === 0) {
            document.getElementById("query-results").innerHTML = '<div><p>No results</p></div>';
            return;
        }
    
        if(queryObj.query.articles.length > 15 && count === 15) {
            page += '<div><button id="show-btn" class="show-more" type="button" onclick="show_more()">Show More</button></div>';
        }
    
        document.getElementById("query-results").innerHTML = page;
    });
}

function show_more() {
    if(document.getElementsByClassName("hidden-row")[0].style.display === "table-row") {
        var x = document.getElementsByClassName("hidden-row");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById("show-btn").innerHTML = "Show More";
    }
    else {
        var x = document.getElementsByClassName("hidden-row");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "table-row";
        }
        document.getElementById("show-btn").innerHTML = "Show Less";
    }
}

function expand(id) {

    queryObj.then((queryObj) => {

        var elem = document.getElementById(id);
        var query = queryObj.query.articles;
        var text = '';
        if(elem.className === "query-card") {
            text += '<img class="icon" alt="" src="/static/x-icon.png" onclick="expand(this.parentElement.id)">';
            text += '<img alt="" src="' + query[id].urlToImage + '">';
            text += '<div class="query-container">';
            text += '<h3><b>' + query[id].title + '</b></h3>';
            text += '<p><b>Author:</b> ' + query[id].author + '</p>';
            text += '<p><b>Source:</b> ' + query[id].source.name + '</p>';
            var date = new Date(query[id].publishedAt);
            var show_date = ((date.getMonth()>8)?(date.getMonth()+1):('0'+(date.getMonth()+1)))+'/'+((date.getDate()>9)?date.getDate():('0'+date.getDate()))+'/'+date.getFullYear();
            text += '<p><b>Date:</b> ' + show_date + '</p>';
            text += '<p>' + query[id].description.replace(/</g, " ") + '</p>';
            text += '<p><a href="' + query[id].url + '" target="_blank">See Original Post</a></p>';
            elem.className = "expanded";
            elem.onclick = "";
        }
        else {
            text += '<img alt="" src="' + query[id].urlToImage + '" onclick="expand(this.parentElement.id)">';
            text += '<div class="query-container" onclick="expand(this.parentElement.id)">';
            text += '<h3><b>' + query[id].title + '</b></h3>';
            text += '<p>' + cutoff(query[id].description).replace(/</g, " ") + ' ...' + '</p></div>';
            elem.className = "query-card";
            elem.onclick = "expand(this.id)";
        }
        
        elem.innerHTML = text;
    });
}

function refresh() {
    document.getElementById("search-btn").className = "not-selected";
    document.getElementById("query-results").innerHTML = '';
    search_page();
}

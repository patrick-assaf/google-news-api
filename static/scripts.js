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
for(var i = 0; i < 4; i++) {
    cnn_content += '<div class="card"><a href="' + cnnObj.headlines.articles[i].url + '" target="_blank">';
    cnn_content += '<img src="' + cnnObj.headlines.articles[i].urlToImage + '">';
    cnn_content += '<div class="container"><h4><b>' + cnnObj.headlines.articles[i].title + '</b></h4>'
    cnn_content += '<p>' + cnnObj.headlines.articles[i].description +'</p></div></div>';
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
for(var i = 0; i < 4; i++) {
    fox_content += '<div class="card"><a href="' + foxObj.headlines.articles[i].url + '" target="_blank">';
    fox_content += '<img src="' + foxObj.headlines.articles[i].urlToImage + '">';
    fox_content += '<div class="container"><h4><b>' + foxObj.headlines.articles[i].title + '</b></h4>'
    fox_content += '<p>' + foxObj.headlines.articles[i].description +'</p></div></a></div>';
}
document.getElementById("fox").innerHTML = fox_content;
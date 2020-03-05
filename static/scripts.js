var jsonObj;
var url = '/headlines';

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", url, false);
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
        alert("Error: Could not parse JSON file");
    }
}

for(var article in jsonObj.headlines.articles) {
    var content = '<div class="card">';
    content += '<img src="' + jsonObj.headlines.articles[article].urlToImage + '">';
    content += '<div class="container"><h4><b>' + jsonObj.headlines.articles[article].title + '</b></h4>'
    content += '<p>' + jsonObj.headlines.articles[article].description +'</p></div></div>';
    document.write(content);
}
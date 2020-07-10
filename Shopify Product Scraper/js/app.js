
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("fileinput").addEventListener('change', handleFileSelect);
});
var fileData = "";
var URLs = "";
var URLcount = 0;
var tabUrl = "";
var arr=Array();
var isOneProduct = document.getElementById("chkOne");
var output = document.querySelector('output');
var rows = ['"Category","Name","Variant Name","Price","Url","Created At"'];
function handleFileSelect() {

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        // alert("Please select a file ");
    }
    else {
        document.getElementById("fileinput").disabled = true;
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }
}
function receivedText() {

    fileData = fr.result;
	var obj={};
	obj["URLs"]=fileData;
	obj["isOneProduct"]=$(isOneProduct).is(":checked");
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {from: 'popup', type: 'SEND_MESSAGES', messages: obj});
    });
    window.close()
}
function start() {
    rows = ["Category, Name, Variant Name, Price, Url, Created At"];
    tabUrl = URLs[URLcount].trim();
    document.getElementById('processing-text').innerText = "Scraping " + tabUrl + "\n Scraped " + String(0) + "+ products";
    output.textContent = "Processing " + (URLcount + 1) + " of " + URLs.length + " URLs...";
    callMe();
}
function callMe() {
    if ($(isOneProduct).is(":checked"))
        getData(tabUrl, 1, 1, { products: [] }, resultFtn);
    else
        getData(tabUrl, 250, 1, { products: [] }, resultFtn);
}
function resultFtn(response) {
    if (response.msg === "scraped_number") {
        document.getElementById('processing-text').innerText = "Scraping " + tabUrl + "\n Scraped " + String(response.data.count) + "+ products";
    }
    else if (response.completed) {
       

        output.textContent = "Processing Completed.";
        document.getElementById("fileinput").disabled = false;
        document.getElementById("fileinput").value = "";
        $(output).parent().append("</br><button onclick='generateLog();'>Download Log File...</button>")
	//window.open('data:text/csv;,' + escape(arr.join("\n")));
    }
    else {
        if (response.success) {
            document.getElementById('processing-text').innerText = "Scraped " + tabUrl + "\n Generating CSV File.....";
        } else {
            document.getElementById('processing-text').innerText = "is not a Shopify Site";
		arr.push(URLs[URLcount].trim());
        }
        URLcount++;
        if (URLcount >= URLs.length) {
            document.getElementById('processing-text').innerText = "ALL URLs Scraped Successfully.\n Generating CSV File.....";
            csvContent = rows;//.join('\n');
            generate({ data: csvContent }, "", resultFtn);

        }
        else {
            tabUrl = URLs[URLcount].trim();
            document.getElementById('processing-text').innerText = "Scraping " + tabUrl + "\n Scraped " + String(0) + "+ products";
            output.textContent = "Processing " + (URLcount + 1) + " of " + URLs.length + " URLs...";
            callMe();
        }
    }
}
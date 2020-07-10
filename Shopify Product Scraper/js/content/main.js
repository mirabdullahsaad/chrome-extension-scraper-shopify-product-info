
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("fileinput").addEventListener('change', handleFileSelect);
});
var fileData = "";
var URLs = "";
var URLcount = 0;
var tabUrl = "";
var arr=Array();
var isOneProduct = false;
var output = document.querySelector('output');
var processingText = document.querySelector('#processing-text');
var rows = ['"Category","Name","Variant Name","Price","Url","Created At"'];

function filter_array2(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index].trim();
        if (value) {
            result[++resIndex] = value;
        }
    }

    return result;
}

function process(messages) {

    isOneProduct = messages.isOneProduct;
    fileData = messages.URLs;
    fileData = fileData.trimEnd("\r\n");
    URLs = fileData.split("\n");
    URLs = filter_array2(URLs);
    len = URLs.length;
    start();
    //processingText.textContent = "Interval : " + interval + " minutes, Downloads Left :" + downloadCount;
}
function start() {
    rows = ["Category, Name, Variant Name, Price, Url, Created At"];
    tabUrl = URLs[URLcount].trim();
    processingText.innerText = "Scraping " + tabUrl + "\n Scraped " + String(0) + "+ products";
    output.textContent = "Processing " + (URLcount + 1) + " of " + URLs.length + " URLs...";
    callMe();
}
function callMe() {
    if (isOneProduct)
        getData(tabUrl, 1, 1, { products: [] }, resultFtn);
    else
        getData(tabUrl, 250, 1, { products: [] }, resultFtn);
}
function resultFtn(response) {

    if (response.msg === "scraped_number") {
        processingText.innerText = "Scraping " + tabUrl + "\n Scraped " + String(response.data.count) + "+ products";
    }
    else if (response.completed) {
       

        output.textContent = "Processing Completed.";
       /// output.parentElement.innerHTML+=output.parentElement.innerHTML+"</br><button onclick='generateLog();'>Download Log File...</button>";
      //  $(output).parent().append(")
    //window.open('data:text/csv;,' + escape(arr.join("\n")));
        generateLog();
    }
    else {
        if (response.success) {
            processingText.innerText = "Scraped " + tabUrl + "\n Generating CSV File.....";
        } else {
            processingText.innerText = "is not a Shopify Site";
		arr.push(URLs[URLcount].trim());
        }
        URLcount++;
        console.log("URLcount",URLcount);
        console.log("URLs.length",URLs.length);
        if (URLcount >= URLs.length) {
            console.log("response",response);
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

chrome.runtime.onMessage.addListener(function (message, sender, response) {


    process(message.messages);
});
var cont = 0;
function generate(request, sender, sendResponse) {
    filename="Products.csv"
    console.log('Downloading this file in a while.. Please wait');    
    const encoder = new TextEncoder
       let data = request.data.join('\n');
       let uint8array = encoder.encode(data + "\n\n")
   var blob = new Blob([uint8array], { type: 'text/csv;charset=utf-8;' });
           if (navigator.msSaveBlob) { // IE 10+
               navigator.msSaveBlob(blob, filename);
           } else {
               var link = document.createElement("a");
               if (link.download !== undefined) { // feature detection
                   // Browsers that support HTML5 download attribute
                   var url = URL.createObjectURL(blob);
                   link.setAttribute("href", url);
                   link.setAttribute("download", filename);
                   link.style.visibility = 'hidden';
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
               }
           }

    sendResponse({ completed: true });

}
function generateLog(){
    filename="log.txt"   
    const encoder = new TextEncoder
       let data = arr.join('\r\n');
       let uint8array = encoder.encode(data + "\n\n")
   var blob = new Blob([uint8array], { type: 'text/txt;charset=utf-8;' });
           if (navigator.msSaveBlob) { // IE 10+
               navigator.msSaveBlob(blob, filename);
           } else {
               var link = document.createElement("a");
               if (link.download !== undefined) { // feature detection
                   // Browsers that support HTML5 download attribute
                   var url = URL.createObjectURL(blob);
                   link.setAttribute("href", url);
                   link.setAttribute("download", filename);
                   link.style.visibility = 'hidden';
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
               }
           }
}
var getCsvFromJson = function (src,json, baseUrl, callback) {
  console.log('src',src);
    json.products.forEach(function (product, pi) {
        var name = product.title;
        var product_url = baseUrl + '/products/' + product.handle;
        var category = product.product_type;
        var createdAt = product.created_at;
        product.variants.forEach(function (variant, vi) {
            
            var variantNames = [];
            if (variant.option1 && variant.option1 != "Default Title") {
                variantNames = variantNames.concat(variant.option1);
            }
            if (variant.option2 && variant.option2 != "Default Title") {
                variantNames = variantNames.concat(variant.option2);
            }
            if (variant.option3 && variant.option3 != "Default Title") {
                variantNames = variantNames.concat(variant.option3);
            }
            if (variant.option4 && variant.option4 != "Default Title") {
                variantNames = variantNames.concat(variant.option4);
            }
            var variant_name = variantNames.join(" ");
            var price = variant.price;
            var row = ['"'+category.replace(/,/g, ' ').replace(/"/g, '""'), name.replace(/,/g, ' ').replace(/"/g, '""'), variant_name.replace(/,/g, ' ').replace(/"/g, '""'), price.replace(/,/g, ' ').replace(/"/g, '""'), product_url.replace(/,/g, ' ').replace(/"/g, '""'), createdAt+'"']
            rows = rows.concat(row.join('","'));
        });
    });
    console.log(rows);
    callback({ success: true });
}



var getData = function (url, limit, page, existingData, sendResponse) {

    var productsJson = url + '/products.json?limit=' + String(limit) + "&page=" + String(page);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', productsJson, true);
    xhr.onreadystatechange = function () {
        var status;
        var data;
        if (xhr.readyState == 4) {
            status = xhr.status;
            if (status == 200) {
                if(xhr.responseText){
                  data = JSON.parse(xhr.responseText);
                
                  if (data.products.length == 0)
                    return getCsvFromJson('a',combinedData, url, sendResponse);
                  combinedData = {
                    products: existingData.products.concat(data.products)
                  }
                }

                else{
                    combinedData = {
                        products: existingData.products
                    }
                    return getCsvFromJson('b',combinedData, url, sendResponse);
                }
                sendResponse({ msg: "scraped_number", data: { count: combinedData.products.length } });
                if (limit == 5000)
                    return getCsvFromJson('c',combinedData, url, sendResponse);
                if (limit*page < 5000) {
                  return getData(url, limit, page + 1, combinedData, sendResponse)
                }else{
                   return getCsvFromJson('a',combinedData, url, sendResponse);
                  combinedData = {
                    products: existingData.products.concat(data.products)
                  }
                }

                
            } else if (status == 430) {
              if (limit*page < 5000) {
                  return getData(url, limit, page, combinedData, sendResponse)
                }else{
                   return getCsvFromJson('a',combinedData, url, sendResponse);
                  combinedData = {
                    products: existingData.products.concat(data.products)
                  }
                }
                
            } else {
                if (existingData.products.length == 0) {
                    //console.log('Actual failure with no result')
                    sendResponse({ data: "", success: false });
                } else {
                     console.log('Sending data of whatever was downloaded')
                    return getCsvFromJson('d',combinedData, url, sendResponse);
                }
            }
        }
    };
    try {
      console.log("called<<<<<<<");
        xhr.send();
    } catch (e) {
        console.log("called.......");
        sendResponse({ data: "", success: false });
    }
}

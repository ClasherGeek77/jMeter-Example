/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.31818181818181, "KoPercent": 3.6818181818181817};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6172727272727273, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.65, 500, 1500, "products-get-by-id"], "isController": false}, {"data": [0.74, 500, 1500, "products-get-item-comment"], "isController": false}, {"data": [0.73, 500, 1500, "products-set-item-comment"], "isController": false}, {"data": [0.72, 500, 1500, "products-delete-item-invalid"], "isController": false}, {"data": [0.71, 500, 1500, "categories-get-by-id"], "isController": false}, {"data": [0.76, 500, 1500, "categories-get-all-category"], "isController": false}, {"data": [0.04, 500, 1500, "products-create-item"], "isController": false}, {"data": [0.69, 500, 1500, "orders-create-order"], "isController": false}, {"data": [0.755, 500, 1500, "auth-login-invalid"], "isController": false}, {"data": [0.775, 500, 1500, "orders-get-by-id"], "isController": false}, {"data": [0.685, 500, 1500, "products-delete-item"], "isController": false}, {"data": [0.67, 500, 1500, "products-set-item-rating-invalid"], "isController": false}, {"data": [0.74, 500, 1500, "categories-create-cateogry"], "isController": false}, {"data": [0.64, 500, 1500, "products-set-item-rating"], "isController": false}, {"data": [0.0, 500, 1500, "orders-get-all-orders"], "isController": false}, {"data": [0.715, 500, 1500, "auth-register-invalid"], "isController": false}, {"data": [0.745, 500, 1500, "products-get-by-id-invalid"], "isController": false}, {"data": [0.725, 500, 1500, "auth-register"], "isController": false}, {"data": [0.675, 500, 1500, "products-get-item-rating"], "isController": false}, {"data": [0.0, 500, 1500, "products-get-all-items"], "isController": false}, {"data": [0.76, 500, 1500, "auth-info"], "isController": false}, {"data": [0.655, 500, 1500, "auth-login"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 81, 3.6818181818181817, 8618.215909090926, 21, 60146, 376.5, 34114.200000000026, 46603.749999999956, 60037.0, 8.192356531356245, 31.24394155451827, 3.6603265701396053], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["products-get-by-id", 100, 3, 3.0, 7878.409999999999, 50, 60136, 342.5, 31207.400000000012, 49042.89999999995, 60135.56, 0.5092894393741851, 0.4844317380266053, 0.19727505481227592], "isController": false}, {"data": ["products-get-item-comment", 100, 5, 5.0, 5802.67, 28, 60038, 170.5, 23820.300000000025, 40085.6, 60037.89, 0.4766489671016883, 0.18636788422673237, 0.18868596221126988], "isController": false}, {"data": ["products-set-item-comment", 100, 5, 5.0, 4673.389999999999, 21, 60042, 206.0, 18100.700000000015, 28171.049999999945, 60041.78, 0.47637648986747205, 0.18605200155536925, 0.22828854600367762], "isController": false}, {"data": ["products-delete-item-invalid", 100, 4, 4.0, 5872.049999999997, 29, 60041, 149.0, 19248.50000000001, 50000.94999999994, 60040.94, 0.47704461321222763, 0.18584241904552914, 0.22003682784414], "isController": false}, {"data": ["categories-get-by-id", 100, 0, 0.0, 6251.72, 33, 53979, 226.0, 21349.200000000008, 38026.44999999999, 53952.11999999999, 0.4385022517090625, 0.14431177619722077, 0.1747157409153296], "isController": false}, {"data": ["categories-get-all-category", 100, 0, 0.0, 4178.2, 99, 50431, 242.5, 16447.300000000003, 32922.09999999988, 50420.329999999994, 0.4381506537207754, 22.714239067867346, 0.17371988809632305], "isController": false}, {"data": ["products-create-item", 100, 2, 2.0, 12219.920000000004, 225, 60041, 5597.0, 35483.9, 43996.94999999994, 60040.84, 0.5896817487601942, 0.26502278751407865, 0.33570397681371367], "isController": false}, {"data": ["orders-create-order", 100, 3, 3.0, 7648.42, 47, 60146, 256.5, 31208.000000000004, 50069.99999999998, 60144.85, 0.43830044618985425, 0.19471411716428377, 0.21589721197086179], "isController": false}, {"data": ["auth-login-invalid", 100, 4, 4.0, 6156.719999999999, 21, 60039, 202.5, 19353.1, 39231.899999999994, 60038.99, 1.1950143999235192, 0.44425593922156764, 0.5937727799619985], "isController": false}, {"data": ["orders-get-by-id", 100, 0, 0.0, 4211.050000000001, 30, 44200, 208.5, 19149.5, 28449.849999999988, 44081.06999999994, 0.4384945604749773, 0.16871763362025494, 0.1729998070623934], "isController": false}, {"data": ["products-delete-item", 100, 4, 4.0, 5534.110000000001, 24, 60037, 234.0, 18609.0, 34155.34999999996, 60036.89, 0.47638783686574915, 0.14976442621466987, 0.22564221546545474], "isController": false}, {"data": ["products-set-item-rating-invalid", 100, 4, 4.0, 6556.640000000001, 79, 60128, 371.5, 22431.80000000001, 36062.299999999945, 60126.99, 0.5099179032175819, 0.22321855400030594, 0.23665867529702717], "isController": false}, {"data": ["categories-create-cateogry", 100, 3, 3.0, 5863.020000000002, 39, 60027, 203.0, 19168.100000000006, 45757.79999999989, 60026.99, 0.47699910324168593, 0.18298784934221823, 0.23767039302341111], "isController": false}, {"data": ["products-set-item-rating", 100, 2, 2.0, 5626.120000000001, 73, 50115, 453.0, 19911.3, 32984.699999999975, 50065.81999999998, 0.5092505359861892, 0.21111020754505594, 0.2436346070113614], "isController": false}, {"data": ["orders-get-all-orders", 100, 19, 19.0, 46681.96, 18459, 60105, 45637.0, 60022.9, 60031.0, 60104.42, 0.4058902797395808, 0.24909137655658922, 0.129068352430471], "isController": false}, {"data": ["auth-register-invalid", 100, 0, 0.0, 1511.89, 270, 39588, 522.0, 768.1, 798.6499999999999, 39586.159999999996, 2.49233606659522, 0.7545158014106622, 1.314317847618573], "isController": false}, {"data": ["products-get-by-id-invalid", 100, 0, 0.0, 5418.35, 29, 56833, 193.0, 23253.400000000005, 38185.54999999997, 56808.21999999999, 0.5092064526641682, 0.1526624814139645, 0.20189240213051982], "isController": false}, {"data": ["auth-register", 100, 7, 7.0, 7258.380000000001, 39, 60064, 293.0, 21494.600000000002, 60046.9, 60063.98, 1.2137542633118499, 0.5809426167328163, 0.632456054509704], "isController": false}, {"data": ["products-get-item-rating", 100, 3, 3.0, 5785.86, 24, 60028, 362.0, 19646.400000000005, 28061.29999999993, 59952.66999999996, 0.5108896120815176, 0.15036818377465683, 0.20591745077578588], "isController": false}, {"data": ["products-get-all-items", 100, 4, 4.0, 21917.11, 10695, 60030, 15670.5, 36190.4, 57646.999999999956, 60029.99, 0.6941166671294111, 16.377723431816918, 0.2628966876752644], "isController": false}, {"data": ["auth-info", 100, 1, 1.0, 5157.54, 23, 60024, 192.5, 20532.600000000002, 37584.999999999876, 59832.4499999999, 0.7525247204370663, 0.2766263235028521, 0.2946531119719158], "isController": false}, {"data": ["auth-login", 100, 8, 8.0, 7397.219999999999, 24, 60037, 274.5, 37072.00000000002, 39986.29999999999, 60036.86, 0.8331528168896739, 0.3819891757827471, 0.42238569664072784], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 64, 79.01234567901234, 2.909090909090909], "isController": false}, {"data": ["400/Bad Request", 10, 12.345679012345679, 0.45454545454545453], "isController": false}, {"data": ["405/Method Not Allowed", 7, 8.641975308641975, 0.3181818181818182], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 81, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 64, "400/Bad Request", 10, "405/Method Not Allowed", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["products-get-by-id", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["products-get-item-comment", 100, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "400/Bad Request", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["products-set-item-comment", 100, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "405/Method Not Allowed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["products-delete-item-invalid", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["products-create-item", 100, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["orders-create-order", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["auth-login-invalid", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["products-delete-item", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 2, "405/Method Not Allowed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["products-set-item-rating-invalid", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "405/Method Not Allowed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["categories-create-cateogry", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["products-set-item-rating", 100, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["orders-get-all-orders", 100, 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["auth-register", 100, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["products-get-item-rating", 100, 3, "400/Bad Request", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["products-get-all-items", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["auth-info", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["auth-login", 100, 8, "400/Bad Request", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

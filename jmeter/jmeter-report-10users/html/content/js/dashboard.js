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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9068181818181819, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "products-get-by-id"], "isController": false}, {"data": [1.0, 500, 1500, "products-get-item-comment"], "isController": false}, {"data": [1.0, 500, 1500, "products-set-item-comment"], "isController": false}, {"data": [1.0, 500, 1500, "products-delete-item-invalid"], "isController": false}, {"data": [1.0, 500, 1500, "categories-get-by-id"], "isController": false}, {"data": [1.0, 500, 1500, "categories-get-all-category"], "isController": false}, {"data": [1.0, 500, 1500, "products-create-item"], "isController": false}, {"data": [1.0, 500, 1500, "orders-create-order"], "isController": false}, {"data": [1.0, 500, 1500, "auth-login-invalid"], "isController": false}, {"data": [1.0, 500, 1500, "orders-get-by-id"], "isController": false}, {"data": [1.0, 500, 1500, "products-delete-item"], "isController": false}, {"data": [1.0, 500, 1500, "products-set-item-rating-invalid"], "isController": false}, {"data": [1.0, 500, 1500, "categories-create-cateogry"], "isController": false}, {"data": [1.0, 500, 1500, "products-set-item-rating"], "isController": false}, {"data": [0.0, 500, 1500, "orders-get-all-orders"], "isController": false}, {"data": [0.95, 500, 1500, "auth-register-invalid"], "isController": false}, {"data": [1.0, 500, 1500, "products-get-by-id-invalid"], "isController": false}, {"data": [1.0, 500, 1500, "auth-register"], "isController": false}, {"data": [1.0, 500, 1500, "products-get-item-rating"], "isController": false}, {"data": [0.0, 500, 1500, "products-get-all-items"], "isController": false}, {"data": [1.0, 500, 1500, "auth-info"], "isController": false}, {"data": [1.0, 500, 1500, "auth-login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 220, 0, 0.0, 1055.6454545454546, 24, 15610, 112.0, 484.3000000000002, 5911.249999999999, 15487.71, 9.163612129290236, 33.30571124729257, 4.217466248229757], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["products-get-by-id", 10, 0, 0.0, 95.0, 42, 186, 87.0, 180.90000000000003, 186.0, 186.0, 9.22509225092251, 3.8413860701107008, 3.6846315728782284], "isController": false}, {"data": ["products-get-item-comment", 10, 0, 0.0, 95.89999999999999, 40, 186, 90.5, 180.3, 186.0, 186.0, 5.096839959225281, 1.7420839704383282, 2.080545998980632], "isController": false}, {"data": ["products-set-item-comment", 10, 0, 0.0, 163.4, 49, 345, 93.5, 344.9, 345.0, 345.0, 5.173305742369374, 1.758115623383342, 2.5563405328504913], "isController": false}, {"data": ["products-delete-item-invalid", 10, 0, 0.0, 159.70000000000005, 49, 284, 129.0, 280.0, 284.0, 284.0, 4.664179104477611, 1.493994869402985, 2.2409923041044775], "isController": false}, {"data": ["categories-get-by-id", 10, 0, 0.0, 93.80000000000001, 24, 170, 85.0, 169.3, 170.0, 170.0, 4.911591355599214, 1.6164123894891944, 1.9569621807465618], "isController": false}, {"data": ["categories-get-all-category", 10, 0, 0.0, 279.0, 199, 339, 266.0, 338.3, 339.0, 339.0, 4.476275738585497, 219.67672896150404, 1.7747733885407342], "isController": false}, {"data": ["products-create-item", 10, 0, 0.0, 109.0, 44, 193, 99.5, 191.0, 193.0, 193.0, 10.070493454179255, 4.1934164149043305, 5.848557087109769], "isController": false}, {"data": ["orders-create-order", 10, 0, 0.0, 147.4, 60, 223, 156.5, 222.5, 223.0, 223.0, 4.6992481203007515, 1.8540002349624058, 2.3863369360902253], "isController": false}, {"data": ["auth-login-invalid", 10, 0, 0.0, 63.8, 39, 119, 45.0, 118.7, 119.0, 119.0, 17.985611510791365, 5.427298785971223, 9.308959082733812], "isController": false}, {"data": ["orders-get-by-id", 10, 0, 0.0, 110.7, 43, 287, 110.0, 274.6, 287.0, 287.0, 4.833252779120348, 1.8596695263412277, 1.9068692605123247], "isController": false}, {"data": ["products-delete-item", 10, 0, 0.0, 104.4, 30, 235, 100.5, 228.90000000000003, 235.0, 235.0, 4.901960784313726, 1.3643152573529411, 2.3696001838235294], "isController": false}, {"data": ["products-set-item-rating-invalid", 10, 0, 0.0, 198.4, 54, 460, 172.5, 459.9, 460.0, 460.0, 6.329113924050633, 2.459948575949367, 3.028579905063291], "isController": false}, {"data": ["categories-create-cateogry", 10, 0, 0.0, 112.89999999999999, 35, 235, 95.0, 232.3, 235.0, 235.0, 4.805382027871216, 1.5955370014416146, 2.46838959634791], "isController": false}, {"data": ["products-set-item-rating", 10, 0, 0.0, 139.8, 61, 206, 151.5, 204.0, 206.0, 206.0, 8.223684210526315, 3.424393503289474, 3.935161389802632], "isController": false}, {"data": ["orders-get-all-orders", 10, 0, 0.0, 14990.5, 14533, 15610, 14865.0, 15598.8, 15610.0, 15610.0, 0.6027000964320154, 0.1665665305568949, 0.23660687379459983], "isController": false}, {"data": ["auth-register-invalid", 10, 0, 0.0, 246.1, 86, 519, 163.0, 515.8, 519.0, 519.0, 10.395010395010395, 3.1469269750519753, 5.481743762993763], "isController": false}, {"data": ["products-get-by-id-invalid", 10, 0, 0.0, 106.8, 26, 209, 102.0, 208.9, 209.0, 209.0, 8.741258741258742, 2.6206703452797204, 3.465772508741259], "isController": false}, {"data": ["auth-register", 10, 0, 0.0, 76.9, 52, 156, 63.5, 149.50000000000003, 156.0, 156.0, 17.605633802816904, 6.342498349471832, 9.865344410211268], "isController": false}, {"data": ["products-get-item-rating", 10, 0, 0.0, 122.89999999999999, 52, 226, 106.5, 221.70000000000002, 226.0, 226.0, 6.097560975609756, 1.6792111280487805, 2.4830887957317076], "isController": false}, {"data": ["products-get-all-items", 10, 0, 0.0, 5620.2, 5300, 5917, 5626.0, 5905.5, 5917.0, 5917.0, 1.6289297931259161, 38.97214530053755, 0.6426637074442091], "isController": false}, {"data": ["auth-info", 10, 0, 0.0, 93.2, 33, 158, 90.0, 157.6, 158.0, 158.0, 12.903225806451612, 4.523689516129032, 5.103326612903226], "isController": false}, {"data": ["auth-login", 10, 0, 0.0, 94.4, 40, 294, 66.5, 276.9000000000001, 294.0, 294.0, 12.376237623762377, 5.372302366955445, 6.427424969059405], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 220, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

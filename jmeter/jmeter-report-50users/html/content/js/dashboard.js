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

    var data = {"OkPercent": 99.72727272727273, "KoPercent": 0.2727272727272727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.77, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.87, 500, 1500, "products-get-by-id"], "isController": false}, {"data": [0.85, 500, 1500, "products-get-item-comment"], "isController": false}, {"data": [0.88, 500, 1500, "products-set-item-comment"], "isController": false}, {"data": [0.95, 500, 1500, "products-delete-item-invalid"], "isController": false}, {"data": [0.74, 500, 1500, "categories-get-by-id"], "isController": false}, {"data": [0.86, 500, 1500, "categories-get-all-category"], "isController": false}, {"data": [0.0, 500, 1500, "products-create-item"], "isController": false}, {"data": [0.87, 500, 1500, "orders-create-order"], "isController": false}, {"data": [0.88, 500, 1500, "auth-login-invalid"], "isController": false}, {"data": [0.98, 500, 1500, "orders-get-by-id"], "isController": false}, {"data": [0.93, 500, 1500, "products-delete-item"], "isController": false}, {"data": [0.89, 500, 1500, "products-set-item-rating-invalid"], "isController": false}, {"data": [0.95, 500, 1500, "categories-create-cateogry"], "isController": false}, {"data": [0.85, 500, 1500, "products-set-item-rating"], "isController": false}, {"data": [0.0, 500, 1500, "orders-get-all-orders"], "isController": false}, {"data": [0.87, 500, 1500, "auth-register-invalid"], "isController": false}, {"data": [0.93, 500, 1500, "products-get-by-id-invalid"], "isController": false}, {"data": [0.95, 500, 1500, "auth-register"], "isController": false}, {"data": [0.89, 500, 1500, "products-get-item-rating"], "isController": false}, {"data": [0.0, 500, 1500, "products-get-all-items"], "isController": false}, {"data": [0.91, 500, 1500, "auth-info"], "isController": false}, {"data": [0.89, 500, 1500, "auth-login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 3, 0.2727272727272727, 4657.7954545454495, 22, 60032, 218.0, 17624.899999999994, 38258.850000000086, 50033.72000000002, 8.317769023115837, 31.29548779934516, 3.8183832265571236], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["products-get-by-id", 50, 0, 0.0, 2163.62, 64, 47234, 193.0, 1251.8999999999999, 21520.54999999983, 47234.0, 0.7168972686214066, 0.29874453365832676, 0.2863388504552297], "isController": false}, {"data": ["products-get-item-comment", 50, 0, 0.0, 1489.0200000000002, 31, 19282, 154.5, 1501.3999999999999, 16508.2, 19282.0, 0.6283617352837682, 0.2147720774895692, 0.2564992239732569], "isController": false}, {"data": ["products-set-item-comment", 50, 0, 0.0, 1406.3600000000001, 33, 17426, 157.5, 1425.1, 14467.899999999983, 17426.0, 0.7108128856159905, 0.24156531659605926, 0.35124152355633903], "isController": false}, {"data": ["products-delete-item-invalid", 50, 0, 0.0, 1446.34, 28, 45964, 113.5, 432.09999999999997, 8595.899999999923, 45964.0, 0.6328793478811199, 0.20271916611817123, 0.3040787491772568], "isController": false}, {"data": ["categories-get-by-id", 50, 0, 0.0, 4105.0199999999995, 28, 44314, 140.0, 17221.3, 34106.74999999993, 44314.0, 0.6361161293605762, 0.2093468121040177, 0.2534525202921045], "isController": false}, {"data": ["categories-get-all-category", 50, 0, 0.0, 1940.2200000000003, 111, 46398, 263.0, 1320.0999999999995, 17034.299999999996, 46398.0, 0.6343245711965898, 32.61914994164214, 0.25149978115802296], "isController": false}, {"data": ["products-create-item", 50, 0, 0.0, 10039.26, 2576, 53551, 5541.5, 23743.8, 44112.949999999924, 53551.0, 0.6785733673524781, 0.2827742454264155, 0.3941954622102492], "isController": false}, {"data": ["orders-create-order", 50, 0, 0.0, 2399.5000000000005, 70, 43355, 217.0, 9550.8, 17171.14999999999, 43355.0, 0.6353482343672567, 0.25066473309020676, 0.3226377752646225], "isController": false}, {"data": ["auth-login-invalid", 50, 0, 0.0, 2041.18, 44, 20326, 184.0, 16370.899999999976, 18190.2, 20326.0, 2.365296371635366, 0.7137466590188751, 1.224225661100336], "isController": false}, {"data": ["orders-get-by-id", 50, 0, 0.0, 239.08000000000004, 47, 1455, 182.0, 412.4999999999999, 860.5499999999963, 1455.0, 0.6357602420975003, 0.24461868690079597, 0.2508272830150294], "isController": false}, {"data": ["products-delete-item", 50, 0, 0.0, 1889.8600000000004, 39, 43969, 127.0, 411.69999999999993, 20908.549999999956, 43969.0, 0.6323670764405321, 0.17600060232964032, 0.30568525667779634], "isController": false}, {"data": ["products-set-item-rating-invalid", 50, 0, 0.0, 1194.68, 66, 27521, 319.5, 1183.299999999999, 7305.599999999945, 27521.0, 0.7070435680246617, 0.2748079492908353, 0.338331394855551], "isController": false}, {"data": ["categories-create-cateogry", 50, 1, 2.0, 1770.3600000000001, 42, 60032, 144.5, 478.0, 9407.199999999924, 60032.0, 0.6325270721586884, 0.2317742265775225, 0.3184131398011335], "isController": false}, {"data": ["products-set-item-rating", 50, 0, 0.0, 1936.5799999999995, 69, 40034, 337.0, 1590.8999999999985, 18357.149999999983, 40034.0, 0.7106714423787595, 0.2961501151287737, 0.3400673894195236], "isController": false}, {"data": ["orders-get-all-orders", 50, 2, 4.0, 40108.42000000001, 31110, 60026, 39876.5, 50881.499999999985, 58989.09999999999, 60026.0, 0.453079125738519, 0.15739190098408787, 0.17075419551270435], "isController": false}, {"data": ["auth-register-invalid", 50, 0, 0.0, 727.8, 118, 19264, 332.0, 601.9, 604.9, 19264.0, 2.493765586034913, 0.754948566084788, 1.3150716957605983], "isController": false}, {"data": ["products-get-by-id-invalid", 50, 0, 0.0, 1884.34, 26, 52041, 107.0, 475.0, 17128.34999999999, 52041.0, 0.7153178157055179, 0.2144556342007754, 0.28361233708636746], "isController": false}, {"data": ["auth-register", 50, 0, 0.0, 624.06, 56, 18797, 214.0, 460.2, 648.1999999999999, 18797.0, 2.5527135344871597, 0.9194754492775821, 1.4303173022923368], "isController": false}, {"data": ["products-get-item-rating", 50, 0, 0.0, 2407.08, 46, 43159, 153.5, 3297.599999999996, 26555.999999999956, 43159.0, 0.7078944387812889, 0.19494749193000338, 0.288273418917771], "isController": false}, {"data": ["products-get-all-items", 50, 0, 0.0, 20014.24, 8904, 50324, 15114.5, 33316.7, 40916.59999999993, 50324.0, 0.9563886763580719, 23.226365992014156, 0.37732521996939555], "isController": false}, {"data": ["auth-info", 50, 0, 0.0, 1007.0200000000001, 42, 22497, 160.0, 533.4, 8593.999999999924, 22497.0, 1.1480792633923447, 0.40250044488071457, 0.4540743180409175], "isController": false}, {"data": ["auth-login", 50, 0, 0.0, 1637.4600000000003, 22, 18478, 160.5, 1304.899999999999, 18265.95, 18478.0, 2.3617212224269046, 1.0249501086391763, 1.2264344504274716], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, 100.0, 0.2727272727272727], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["categories-create-cateogry", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["orders-get-all-orders", 50, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: altashop-api.fly.dev:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

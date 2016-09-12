var dataTable;
var setUpTable;
var setUpCall;

$(document).ready(function () {
    $.ajax({
        type: 'POST',
        url: '/fullBackCheck',
        contentType: 'application/json',
        success: function (data) {
            if (data == true) {

                NProgress.start();

                google.charts.load('current', { 'packages': ['corechart'] });

                setUpCall = $.ajax({
                    type: 'POST',
                    url: '/getProcessedData',
                    contentType: 'application/json',
                    success: function (data) {
                        $("#fileName").text(data.name);
                        showTable(JSON.parse(data.data));
                        google.charts.setOnLoadCallback(drawChart);
                    }
                });
            }
            else {
                window.location = "/";
            }
        }
    });
});

function showTable(fileContentArray) {
    var rows = fileContentArray.length;
    var cols = fileContentArray[0].length;

    //generate header

    setTimeout(function () {

        var headArr = fileContentArray.splice(0, 1);
        var headObjArr = [];
        for (i = 0; i < cols; i++) {
            NProgress.inc();
            var val = headArr[0][i];
            headObjArr.push({ title: val });
        }
        dataTable = $("#dataTable").DataTable({
            data: fileContentArray,
            columns: headObjArr,
            "iDisplayLength": 25

        });


        // for stopping while the table is loading (doesn't work with large files)
        /*
        setUpTable = true;
        arrLen = fileContentArray.length;
        for (i = 0; i < arrLen; i++)
        {
            dataTable.row.add(fileContentArray[i]).draw(false);
            if (!setUpTable)
                break;
        }
        */

        NProgress.done();
    }, 10);

}



function backButton() {
    NProgress.start();
    $("#dataTable").html("");
    setUpCall.abort();
    setUpTable = false;
    // dataTable.destroy();
    dataTable = null;
    NProgress.done();
    window.location = '/userlist'
}

function logout() {
    window.location = '/';
}


function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Season', 'W-L%', 'test', 'test2'],
        [1, 37.8, 80.8, 41.8],
        [2, 30.9, 69.5, 32.4],
        [3, 25.4, 57, 25.7],
        [4, 11.7, 18.8, 10.5],
        [5, 11.9, 17.6, 10.4],
        [6, 8.8, 13.6, 7.7],
        [7, 7.6, 12.3, 9.6],
        [8, 12.3, 29.2, 10.6],
        [9, 16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11, 5.3, 7.9, 4.7],
        [12, 6.6, 8.4, 5.2],
        [13, 4.8, 6.3, 3.6],
        [14, 4.2, 6.2, 3.4]
    ]);

    var options = {
        title: 'Statistics',
        curveType: 'function',
        legend: { position: 'right' },
        backgroundColor: 'whitesmoke'

    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

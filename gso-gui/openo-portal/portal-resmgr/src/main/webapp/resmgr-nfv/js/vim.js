function loadVimData() {
    var requestUrl = "/resmgr/rest/v1/resmanage/vim/vimInfo";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            printCharts(jsonobj.data[0].used.cpu,
                jsonobj.data[0].total.cpu, jsonobj.data[0].used.memory, jsonobj.data[0].total.memory, jsonobj.data[0].used.disk, jsonobj.data[0].total.disk);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on getting data (here display the test data) : " + xhr.responseText);
            printCharts(11, 12, 21, 22, 31, 32);
        }
    });
}
function printCharts(v11, v12, v21, v22, v31, v32) {
    var cpuChart = new Chart($("#cpuChart"), {
        type: 'doughnut',
        data: {
            labels: ["used", "available"],
            datasets: [{
                data: [v11, v12],
                backgroundColor: ["#FFCE56", "#36A2EB"],
                hoverBackgroundColor: ["#FFCE56", "#36A2EB"]
            }]
        },
        options: {
            animation: {
                animateScale: true,
                animateRotate: true

            }
        }
    });
    var memoryChart = new Chart($("#memoryChart"), {
        type: 'doughnut',
        data: {
            labels: ["used", "available"],
            datasets: [{
                data: [v21, v22],
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB"]
            }]
        },
        options: {

            animation: {
                animateScale: true,
                animateRotate: true

            }
        }
    });
    var diskChart = new Chart($("#diskChart"), {
        type: 'doughnut',
        data: {
            labels: ["used", "available"],
            datasets: [{
                data: [v31, v32],
                backgroundColor: ["#FF6384", "green"],
                hoverBackgroundColor: ["#FF6384", "green"]
            }]
        },
        options: {
            animation: {
                animateScale: true,
                animateRotate: true

            }
        }
    });
}

$(function () {
    loadVimData();

})
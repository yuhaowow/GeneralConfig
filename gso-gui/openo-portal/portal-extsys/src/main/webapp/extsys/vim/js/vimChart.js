/*
 * Copyright 2016 ZTE Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vimChart = {};


var labelTop = {
    normal: {
        label: {
            show: true,
            position: 'outer',
            formatter: function (params) {
                var total = params.series.data[1].value + params.series.data[0].value;
                var util = params.series.data[0].util;                
                return $.i18n.prop('com_zte_ums_eco_roc_vim_resource_chart_used') + params.value + util + "\n" +
                    $.i18n.prop('com_zte_ums_eco_roc_vim_resource_chart_total') + total + util;
            },
            textStyle: {
                baseline: 'bottom',
                fontWeight: 'normal'

            }
        },
        labelLine: {
            show: true
        }
    }
};


var labelFromatter = {
    normal: {
        label: {
            formatter: function (params) {
                return params.series.data[0].name + "\n" + (100 - params.percent).toFixed(0) + '%'
            },
            textStyle: {
                baseline: 'center',
                color: "#000",
                fontWeight: 'bold'


            }
        }
    }
}
var labelBottom = {
    normal: {
        color: '#ccc',
        label: {
            show: true,
            position: 'center'
        },
        labelLine: {
            show: false
        }
    },
    emphasis: {
        color: 'rgba(0,0,0,0)'
    }
};

var radius = [40, 55];

var vimPieChart;

vimChart.vimPieChartInit = function () {
    vimPieChart = echarts.init(document.getElementById('vimPieChartDiv'));
    vimPieChart.showLoading({
        text: "Loading",
        effect: "whirling",
        textStyle: {
            fontSize: 20
        }
    });

}

vimChart.vimPieChart = function (data) {

    var option = {
        animation: true,
        legend: {
            x: 'left',
            y: "top",
            data: [
                $.i18n.prop('com_zte_ums_eco_roc_vim_resource_vim_cpu'),
                $.i18n.prop('com_zte_ums_eco_roc_vim_resource_vim_memory'),
                $.i18n.prop('com_zte_ums_eco_roc_vim_resource_vim_disk')
            ],
            orient: 'vertical'
        },
        color: ["#578ebe", "#44b6ae", "#DABA36"],
        title: {
            text: '',
            subtext: '',
            x: 'center'
        },
        toolbox: {
            show: true,

            feature: {
                saveAsImage: {
                    show: true,
                    title: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_chart_save_picture'),
                    type: 'png',
                    lang: [$.i18n.prop('com_zte_ums_eco_roc_vim_resource_chart_click_save')]
                }
            }
        },
        series: [
            {
                type: 'pie',
                center: ['15%', '55%'],
                radius: radius,
                itemStyle: labelFromatter,
                data: [
                    {
                        name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_vim_cpu'),
                        value: data.usage.cpu,
                        itemStyle: labelTop,
                        util: ''
                    },
                    {name: 'other', value: data.resource.cpu - data.usage.cpu, itemStyle: labelBottom}

                ]
            },
            {
                type: 'pie',
                center: ['40%', '55%'],
                radius: radius,
                itemStyle: labelFromatter,
                data: [
                    {
                        name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_vim_memory'),
                        value: data.usage.memoryMb,
                        itemStyle: labelTop,
                        util: 'MB'
                    },
                    {name: 'other', value: data.resource.memoryMb - data.usage.memoryMb, itemStyle: labelBottom}

                ]
            },
            {
                type: 'pie',
                center: ['65%', '55%'],
                radius: radius,
                itemStyle: labelFromatter,
                data: [
                    {
                        name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_vim_disk'),
                        value: data.usage.diskGb,
                        itemStyle: labelTop,
                        util: 'GB'
                    },
                    {name: 'other', value: data.resource.diskGb - data.usage.diskGb, itemStyle: labelBottom}

                ]
            }

        ]
    };


     
    vimPieChart.hideLoading();
    vimPieChart.setOption(option);
    window.onresize = vimPieChart.resize;


}

vimChart.getPieCenter = function (n) {
    var center;
    switch (n) {
        case 1:
            center = ['15%', '30%'];
            break;
        case 2:
            center = ['40%', '30%'];
            break;
        case 3:
            center = ['65%', '30%'];
            break;
        case 4:
            center = ['15%', '80%'];
            break;
        case 5:
            center = ['40%', '80%'];
            break;
        case 6:
            center = ['65%', '80%'];
            break;
        case 7:
            center = ['90%', '80%'];
            break;

    }
    return center;
}


var tenantPieChart;
vimChart.tenantPieChartInit = function () {
    tenantPieChart = echarts.init(document.getElementById('tenantPieChartDiv'));

    tenantPieChart.showLoading({
        text: "Loading",
        effect: "whirling",
        textStyle: {
            fontSize: 20
        }
    });
}
vimChart.tenantPieChart = function (data) {

    var legend_data = new Array();
    var series = new Array();
    var n = 0;

    if (data.quota.instances != -1) {
        n++;

        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_instances'));
        var instances_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_instances'),
                    value: data.usage.instances,
                    itemStyle: labelTop,
                    util: ''
                },
                {name: 'other', value: data.quota.instances - data.usage.instances, itemStyle: labelBottom}

            ]
        };
        series.push(instances_series);

    }
    if (data.quota.cpu != -1) {
        n++;
        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_cpu'));
        var cpu_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_cpu'),
                    value: data.usage.cpu,
                    itemStyle: labelTop,
                    util: ''
                },
                {name: 'other', value: data.quota.cpu - data.usage.cpu, itemStyle: labelBottom}

            ]
        };
        series.push(cpu_series);
    }
    if (data.quota.memoryMb != -1) {
        n++;
        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_memoryMb'));
        var memoryMb_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_memoryMb'),
                    value: data.usage.memoryMb,
                    itemStyle: labelTop,
                    util: 'MB'
                },
                {name: 'other', value: data.quota.memoryMb - data.usage.memoryMb, itemStyle: labelBottom}

            ]
        };
        series.push(memoryMb_series);
    }
    if (data.quota.floatingIps != -1) {
        n++;
        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_floatingIps'));
        var floatingIps_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_floatingIps'),
                    value: data.usage.floatingIps,
                    itemStyle: labelTop,
                    util: ''
                },
                {name: 'other', value: data.quota.floatingIps - data.usage.floatingIps, itemStyle: labelBottom}

            ]
        };
        series.push(floatingIps_series);
    }
    if (data.quota.securityGroups != -1) {
        n++;
        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_securityGroups'));
        var securityGroups_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_securityGroups'),
                    value: data.usage.securityGroups,
                    itemStyle: labelTop,
                    util: ''
                },
                {name: 'other', value: data.quota.securityGroups - data.usage.securityGroups, itemStyle: labelBottom}

            ]
        };
        series.push(securityGroups_series);
    }
    if (data.quota.volumes != -1) {
        n++;
        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_volumes'));
        var volumes_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_volumes'),
                    value: data.usage.volumes,
                    itemStyle: labelTop,
                    util: ''
                },
                {name: 'other', value: data.quota.volumes - data.usage.volumes, itemStyle: labelBottom}

            ]
        };
        series.push(volumes_series);
    }
    if (data.quota.volumeStorage != -1) {
        n++;
        legend_data.push($.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_volumeStorage'));
        var volumeStorage_series = {
            type: 'pie',
            center: vimChart.getPieCenter(n),
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                {
                    name: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_tenant_volumeStorage'),
                    value: data.usage.volumeStorage,
                    itemStyle: labelTop,
                    util: 'GB'
                },
                {name: 'other', value: data.quota.volumeStorage - data.usage.volumeStorage, itemStyle: labelBottom}

            ]
        };
        series.push(volumeStorage_series);
    }


    var option = {
        animation: true,
        legend: {
            x: 'left',
            y: "top",
            data: legend_data,
            orient: 'vertical'
        },
        color: ["#578ebe", "#44b6ae", "#DABA36", "#F79695", "#9699e0", "#57b5e3", "#48c79c"],
        title: {
            text: '',
            subtext: '',
            x: 'center'
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    title: $.i18n.prop('com_zte_ums_eco_roc_vim_resource_chart_save_picture'),
                    type: 'png',
                    lang: [$.i18n.prop('com_zte_ums_eco_roc_vim_resource_chart_click_save')]
                }
            }
        },
        series: series
    };


  
    tenantPieChart.hideLoading();
    tenantPieChart.setOption(option);
    window.onresize = tenantPieChart.resize;


}

vimChart.growl = function (message, type) {
    $.growl({
        icon: "fa fa-envelope-o fa-lg",
        title: "&nbsp;&nbsp;" + $.i18n.prop('com_zte_ums_eco_roc_vim_title_notice'),
        message: message + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }, {
        type: type,
        delay: 0
    });
}
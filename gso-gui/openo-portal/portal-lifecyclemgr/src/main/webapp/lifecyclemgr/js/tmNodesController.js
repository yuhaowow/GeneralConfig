/*
 * Copyright 2016 ZTE Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var vm = avalon.define({
    $id: "tmNodesController",
    instanceId: "",
    $language: {
        "sProcessing": "<img src='../common/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;"
        + $.i18n.prop("nfv-nso-iui-table-sProcess") + "</span>",
        "sLengthMenu": $.i18n.prop("nfv-nso-iui-table-sLengthMenu"),
        "sZeroRecords": $.i18n.prop("nfv-nso-iui-table-sZeroRecords"),
        "sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("nfv-nso-iui-table-sInfo"),
        "sInfoEmpty": $.i18n.prop("nfv-nso-iui-table-sInfoEmpty"),
        "sGroupActions": $.i18n.prop("nfv-nso-iui-table-sGroupActions"),
        "sAjaxRequestGeneralError": $.i18n.prop("nfv-nso-iui-table-sAjaxRequestGeneralError"),
        "sEmptyTable": $.i18n.prop("nfv-nso-iui-table-sEmptyTable"),
        "oPaginate": {
            "sPrevious": $.i18n.prop("nfv-nso-iui-table-sPrevious"),
            "sNext": $.i18n.prop("nfv-nso-iui-table-sNext"),
            "sPage": $.i18n.prop("nfv-nso-iui-table-sPage"),
            "sPageOf": $.i18n.prop("nfv-nso-iui-table-sPageOf")
        }
    },
    $restUrl: {
        queryNodeInstanceUrl: "/openoapi/nslcm/v1.0/ns/"
    },
    $init: function () {
        vm.$initInstanceData();
    },
    $initInstanceData: function () {
        $.ajax({
            type: "GET",
            url: vm.$restUrl.queryNodeInstanceUrl,
            success: function (resp) {
                if (resp) {
                    vm.servicesInstanceData = [
                        resp.nsName,
                        resp.description,
                        resp.nsdId,
                        resp.nsState
                    ];
                    var tableData = [
                        [resp.vnfInfoId, 'vnf'],
                        [resp.vlInfo.vldId, 'vl'],
                        [resp.vnffgInfo.vnffgInstanceId, 'vnffg']
                    ];
                    vm.$initNfvNodesTab();
                    vm.nodesList.nodesData = tableData;
                    vm.nodesList.$initNodesTable();
                }
            },
            error: function () {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });
    },
    servicesInstanceData: [],
    $nodesTabId: "ict_nodes_template_table",
    $nodesInstanceTabFields: {// table columns
        table: [
            {"mData": "serviceInstanceId", name: "ID", "bVisible": false},
            {"mData": "", name: "", "sClass": 'details-control'},
            {"mData": "serviceName", name: "Service Name"},
            {"mData": "serviceDescription", name: "Service Description"},
            {"mData": "nsdId", name: "NSD ID"},
            {"mData": "status", name: "Status"}
        ]
    },
    $initNfvNodesTab: function () {
        var setting = {};
        setting.language = vm.$language;
        setting.paginate = true;
        setting.info = true;
        setting.columns = vm.$nodesInstanceTabFields.table;
        setting.tableId = vm.$nodesTabId;
        vm.$initDataTable(setting, vm.$nodesTabId + '_div', vm.servicesInstanceData);
        $('#' + vm.$nodesTabId + '>tbody').on("click", 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var table = $('#' + vm.$nodesTabId).dataTable();
            if (table.fnIsOpen(tr[0])) {
                table.fnClose(tr[0]);
                tr.removeClass('shown');
            }
            else {
                table.fnOpen(tr[0], vm.nodesList.$format_Detail(), 'details');
                tr.addClass('shown');
            }
        });
    },

    $initDataTable: function (setting, divId, tableData) {
        //transform colomn
        var column = setting.columns;
        //empty table
        $('#' + divId).children().remove();
        var tableId = setting.tableId;
        var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= ' + tableId + '>'
            + '<thead>'
            + '<tr role="row" class="heading" >'
            + '</tr>'
            + '</thead>'
            + '<tbody>'
            + '</tbody>'
            + '</table>';
        $('#' + divId).append(tableEleStr);
        var trEle = $('#' + tableId + ' > thead >tr');
        for (var one in column) {
            var th = '<th>' + column[one].name + '</th>';
            trEle.append(th);
        }
        var table = $("#" + tableId).dataTable({
            "sDom": '<"top"rt><"bottom"lip>',
            "oLanguage": setting.language,//language
            "bPaginate": setting.paginate,// page button
            "bFilter": false,// search bar
            "bAutoWidth": true,//automatically set colum width
            "bLengthChange": true,// record number in each row
            "iDisplayLength": 10,// row number in each page
            "bSort": setting.sort ? true : false,// sort
            "bInfo": setting.info,// Showing 1 to 10 of 23 entries 
            "bWidth": true,
            "bScrollCollapse": true,
            "sPaginationType": "bootstrap_extended", // page, a total of two kinds of style, another one is two_button
            "bProcessing": true,
            "bServerSide": false,
            "bDestroy": true,
            "bSortCellsTop": true,
            "aoColumns": setting.columns,
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: ['_all']
                }
            ],
            "aaData": tableData
        });
    };

//nodes list table
nodesList :{
    nodesData: [],
        $nodesTabDataId
:
    "ict_nodes_table",
        $nodesTabFields
:
    {// table columns
        table: [
            {"mData": "id", name: "ID", "bVisible": false},
            {"mData": "instanceId", name: "Instance Id"},
            {"mData": "nodeType", name: "Node Type"}
        ]
    }
,
    $initNodesTable: function () {
        var setting = {};
        setting.language = vm.$language;
        setting.paginate = true;
        setting.info = true;
        setting.columns = vm.nodesList.$nodesTabFields.table;
        setting.tableId = vm.nodesList.$nodesTabDataId;
        vm.$initDataTable(setting, vm.nodesList.$nodesTabDataId + '_div', vm.nodesList.nodesData);
    }
}
})
;

var initParam = function () {
    var paramStr = window.location.search.substring(1);
    if (paramStr.length > 0) {
        avalon.scan();
        var params = paramStr.split("&");
        var instanceId = params[0].substring(params[0].indexOf('=') + 1);

        vm.instanceId = instanceId;
        vm.$restUrl.queryNodeInstanceUrl = commonUtil.format(vm.$restUrl.queryNodeInstanceUrl, instanceId);
        vm.$init();
    }
};

initParam();
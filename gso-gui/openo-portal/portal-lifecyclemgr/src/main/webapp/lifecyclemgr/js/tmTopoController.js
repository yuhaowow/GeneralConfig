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
    $id: "tmTopoController",
    templateId: "",
    nodesData: [],
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
        queryNodeTemplateUrl: "/openoapi/catalog/v1/servicetemplates/{0}/nodetemplates",
        queryTemplateInfoUrl: "/openoapi/catalog/v1/servicetemplates"
    },
    $init: function () {
        vm.$initTemplateData();
        vm.$initTopoNodesData();
    },
    $initTemplateData: function () {
        $.ajax({
            type: "GET",
            url: vm.$restUrl.queryTemplateInfoUrl,
            success: function (resp) {
                if (resp) {
                    vm.servicesTemplateData = [];
                    for (var i = 0; i < resp.length; i++) {
                        //generate node table display data
                        vm.servicesTemplateData.push(resp[i]);
                    }
                    //vm.$initNfvNodesTab();
                }
            },
            error: function () {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });
    },
    $initTopoNodesData: function () {
        $.ajax({
            type: "GET",
            url: vm.$restUrl.queryNodeTemplateUrl,
            success: function (resp) {
                if (resp) {
                    vm.nodesDetail.nodesTemplateDetailData = [];
                    for (var i = 0; i < resp.length; i++) {
                        //generate node table display data
                        var nodeTemplate = topoUtil.generateNodeTemplate(resp[i]);
                        vm.nodesData.push(nodeTemplate);
                    }
                    vm.nodesDetail.nodesTemplateDetailData = resp;
                    //generate topology graph display data
                    vm.topologyTab.topoTemplateData = topoUtil.generateTopoTemplate(vm.nodesData.$model);
                    //initialize topology data
                    topoUtil.initTopoData(vm.topologyTab.topoTemplateData.$model);
                }
            },
            error: function () {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });
    },
    topologyTab: {
        topology: "topology.html",
        vnfTip: $.i18n.prop("nfv-topology-iui-vnf-tip"),
        btnTip: $.i18n.prop("nfv-topology-iui-btn-return-tip"),
        topoTemplateData: [],
        boxTopoDatas: [],
        networkTopoDatas: [],
        isShowNum: false,
        returnBtnVisible: false,
        $getColor: function (index) {
            return topoUtil.getColor(index);
        },
        $getCidr: function (properties) {
            return topoUtil.getCidr(properties);
        },
        $getCpTop: function (index, parentBoxId) {
            return topoUtil.getCpTop(index, parentBoxId);
        },
        $initTopology: function () {
            topoUtil.initTopoData(vm.topologyTab.topoTemplateData.$model);
        },
        $showTopo: function (id, name) {
            vm.nodesDetail.$showDetails("block", id, name);
        },
        $showVnfTopo: function (templateId) {
            vm.topologyTab.returnBtnVisible = true;
            vm.$restUrl.queryNodeTemplateUrl = "/openoapi/catalog/v1/servicetemplates/" + templateId + "/nodetemplates";
            vm.$init();
        },
        $returnNS: function () {
            vm.topologyTab.returnBtnVisible = false;
            vm.$restUrl.queryNodeTemplateUrl = "/openoapi/catalog/v1/servicetemplates/" + vm.templateId + "/nodetemplates";
            vm.$init();
        }
    },
    //Nodes Details
    nodesDetail: {
        nodesTemplateDetailData: [],
        detailTitle: "",
        isShow: "none",
        detailIndex: 0,
        detailData: [
            {id: "general", name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-general"), isActive: true},
            {id: "properties", name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-properties"), isActive: false},
            {
                id: "relationShips",
                name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-relationShips"),
                isActive: false
            }
        ],
        $showDetails: function (isShow, nodetypeid, nodetypename) {
            vm.nodesDetail.isShow = isShow;
            if (isShow == "block") {
                vm.nodesDetail.detailTitle = nodetypename + " " + $.i18n.prop("nfv-templateDetail-nodesTab-iui-title-nodeDetail"),
                    $('#' + vm.nodesDetail.detailData[0].id).click();
                vm.nodesDetail.detailData[0].isActive = true;
                vm.nodesDetail.$initNodeDetailTable(nodetypeid);
            }
        },
        detailCondChange: function (index) {
            vm.nodesDetail.detailIndex = index;
            for (var i = 0; i < vm.nodesDetail.detailData.length; i++) {
                vm.nodesDetail.detailData[i].isActive = false;
            }
            vm.nodesDetail.detailData[index].isActive = true;
        },
        $tableFields: {// table columns
            general: [
                {"mData": "key", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-key"), "bSortable": false},
                {
                    "mData": "value",
                    "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-value"),
                    "bSortable": false
                }
            ],
            properties: [
                {"mData": "key", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-key"), "bSortable": false},
                {
                    "mData": "value",
                    "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-value"),
                    "bSortable": false
                }
            ],
            relationShips: [
                {
                    "mData": "sourceNodeName",
                    "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-sourceNodeName"),
                    "bSortable": false
                },
                {
                    "mData": "targetNodeName",
                    "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-targetNodeName"),
                    "bSortable": false
                },
                {"mData": "type", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-type"), "bSortable": false}
            ]
        },
        $initNodeDetailTable: function (nodetemplateid) {
            var data = topoUtil.getCurrentDetailData(vm.nodesDetail.nodesTemplateDetailData.$model, nodetemplateid);
            //initialize three tables of nodedetail
            $.each(vm.nodesDetail.$tableFields, function (key, value) {
                var setting = {};
                setting.language = vm.$language;
                setting.paginate = false;
                setting.info = false;
                setting.columns = value;
                setting.tableId = "ict_table_" + key;
                serverPageTable.initTableWithData(setting, setting.tableId + '_div', data[key]);
            });
        }
    },
});

var initParam = function () { //initialize template detail params
    var paramStr = window.location.search.substring(1);
    if (paramStr.length > 0) {
        avalon.scan();
        var params = paramStr.split("&");
        var instanceId = params[0].substring(params[0].indexOf('=') + 1);
        var templateQueryUrl = '/openoapi/nslcm/v1.0/ns/' + instanceId;
        $.ajax({
            type: "GET",
            url: templateQueryUrl,
            contentType: "application/json",
            dataType: "json",
            success: function (jsonResp) {
                initTopo(jsonResp.nsdId)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on page : " + xhr.responseText);
            }
        });
    }
};

function initTopo(templateId) {
    vm.templateId = templateId;
    vm.$restUrl.queryNodeTemplateUrl = commonUtil.format(vm.$restUrl.queryNodeTemplateUrl, templateId);
    vm.$init();
}

initParam();
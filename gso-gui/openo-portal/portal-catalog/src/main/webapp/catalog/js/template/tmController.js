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
avalon.config({
	interpolate: ["<!--", "-->"]
});

var vm = avalon.define({
	$id: "tmController",
    $tableId : "ict_template_table",
	$templateTableFields : {// table columns
		table: [
            {"mData": "serviceTemplateId", name: "ID", "bVisible": false},
            {"mData": "templateName",name: $.i18n.prop("nfv-template-iui-field-templatename"),"fnRender": tmUtil.nameRender},
            //{"mData": "templateName", name: $.i18n.prop("nfv-template-iui-field-templatename-topo"), "fnRender" : tmUtil.topoRender},
            //{"mData": "templateName", name: $.i18n.prop("nfv-template-iui-field-templatename-nodes"), "fnRender" : tmUtil.nodesRender},
            {"mData": "vendor", name: $.i18n.prop("nfv-template-iui-field-vendor")},
            {"mData": "version", name: $.i18n.prop("nfv-template-iui-field-version")},
            {"mData":"csarId", name: "packageID","bVisible": false},
            {"mData": "type", name: $.i18n.prop("nfv-template-iui-field-type")},
		]
	},
    $language: {
            "sProcessing": "<img src='../common/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;"
                        +$.i18n.prop("nfv-nso-iui-table-sProcess")+"</span>",
            "sLengthMenu": $.i18n.prop("nfv-nso-iui-table-sLengthMenu"),
            "sZeroRecords": $.i18n.prop("nfv-nso-iui-table-sZeroRecords"),
            "sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("nfv-nso-iui-table-sInfo"),
            "sInfoEmpty": $.i18n.prop("nfv-nso-iui-table-sInfoEmpty"),
            "sGroupActions": $.i18n.prop("nfv-nso-iui-table-sGroupActions"),
            "sAjaxRequestGeneralError":$.i18n.prop("nfv-nso-iui-table-sAjaxRequestGeneralError"),
            "sEmptyTable": $.i18n.prop("nfv-nso-iui-table-sEmptyTable"),
            "oPaginate": {
                "sPrevious": $.i18n.prop("nfv-nso-iui-table-sPrevious"),
                "sNext": $.i18n.prop("nfv-nso-iui-table-sNext"),
                "sPage": $.i18n.prop("nfv-nso-iui-table-sPage"),
                "sPageOf": $.i18n.prop("nfv-nso-iui-table-sPageOf")
            }
    },
    $restUrl : {
        queryTemplateInfoUrl : "/openoapi/catalog/v1/servicetemplates"
    },
    $getTemplateCond: function() {
    	var cond = {};
		return cond;
    },
	$initTable: function() {
		var setting = {};
		setting.language = vm.$language;
        setting.paginate = true;
        setting.info = true;
		setting.columns = vm.$templateTableFields.table;
		setting.restUrl = vm.$restUrl.queryTemplateInfoUrl;
		setting.tableId = vm.$tableId;
		serverPageTable.initDataTable(setting, vm.$getTemplateCond(),
				vm.$tableId + '_div');
	},
    $openDetail : function(templateId, rowId) {
        var oSelect = $("tbody tr select").eq(rowId);
        var flavor = "";
        if(oSelect.length) {
            oSelect.find("option:selected").val();
        }
        window.open("./templateDetail.html?templateId="+templateId+"&flavor="+flavor,"_self");
    },
    $openTopoDetail : function(templateId, rowId) {
        var oSelect = $("tbody tr select").eq(rowId);
        var flavor = "";
        if(oSelect.length) {
            oSelect.find("option:selected").val();
        }
        window.open("./topologyDetail.html?templateId="+templateId+"&flavor="+flavor,"_self");
    },
    $openNodesDetail : function(templateId, rowId) {
        var oSelect = $("tbody tr select").eq(rowId);
        var flavor = "";
        if(oSelect.length) {
            oSelect.find("option:selected").val();
        }
        window.open("./nodesDetail.html?templateId="+templateId+"&flavor="+flavor,"_self");
    }
});
avalon.scan();
vm.$initTable();

var refreshByCond = function() {
    vm.$initTable();
};
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
var vm = avalon.define({
	$id : "pmController",
    resource : {
        packageInfo : [],
        packageDetails : "",
        vimSelectItems : []
    },
    csarIdSelected : "",
	$packageTableFields : {// table columns
		table: [
            {"mData": "name", name: $.i18n.prop("nfv-package-iui-field-name")},
            {"mData": "type", name: $.i18n.prop("nfv-package-iui-field-type")},
            {"mData": "size", name: $.i18n.prop("nfv-package-iui-field-size")},
            {"mData": "createTime", name: $.i18n.prop("nfv-package-iui-field-createTime")},
            {"mData": "status", name: $.i18n.prop("nfv-package-iui-field-status"), "fnRender" : pmUtil.statusRender},
            {"mData": null, name: $.i18n.prop("nfv-package-iui-field-operation"), "fnRender" : pmUtil.actionRender}
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
    $restUrl:{
        queryPackageInfoUrl: "/openoapi/catalog/v1/csars",
        uploadPackageUrl: "/openoapi/catalog/v1/csars",
        gsarDelPackageUrl: "/openoapi/gsolcm/v1.0/nspackage",
        ssarDelPackageUrl: "/openoapi/catalog/v1/csars",
        nsarDelPackageUrl: "/openoapi/nslcm/v1.0/nspackage",
        nfarDelPackageUrl: "/openoapi/nslcm/v1.0/vnfpackage",
        gsarOnboardUrl: "/openoapi/gsolcm/v1.0/nspackage",
        ssarOnboardUrl: "/openoapi/nslcm/v1.0/nspackage",
        nsarOnboardUrl: "/openoapi/nslcm/v1.0/nspackage",
        nfarOnboardUrl: "/openoapi/nslcm/v1.0/vnfpackage",
        changePackageStatusUrl : "/openoapi/catalog/v1/csars",
        queryVimInfoUrl : "/openoapi/extsys/v1/vims"
    },
    $getPackageCond: function() {
    	var cond = {};
		return cond;
    },
	$initTable: function() {
        var url=vm.$restUrl.queryPackageInfoUrl;
        commonUtil.get(url,null,function(resp) {
            if (resp) {
                vm.resource.packageInfo=resp;
            }
        })
	},
    packageDetail : {
        detailTitle : "",
        isShow : "none",
        detailIndex : 0,
        detailData : [{
            id : "general",
            name : $.i18n.prop("com_zte_ums_eco_roc_rsview_info"),
            isActive : true
        }, {
            id : "relationShips",
            name : $.i18n.prop("com_zte_ums_eco_roc_rsview_relation"),
            isActive : false
        }
        ],
        $showDetails : function (isShow, sn, name) {
            vm.packageDetail.isShow = isShow;
            vm.packageDetail.detailCondChange(0);
            if (isShow == "block") {
                vm.packageDetail.detailTitle = name + "-" + $.i18n.prop("nfv-package-iui_packageview_packageDetail"),
                    $('#' + vm.packageDetail.detailData[0].id).click();
                vm.packageDetail.detailData[0].isActive = true;
                vm.packageDetail.$initPackageDetailTable(sn);
            }
        },
        detailCondChange : function (index) {
            vm.packageDetail.detailIndex = index;
            for (var i = 0; i < vm.packageDetail.detailData.length; i++) {
                vm.packageDetail.detailData[i].isActive = false;
            }
            vm.packageDetail.detailData[index].isActive = true;
        },
        $initPackageDetailTable : function (sn) {
            vm.resource.packageDetails = vm.resource.packageInfo[sn];
            vm.resource.relationInfo = [];
        },
        $isRowDeletingStatus : function(name) {
            var table = $("#" + vm.$tableId).dataTable();
            var tableData = table.fnGetData();
            for (var i=0; i<tableData.length; i++) {
                if(tableData[i]["name"] == name &&
                    tableData[i]["status"].indexOf($.i18n.prop("nfv-package-iui-status-deleting")) > -1) {
                    return true;
                }
            }
            return false;
        },
    },
    selectVimDialog : {
        currentRadioClicked : [],
        clickedIndex : "",
        nfarOnBoardParam : {
            csarId : "",
            vimIds : [],
            labVimId : "",
        },
        $initData : function(csarId) {
            //vm.resource.vimSelectItems = [
            //    {vimName:"test1", oid:"123456"},
            //    {vimName:"test2", oid:"987654"},
            //    {vimName:"test3", oid:"123qwe"}
            //];
            var url=vm.$restUrl.queryVimInfoUrl;
            commonUtil.get(url,null,function(resp) {
                if (resp) {
                    vm.resource.vimSelectItems=resp;
                }
            })
            vm.selectVimDialog.nfarOnBoardParam.csarId = csarId;
        },
        $confirmBtnClick : function () {
            var labVimId = "";
            var vimIds = [];
            var testEnvCount = 0;
            for(var i=0; i<vm.resource.vimSelectItems.length; i++) {
                var radioId = "testEnvRadios" + i;
                var checkboxId = "produceEnvChecks" + i;
                if(document.getElementById(radioId).checked) {
                    labVimId = vm.resource.vimSelectItems[i].vimId;
                }
                if(document.getElementById(checkboxId).checked) {
                    vimIds.push(vm.resource.vimSelectItems[i].vimId);
                }
            }
            vm.selectVimDialog.nfarOnBoardParam.labVimId = labVimId;
            vm.selectVimDialog.nfarOnBoardParam.vimIds = vimIds;
            var extData = vm.selectVimDialog.nfarOnBoardParam;
            pmUtil.doNFAROnboard(extData);
            $("#selectVimDialog").modal("hide");
        },
        $radioClicked : function(index) {
            var radioId = "testEnvRadios" + index;
            var checkboxId = "produceEnvChecks" + index;
            if(vm.selectVimDialog.currentRadioClicked[index] && vm.selectVimDialog.clickedIndex == index) {
                vm.selectVimDialog.currentRadioClicked[index] = false;
                document.getElementById(radioId).checked = false;
                document.getElementById(checkboxId).disabled = false;
            } else {
                for(var i=0; i<vm.resource.vimSelectItems.length; i++) {
                    var uncheckId = "produceEnvChecks" + i;
                    document.getElementById(uncheckId).disabled = false;
                }
                document.getElementById(checkboxId).checked = false;
                document.getElementById(checkboxId).disabled = true;
                vm.selectVimDialog.currentRadioClicked[index] = true;
                vm.selectVimDialog.clickedIndex = index;
            }
        }
    },

    $delPackage : function(csarId,type) {
        bootbox.confirm($.i18n.prop("nfv-package-iui-message-delete-confirm"), function(result){
            var url = "";
            if(result) {
                if(type == "NSAR") {
                    url = vm.$restUrl.nsarDelPackageUrl + "/" + csarId;
                    //commonUtil.delete(url, function(resp) {
                    //    vm.gotoPackageListPage();
                    //});
                } else if(type == "NFAR") {
                    url = vm.$restUrl.nfarDelPackageUrl + "/" + csarId;
                    //commonUtil.delete(url, function(resp) {
                    //    vm.gotoPackageListPage();
                    //});
                } else if(type == "GSAR") {
                    url = vm.$restUrl.gsarDelPackageUrl + "/" + csarId;
                    //commonUtil.delete(url, function(resp) {
                    //    vm.gotoPackageListPage();
                    //});
                } else if(type == "SSAR") {
                    url = vm.$restUrl.ssarDelPackageUrl + "/" + csarId;
                    //commonUtil.delete(url, function(resp) {
                    //    vm.gotoPackageListPage();
                    //});
                }
                commonUtil.delete(url, function(resp) {
                    vm.gotoPackageListPage();
                });
            }
        });
    },
    isRowOnBoardingStatus : function(csarId) {
        var table = $("#" + vm.$tableId).dataTable();
        var tableData = table.fnGetData();
        for (var i=0; i<tableData.length; i++) {
            if(tableData[i]["name"] == name &&
                tableData[i]["status"].indexOf($.i18n.prop("nfv-package-iui-status-onboarding")) > -1) {
                return true;
            }
        }
        return false;
    },

    onBoardPackage : function(csarId,type) {
        var param = {
            csarId : csarId
        };
        if(type == "NSAR") {
            //vm.csarIdSelected = csarId;
            //vm.showOnboardDialog(csarId);
            var url = vm.$restUrl.nsarOnboardUrl;
            pmUtil.doOnBoard(url, param);
        } else if(type == "NFAR") {
            //var url = vm.$restUrl.nfarOnboardUrl;
            //pmUtil.doOnBoard(url, param);
            vm.csarIdSelected = csarId;
            vm.showOnboardDialog(csarId);
        } else if(type == "GSAR") {
            var url = vm.$restUrl.gsarOnboardUrl;
            pmUtil.doOnBoard(url, param);
        } else if(type == "SSAR") {
            var url = vm.$restUrl.ssarOnboardUrl;
            pmUtil.doOnBoard(url, param);
        }
    },
    showOnboardDialog : function(csarId) {
        vm.selectVimDialog.$initData(csarId);
        $("#selectVimDialog").modal("show");
    },
    $initUpload : function() {
        $("#fileupload").fileupload({
            url : vm.$restUrl.uploadPackageUrl,
            dropZone: $('#dropzone'),
            maxNumberOfFiles : 1,
            maxChunkSize : 20000000, //20M
            autoUpload : false,
            add : function(e, data) {
                $("#bar").css('width', '0%');
                $("#persent").text('0%');
                $("#fileName").text(data.files[0].name);
                $("#fileremove").attr("disabled", false);
                $("#filesubmit").attr("disabled", false);

                $("#filesubmit").remove();
                $('<button id="filesubmit" class="btn btn-default" type="button"/>').text("上传")
                    .appendTo($(".input-group-btn")[0])
                    .click(function () {
                        var fileName = data.files[0].name;
                        var existPackage = pmUtil.getExistPackageByName(fileName);
                        if(existPackage == 0){//0:package is not exist
                            $(".progress").addClass("active");
                            data.submit();
                        } else {
                            var msg = "";
                            if(existPackage == 1){//1:package not exist, instance reference this csar
                                msg = $.i18n.prop("nfv-package-iui-message-upload-csar-deletionpending");
                            }
                            if(existPackage == 2){//2:package exist
                                msg = $.i18n.prop("nfv-package-iui-message-upload-csar-exist");
                            }

                            bootbox.confirm(msg, function(result){
                                if(result) {
                                    $(".progress").addClass("active");
                                    data.submit();
                                }
                            });
                        }
                    });
                $("#fileremove").click(function(){
                    $("#bar").css('width', '0%');
                    $("#persent").text("");
                    $("#fileName").text("");
                    $("#filesubmit").attr("disabled", true);
                    $("#fileremove").attr("disabled", true);
                });
            },
            done : function(e, data) {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-upload-success"), 'success');
            },
            fail : function(e, data) {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-upload-fail"), 'danger');
            },
            always : function(e, data) {
                refreshByCond();
                $(".progress").removeClass("active");
                $("#bar").css('width', '100%');
                $("#persent").text('100%');
            },
            progressall : function(e ,data) {
                var progress = parseInt(data.loaded / data.total * 80, 10);
                $("#bar").css('width', progress + '%');
                $("#persent").text(progress + '%');
            }
        });
    },
    gotoPackageListPage:function(){
        window.location.href="./csarPackage.html";
    }
});
avalon.scan();
vm.$initUpload();

$(function(){
    vm.$initTable();
});
var refreshByCond = function() {
    vm.$initTable();
};
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

var vm = avalon
    .define({
        $id: "vnfmController",
        vnfmInfo: [],
        //mocSelectItems : [],
        vimSelectItems: [],
        server_rtn: {
            info_block: false,
            warning_block: false,
            rtn_info: "",
            $RTN_SUCCESS: "RTN_SUCCESS",
            $RTN_FAILED: "RTN_FAILED"
        },
        $Status: {
            success: "active",
            failed: "inactive"
        },
        $restUrl: {
            queryVnfmInfoUrl: '/openoapi/extsys/v1/vnfms',
            addVnfmInfoUrl: '/openoapi/extsys/v1/vnfms',
            updateVnfmInfoUrl: '/openoapi/extsys/v1/vnfms/',
            delVnfmInfoUrl: '/openoapi/extsys/v1/vnfms/',
            queryMocUrl: '',
            queryVimUrl: '/openoapi/extsys/v1/vims'
        },
        $htmlText: {
            saveSuccess: $.i18n.prop("nfv-vnfm-iui-message-save-success"),
            saveFail: $.i18n.prop("nfv-vnfm-iui-message-save-fail"),
            alreadyExist: $.i18n.prop("nfv-vnfm-iui-message-vnfm-already-exists"),
            updateSuccess: $.i18n.prop("nfv-vnfm-iui-message-update-success"),
            updateFail: $.i18n.prop("nfv-vnfm-iui-message-update-fail")
        },
        $initTable: function () {
            $.ajax({
                "type": 'GET',
                "url": vm.$restUrl.queryVnfmInfoUrl,
                //"dataType": "json",
                "success": function (resp) {
                    for (var i = 0; i < resp.length; i++) {
                        resp[i].status = vm.$Status.success;
                    }
                    vm.vnfmInfo = resp;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    bootbox.alert($.i18n.prop("nfv-vnfm-iui-message-query-fail") + "：" + textStatus + ":" + errorThrown);
                    return;
                },
                complete: function () {
                    vnfmUtil.tooltipVnfmStatus();
                }
            });
        },
        // $initMoc : function() {
        // 	/*var url = vm.$restUrl.queryMocUrl;
        //     commonUtil.get(url, null, function(resp) {
        //         if (resp) {
        //             vm.addVnfm.moc = resp.data;
        //         }
        //     });*/
        //     var resp = [
        //     	{ id : "nfv.vnfm.eco", name : "VNFM(ECO)"},
        //     	{ id : "nfv.vnfm.tacker", name : "VNFM(Tacker)"},
        //     	{ id : "nfv.vnfm.cmcc", name : "VNFM(CMCC)"},
        //     	{ id : "nfv.vnfm.etsi", name : "VNFM(ETSI)"}
        //     ]
        //     vm.mocSelectItems = resp;
        // },
        $initVim: function () {
            $.ajax({
                type: 'get',
                url: vm.$restUrl.queryVimUrl,
                dataType: 'json',
                success: function (resp) {
                    if (resp) {
                        vm.vimSelectItems = resp;
                    }
                    vm.vimSelectItems.push({"vimId": "", "name": ""});
                }
            });
        },
        addVnfm: {
            title: $.i18n.prop("nfv-vnfm-iui-text-register"),
            vnfmId: "",
            name: "",
            type: "",
            //moc : "",
            nameReadonly : false,
            vimId: "",
            //vimVisiable : false,
            vendor: "",
            version: "",
            description: "",
            certificateUrl: "",
            url: "",
            urlTip: $.i18n.prop("nfv-vnfm-iui-text-url-tip"),
            userName: "",
            password: "",
            saveType: "add",
            status: ""
        },
        $showVnfmTable: function () {
            vm.addVnfm.title = $.i18n.prop("nfv-vnfm-iui-text-register"),
                vm.addVnfm.vnfmId = "";
            vm.addVnfm.name = "";
            vm.addVnfm.type = "";
            //vm.addVnfm.moc = "";
            vm.addVnfm.nameReadonly = false;
            vm.addVnfm.vimId = "";
            //vm.addVnfm.vimVisiable = false;
            vm.addVnfm.vendor = "";
            vm.addVnfm.version = "";
            vm.addVnfm.description = "";
            vm.addVnfm.certificateUrl = "";
            vm.addVnfm.url = "";
            vm.addVnfm.userName = "";
            vm.addVnfm.password = "";
            vm.addVnfm.saveType = "add";
            vm.server_rtn.warning_block = false;
            vm.server_rtn.info_block = false;
            //vm.$initMoc();
            vm.$initVim();
            //vm.$mocChange();

            $(".form-group").each(function () {
                $(this).removeClass('has-success');
                $(this).removeClass('has-error');
                $(this).find(".help-block[id]").remove();
            });
            $("#addVnfmDlg").modal("show");
        },
        // $getMocName : function(mocId) {
        //       	var items = vm.mocSelectItems;
        //           for(var i=0;i<items.length;i++) {
        //    		if(items[i].id == mocId) {
        //    			return items[i].name;
        //    		}
        //    	}
        //    	return "";
        // },
        $saveVnfm: function () {
            var form = $('#vnfm_form');
            if (form.valid() == false) {
                return false;
            }
            vm.server_rtn.info_block = true;
            vm.server_rtn.warning_block = false;
            vm.addVnfm.status = vm.$Status.success;

            var param = {
                name: vm.addVnfm.name,
                //status : vm.addVnfm.status,
                //moc : $("#moc").val(),
                //vimId : vm.$getVimId($("#moc").val()),
                vimId: $("#vimId").val(),
                vendor: vm.addVnfm.vendor,
                version: vm.addVnfm.version,
                type: vm.addVnfm.type,
                description: vm.addVnfm.description,
                certificateUrl: vm.addVnfm.certificateUrl,
                url: vm.addVnfm.url,
                userName: vm.addVnfm.userName,
                password: vm.addVnfm.password
            }
            //save VIM info
            if (vm.addVnfm.saveType == "add") {  
                //      for( var i = 0; i < vm.vnfmInfo.length; i ++ ){
                //     if(vm.addVnfm.name == vm.vnfmInfo[i].name){                       
                //        vm.server_rtn.warning_block = true;
                //        vm.server_rtn.rtn_info = vm.$htmlText.alreadyExist;
                //        commonUtil.showMessage(vm.$htmlText.alreadyExist, "failed");
                //        return;
                //     }
                // }     
                $.ajax({
                    type: "POST",
                    url: vm.$restUrl.addVnfmInfoUrl,
                    data: JSON.stringify(param),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        vm.server_rtn.info_block = false;
                        vm.server_rtn.warning_block = false;
                        if (data) {
                            vm.vnfmInfo = [];
                            vm.$initTable();

                            $('#addVnfmDlg').modal('hide');
                            commonUtil.showMessage(vm.$htmlText.saveSuccess, "success");
                        } else {
                            vm.server_rtn.warning_block = true;
                            vm.server_rtn.rtn_info = vm.$htmlText.saveFail;
                            commonUtil.showMessage(vm.$htmlText.saveFail, "failed");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        vm.server_rtn.warning_block = true;
                        vm.server_rtn.rtn_info = textStatus + ":" + errorThrown;
                        vm.server_rtn.info_block = false;
                    }
                });
            } else {
                $.ajax({
                    type: "PUT",
                    url: vm.$restUrl.updateVnfmInfoUrl + vm.addVnfm.vnfmId,
                    data: JSON.stringify(param),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        vm.server_rtn.info_block = false;
                        vm.server_rtn.warning_block = false;
                        if (data) {
                            for (var i = 0; i < vm.vnfmInfo.length; i++) {
                                if (vm.vnfmInfo[i].vnfmId == vm.addVnfm.vnfmId) {
                                    vm.vnfmInfo[i].name = vm.addVnfm.name;
                                    vm.vnfmInfo[i].vimId = $("#vimId").val();
                                    vm.vnfmInfo[i].vendor = vm.addVnfm.vendor;
                                    vm.vnfmInfo[i].version = vm.addVnfm.version;
                                    vm.vnfmInfo[i].certificateUrl = vm.addVnfm.certificateUrl;
                                    vm.vnfmInfo[i].description = vm.addVnfm.description;
                                    vm.vnfmInfo[i].url = vm.addVnfm.url;
                                    vm.vnfmInfo[i].userName = vm.addVnfm.userName;
                                    vm.vnfmInfo[i].password = vm.addVnfm.password;
                                }
                            }
                            $('#addVnfmDlg').modal('hide');
                            commonUtil.showMessage(vm.$htmlText.updateSuccess, "success");
                        } else {
                            vm.server_rtn.warning_block = true;
                            vm.server_rtn.rtn_info = vm.$htmlText.updateFail;
                            commonUtil.showMessage(vm.$htmlText.updateFail, "failed");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        vm.server_rtn.warning_block = true;
                        vm.server_rtn.rtn_info = textStatus + ":" + errorThrown;
                        vm.server_rtn.info_block = false;
                    }
                });
            }
        },
        //  		mocRendered : function(action) {
        // 	if(vm.addVnfm.saveType === "update" && vm.addVnfm.moc) {
        // 		var items = vm.mocSelectItems;
        // 		for(var i=0;i<items.length;i++) {
        //     		if(items[i].id == vm.addVnfm.moc) {
        //     			$("#moc")[0].selectedIndex = i;
        //     			vm.$mocChange();
        //     			break;
        //     		}
        //     	}
        // 	} else {
        // 		$("#moc")[0].selectedIndex = 0;
        // 	}
        // },
        vimRendered: function (action) {
            var items = vm.vimSelectItems;
            if (vm.addVnfm.saveType === "update") {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].vimId == vm.addVnfm.vimId) {
                        $("#vimId")[0].selectedIndex = i;
                        break;
                    }
                }
            } else {
                $("#vimId")[0].selectedIndex = items.length - 1;
            }
        },
        // $mocChange : function() {
        // 	var mocId = $('#moc').val();
        // 	if(mocId == "nfv.vnfm.tacker") {
        // 		vm.addVnfm.vimVisiable = true;
        // 	} else {
        // 		vm.addVnfm.vimVisiable = false;
        // 	}
        // },
        // $getVimId : function(mocId) {
        // 	if(vm.addVnfm.vimVisiable) {
        // 		return $("#vimId").val();
        // 	} else {
        // 		return "";
        // 	}
        // }
    });
avalon.scan();
vm.$initTable();
//vm.$initMoc();
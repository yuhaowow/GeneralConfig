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
        $id: "vimController",
        vimInfo: [],
        //vimStatusTime:$.i18n.prop('com_zte_ums_eco_roc_vim_getting_info'),
        // ifSearch : 0,
        // server_rtn:{
        // 	info_block:false,
        // 	warning_block:false,
        // 	rtn_info:"",
        // 	$RTN_SUCCESS:"RTN_SUCCESS",
        // 	$RTN_FAILED:"RTN_FAILED",
        //              wait : $.i18n.prop('com_zte_ums_eco_roc_vim_checking_status')
        // },
        executeWait: {clazz: 'alert-info', visible: true, text: $.i18n.prop('com_zte_ums_eco_roc_vim_checking_status')},
        executeError: {clazz: 'alert-danger', visible: true, text: 'error'},
        $Status: {
            success: "active",
            failed: "inactive",
            displayActive: $.i18n.prop('com_zte_ums_eco_roc_vim_normal'),
            displayInactive: $.i18n.prop('com_zte_ums_eco_roc_vim_abnormal')
        },
        isSave: true,
        action: {ADD: 'add', UPDATE: 'update'},
        $queryVimInfoUrl: '/openoapi/extsys/v1/vims',
        $addVimInfoUrl: '/openoapi/extsys/v1/vims/',
        $updateVimInfoUrl: '/openoapi/extsys/v1/vims/',
        $delVimInfoUrl: '/openoapi/extsys/v1/vims/{vim_id}',
        $initTable: function () {
            $.ajax({
                "type": 'get',
                "url": vm.$queryVimInfoUrl,
                //"dataType": "json",
                "success": function (resp, statusText, jqXHR) {
                    if (jqXHR.status == "200") {
                        vm.vimInfo = resp;
                    }
                    else {
                        vm.vimInfo = [];
                        bootbox.alert($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_query_failed"));
                        return;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    bootbox.alert($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_query_failed") + textStatus + ":" + errorThrown);
                    return;
                },
                complete: function () {
                    resUtil.tooltipVimStatus();
                }
            });

        },
        $vimType: {
            condName: $.i18n.prop("com_zte_ums_eco_roc_vim_type"),
            component_type: 'select',
            selectItems: [
                {
                    cond_value: 'vmware',
                    name: "vmware",
                    value: true
                },
                {
                    cond_value: 'openstack',
                    name: "openstack",
                    value: true
                }
            ]
        },
        addVim: {
            titleName: $.i18n.prop("com_zte_ums_eco_roc_vim_register_info"),
            vimId: "",
            vimName: "",
            domain: '',
            domainVisable:true,
            vimNameModify:false,
            userName: "",
            tenant: "",
            password: "",
            url: "",
            saveType: "add",
            description: "",
            vimType: "openstack",
            vendor: "",
            version: ""
        },
        $showVimTable: function (el, action) {
            vm.isSave = false;
            if (vm.action.ADD == action) {
                vm.addVim.vimId = "";
                vm.addVim.vimName = "";
                vm.addVim.vimNameModify=false;
                vm.addVim.userName = "";
                vm.addVim.password = "";
                vm.addVim.url = "";
                vm.addVim.domain = "";
                vm.addVim.domainVisable = true;
                vm.addVim.description = "";
                vm.addVim.tenant = "";
                vm.addVim.vendor = "";
                vm.addVim.saveType = "add";
                vm.addVim.vimType = "openstack";
                vm.addVim.titleName = $.i18n.prop("com_zte_ums_eco_roc_vim_register_info");

            } else {
                vm.addVim.vimId = el.vimId;
                vm.addVim.vimName = el.name;
                vm.addVim.vimNameModify=true;
                vm.addVim.url = el.url;
                vm.addVim.description = el.description;
                vm.addVim.userName = el.userName;
                vm.addVim.password = el.password;
                vm.addVim.tenant = el.tenant;
                vm.addVim.domain = el.domain;
                vm.addVim.domainVisable=vm.$getdomainVisable(el.type);
                vm.addVim.saveType = "update";
                vm.addVim.titleName = $.i18n.prop('com_zte_ums_eco_roc_vim_modify_info');
                vm.addVim.vimType = el.type;
                vm.addVim.vendor = el.vendor;
                vm.addVim.version = el.version;
            }
            vm.executeError.visible = false;
            vm.executeWait.visible = false;
            $(".form-group").each(function () {
                $(this).removeClass('has-success');
                $(this).removeClass('has-error');
                $(this).find(".help-block[id]").remove();
            });
            $("#addVimDlg").modal("show");
        },

        $saveVimTable: function () {
            vm.isSave = true;
            success.hide();
            error.hide();
            if (form.valid() == false) {
                vm.isSave = false;
                return false;
            }
            vm.executeWait.visible = true;
            vm.executeError.visible = false;
            if (vm.addVim.saveType == "add") { 
                for( var i = 0; i < vm.vimInfo.length; i ++ ){
                    if(vm.addVim.name == vm.vimInfo[i].name){
                       resUtil.growl($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_title") +  ' already exists',"info");
                       $('#addVimDlg').modal('hide');
                        return;
                    }
                }                 
                vm.persistVim();
            } else if (vm.addVim.saveType == "update") {
                vm.updateVim();
            }
        },
        //add vim
        persistVim: function () {
            $.ajax({
                type: "Post",
                url: vm.$addVimInfoUrl,
                data: JSON.stringify({
                    name: vm.addVim.vimName,
                    url: vm.addVim.url,
                    userName: vm.addVim.userName,
                    password: vm.addVim.password,
                    tenant: vm.addVim.tenant,
                    domain: vm.addVim.domain,
                    vendor: vm.addVim.vendor,
                    version: vm.addVim.version,
                    description: vm.addVim.description,
                    type: vm.addVim.vimType,
                }),
                async: false,
                dataType: "json",
                contentType: 'application/json',
                success: function (data, statusText, jqXHR) {
                    vm.executeWait.visible = false;
                    vm.executeError.visible = false;
                    if (jqXHR.status == "201") {
                        vm.addVim.vimId = data.vimId;
                        vm.addVim.name = data.name;
                        vm.addVim.tenant = data.tenant;
                        vm.addVim.type = data.type;
                        var newVim = jQuery.extend({}, vm.addVim);
                        vm.vimInfo.push(newVim);

                        $('#addVimDlg').modal('hide');
                        resUtil.growl($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_title") + $.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_save_success"), "success");
                    } else {
                        vm.executeError.visible = true;
                        vm.executeError.text = $.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_save_failed");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    vm.executeError.visible = true;
                    vm.executeError.text = textStatus + ":" + errorThrown;
                    vm.executeWait.visible = false;
                    vm.isSave = false;
                }
            });
        },
        //update vim
        updateVim: function () {
            $.ajax({
                type: "Put",
                url: vm.$updateVimInfoUrl + vm.addVim.vimId,
                contentType: 'application/json',
                data: JSON.stringify({
                    name: vm.addVim.vimName,
                    userName: vm.addVim.userName,
                    password: vm.addVim.password,
                    domain: vm.addVim.domain,
                    version: vm.addVim.version,
                    description: vm.addVim.description,
                    url: vm.addVim.url,
                    tenant: vm.addVim.tenant,
                    type: vm.addVim.vimType,
                    vendor: vm.addVim.vendor,
                }),
                dataType: "json",
                async: false,
                success: function (data, statusText, jqXHR) {
                    vm.executeWait.visible = false;
                    vm.executeError.visible = false;
                    if (jqXHR.status == "200") {
                        for (var i = 0; i < vm.vimInfo.length; i++) {
                            if (vm.vimInfo[i].vimId == vm.addVim.vimId) {
                                vm.vimInfo[i].name = vm.addVim.vimName;
                                vm.vimInfo[i].userName = vm.addVim.userName;
                                vm.vimInfo[i].password = vm.addVim.password;
                                vm.vimInfo[i].url = vm.addVim.url;
                                vm.vimInfo[i].tenant = vm.addVim.tenant;
                                vm.vimInfo[i].domain = vm.addVim.domain;
                                vm.vimInfo[i].description = vm.addVim.description;
                                vm.vimInfo[i].type = vm.addVim.vimType;
                                vm.vimInfo[i].version=vm.addVim.version;
                                vm.vimInfo[i].vendor=vm.addVim.vendor;
                            }
                        }
                        $('#addVimDlg').modal('hide');
                        resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_save_success'), "success");
                    }
                    else {
                        vm.executeError.visible = true;
                        vm.executeError.text = $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_save_failed');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    vm.isSave = false;
                    vm.executeError.visible = true;
                    vm.executeError.text = textStatus + ":" + errorThrown;
                    vm.executeWait.visible = false;
                }
            });
        },
        delVim: function (el) {
            bootbox.confirm($.i18n.prop('com_zte_ums_eco_roc_vim_confirm_delete_vim_record'), function (result) {
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: vm.$delVimInfoUrl.replace('{vim_id}', el.vimId),
                        success: function (data, statusText, jqXHR) {
                            if (jqXHR.status == "204") {
                                for (var i = 0; i < vm.vimInfo.length; i++) {
                                    if (el.vimId == vm.vimInfo[i].vimId) {
                                        vm.vimInfo.splice(i, 1);
                                        break;
                                    }
                                }
                                resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_remove_success'), "success");
                            }
                            else {
                                resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_remove_failed'), "warning");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + errorThrown, "danger");
                        }
                    });
                }
            });
        },
        gotoChartPage: function (oid, name, tenant) {
            window.location.href = "vimChart.html?" + oid + "&" + name + "&" + tenant;
        },
        $getdomainVisable:function(vimType){
            if ("openstack"==vimType){
                return true;           
             }else{
                return false;
             }

        },
        vimTypeRendered:function(){
            vm.addVim.domainVisable=vm.$getdomainVisable(vm.addVim.vimType);
        }


    });
avalon.scan();
vm.$initTable();





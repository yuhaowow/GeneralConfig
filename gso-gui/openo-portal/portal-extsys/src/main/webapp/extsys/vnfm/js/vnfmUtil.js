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
var vnfmUtil = {};

vnfmUtil.delVnfm = function (vnfmId) {
    bootbox.confirm($.i18n.prop("nfv-vnfm-iui-message-delete-confirm"), function (result) {
        if (result) {
            $.ajax({
                type: "DELETE",
                url: vm.$restUrl.delVnfmInfoUrl + vnfmId,
                dataType: "json",
                success: function (data, statusText, jqXHR) {
                    if (jqXHR.status == "204") {
                        for (var i = 0; i < vm.vnfmInfo.length; i++) {
                            if (vnfmId == vm.vnfmInfo[i].vnfmId) {
                                //delete the vnfm object from vnfm array
                                vm.vnfmInfo.splice(i, 1);
                                break;
                            }
                        }
                        commonUtil.showMessage($.i18n.prop("nfv-vnfm-iui-message-delete-success"), "success");
                    } else {
                        commonUtil.showMessage($.i18n.prop("nfv-vnfm-iui-message-delete-fail"), "warning");
                    }
                },
                error: function () {
                    commonUtil.showMessage($.i18n.prop("nfv-vnfm-iui-message-delete-fail"), "warning");
                }
            });
        }
    });
}

vnfmUtil.updateVnfm = function (data) {
    vm.addVnfm.vnfmId = data.vnfmId;
    vm.addVnfm.name = data.name;
    //vm.addVnfm.moc = data.moc;
    //vm.addVnfm.mocDisabled = true;
    vm.addVnfm.vendor = data.vendor;
    vm.addVnfm.version = data.version;
    vm.addVnfm.description = data.description;
    vm.addVnfm.type = data.type;
    vm.addVnfm.vimId = data.vimId;
    vm.addVnfm.url = data.url;
    vm.addVnfm.nameReadonly=true;
    vm.addVnfm.userName = data.userName;
    vm.addVnfm.password = data.password;
    vm.addVnfm.saveType = "update";
    vm.addVnfm.title = $.i18n.prop("nfv-vnfm-iui-test-update");
    vm.server_rtn.info_block = false;
    vm.server_rtn.warning_block = false;
    //vm.$initMoc();
    vm.$initVim();

    $(".form-group").each(function () {
        $(this).removeClass('has-success');
        $(this).removeClass('has-error');
        $(this).find(".help-block[id]").remove();
    });
    $("#addVnfmDlg").modal("show");
}

vnfmUtil.tooltipVnfmStatus = function () {
    $("[data-toggle='tooltip']").tooltip();
}
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
        $id: "vimChartController",
        $vimChartUrl: '../../api/vim/v1/{vim_id}/resource',
        $tenantChartUrl: '../../api/vim/v1/{vim_id}/resource/{tenant_name}',
        $tenantListUrl: '../../api/vim/v1/{vim_id}/tenants',
        $tenantRoleUrl: '../../api/vim/v1/{vim_id}/roles',
        vimInfo: {
            name: name,
            id: id,
            tenant: tenant,
            isAdmin: true
        },
        tenantSelectList: {
            condName: $.i18n.prop("com_zte_ums_eco_roc_vim_type"),
            component_type: 'select',
            selectItems: []
        },
        initChart: function () {

            //has admin role
            var tenantRoleUrl = vm.$tenantRoleUrl.replace("{vim_id}", vm.vimInfo.id);
            $.ajax({
                "type": 'get',
                "url": tenantRoleUrl,
                "dataType": "json",
                success: function (resp) {
                    vm.vimInfo.isAdmin = (resp == null) ? false : resp.isAdminRole;

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    vimChart.growl("get [tenant Role] is error ：" + textStatus + ":" + errorThrown, "danger");
                },
                complete: function () {
                    if (vm.vimInfo.isAdmin == true) {

                        //get all resource 
                        vm.vimChartLoad();

                        //get tenant list
                        vm.vimListLoad();
                    }

                }
            });
            //get resource of tenant 
            vm.tenantChartLoad();
        },
        gotoVimPage: function () {
            window.parent.ZteFrameWork.goToURLByIDAndNewAction('eco_roc_vimmgr');
        },
        vimListLoad: function () {
            var tenantListUrl = vm.$tenantListUrl.replace("{vim_id}", vm.vimInfo.id);
            $.ajax({
                "type": 'get',
                "url": tenantListUrl,
                "dataType": "json",
                success: function (resp) {
                    vm.tenantSelectList.selectItems = (resp == null) ? [] : resp;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    vimChart.growl("get [tenant List] is error ：" + textStatus + ":" + errorThrown, "danger");
                }
            });
        },
        vimChartLoad: function () {
            var viminitData = {
                "resource": {
                    "cpu": 0,
                    "memoryMb": 503,
                    "diskGb": 9.8
                },
                "usage": {
                    "cpu": 0,
                    "memoryMb": 0,
                    "diskGb": 0
                }
            }

            vimChart.vimPieChartInit();

            var vimChartUrl = vm.$vimChartUrl.replace("{vim_id}", vm.vimInfo.id);


            $.ajax({
                "type": 'get',
                "url": vimChartUrl,
                "dataType": "json",
                success: function (resp) {
                    var vimData = (resp == null) ? viminitData : resp;
                    vimChart.vimPieChart(vimData);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    vimChart.growl("get [virtual machine manager resource using status] is error ：" + textStatus + ":" + errorThrown, "danger");
                }
            });

        },
        tenantChartLoad: function () {
            var tenantChartUrl = vm.$tenantChartUrl.replace("{vim_id}", vm.vimInfo.id).replace("{tenant_name}", vm.vimInfo.tenant);

            var tenantinitData = {
                "tenant_name": "",
                "errormsg": "",
                "quota": {
                    "cpu": 0,
                    "memoryMb": 0,
                    "instances": 0,
                    "floatingIps": 0,
                    "securityGroups": 0,
                    "volumeStorage": 0,
                    "volumes": 0
                },
                "usage": {
                    "cpu": 0,
                    "memoryMb": 0,
                    "instances": 0,
                    "floatingIps": 0,
                    "securityGroups": 0,
                    "volumeStorage": 0,
                    "volumes": 0
                }
            };
            vimChart.tenantPieChartInit();
            $.ajax({
                "type": 'get',
                "url": tenantChartUrl,
                "dataType": "json",
                success: function (resp) {
                    var tenantData = (resp == null) ? tenantinitData : resp;
                    if (tenantData.errormsg != null) {
                        vimChart.growl(tenantData.errormsg, "danger");
                    }
                    vimChart.tenantPieChart(tenantData);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    vimChart.growl("get [tenant quota using status] occur error ：" + textStatus + ":" + errorThrown, "danger");
                }
            });

        }

    });
avalon.scan();
vm.initChart();
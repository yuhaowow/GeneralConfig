/* Copyright 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var url = {};
$.getJSON("./conf/dataconfig.json", function (jsonData){
    url.overlay = jsonData.url +":"+ jsonData.port + "/org.openo.sdno.overlayvpnservice";
    url.underlay = jsonData.url +":"+ jsonData.port + "/org.openo.sdno.l3vpnservice";
    console.log("URL = " + JSON.stringify(url));
});

function loadUnderlayData() {
    var requestUrl = url.underlay + "/openoapi/sdnol3vpn/v1/l3vpns";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("loading underlay data");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert("Error on getting underlay data : " + xhr.responseText);
            }
        });
}
function deleteUnderlayData(objectId) {
    var requestUrl = url.underlay + "/openoapi/sdnol3vpn/v1/l3vpns/" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("deleting underlay data");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting underlay data : " + xhr.responseText);
            }
        });
}
function loadOverlayData() {
    var requestUrl = url.overlay + "/openoapi/sdnooverlayvpn/v1/site2dc-vpn";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("loading Overlay data...");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert("Error on getting Overlayvpn data : " + xhr.responseText);
            }
        });
}
function refressTpDataTable(overlayTable, TpTable) {
    alert("refesssing Tp data table");
}
$(function () {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $('#createUnderlay').click(function () {
        var formData = JSON.stringify($("#underlayForm").serializeObject());
        alert(formData);
        var jsonobj = JSON.parse(formData);
        var requestUrl = url.underlay + "/openoapi/sdnol3vpn/v1/l3vpns";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonobj) {
                    alert("Details saved successfully!!!");
                    //var data = [jsonobj.name,jsonobj.hostName,jsonobj.productName,jsonobj.vendor,jsonobj.description];
                    //TODO: update the table
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });
    $('.underlayNameLink').click(function () {
        alert("coming here");
        var data = $(this).parent().parent().parent().find('td:last').find('div:last').html();
        alert(data);
        var jsonObj = JSON.parse(data);
        for (var i = 0; i < jsonObj.length; i++) {
            var obj = jsonObj[i];
            var rowData = [obj.tpName, obj.peName, obj.vlanId, obj.siteCidr, obj.ip];
            $('#underlayTpDataTable').DataTable();
            $('#underlayTpDataTable').dataTable().fnAddData(rowData);
        }

    });

})
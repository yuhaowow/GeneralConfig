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

var url = "";
$.getJSON("./conf/dataconfig.json", function (jsonData){
    url = jsonData.url +":"+ jsonData.port;
    console.log("URL = " + url);
});

$('.siteDeleteImg').click(
    function () {
        var data = $(this).parent().parent().parent().find('td:last').find(
            'div:last').html();
        alert(data);
        var jsonObj = JSON.parse(data);
        for (var i = 0; i < jsonObj.length; i++) {
            var obj = jsonObj[i];
            var rowData = [obj.tpName, obj.peName, obj.vlanId,
                obj.siteCidr, obj.ip];
            $('#underlayTpDataTable').DataTable();
            $('#underlayTpDataTable').dataTable().fnAddData(rowData);
        }
    });

function deleteController(objectId) {
    var requestUrl = url + "/openoapi/extsys/v1/sdncontrollers/" + objectId;
    $.ajax({
        type: "DELETE",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            $('#controller').bootstrapTable('remove', {
                field: 'id',
                values: [objectId]
            });
            alert("Delete Controller successfull !!!");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on deleting controller : " + xhr.responseText);
        }
    });
}

function loadControllerData() {
    var requestUrl = url + "/openoapi/extsys/v1/sdncontrollers";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            $('#controller').bootstrapTable({
                data: jsonobj.topologicalControllers
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on getting controller data : " + xhr.responseText);
        }
    });
}

$(function () {
    $('.creat-btn').click(function () {
        $('#vmAppDialog').addClass('in').css({
            'display': 'block'
        });

    });
    $('.close,.button-previous').click(function () {
        $('#vmAppDialog').removeClass('in').css('display', 'none');
    });
    $('.detail-top ul li').click(function () {
        $(this).addClass('current').siblings().removeClass('current');
    });
    $('.para').click(function () {
        if ($('#serviceTemplateName').val() == '') {
            alert('Please choose the service templet！');
            $('#flavorTab').css('display', 'none');
        } else {
            $('#flavorTab').css('display', 'block');
        }
        $('#basicTab').css('display', 'block');
    });
    $('.basic').click(function () {
        $('#flavorTab').css('display', 'none');
    });

    $('.table tbody tr').click(
        function () {
            $(this).addClass('openoTable_row_selected').siblings()
                .removeClass('openoTable_row_selected');
        });
    $('.table tr:odd').addClass('active');
    $('#false').click(function () {
        $('#vmAppDialog').addClass('in').css({
            'display': 'block'
        });
    });
    $('.close,.button-previous').click(function () {
        $('#vmAppDialog').removeClass('in').css('display', 'none');
    });
    $('#filterTpLogicalType').click(
        function () {
            $('#filterTpLogicalType_select_popupcontainer').toggleClass(
                'openo-hide');
            $('#filterTpLogicalType').toggleClass('openo-focus');
            var oLeft = $('#open_base_tpL_td6').offset().left;
            var oTop = $('#open_base_tpL_td6').offset().top;
            var oHeight = $('#open_base_tpL_td6').height();
            $('#filterTpLogicalType_select_popupcontainer').css({
                'left': oLeft,
                'top': oTop + oHeight + 10
            });
        });
    $('div.openo-select-popup-container>div.openo-select-item>label').click(
        function () {
            var Lvalue = $(this).html();
            $('#filterTpLogicalType_select_input').attr('value', Lvalue);
            $('#filterTpLogicalType_select_popupcontainer').addClass(
                'openo-hide');
            $('#filterTpLogicalType').removeClass('openo-focus');
        });
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

    $('#createController').click(function () {
        var formData = JSON.stringify($("#controllerForm").serializeObject());
        var jsonobj = JSON.parse(formData);
        var newJson = {
            "topologicalController": jsonobj
        };
        formData = JSON.stringify(newJson);
        var requestUrl = url + "/openoapi/extsys/v1/sdncontrollers";
        $.ajax({
            type: "POST",
            url: requestUrl,
            contentType: "application/json",
            dataType: "json",
            data: formData,
            success: function (jsonResp) {
                alert("Controller saved successfully!!!");
                jsonobj["id"] = jsonResp.topologicalController.id;
                $('#controller').bootstrapTable("append", jsonobj);
                $('#vmAppDialog').removeClass('in').css('display', 'none');

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on page : " + xhr.responseText);
            }
        });
    });

})
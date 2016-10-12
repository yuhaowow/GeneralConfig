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
    url = jsonData.url +":"+ jsonData.port + "/org.openo.sdno.brs";
    console.log("URL = " + url);
});

function deleteSite(objectId) {
    alert(objectId);
    var requestUrl = url + "/openoapi/sdnobrs/v1/sites" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("Details deleted successfully!!!");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert("Error on deleting site: " + xhr.responseText);
            }
        });
}
function deleteLink(objectId) {
    var requestUrl = url + "/openoapi/sdnobrs/v1/topological-links" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("Details deleted successfully!!!");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting link : " + xhr.responseText);
            }
        });
}

function deleteNe(objectId) {
    var requestUrl = url + "/sdnobrs/v1/managed-elements" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("Details deleted successfully!!!");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting ne : " + xhr.responseText);
            }
        });
}

function deletePort(objectId) {
    var requestUrl = url + "/openoapi/sdnobrs/v1/logical-termination-points" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("Details deleted successfully!!!");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting port : " + xhr.responseText);
            }
        });
}
function loadSiteData() {
    var requestUrl = url + "/openoapi/sdnobrs/v1/sites";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("loading Site data");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting site data : " + xhr.responseText);
            }
        });
}
function loadLinkData() {
    var requestUrl = url + "/openoapi/sdnobrs/v1/topological-links";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("loading Link data");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting link data : " + xhr.responseText);
            }
        });
}
function loadNeData() {
    var requestUrl = url + "/sdnobrs/v1/managed-elements";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("loading NE data");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting ne data : " + xhr.responseText);
            }
        });
}
function loadPortData() {
    var requestUrl = url + "/openoapi/sdnobrs/v1/logical-termination-points";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                alert("loading port data");
                //TODO: Update the table
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting port data : " + xhr.responseText);
            }
        });
}
$(function () {
    $('.creat-btn').click(function () {
        $('#vmAppDialog').addClass('in').css({'display': 'block'});

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

    $('.table tbody tr').click(function () {
        $(this).addClass('openoTable_row_selected').siblings().removeClass('openoTable_row_selected');
    });
    $('.table tr:odd').addClass('active');
    $('#false').click(function () {
        $('#vmAppDialog').addClass('in').css({'display': 'block'});
    });
    $('.close,.button-previous').click(function () {
        $('#vmAppDialog').removeClass('in').css('display', 'none');
    });
    $('#filterTpLogicalType').click(function () {
        $('#filterTpLogicalType_select_popupcontainer').toggleClass('openo-hide');
        $('#filterTpLogicalType').toggleClass('openo-focus');
        var oLeft = $('#open_base_tpL_td6').offset().left;
        var oTop = $('#open_base_tpL_td6').offset().top;
        var oHeight = $('#open_base_tpL_td6').height();
        $('#filterTpLogicalType_select_popupcontainer').css({'left': oLeft, 'top': oTop + oHeight + 10});
    });
    $('div.openo-select-popup-container>div.openo-select-item>label').click(function () {
        var Lvalue = $(this).html();
        $('#filterTpLogicalType_select_input').attr('value', Lvalue);
        $('#filterTpLogicalType_select_popupcontainer').addClass('openo-hide');
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
    $('#createSite').click(function () {
        var formData = JSON.stringify($("#vmAppForm").serializeObject());
        alert(formData);
        var jsonobj = JSON.parse(formData);
        var requestUrl = "/openoapi/sdnobrs/v1/sites";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonobj) {
                    alert("Details saved successfully!!!");
                    var data = [jsonobj.name, jsonobj.hostName, jsonobj.productName, jsonobj.vendor, jsonobj.description];
                    $('#example').dataTable().fnAddData(data);
                    $('.modal').modal('hide');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

    $('#createNe').click(function () {
        var formData = JSON.stringify($("#neForm").serializeObject());
        alert(formData);
        var jsonobj = JSON.parse(formData);
        var requestUrl = "/sdnobrs/v1/managed-elements";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonobj) {
                    alert("Details saved successfully!!!");
                    var data = [jsonobj.name, jsonobj.hostName, jsonobj.productName, jsonobj.vendor, jsonobj.description];
                    $('#example').dataTable().fnAddData(data);
                    $('.modal').modal('hide');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

    $('#createPort').click(function () {
        var formData = JSON.stringify($("#portForm").serializeObject());
        alert(formData);
        var jsonobj = JSON.parse(formData);
        var requestUrl = "/openoapi/sdnobrs/v1/logical-termination-points";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonobj) {
                    alert("Details saved successfully!!!");
                    var data = [jsonobj.name, jsonobj.hostName, jsonobj.productName, jsonobj.vendor, jsonobj.description];
                    $('#example').dataTable().fnAddData(data);
                    $('.modal').modal('hide');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

    $('#createLink').click(function () {
        var formData = JSON.stringify($("#linkForm").serializeObject());
        alert(formData);
        var jsonobj = JSON.parse(formData);
        var requestUrl = "/openoapi/sdnobrs/v1/topological-links";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonobj) {
                    alert("Details saved successfully!!!");
                    var data = [jsonobj.name, jsonobj.hostName, jsonobj.productName, jsonobj.vendor, jsonobj.description];
                    $('#example').dataTable().fnAddData(data);
                    $('.modal').modal('hide');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

})
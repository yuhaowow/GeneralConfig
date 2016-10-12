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

$('.siteDeleteImg').click(function () {
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


function deleteSite(objectId) {
    var requestUrl = url+"/openoapi/sdnobrs/v1/sites/" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#site').bootstrapTable('remove', {
                    field: 'id',
                    values: [objectId]
                });
                alert("Delete Site successfull !!!");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting site: " + xhr.responseText);
            }
        });
}
function deleteLink(objectId) {
    var requestUrl = url+"/openoapi/sdnobrs/v1/topological-links/" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#link').bootstrapTable('remove', {
                    field: 'id',
                    values: [objectId]
                });
                alert("Delete Link successfull !!!");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting link : " + xhr.responseText);
            }
        });
}

function deleteNe(objectId) {
    var requestUrl = url+"/openoapi/sdnobrs/v1/managed-elements/" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#ne').bootstrapTable('remove', {
                    field: 'id',
                    values: [objectId]
                });
                alert("Delete NE successfull !!!");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting ne : " + xhr.responseText);
            }
        });
}

function deletePort(objectId) {
    var requestUrl = url+"/openoapi/sdnobrs/v1/logical-termination-points/" + objectId;
    $
        .ajax({
            type: "DELETE",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#port').bootstrapTable('remove', {
                    field: 'id',
                    values: [objectId]
                });
                alert("Delete Port successfull !!!");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on deleting port : " + xhr.responseText);
            }
        });
}
function loadSiteData() {
    var requestUrl = url+"/openoapi/sdnobrs/v1/sites";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#site').bootstrapTable({
                    data: jsonobj.sites
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting site data : " + xhr.responseText);
            }
        });
}
function loadLinkData() {
    var requestUrl = url+"/openoapi/sdnobrs/v1/topological-links";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#link').bootstrapTable({
                    data: jsonobj.topologicalLinks
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting link data : " + xhr.responseText);
            }
        });
}
function loadNeData() {
    var requestUrl = url+"/openoapi/sdnobrs/v1/managed-elements";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#ne').bootstrapTable({
                    data: jsonobj.managedElements
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error on getting ne data : " + xhr.responseText);
            }
        });
}
function loadPortData() {
    var requestUrl = url+"/openoapi/sdnobrs/v1/logical-termination-points";
    $
        .ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
                $('#port').bootstrapTable({
                    data: jsonobj.logicalTerminationPoints
                });
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
        var jsonobj = JSON.parse(formData);
        var newJson = {"site": jsonobj};
        formData = JSON.stringify(newJson);
        var requestUrl = url+"/openoapi/sdnobrs/v1/sites";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonResp) {
                    alert("Site saved successfully!!!");
                    jsonobj["id"] = jsonResp.site.id;
                    $('#site').bootstrapTable("append", jsonobj);
                    $('#vmAppDialog').removeClass('in').css('display', 'none');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

    $('#createNe').click(function () {
        var formData = JSON.stringify($("#neForm").serializeObject());
        var jsonobj = JSON.parse(formData);
        var newJson = {"managedElement": jsonobj};
        formData = JSON.stringify(newJson);
        var requestUrl = url+"/openoapi/sdnobrs/v1/managed-elements";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonResp) {
                    alert("NE saved successfully!!!");
                    jsonobj["id"] = jsonResp.managedElement.id;
                    $('#ne').bootstrapTable("append", jsonobj);
                    $('#vmAppDialog').removeClass('in').css('display', 'none');

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

    $('#createPort').click(function () {
        var formData = JSON.stringify($("#portForm").serializeObject());
        var jsonobj = JSON.parse(formData);
        var newJson = {"logicalTerminationPoint": jsonobj};
        formData = JSON.stringify(newJson);
        var requestUrl = url+"/openoapi/sdnobrs/v1/logical-termination-points";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonResp) {
                    alert("Port saved successfully!!!");
                    //TODO : hide model data window.
                    jsonobj["id"] = jsonResp.logicalTerminationPoint.id;
                    $('#port').bootstrapTable("append", jsonobj);
                    $('#vmAppDialog').removeClass('in').css('display', 'none');

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

    $('#createLink').click(function () {
        var formData = JSON.stringify($("#linkForm").serializeObject());
        var jsonobj = JSON.parse(formData);
        var newJson = {"topologicalLink": jsonobj};
        formData = JSON.stringify(newJson);
        var requestUrl = url+"/openoapi/sdnobrs/v1/topological-links";
        $
            .ajax({
                type: "POST",
                url: requestUrl,
                contentType: "application/json",
                dataType: "json",
                data: formData,
                success: function (jsonResp) {
                    alert("Link saved successfully!!!");
                    jsonobj["id"] = jsonResp.topologicalLink.id;
                    $('#link').bootstrapTable("append", jsonobj);
                    $('#vmAppDialog').removeClass('in').css('display', 'none');

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });

})
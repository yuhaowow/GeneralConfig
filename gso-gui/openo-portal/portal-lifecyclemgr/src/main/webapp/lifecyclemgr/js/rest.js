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
$(function () {

    $.getJSON("./conf/dataconfig.json", function (jsonData){
        url = jsonData.url +":"+ jsonData.port;
        console.log("URL = " + url);
    });

    $('.creat-btn').click(function () {
        /*$('#vmAppDialog').addClass('in').css({'display': 'block'});*/
        $('#vmAppDialog').modal();

    });
    $('.close,.button-previous').click(function () {
        $('#vmAppDialog').removeClass('in').css('display', 'none');
    });
    $('.detail-top ul li').click(function () {
        $(this).addClass('current').siblings().removeClass('current');
    });
    $('.para').click(function () {
        if ($('#serviceTemplateName').val() == '') {
            alert('Please choose the service template！');
            $('#flavorTab').css('display', 'none');
        } else {
            $('#flavorTab').css('display', 'block');
        }
        $('#basicTab').css('display', 'block');
    });
    $('.basic').click(function () {
        $('#flavorTab').css('display', 'none');
    });
/*
    $('.table tbody tr').click(function(){
        $(this).addClass('openoTable_row_selected').siblings().removeClass('openoTable_row_selected');
    });*/
    $('.table tr:odd').addClass('active');
    $('#false').click(function () {
        /*$('#vmAppDialog').addClass('in').css({'display': 'block'});*/
	$('#vmAppDialog').modal();
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

    $('#createNS').click(function(){
        var formData = JSON.stringify($("#neForm").serializeObject());
        var jsonobj = JSON.parse(formData);
        var newJson = {"managedElement": jsonobj};
        formData = JSON.stringify(newJson);
        var requestUrl = url + "/org.openo.sdno.brs/openoapi/sdnobrs/v1/managed-elements";
        $
            .ajax({
                type : "POST",
                url : requestUrl,
                contentType : "application/json",
                dataType : "json",
                data : formData,
                success : function(jsonResp) {
                    alert("NS saved successfully!!!");
                    jsonobj["id"]= jsonResp.managedElement.id;
                    $('#ne').bootstrapTable("append", jsonobj);
                    $('#vmAppDialog').removeClass('in').css('display','none');

                },
                error : function(xhr, ajaxOptions, thrownError) {
                    alert("Error on page : " + xhr.responseText);
                }
            });
    });
})

/*******************************************Get Service**********************************************/
function loadGetServiceData(){
    return JSON.parse('[{"serviceId":"1111","serviceName":"siteToDC","description":"siteToDC","createTime":"xxxxxx","creator":"XXXX","serviceType":"GSO","templateName":"xxxxxx","inputParameters":{"POP-1-0-0.vFW-moc":"xxx","POP-1-0-0.vCPE-moc":"xxx"}},{"serviceId":"2222","serviceName":"siteToDC","description":"siteToDC","createTime":"xxxxxx","creator":"XXXX","serviceType":"GSO","templateName":"xxxxxx","inputParameters":{"POP-1-0-0.vFW-moc":"xxx1","POP-1-0-0.vCPE-moc":"xxx1"}}]');

    // TODO authenticate the url.
    var requestUrl = url + "/openoapi/sdnobrs/v1/topological-links";
    $
        .ajax({
            type : "GET",
            url : requestUrl,
            contentType : "application/json",
            success : function(jsonobj) {
                // TODO return according to the json data received.
                return jsonobj;
            },
            error : function(xhr, ajaxOptions, thrownError) {
                alert("Error on getting link data : " + xhr.responseText);
            }
        });
}

/*********************************************Get Service Details********************************************/
function loadServiceDetails(serviceId){
    return JSON.parse('[{"id":"12345", "name":"sdno"}, {"id":"23456", "name":"gso"},{"id":"12345", "name":"nfvo"}]');
    //return JSON.parse('{"sdno":[{"id":"12345", "name":"SDNO"}], "nfvo":[{"id":"12345", "name":"SDNO"}]}');
    //return JSON.parse('"nfvo":[{"id":"12345", "name":"SDNO"}]}');
    // TODO authenticate the url.
    var requestUrl = url + "/openoapi/lifecyclemgr/v1/services/toposequence/" + serviceId;
    $
        .ajax({
            type : "GET",
            url : requestUrl,
            contentType : "application/json",
            success : function(jsonobj) {
                // TODO return according to the json data received.
                return jsonobj;
            },
            error : function(xhr, ajaxOptions, thrownError) {
                alert("Error on getting link data : " + xhr.responseText);
            }
        });
}

function anchorClick(serviceId){
    var jsonData = loadServiceDetails(serviceId);
    //TODO populate the modal according to json response
    return true;
}

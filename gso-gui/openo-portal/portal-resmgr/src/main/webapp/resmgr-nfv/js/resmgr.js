function hideFirstCol() {
//	$('table tr').find('th:eq(0)').hide();
//	$('table tr').find('td:eq(0)').hide();
}
function deleteLocation(objectId) {
    var requestUrl = "/resmgr/rest/openoapi/resmgr/v1/locations/" + objectId;
    $.ajax({
        type: "DELETE",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            $('#location_table').bootstrapTable('remove', {
                field: 'id',
                values: [objectId]
            });
            bootbox.alert("Delete  successfull !!!");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on deleting data: " + xhr.responseText);
        }
    });
}

function editLocation(row) {
    $('#vmAppDialog').addClass('in').css({
        'display': 'block'
    });
    $('#id').val(row.id);
    $('#country').val(row.country);
    $('#location').val(row.location);
    $('#description').val(row.description);
    $('#latitude').val(row.latitude);
    $('#longitude').val(row.longitude);
}

function loadLocationData() {
    var requestUrl = "/resmgr/rest/openoapi/resmgr/v1/locations";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            $('#location_table').bootstrapTable({
                pageSize: 50,
                striped: true,
                data: jsonobj.locations
            });
            $('#location_table').bootstrapTable('refresh');

        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on getting site data : " + xhr.responseText);
        }
    });

}

$(function () {
    $("#vmAppForm").validate({
        rules: {
            country: "required",
            location: "required",
            latitude: {
                required: true,
                number: true
            },
            longitude: {
                required: true,
                number: true
            }
        }
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
        $('#vmAppForm')[0].reset();
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
    $('#createLocation')
        .click(
            function () {
                var formData = JSON.stringify($("#vmAppForm").serializeObject());
                var jsonobj = JSON.parse(formData);
                var requestUrl = "/resmgr/rest/openoapi/resmgr/v1/locations";
                var requestUrl_query = "/resmgr/rest/openoapi/resmgr/v1/locations";
                if ($('#id').val().length === 0) {//create


                    $.ajax({
                        type: "POST",
                        url: requestUrl,
                        contentType: "application/json",
                        dataType: "json",
                        data: formData,
                        success: function (jsonResp) {
                            loadLocationData();
                            bootbox.alert(jsonResp.msg);
                            $('#vmAppDialog').removeClass('in').css({
                                'display': 'none'
                            });

                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            bootbox.alert("Error on page : " + xhr.responseText);
                        }
                    });
                } else {//put


                    $.ajax({
                        type: "PUT",
                        url: requestUrl,
                        contentType: "application/json",
                        dataType: "json",
                        data: formData,
                        success: function (jsonResp) {
                            loadLocationData();
                            bootbox.alert(jsonResp.msg);
                            $('#vmAppDialog').removeClass('in').css({
                                'display': 'none'
                            });

                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            bootbox.alert("Error on page : " + xhr.responseText);
                        }
                    });
                }

            });


})
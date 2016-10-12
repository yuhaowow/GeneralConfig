/*
 * Copyright 2016 Huawei Technologies Co., Ltd.
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
var Table = {};
Table.create = function(data, id, columns) {
        $('#' + id).DataTable({
            data: data,
            bSort: false,
            "sDom": "<t<'left'li><'right'p>>",
            columns: columns
        });
    }
    /**
     *  update the table data, the cloumns must be same with the create one.
     *  data: the update data. as the create structure
     *  id: the table id.
     */
Table.updata = function(data, id) {
    var datatable = $('#' + id).dataTable().api();
    datatable.clear();
    datatable.rows.add(data);
    datatable.draw();
}

Table.enableToolTips = function(id) {
    $("#" + id + " tr th").each(function(index, sdom){
        sdom.title = sdom.textContent;
    })
    $("#" + id + " tbody tr td").each(function(index, sdom){
        sdom.title = sdom.textContent;
    })
}

var Rest = {};

Rest.http = function(setting) {
    var ret = $.ajax(setting);
    ret.fail(function(data) {
        try {
            if (data.responseText.indexOf("login") != -1) {
                top.window.document.location.reload()
            }
            var result = JSON.parse(data.responseText);
            if (result.error && result.error.message) {
                top.bootbox.alert(result.error.message, function() {});
            }
        } catch (e) {
        }

    })
    return ret;
}

Rest.turn2URI = function(url) {
    var cookies = document.cookie.split(";");
    var cookie = "";
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].split("=")[0] == "X-Auth-Token") {
            cookie = cookies[i].split("=")[1];
            break;
        }
    }
    $.ajax({
        url: "/openoapi/auth/v1/tokens",
        type: "HEAD",
        headers: {
            "X-Auth-Token": cookie
        },
        success: function(data) {
            window.document.location = url;
        },
        error: function(data) {
            top.window.document.location.reload();
        }
    })
}

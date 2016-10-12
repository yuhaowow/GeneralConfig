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
$(document).ready(function() {
    var USER_SERVICE = "/openoapi/auth/v1/users";
    var deleteEditOpt = "<img class='edit' title='edit' src='/openoui/auth/v1/user/images/edit.png'><img class='changePsd' title='Change Password' src='/openoui/auth/v1/user/images/reset.png'><img class='delete' title='delete' src='/openoui/auth/v1/user/images/delete.png'>";
    var editOpt = "<img class='edit' title='edit' src='/openoui/auth/v1/user/images/edit.png'><img class='changePsd' title='Change Password' src='/openoui/auth/v1/user/images/reset.png'>";

    var userListHeader = [
        { title: "User", data: "User",width: "20%"},
        { title: "Description", data: "Description",width: "60%"},
        { title: "Operations", data: "Operations",width: "20%"}
    ];
    function initialPage() {
        /*get the user list data;*/
        getUserList().done(function(data) {
            var data = formatUsers(data);
            Table.create(data, "table_id", userListHeader);
            $(".hw_body").css("visibility", "visible");
        }).error(function(data) {
            if (data.status == 403) {
                $(".hw_body").html("<span style='font-size:20px;'>" + JSON.parse(data.responseText).error.message + "</span>");
            }
        });

        /*add the listener*/
        $("#table_id tbody").on("click", "td", function(e) {
            var classname = e.target.className;
            var id = $("#table_id").DataTable().row(this).data().rowid;
            if (classname == "delete") {
                top.bootbox.confirm("Are you sure to delete this user?", function(result) {
                    if (result) {
                        deleteUser(id).done(function() {
                            getUserList().done(function(data) {
                                var data = formatUsers(data);
                                var datatable = $("#table_id").dataTable().api();
                                datatable.clear();
                                datatable.rows.add(data);
                                datatable.draw();
                            })
                        })
                    }
                })
            } else if (classname == "edit") {
                window.document.location = "/openoui/auth/v1/user/html/modifyUser.html" + "?id=" + id;
            } else if (classname == "changePsd") {
                window.document.location = "/openoui/auth/v1/user/html/changePassword.html" + "?id=" + id;
            }
        })

        $("#create").click(function(e) {
            window.document.location = "/openoui/auth/v1/user/html/createUser.html";
        })
    }

    function getUserList() {
        return Rest.http({
            url: USER_SERVICE + "?=" + new Date().getTime(),
            type: "GET",
            async: false,
            contentType: 'application/json',
            dataType: "json"
        })
    }

    function deleteUser(id) {
        return Rest.http({
            url: USER_SERVICE + "/" + id + "?=" + new Date().getTime(),
            type: "DELETE",
            async: false,
            contentType: 'application/json',
            dataType: "json"
        })
    }

    function formatUsers(data) {
        var tableData = [];
        for (var i = 0; i < data.length; i++) {
            var temp = {};
            temp.rowid = data[i].id;
            temp.User = data[i].name;
            temp.Description = data[i].description;
            if (data[i].name == "admin") {
                temp.Operations = editOpt;
            } else {
                temp.Operations = deleteEditOpt;
            }
            tableData.push(temp);
        }
        return tableData;
    }
    initialPage();

    setTimeout(function() {
        Table.enableToolTips("table_id");
    }, 0)
});

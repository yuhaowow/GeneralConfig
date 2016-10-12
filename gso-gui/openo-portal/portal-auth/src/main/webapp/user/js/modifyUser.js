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
    var userId;
    function initialPage() {
        userId = getId();
        getUserDetails(userId).done(function(data) {
            listUserDetails(data);
        });

        /*initial the event*/
        $("#confirm").click(function(e) {
            var data = getModifyUser();
            modifyUser(data).done(function() {
                window.document.location = "/openoui/auth/v1/user/html/user.html";
            })
        })
        $("#cancel").click(function(e) {
            window.document.location = "/openoui/auth/v1/user/html/user.html";
        })
    }

    function getModifyUser() {
        var data = {};
        data.description = $("#description").val();
        data.email = "xxxx@xxxx.com";
        return data;
    }
    function getUserDetails(id) {
        return Rest.http({
            url: USER_SERVICE + "/" + id + "?=" + new Date().getTime(),
            type: "GET",
            async: false,
            contentType: 'application/json',
            dataType: "json"
        })
    }

    function listUserDetails(data) {
        $("#userName").val(data.name);
        $("#description").val(data.description);
    }

    function modifyUser(data) {
        return Rest.http({
            url: USER_SERVICE + "/" + userId + "?=" + new Date().getTime(),
            type: "PATCH",
            async: false,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(data)
        })
    }

    function getId() {
        var qs = location.search;
        qs = qs.indexOf("?") === 0 ? qs : ("?" + qs);
        var start = qs.indexOf("id=") + 3;
        var end = qs.indexOf("&") === -1 ? qs.length : qs.indexOf("&") - start;
        return qs.substr(start, end);
    }

    initialPage();
})
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
    var $userName = $("#userName");
    var $oldPassword = $("#oldPassword");
    var $oldPasswordError = $("#oldPasswordError");
    var $password = $("#password");
    var $passwordError = $("#passwordError")

    var $cfPsdError = $("#cfPsdError");

    function initialPage() {
        userId = getId();
        getUserDetails(userId).done(function(data) {
            listUserDetails(data);
        });

        /*initial the event*/
        $("#confirm").click(function(e) {
            if (!checkPassword()) {
                return;
            }
            var data = getModifyUser();
            changePsd(data).done(function() {
                top.bootbox.alert("Password change successfully.", function(e) {
                    Rest.turn2URI("/openoui/auth/v1/user/html/user.html");
                })
            }).fail(function(e) {
                if (e.statusText == "Unauthorized") {
                    showError($oldPasswordError, "The old password is wrong.");
                } else {
                    showError($oldPasswordError, e.statusText);
                }
            })
        })
        $("#cancel").click(function(e) {
            window.document.location = "/openoui/auth/v1/user/html/user.html";
        })
    }

    function checkPassword() {
        if (!checkMandatory()) {
            return false;
        }

        if (!checkCfPassword()) {
            showError($cfPsdError, "The password is not the same.");
            return false;
        }

        if (!checkPasswordRule()) {
            return false;
        }
        return true;
    }

    function checkMandatory() {
        if ($password.val() == "") {
            showError($passwordError, "Mandatory.");
            return false;
        }

        if ($oldPassword.val() == "") {
            showError($oldPasswordError, "Mandatory.");
            return false;
        }
        return true;
    }

    function checkCfPassword() {
        return $("#password").val() == $("#cfPassword").val();
    }

    function checkPasswordRule() {
        var password = $password.val();

        if (!checkLength(8, 32, password)) {
            showError($passwordError, "The password length should between 8 and 32.");
            return false
        }

        if (!checkCotainSpecial(password)) {
            showError($passwordError, "At least contain: one uppercase letter, one lowercase letter, and one digit, one special character;");
            return false
        }

        if (!checkNoContainAndReverse(password, $userName.val())) {
            showError($passwordError, "The password should not contain the user name or reverse.");
            return false
        }

        if (!checkNoSpace(password)) {
            showError($passwordError, "The password should not contain space.");
            return false
        }
        return true
    }

    function checkLength(min, max, str) {
        return str.length >= min && str.length <= max;
    }

    function checkOnlySpecials(str, reg) {
        return str.match(reg) && str.match(reg).length == str.length
    }

    function checkCotainSpecial(password) {
        return password.match(/\~|\`|\@|\#|\$|\%|\^|\&|\*|\-|\_|\=|\+|\||\?|\/|\(|\)|\<|\>|\[|\]|\{|\}|\"|\,|\.|\;|\'|\!/g) != null 
                && password.match(/[0-9]/g) != null && password.match(/[a-z]/g) != null && password.match(/[A-Z]/g) != null;
    }

    function checkUderScore(str) {
        return str.indexOf("_") != 0 && str.lastIndexOf("_") != str.length - 1;
    }

    function checkNoSpace(str) {
        return str.indexOf(" ") == -1;
    }

    function checkNoContainAndReverse(str, str2) {
        return str.indexOf(str2) == -1 && str.indexOf(str2.split("").reverse().join("")) == -1;
    }

    function getModifyUser() {
        var data = {};
        data["original_password"] = $("#oldPassword").val();
        data.password = $("#password").val();
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
    }


    function changePsd(data) {
        return Rest.http({
            url: USER_SERVICE + "/" + userId + "/password" + "?=" + new Date().getTime(),
            type: "POST",
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

    function showError($Obj, message) {
        $Obj.text(message);
        $Obj.css("visibility", "visible");
        setTimeout(function() {
            hideError($Obj);
        }, 5000)
    }

    function hideError($Obj) {
        $Obj.css("visibility", "hidden");
    }

    initialPage();
})

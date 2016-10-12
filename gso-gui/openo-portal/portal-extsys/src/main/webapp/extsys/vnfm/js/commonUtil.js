/*
 * Copyright 2016 ZTE Corporation.
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
var commonUtil = {};
commonUtil.arrayRemove = function (aryInstance, index) {
    if (aryInstance == undefined || aryInstance == null) {
        return;
    }
    for (var i = 0, n = 0; i < aryInstance.length; i++) {
        if (aryInstance[i] != aryInstance[dx]) {
            aryInstance[n++] = aryInstance[i];
        }
    }
    aryInstance.length -= 1;
};

//For the expansion of the Date, convert the Date to specify the format String
// examples：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
commonUtil.parseDate = function (dateObj, format) {
    var o = {
        "M+": dateObj.getMonth() + 1, //month
        "d+": dateObj.getDate(),    //day
        "h+": dateObj.getHours(),   //hour
        "m+": dateObj.getMinutes(), //minute
        "s+": dateObj.getSeconds(), //second
        "q+": Math.floor((dateObj.getMonth() + 3) / 3),  //quarter
        "S": dateObj.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

//tooltip
commonUtil.showMessage = function (message, type) {
    $.growl({
        icon: "fa fa-envelope-o fa-lg",
        title: "&nbsp;&nbsp;" + $.i18n.prop("nfv-nso-iui-common-tip"),
        message: message
    }, {
        type: type
    });
};

commonUtil.registerCometdMessage = function (url, channel, callback) {
    var cometd = new $.Cometd();
    var cometdURL = location.protocol + "//" + location.host + url;
    cometd.configure({
        url: cometdURL,
        logLevel: "info"
    });
    // unregister websocket transport, use long-polling transport
    cometd.unregisterTransport('websocket');
    // store channel object parameters(this object include channel and callback function), start from arguments[1]
    var _args = arguments;

    cometd.addListener("/meta/handshake", function (handshake) {
        if (handshake.successful === true) {
            cometd.batch(function () {
                //subscribe channel
                cometd.subscribe(channel, function (message) {
                    callback.call(this, message.data);
                });
            });
        }
    });
    cometd.handshake();
}

commonUtil.format = function () {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
}

commonUtil.get = function (url, params, callback) {
    $.ajax({
        type: "GET",
        url: url,
        //contentType : contentType || "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "json",
        data: params || {},
        success: callback
    });
}

commonUtil.post = function (url, params, callback, contentType) {
    $.ajax({
        type: "POST",
        url: url,
        contentType: contentType || "application/x-www-form-urlencoded; charset=UTF-8",
        data: params || {},
        success: callback
    });
}

commonUtil.delete = function (url, callback, contentType) {
    $.ajax({
        type: "DELETE",
        url: url,
        contentType: contentType || "application/x-www-form-urlencoded; charset=UTF-8",
        success: callback
    });
}
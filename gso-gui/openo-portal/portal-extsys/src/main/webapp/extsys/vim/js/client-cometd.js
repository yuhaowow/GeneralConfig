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
/**
 * Created by 10184303 on 15-11-17.
 */

$(function () {
    var registerCometdMessage = function (url, callback) {
        var cometd = new $.Cometd();
        var cometdURL = location.protocol + "//" + location.host + "/api/nsocnotification/v1";
        cometd.configure({
            url: cometdURL,
            logLevel: "debug"
        });

        cometd.addListener("/meta/handshake", function (handshake) {
            if (handshake.successful === true) {
                cometd.batch(function () {
                    cometd.subscribe(url, function (message) {
                        callback.call(this, message.data);
                    });
                });
            }
        });
        cometd.handshake();
    }
    registerCometdMessage("/VIMstatus", function (data) {
        var alarmArray = JSON.parse(data.greeting);
        console.log(data.greeting);
        for (var i = 0; i < alarmArray.length; i++) {
            vm.vimStatusTime = alarmArray[i].checkTime;
            for (var n = 0; n < vm.vimInfo.length; n++) {
                if (alarmArray[i].id == vm.vimInfo[n].oid && alarmArray[i].hostStorageInfo == "") {
                    vm.vimInfo[n].status = alarmArray[i].status;
                    vm.vimInfo[n].errorInfo = alarmArray[i].alarmContent;
                    break;
                }
                if (alarmArray[i].id == vm.vimInfo[n].oid && alarmArray[i].hostStorageInfo.length != "") {
                    vm.vimInfo[n].status = "inactive";
                    vm.vimInfo[n].errorInfo = alarmArray[i].hostStorageInfo;
                    break;
                }

            }
        }

        setTimeout('resUtil.tooltipVimStatus()', 5000);
    });
});


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
var resUtil = {};

resUtil.tooltipVimStatus = function () {
    $("[data-toggle='tooltip']").tooltip();

}

resUtil.growl = function (message, type) {
    $.growl({
        icon: "fa fa-envelope-o fa-lg",
        title: "&nbsp;&nbsp;Notice: ",
        message: message + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }, {
        type: type
    });
    /*
     $.bootstrapGrowl(message, {
     ele: 'body', // which element to append to
     type: type, // (null, 'info', 'danger', 'success')
     offset: {from: 'bottom', amount: 20}, // 'top', or 'bottom'
     align: 'right', // ('left', 'right', or 'center')
     width: 'auto', // (integer, or 'auto')
     delay: 3000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
     allow_dismiss: false, // If true then will display a cross to close the popup.
     stackup_spacing: 10 // spacing between consecutively stacked growls.
     });
     */
}









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
var tmUtil = {};

tmUtil.nameRender = function(obj) {
    return '<a href="#" onclick="vm.$openDetail(\'' + obj.aData.serviceTemplateId
        + '\',' + obj.iDataRow + ')">' + obj.aData.templateName + '</a>';
}

tmUtil.topoRender = function(obj) {
    return '<a href="#" onclick="vm.$openTopoDetail(\'' + obj.aData.serviceTemplateId
    + '\',' + obj.iDataRow + ')">' + obj.aData.templateName + '</a>';
}

tmUtil.nodesRender = function(obj) {
    return '<a href="#" onclick="vm.$openNodesDetail(\'' + obj.aData.serviceTemplateId
        + '\',' + obj.iDataRow + ')">' + obj.aData.templateName + '</a>';
}
/*tmUtil.openDetail = function(obj) {
    if (obj) {
        var framework;
        if(window.parent.ZteFrameWork){
            framework = window.parent.ZteFrameWork;
        }else{
            return;
        }
        framework.goToURLByIDAndNewAction('eco-nsoc-templateDetail', 'initParam("' + obj.templateid + '")');
    }
}*/
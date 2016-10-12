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
var tmDetailUtil = {};
tmDetailUtil.timer = null;

tmDetailUtil.nameRender = function(obj) {
    return '<a href="#" onclick="vm.nodesDetail.$showDetails('
    + '\'block\',\'' + obj.aData.id + '\', \'' + obj.aData.name + '\',\'' + vm.nodesTab.nodesList.tempId + '\')">' + obj.aData.name + '</a>';
}

tmDetailUtil.inputsRender = function(obj) {
	var inputs = obj.aData.inputs;
	var result = "";
	//if(inputs && inputs.length) {
	//	var optionHtml = "";
	//	for(var i=0;i<inputs.length;i++) {
	//		optionHtml += '<option>' + inputs[i].name + '</option>';
	//	}
	//	result = '<select>' + optionHtml + '</select>';
	//}
	result = JSON.stringify(inputs);
	return result;
}

tmDetailUtil.outputsRender = function(obj) {
	var outputs = obj.aData.outputs;
	var result = "";
	//if(inputs && inputs.length) {
	//	var optionHtml = "";
	//	for(var i=0;i<inputs.length;i++) {
	//		optionHtml += '<option>' + inputs[i].name + '</option>';
	//	}
	//	result = '<select>' + optionHtml + '</select>';
	//}
	result = JSON.stringify(outputs);
	return result;
}

tmDetailUtil.initSteps = function() {
	$.ajax({
		type : "GET",
		url : vm.executionTab.$queryEventsInfoUrl,
		data : "json",
		success : function(data) {
			console.log("initSteps");
			if (data) {
				var step = $(".step");
	            if (step.getStep().length == 0) {
	            	vm.executionTab.steps = [{title : "start"}, {title : "install VM"}, {title : "execute"}, {title : "complete"}];
	                step.loadStep({
	                    size : "large",
	                    color : "blue",
	                    steps : vm.executionTab.steps
	                });
	            }
			}
		}
	});
}

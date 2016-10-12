/* Copyright 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var icon = {
	device_icon : "images/topo/NEUP.png",
  sfc_device_icon : "images/topo/OTHER_3.png",
  site_icon : "images/topo/site.png",
	network_icon : "images/topo/NETWORK.png"
}

/* when node is clicked, details will be displayed in the label. */
function Node(id, label, details, size, type, x, y) {
	this.id = id;
	this.label = label;
  this.brief = label;
  this.details = details;
	this.type = "square";
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = "white";
	this.borderColor = "white";
	this.image = {
		url : icon[type],
		scale : 1.0,
		clip : 1.0
	};
}

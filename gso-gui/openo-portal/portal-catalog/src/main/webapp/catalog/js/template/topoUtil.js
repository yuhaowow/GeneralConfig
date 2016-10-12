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
var topoUtil = {};
topoUtil.topoDatas=[];
topoUtil.svgOffsetWidth = 0;

/**
 * recursive generate tree structure of the topology graph data
 * @param  {[type]} rootName [description]
 * @param  {[type]} rootNode [description]
 * @return {[type]}          [description]
 */
topoUtil.generateSortData = function(rootName,rootNode) {
    for(var i=0;i<topoUtil.topoDatas.length;i++) {
		if(topoUtil.topoDatas[i].containIn == rootName){
			rootNode["children"].push(topoUtil.topoDatas[i]);	
			var currentNum = rootNode["children"].length-1;	
			topoUtil.generateSortData(topoUtil.topoDatas[i].id, rootNode["children"][currentNum])
		}
    }
}

/**
 * generate CP data, CP is inserted into the VDU or VNF child nodes
 * @param  {[type]} cpNode   [description]
 * @param  {[type]} rootNode [description]
 * @return {[type]}          [description]
 */
topoUtil.generateCpData = function(cpNode, rootNode) {
    for(var i=0;i<cpNode.length;i++){
		for(var j=0;j<rootNode.length;j++) {
			var node = rootNode[j];
			if(cpNode[i].virtualbindsto == node.id) {
				rootNode[j].cp.push(cpNode[i]);
				break;
			}					
		}
    }
}

/**
 * generate NETWORK and VL data, VL is inserted into the NETWORK child nodes
 * @param  {[type]} rootNode [description]
 * @return {[type]}          [description]
 */
topoUtil.generateNetworkData = function(vlanNode, networkNode) {
	if(networkNode.length == 0) {
		//no NETWORK, just VL
		var network = {
			subnets : vlanNode
		}
		networkNode.push(network);
	} else {
		//NETWORK and VL
		for(var i=0;i<networkNode.length;i++) {
			networkNode[i].subnets = [];
			for(var j=0;j<vlanNode.length;j++){
				var network = vlanNode[j].virtuallinksto;
				if(network == networkNode[i].id) {
					networkNode[i].subnets.push(vlanNode[j]);
				}
		    }
		}
	}
}

/**
 * initialize topology graph data
 * @param  {[type]} resp             [description]
 * @param  {[type]} nodeInstanceData [description]
 * @return {[type]}                  [description]
 */
topoUtil.initTopoData = function(resp, nodeInstanceData) {
	if(resp && resp.length > 0) {
		var datas = resp;
		var boxData = [];
		var networks = [];
		var vlanData = [];
		var cpData = [];
        for(var i=0;i<datas.length;i++){       	
        	if (datas[i]["containIn"] == "") {
        		datas[i]["containIn"] = "--";
        	}
        	//add the property of children for all nodes
            datas[i]["children"] = [];
            datas[i]["cp"] = [];
            //count instances number
            if (nodeInstanceData) {
            	datas[i]["num"] = topoUtil.getInstanceNum(datas[i], nodeInstanceData);
            }
            //empty currentLinkNum
            datas[i]["currentLinkNum"] = 0; 
            //distinguish VL, CP, NETWORK, VNF, VDU, VNFC from nodes to display topology graph
            var type = datas[i]["type"];
		 	if (type.toUpperCase().indexOf(".VL") > -1) {
		 		vlanData.push(datas[i]);
		 	} else if (type.toUpperCase().indexOf(".CP") > -1) {
		 		cpData.push(datas[i]);
		 	} else if(type.toUpperCase().indexOf(".NETWORK") > -1) {
		 		networks.push(datas[i]);
		 	} else if ((type.toUpperCase().indexOf(".VNF") > -1) || (type.toUpperCase().indexOf(".VDU") > -1) 
		 		|| (type.toUpperCase().indexOf(".VNFC") > -1)) {
		 		boxData.push(datas[i]);
		 	} else {
				boxData.push(datas[i]);
			}
        }
        
		//generate CP nodes
		topoUtil.generateCpData(cpData, boxData);
		//generate VNF/NS tree data
        var rootNode = {"children":[]};
        topoUtil.topoDatas = boxData;
		topoUtil.generateSortData("--", rootNode);
		vm.topologyTab.boxTopoDatas = rootNode.children;
		//generate NETWORK and VL nodes
		topoUtil.generateNetworkData(vlanData, networks);
		vm.topologyTab.networkTopoDatas = networks;

        //draw topology graph
        topoUtil.topoDatas = datas;
        setTimeout("topoUtil.generateLine()", 100);
        //bind window object events
        topoUtil.initWindowEvent();
	}
}

/**
 * get node instances number
 * @param  {[type]} nodeTemplate     [description]
 * @param  {[type]} nodeInstanceData [description]
 * @return {[type]}                  [description]
 */
topoUtil.getInstanceNum = function(nodeTemplate, nodeInstanceData) {
	var num = 0;
	var id;
	if(nodeTemplate.properties && nodeTemplate.properties.vnfdid) {
		id = nodeTemplate.properties.vnfdid;
	} else {
		id = nodeTemplate.id;
	}
	
	if(nodeInstanceData && nodeInstanceData.length > 0) {
		for (var j=0;j<nodeInstanceData.length;j++) {
			if(nodeInstanceData[j].nodeTemplateId == id) {
				num++;
			}
		}
	}
	return num;
}

topoUtil.getLineOffset = function(index) {
	return  index*15;
}
/**
 * get node y coordinate offset, it is based on the total number of connections and the number of connections to 
 * calculate the Y coordinate offset current connection
 * here's the connection refers connectsto relationship between VNC and VNC
 * @param  {[type]} node   current node object
 * @param  {[type]} height current DOM object cliengtHeight
 * @return {[type]}        Y coordinate offset
 */
topoUtil.getNodeOffset = function(node, height) {
	var toNodeLinkNum = ++node.currentLinkNum;
	var totalLinkNum = node.inLinks.length + node.outLinks.length;
	totalLinkNum++;
	return (height/totalLinkNum)*toNodeLinkNum;
}
/**
 * get node object by name
 * @param  {[type]} name node name
 * @return {[type]}      node object data
 */
topoUtil.getTopoDataById = function(id) {
	var node;
	for(var i=0;i<topoUtil.topoDatas.length;i++) {
		if(id == topoUtil.topoDatas[i].id) {
			node = topoUtil.topoDatas[i];
		}
	}
	return  node;
}

topoUtil.pageX = function(elem) {
	return  elem.offsetParent ? (elem.offsetLeft + topoUtil.pageX(elem.offsetParent)) : elem.offsetLeft;
}

topoUtil.pageY = function(elem) {
	return  elem.offsetParent ? (elem.offsetTop + topoUtil.pageY(elem.offsetParent)) : elem.offsetTop;
}

topoUtil.getHorizontalOffset = function(elem, elemArray) {
	var horizontalOffset = 0;
	for(var i=0;i<elemArray.length;i++) {
		var nodeTop = topoUtil.pageY(elemArray[i]);
		var fromTop = topoUtil.pageY(elem);
		if(fromTop == nodeTop) {
			horizontalOffset = topoUtil.getLineOffset(++horizontalIndex);
		}
	}
	return horizontalOffset;
}

topoUtil.getParentNode = function(elem) {
	return elem.className == "app" ? topoUtil.getParentNode(elem.offsetParent) : elem.offsetParent;
}

topoUtil.initElementSize = function() {
	var height=$(".bpContainer").height();
    $(".vlan").height() < height ? $(".vlan").height(height) : height;

    var networkWidth = $("#networks").width();
    var topoWidth = $("#topo").width();
    var bodyWidth = $("body").width();
    (networkWidth+topoWidth+50) > bodyWidth ? $("body").width(networkWidth+topoWidth+topoUtil.svgOffsetWidth+10) : $("body").width($("html").width());

    var containerHeight=$(".container-fluid").height();
    $(".coordinates").height(containerHeight).width($("body").width());
}

/**
 * get the widest VDU or VNF node to generate connect lines
 * @return {[type]} [description]
 */
topoUtil.getMaxNodeRight = function() {
	var maxNode = {offsetWidth : 0};
	for(var i=0;i<topoUtil.topoDatas.length;i++) {
		var node = document.getElementById(topoUtil.topoDatas[i].id);
		if(node && (maxNode.offsetWidth < node.offsetWidth)) {
			maxNode = node;
		}
	}
	return topoUtil.pageX(maxNode) + maxNode.offsetWidth;
}

topoUtil.initWindowEvent = function() {
	$(window.frameElement).attr('scrolling', 'auto');
	$('body').css('overflow', 'scroll');
	$(window).scroll(function(){
		$("#right-menu").css("top",$(window).scrollTop()); //vertical scroll
		$("#right-menu").css("right",-1*$(window).scrollLeft()); //horizontal scroll
	}).unload(function(){
		$(window.frameElement).attr('scrolling', 'no');
	});
	//$(window).resize(topoUtil.generateLine);
}

/**
 * generate topology attachment
 * connectedto represent the connection between the VNFC and VNFC, virtuallinksto represent the connection between the VLAN and VDU
 * @return {[type]} [description]
 */
topoUtil.generateLine = function() { 
	topoUtil.initElementSize();
	var vduPath='';
	var vlPath='';
	var vduIndex=0;
	var vlIndex=0;
	var fromNodeArray = [];
	var horizontalIndex = 0;
	var maxNodeParentRight = topoUtil.getMaxNodeRight();
	for(var i=0;i<topoUtil.topoDatas.length;i++) {
	 	//connectedto
	 	if(topoUtil.topoDatas[i].connectedto !=""){	 		
	 		var fromNode = document.getElementById(topoUtil.topoDatas[i].id); 
	 		var horizontalOffset = 0;
	 		for(var k=0;k<fromNodeArray.length;k++) {
	 			//VNFC node in the same VDU, coordinate offset
	 			var nodeTop = topoUtil.pageY(fromNodeArray[k]);
	 			var fromTop = topoUtil.pageY(fromNode);
	 			if(fromTop == nodeTop) {
	 				horizontalOffset = topoUtil.getLineOffset(++horizontalIndex);
	 			}
	 		}
	 		fromNodeArray.push(fromNode);	 		
	 		var fromNodeParent = topoUtil.getParentNode(fromNode);
	 		var toArray = topoUtil.topoDatas[i].connectedto.split(",");	 		
	 		for (var j=0;j<toArray.length;j++) {	 			
	 			var toNode = document.getElementById(toArray[j]); 
	 			var toNodeParent = topoUtil.getParentNode(toNode);
	 			//Computing connection point and the connection point Y coordinate offset
	 			var fromNodeOffset = topoUtil.getNodeOffset(topoUtil.topoDatas[i], fromNode.clientHeight); 
	 			var toNodeTopoData = topoUtil.getTopoDataById(toArray[j]);
	 			var toNodeOffset = topoUtil.getNodeOffset(toNodeTopoData, toNode.clientHeight); 
	 			//X coordinate offset calculation link
	 			var xLineOffset = topoUtil.getLineOffset(++vduIndex); 
	 			//Get the largest X coordinate offset is used to set the width of the body
	 			topoUtil.svgOffsetWidth = Math.max(xLineOffset, topoUtil.svgOffsetWidth);
	 				 			
	 			var fromNodeLeft = topoUtil.pageX(fromNode);	 			
	 			var fromNodeRight = topoUtil.pageX(fromNode) + fromNode.offsetWidth;
	 			var fromNodeTop = topoUtil.pageY(fromNode);

	 			var toNodeLeft = topoUtil.pageX(toNode);
	 			var toNodeRight = topoUtil.pageX(toNode) + toNode.offsetWidth;
	 			var toNodeTop = topoUtil.pageY(toNode); 			

	 			var coord = '';
	 			if(fromNodeTop == toNodeTop) {
	 				if(fromNodeLeft < toNodeLeft) {
	 					coord = "M"+fromNodeRight+","+(fromNodeTop+horizontalOffset+fromNodeOffset)
							+" L"+toNodeLeft+","+(fromNodeTop+horizontalOffset+fromNodeOffset)
	 				} else {
	 					coord = "M"+fromNodeLeft+","+(fromNodeTop+horizontalOffset+fromNodeOffset)							
							+" L"+toNodeRight+","+(fromNodeTop+horizontalOffset+fromNodeOffset);
	 				}
	 			} else {
	 				var nodeRight = maxNodeParentRight + xLineOffset;
				 	coord = "M"+fromNodeRight+","+(fromNodeTop+horizontalOffset+fromNodeOffset)
							+" L"+nodeRight+","+(fromNodeTop+horizontalOffset+fromNodeOffset)
							+" L"+nodeRight+","+(toNodeTop+toNodeOffset)
							+" L"+toNodeRight+","+(toNodeTop+toNodeOffset);			 	
			 	}
			 	vduPath +='<path d="'+coord+'" marker-end="url(#arrowhead)" fill="none" stroke-dasharray="5,5" stroke="#7A7A7A" stroke-width="3px" shape-rendering="geometricPrecision"></path>';	
	 		}
	 	}

	 	//virtuallinksto	 	
	 	if(topoUtil.topoDatas[i].virtuallinksto !=""){
			var fromNode = document.getElementById(topoUtil.topoDatas[i].id); 
			var toArray = topoUtil.topoDatas[i].virtuallinksto.split(",");	 		
	 		for (var j=0;j<toArray.length;j++) {
	 			var toNode = document.getElementById(toArray[j]);
	 			if(toNode) {
	 				var yLineOffset = topoUtil.getLineOffset(j); 
		 			var xLineOffset = topoUtil.getLineOffset(++vlIndex); 

		 			var fromNodeLeft = topoUtil.pageX(fromNode);
		 			var fromNodeTop = topoUtil.pageY(fromNode);

		 			var toNodeRight = topoUtil.pageX(toNode) + toNode.offsetWidth;
		 			var toNodeTop = topoUtil.pageY(toNode);

		 			var coord = "";
		 			if(fromNodeTop == toNodeTop) {
		 				coord = "M"+fromNodeLeft+","+(fromNodeTop+fromNode.clientHeight/2+xLineOffset)
							+" L"+toNodeRight+","+(fromNodeTop+fromNode.clientHeight/2+xLineOffset);
		 			} else {
		 				coord = "M"+fromNodeLeft+","+(fromNodeTop+fromNode.clientHeight/2+yLineOffset)
							+" L"+toNodeRight+","+(fromNodeTop+fromNode.clientHeight/2+yLineOffset);
		 			}
				 	vlPath +='<path d="'+coord+'" fill="none" stroke="'+toNode.style.backgroundColor+'" stroke-width="4px"></path>';
	 			}	 				
	 		}
		}
	}
	
	$("#svg_vdu g").html(vduPath);
	$("#svg_vl g").html(vlPath);
}

/**
 * generate node table data
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
topoUtil.generateNodeTemplate = function(data) {
	var nodeTemplate = {};
	nodeTemplate.id = data.id;
	nodeTemplate.name = data.name;
	nodeTemplate.type = data.type;
	nodeTemplate.parentType = data.parentType;
	nodeTemplate.vnfdid = ""; //only nested VNF node has value
	nodeTemplate.properties = data.properties;
	nodeTemplate.flavors = data.flavors;	 
	nodeTemplate.containIn = ""; //containIn relation which the front-end custom is used to display the topo relations of the graph
	nodeTemplate.containedin = ""; //the relation between VNF and VNFC
	nodeTemplate.deployedon = ""; //the relation between VDU and VNFC
	nodeTemplate.connectedto = ""; //the relation between VNFC and VNFC
	nodeTemplate.virtuallinksto = ""; //the relation between VL and CP or between VL and VDU
	nodeTemplate.virtualbindsto = ""; //the relation between CP and VDU
	nodeTemplate.outLinks = []; //a collection of connected nodes connectedto
	nodeTemplate.inLinks = []; //nodes are connected connectedto relationship collection
	nodeTemplate.currentLinkNum = 0;
	var relationShips = data.relationShips || []; //some nodes may not have relationships
	$.each(relationShips, function(index, obj){
		if (obj.sourceNodeId == data.id) {
			switch(obj.type) {
				case "containedIn" :
				case "tosca.relationships.nfv.ContainedIn" :
				case "tosca.relationships.nfv.BelongTo" :
					nodeTemplate.containedin = obj.targetNodeId;
					break;
				case "deployedOn" :
				case "tosca.relationships.nfv.DeployedOn" :
					nodeTemplate.deployedon = obj.targetNodeId;
					break;
				case "connectedTo" : 
				case "tosca.relationships.nfv.ConnectsTo" :
					nodeTemplate.connectedto += "," + obj.targetNodeId;
					nodeTemplate.outLinks.push(obj.targetNodeId);
					break;
				case "virtualLinksTo" :
				case "tosca.relationships.nfv.VirtualLinksTo" :
					nodeTemplate.virtuallinksto += "," + obj.targetNodeId;
					break;
				case "virtualBindsTo" :
				case "tosca.relationships.nfv.VirtualBindsTo" :
					nodeTemplate.virtualbindsto += "," + obj.targetNodeId;
					break;
			}
		}
		if (obj.targetNodeId == data.id) {
			switch(obj.type) {
				case "connectedTo" : 
				case "tosca.relationships.nfv.ConnectsTo" :
					nodeTemplate.inLinks.push(obj.sourceNodeId);
					break;
			}
		}
	});
	nodeTemplate.connectedto = nodeTemplate.connectedto.substring(1);
	nodeTemplate.virtuallinksto = nodeTemplate.virtuallinksto.substring(1);
	nodeTemplate.virtualbindsto = nodeTemplate.virtualbindsto.substring(1);

	if(topoUtil.isVNFType(data.type)) {
        $.each(data.properties, function(key, value) {
            if(key == "vnfdid" && value) {
                nodeTemplate.vnfdid = value;
            }
        });
	}
	return nodeTemplate;
}

/**
 * generate topology data
 * deployedon is used to display the relation between VNFC and VDU
 * containedin is used to display the relation between VNFC and VNF
 * transform relations between VDU and VNF, containIn is used to display the relation between VDU and VNF
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
topoUtil.generateTopoTemplate = function(data) {
	for(var i=0;i<data.length;i++) {
		if(data[i].containedin){
			//assignment is designed to compatible with no VDU, only VNF and VNFC situations
			data[i].containIn = data[i].containedin;
			for(var j=0;j<data.length;j++) {
				if(data[i].deployedon == data[j].id) {
					data[j].containIn = data[i].containedin;
					break;
				}
			}
		}
		//the relationship between VNFC and VDU deployedon replace with containIn
		if(data[i].deployedon){
			data[i].containIn = data[i].deployedon;
		}
	}
	return data;	
}

/**
 * generate nodetemplate detail
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
topoUtil.generateNodeTemplateDetail = function(data) {
	var nodeTemplateDetail = {};
	nodeTemplateDetail.properties = [];
	var properties = data.properties;
	for(var key in properties) {
		var property = {};
		property.key = key;
		property.value = properties[key];
		nodeTemplateDetail.properties.push(property);
	}
	//add flavor to nodetempalte properties
	var flavors = data.flavors;
	if(flavors && flavors.length) {
		var flavor = flavors[0];
		for(var key in flavor) {
			var property = {};
			property.key = key;
			property.value = flavor[key];
			nodeTemplateDetail.properties.push(property);
		}
	}

	nodeTemplateDetail.relationShips = data.relationShips;	

	nodeTemplateDetail.general = [];
	var general = {};
	general.key = "name";
	general.value = data.name;
	nodeTemplateDetail.general.push(general);
	var general = {};
	general.key = "type";
	general.value = data.type;
	nodeTemplateDetail.general.push(general);

	return nodeTemplateDetail;
}

topoUtil.getCurrentDetailData = function(detailDatas, nodetemplateid) {
    var data;
    for(var i=0; i<detailDatas.length; i++) {
        if (detailDatas[i].id == nodetemplateid) {
            data = topoUtil.generateNodeTemplateDetail(detailDatas[i]);
            break;
        }
    }
    return data;
}

/**
 * generate node instance detail
 * a node template may correspond to multiple node instances, their properties are not the same
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
topoUtil.generateNodeInstanceDetail = function(data) {
	var nodeInstanceDetail = [];
	nodeInstanceDetail.properties = [];
	nodeInstanceDetail.general = [];	

	var properties = data.properties;
	for(var i=0;i<properties.length;i++) {
		var nodeDetail = {};
		var name = data.name;		
		for(var key in properties[i]) {
			var property = {};
			property.key = key;
			property.value = properties[i][key];			
			nodeDetail.properties.push(property);

			if(key == "name") {
				name = properties[i][key];
			}
		}
		var general = {};
		general.key = "name";
		general.value = name;
		nodeDetail.general.push(general);
		var general = {};
		general.key = "type";
		general.value = data.type;
		nodeDetail.general.push(general);

		nodeDetail.relationShips = data.relationShips;
		nodeInstanceDetail.push(nodeDetail);
	}
	return nodeInstanceDetail;
}

topoUtil.getCurrentNodeInstanceDetail = function(detailDatas, nodetemplateid) {
    var data;
    for(var i=0; i<detailDatas.length; i++) {
        if (detailDatas[i].id == nodetemplateid) {
            data = topoUtil.generateNodeInstanceDetail(detailDatas[i]);
            break;
        }
    }
    return data;
}

topoUtil.getCidr = function(properties) {
	for(var key in properties) {
        if(key == "cidr") {
        	return properties[key];
        }
    }
}

topoUtil.getColor = function(index) {
	var colors = ['#1F77B4','#FF7F0E','#2CA02C','#D62728','#9467BD','#8C564B','#4b6c8b','#550000','#dc322f','#FF6600'];
	return colors[index%10];
}

topoUtil.getCpTop = function(index, parentBoxId) {
    var newTop = "";
    var height = 0;
    if(index == 0) {
        var circle_top = $(".circle").css("top");
        var circle_height = $(".circle").css("height");
        var top = circle_top.substring(0, circle_top.length-2) - 0;
        height = circle_height.substring(0, circle_height.length-2) - 0;
        newTop = (top+height+10);
    } else {
        var circle_top = $(".smallCircle").css("top");
        var circle_height = $(".smallCircle").css("height");
        var top = circle_top.substring(0, circle_top.length-2) - 0;
        height = circle_height.substring(0, circle_height.length-2) - 0;
        newTop = (top+height*(index));
    }
    //if the length of cp over the box which cp is virtualbindsto, set the box min-heght attribute
    var $box = $("#" + parentBoxId);
	var min_height = $box.css("min-height");
	var box_min_height = min_height.substring(0, min_height.length-2) - 0;
	var cp_height = newTop + height;
	if(cp_height > box_min_height) {
		$box.css("min-height", cp_height);
	}

    return newTop + "px";
}

topoUtil.isVNFType = function(type) {
	if((type.toUpperCase().indexOf(".VNF") > -1) && (type.toUpperCase().indexOf(".VNFC") < 0)) {
		return true;
	}
	return false;
}
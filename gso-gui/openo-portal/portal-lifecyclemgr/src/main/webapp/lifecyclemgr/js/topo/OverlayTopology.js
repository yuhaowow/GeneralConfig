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

/* overlay micro-service API URL. We might use Maven filter feature to replace with the real address when generating the war package. */  
const REQUEST_URL_PER_OVERLAY_VPN = "http://localhost:8080/org.openo.sdno.overlayvpnservice/openoapi/sdnooverlayvpn/v1/site2dc-vpn/";
 
/* extract Overlay VPN ID from query string of request URL. */
function extractOverlayVPNId()
{
  var parameters = location.search.substring(1).split("&");
  var temp = parameters[0].split("=");
  var id = unescape(temp[1]);
  
  return id;
}

/* load overlay vpn instance data from overlay micro-service and display its topology. */
function loadOverlayData(vpn_id) {
  var requestUrl = REQUEST_URL_PER_OVERLAY_VPN.concat(vpn_id);
  $
    .ajax({
      type: "GET",
      url: requestUrl,
      contentType: "application/json",
      success: function (jsonobj) {
        init_topo(jsonobj);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert("Error on getting Overlayvpn data : " + xhr.responseText);
        
        //the following lines are used to test w/o overlay micro-service.
        //var vpn_info = createMockVpnInfo();
        //init_topo(vpn_info);
      }
    });
}
/* a function that mock overlay micro-service response based on API for testing purpose only.*/
function createMockVpnInfo(vpn_id) {
  var vpnObj = '{"name":"Overlay VPN 1","description":"One VPN connect site to DC.","site":{"cidr":"10.10.0.0/16","thinCpeId":"thincpe-1234-5678","portAndVlan":"port12vlan13","vCPEId":"vcpe-2222-5555"},"vpc":{"name":"VPC 1","site":{"name":"subnet 1","cidr":"172.18.0.0/16","vni":"vni-1234-9999"}},"sfp":{"scfNeId":"scfneid-1234-5678","servicePathHop":[{"hopNumber":"hopNumber-111111","sfiId":"sfiId-333333","sfgId":"sfgId-444444"}]}}';   
  return JSON.parse(vpnObj);
}


/* definition of Topology */
function Topology(containerId) {
	/**
	 * IMPORTANT: This only works with the canvas renderer. TBD in the future
	 * will also support the WebGL renderer.
	 */
	sigma.utils.pkg('sigma.canvas.nodes');

	this.s = new sigma({
		graph : {
			nodes : [],
			edges : []
		},
		renderer : {
			// IMPORTANT:
			// This works only with the canvas renderer, so the
			// renderer type set as "canvas" is necessary here.
			container : document.getElementById(containerId),
			type : 'canvas'
		},
		settings : {
			minNodeSize : 8,
			maxNodeSize : 64,
			edgeLabelSize : 'proportional'
		}
	});
  
	this.addNode = addNode;
	this.addEdge = addEdge;
}
function addNode(node) {
	this.s.graph.addNode(node);
}
function addEdge(edge) {
	this.s.graph.addEdge(edge);
}


/* get details to be displayed when site or vpc node is clicked. Note that more details may be added if it is appropriate. */
function getSiteDetails(vpn_info) {
  var siteCidr = vpn_info.site.cidr;
  return "Site CIDR: ".concat(siteCidr);
}
function getVPCDetails(vpn_info) {
  var vpcCidr = vpn_info.vpc.site.cidr;
  return "VPC CIDR: ".concat(vpcCidr);;
}

/** create topology of overlay vpn with instance data. 
 * Note that the layout/topology is hard-coded. In the future, this function may be moved to BRS/MSS 
 * that can understand NSD, calculate layout, fill with instance information, and return the final JSON string expected by sigma for rendering.
 */
function createNodesAndEdgesForOverlayVPN(topology, vpn_info) {
  var siteNode = new Node("site", "Site", getSiteDetails(vpn_info), 48, "site_icon", 0.1, 0.65);
	var thinCPENode = new Node("thinCPE", "ThinCPE", "ThinCPE ID: ".concat(vpn_info.site.thinCpeId), 16, "device_icon", 0.1, 0.5);
  var vCPENode = new Node("vCPE", "vCPE", "vCPE ID: ".concat(vpn_info.site.vCPEId), 16, "device_icon", 0.4, 0.5);
	var gwNode = new Node("gw", "GW", "GW", 16, "device_icon", 0.8, 0.5);

  var fwNode = new Node("fw", "FW", "FW", 8, "sfc_device_icon", 0.8, 0.4);
  var lbNode = new Node("lb", "LB", "LB", 8, "sfc_device_icon", 0.8, 0.3);
  var vpcNode = new Node("vpc", "VPC", getVPCDetails(vpn_info), 48, "network_icon", 1.0, 0.3);
  
  var vfwNode = new Node("vfw", "vFW", "vFW", 8, "sfc_device_icon", 0.32, 0.35);
  var vlbNode = new Node("vlb", "vLB", "vLB", 8, "sfc_device_icon", 0.48, 0.35);
  
  var edge0 = new Edge("e0", "", "site", "thinCPE", 0.5, "black");
	var edge1 = new Edge("e1", "VxLAN", "thinCPE", "vCPE", 0.5, "blue");
	var edge2 = new Edge("e2", "IPSec", "vCPE", "gw", 0.5, "green");
  
  var edge3 = new Edge("e3", "", "vCPE", "vfw", 0.5, "grey");
  var edge4 = new Edge("e4", "", "vfw", "vlb", 0.5, "grey");
  var edge5 = new Edge("e5", "", "vlb", "vCPE", 0.5, "grey");
  
  var edge6 = new Edge("e6", "", "gw", "fw", 0.5, "grey");
  var edge7 = new Edge("e7", "", "fw", "lb", 0.5, "grey");
  var edge8 = new Edge("e8", "", "lb", "vpc", 0.5, "grey");  
  
  topology.addNode(siteNode);
	topology.addNode(thinCPENode);
	topology.addNode(vCPENode);
	topology.addNode(gwNode);
  topology.addNode(fwNode);
	topology.addNode(lbNode);
  topology.addNode(vpcNode);
  topology.addNode(vfwNode);
	topology.addNode(vlbNode);
  
  topology.addEdge(edge0);
	topology.addEdge(edge1);
	topology.addEdge(edge2);
  topology.addEdge(edge3);
  topology.addEdge(edge4);
	topology.addEdge(edge5);
  topology.addEdge(edge6);
  topology.addEdge(edge7);
	topology.addEdge(edge8);
}


/* create and show the topology based on overlay vpn instance data. */
function init_topo(vpn_info) {
	var topology = new Topology("container");
  createNodesAndEdgesForOverlayVPN(topology, vpn_info);
	CustomShapes.init(topology.s);
	topology.s.refresh();
  
  //show details when a node is clicked
  topology.s.bind('clickNode', function(e) {
    console.log(e.type, e.data.node.label, e.data.captor); 
    var nodeId = e.data.node.id;
    topology.s.graph.nodes().forEach(function(n) {
      if (n.id == nodeId)
        n.label = n.details;
    });
    topology.s.refresh();
  }); 
  topology.s.bind('clickStage', function(e) {
    console.log(e.type, e.data.edge, e.data.captor); 
    topology.s.graph.nodes().forEach(function(n) {
      n.label = n.brief;
    });
    topology.s.refresh();    
  }); 
}

/* code to be run when loading the page */
$(document).ready(function() {
  var vpn_id = extractOverlayVPNId();
  
  //load overlay vpn instance data and show its topology.
  loadOverlayData(vpn_id);
  
  //insert overlay VPN id into the title.
  var titleStr = "Topology of Overlay VPN : ".concat("<b>", vpn_id, "</b>");
  document.getElementById("title").innerHTML = titleStr;
});
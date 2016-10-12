/*
 * Copyright 2016, CMCC Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function oTopo() { 
	
	var topo;
	
	/**
	 * <Creat topological graph object>
	 * @param id: The id of DIV which display topological graph.
	 * @param settings: Init parameters .
	 * @see []
	 */
	this.canvas = function (id, settings)
	{
		var g =
		{
			nodes : [],// nodes
			edges : [] // links
		};
		
		topo =  new sigma(
		{
			graph : g,
			renderer :
			{
				// IMPORTANT:
				// This works only with the canvas renderer, so the
				// renderer type set as "canvas" is necessary here.
				container : document.getElementById(id),
				type : 'canvas'
			},
			settings : settings
		});
		
		CustomShapes.init(topo);
	};
	
	
	/**
	 * <Refresh topological graph object>
	 * @see []
	 */
	this.refresh = function()
	{
		topo.refresh();
	};
	
	
	/**
	 * <Creat node object>
	 * @param id: The id of node.
	 * @see []
	 */
	this.Node = function(id)
	{
		var pr = this;
		this.id = id,
		this.label = "",
		this.type = "square",/**equilateral,star,square,diamond,circle,cross**/
		this.x = 1,
		this.y = 1,
		this.size = 10,
		this.image = {};
		this.color = "transparent",
		this.borderColor = "#1E90FF",
		
		this.setName = function(v)
		{
			pr.label = v;
		};
		
		this.setType = function(v)
		{
			pr.type = v;
		};
		
		this.setSize = function(v)
		{
			pr.size = v;
		};
		
		this.setImg = function(url)
		{
			pr.image =
			{
				url : url,
				// scale/clip are ratio values applied on top of 'size'
				scale : 1,
				clip : 0,
			};
			pr.borderColor = "transparent";
			pr.color = "transparent";
		};
		
		this.setImgScale = function(s)
		{
			pr.image.scale = s;
		};
		
		this.setImgClip = function(c)
		{
			pr.image.clip = c;
		};
		
		this.setColor = function(v)
		{
			pr.color = v;
		};
		
		this.setBorderColor = function(v)
		{
			pr.borderColor = v;
		};
		
		this.setLocation = function(x,y)
		{
			pr.x = x;
			pr.y = y;
		};
		
		this.setProperty = function(k,v)
		{
			pr[k] = v;
		};
	};
	
	/**
	 * <Creat link object>
	 * @param id: The id of link.
	 * @see []
	 */
	this.Link = function(id)
	{
		var pr = this;
		this.id = id,
		this.type = "arrow",/*'line','curve','arrow','curvedArrow','dashed','dotted','parallel','tapered'*/
		this.source = 1,
		this.target = 1,
		this.size = Math.random(),
		this.color = "#1E90FF",
		
		this.setType = function(v)
		{
			pr.type = v;
		};
		
		this.setSize = function(v)
		{
			pr.size = v;
		};
		
		this.setConnect = function(s,t)
		{
			pr.source = s;
			pr.target = t;
		};
		
		this.setColor = function(v)
		{
			pr.color = v;
		};
		
		this.setProperty = function(k,v)
		{
			pr[k] = v;
		};
	};
	
	/**
	 * <Add node to the topological graph>
	 * @param v: Node object.
	 * @see []
	 */
	this.addNode = function(v)
	{
		topo.graph.addNode(v);
	};
	
	/**
	 * <Delete node from the topological graph>
	 * @param id: The id of node.
	 * @see []
	 */
	this.dropNode = function(id)
	{
		topo.graph.dropNode(id);
	};
	
	
	/**
	 * <Add link to the topological graph>
	 * @param v: Link object.
	 * @see []
	 */
	this.addLink = function(v)
	{
		topo.graph.addEdge(v);
	};
	
	/**
	 * <Delete link from the topological graph>
	 * @param id: The id of link.
	 * @see []
	 */
	this.dropLink = function(id)
	{
		topo.graph.dropEdge(id);
	};
	
	/**
	 * <Returns all of the nodes>
	 * @see []
	 */
	this.allNodes = function()
	{
		return topo.graph.nodes();
	};
	
	/** 
	 * Define drag and drop object.
	 */
	var dragListener = null;
	
	/**
	 * <Set the node drag and drop>
	 * @param b: The node can be dragged and dropped when the parameter is TRUE.Set after canvas init.
	 * @see []
	 */
	this.setDrag = function(b)
	{
		if (b)
		{
		    dragListener = sigma.plugins.dragNodes(topo, topo.renderers[0]);
		}
	};
	
	/**
	 * <Binding the event of drag and drop>
	 * @param method: The binding method include:startdrag,drag,drop,dragend.
	 * @param e: Callback method.
	 * @see []
	 */
	var dragBind = function(method,e)
	{
		if (null != dragListener)
		{
			dragListener.bind(method, function(event){
				e(event);
			});
		}
	};
	
	
	/**
	 * <Binding the event of mouse>
	 * @param method: The binding method include:rightClick,clickStage,doubleClickStage,rightClickStage,clickNode,clickNodes,clickEdge,
	 *                       clickEdges,doubleClickNode,doubleClickNodes,doubleClickEdge,doubleClickEdges,rightClickNode,
	 *                       rightClickNodes,rightClickEdge,rightClickEdges,overNode,overNodes,overEdge,overEdges,outNode,
	 *                       outNodes,outEdge,outEdges,downNode,downNodes,downEdge,downEdges,upNode,upNodes,upEdge,upEdges
	 * @param e Callback method.
	 * @see []
	 */
	this.mouseBind = function(method,e)
	{
		if (null != topo)
		{
			topo.bind(method, function(event){
				e(event);
			});
		}
	};
	
	
	/**
	 * <Disable the right mouse button for browser>
	 * @param obj: The object to be disabled.
	 * @see []
	 */
	this.noright = function(obj) {
	    if (obj) {
	        obj.oncontextmenu  =  function() {
	            return false;
	        }
	        obj.ondragstart  =  function() {
	            return false;
	        }
	        obj.onselectstart  =  function() {
	            return false;
	        }
	        obj.onselect  =  function() {
	            obj.selection.empty();
	        }
	        obj.oncopy  =  function() {
	            obj.selection.empty();
	        }
	        obj.onbeforecopy  =  function() {
	            return false;
	        }
	    }
	}
}

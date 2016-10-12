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
var initMainPage = function(){
	var modules;
	var resConfig;

	var lang = getLanguage();
	var propertiesFileNamePrefix = "";
	//var jsonUrl = "json/main-page-" + lang + ".json";	
	//var jsonUrl = mainpagePath;
	var jsonUrl = "appRes/json/main-page.json";
	var appResExist = false;
	
	$.ajax({
		  async:false,
		  "type" : "GET",
		  url: jsonUrl,
		  dataType: "json",
		  "success" : function (res, textStatus, jqXHR) {		
				resConfig = res;
				modules = res.modules;	
				propertiesFileNamePrefix = res.propertiesFileNamePrefix;	
				appResExist	= true;
		  },
		  "error" : function () {
			   //alert("Config file load error!");
		  }
	});		
	
	if(!appResExist){
		jsonUrl = "json/main-page.json";		
		$.ajax({
			  async:false,
			  "type" : "GET",
			  url: jsonUrl,
			  dataType: "json",
			  "success" : function (res, textStatus, jqXHR) {		
					resConfig = res;
					modules = res.modules;	
					propertiesFileNamePrefix = res.propertiesFileNamePrefix;				 
			  },
			  "error" : function () {
				   alert("Config file load error!");
			  }
		});		
	}

	var template = "<div class='brick {image}'>" + 
					"<a id='{linkId}' href='{url}' class='entranceLink'>" + 
					"<div class='row'>" + 
					   "<div class='cover contentToggle'>{cover}</div>" +
					   "<div class='{toolsImage}'></div>" +  
					   "<div class='contentTip  contentToggle'>{contentTip}</div>" +
					"</div>" + 
					"</a>" +  					
			   "</div>";
			   
	var templatePic = "<div class='brick {image}'>" + 
					"<div class='row'>" + 
					   "<div class='cover contentToggle'>{cover}</div>" +
					   "<div class='{toolsImage}'></div>" +  
					   "<div class='contentTip  contentToggle'>{contentTip}</div>" +
					"</div>" + 				
			   "</div>";
	
	for (var i = 0; i < modules.length; ++i) {
			
		if(!modules[i].background){
			alert("Brick background missed!");
			return;
		}
		
		var temp = "";		
		
		if(modules[i].linkId){
			temp = template.replace("{linkId}", modules[i].linkId)
						.replace("{image}", modules[i].background)
						.replace("{toolsImage}", modules[i].toolsImage)
						.replace("{url}", modules[i].url)
						.replace("{contentTip}", modules[i].contentTip);
		}else{
			temp = templatePic.replace("{image}", modules[i].background)
						.replace("{url}", modules[i].url)
						.replace("{contentTip}", "");
		}
		
		if(modules[i].cover){
			temp = temp.replace("{cover}", "<span id='" + modules[i].cover + "' name_i18n='com_zte_ums_ict_framework_ui_i18n'></span>");
		}else{
			temp = temp.replace("{cover}","");
		}
		
		$($(".column")[i % 4]).append(temp);
			
	}
			
	
	$(function() {						
		
		$("#headerName").html("<img src='" + resConfig.productImage + "' />" );
		
		$(".brick").mouseover(function(){	
			$(".contentTip", this).fadeTo(1000, 1);					
			$(".cover", this).fadeOut(1000);
		});
		
		$(".brick").mouseout(function(){
			$(".contentTip", this).fadeTo(1000, 0);	
			$(".cover", this).fadeIn(1000);
		});
		
		//添加模块导航链接
		$("a.entranceLink").click(function(e){
			e.preventDefault();
			if($(this).attr("id") && $(this).attr("id") != "undefined"){
				location.href = "default.html" + "#_" + $(this).attr("id");
			}
		});					
		
		//国际化
		loadPropertiesSideMenu(lang, propertiesFileNamePrefix, "appRes/i18n/" , "com_zte_ums_ict_framework_ui_i18n");
		//loadPropertiesSideMenu(lang, propertiesFileNamePrefix, "i18n/" , "com_zte_ums_ict_framework_ui_i18n");
		loadPropertiesSideMenu(lang, "web-framework-integration-i18n", "i18n/" , "com_zte_ums_ict_framework_ui_i18n");
	});
}
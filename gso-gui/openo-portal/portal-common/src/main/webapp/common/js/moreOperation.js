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
var resetSelectedItem=function(menuAlink){
	if(menuAlink.children('div.boxOperation').length>0){
		$(".box.boxOperation", $(".carousel-inner")).removeClass("moreButtonSelected");
		menuAlink.children('div.boxOperation').addClass('moreButtonSelected');
	}else if(menuAlink.parents('div.boxOperation').length>0){
		$(".box.boxOperation", $(".carousel-inner")).removeClass("moreButtonSelected");
		menuAlink.parents('div.boxOperation').addClass('moreButtonSelected');
	}
}
var reSelected=function(){
	if(openoFrameWork){
		var menuID = openoFrameWork.getLocationHash();
		var menuAlink = $('#'+ menuID,$('#pageableDiv'));
		if(menuAlink.length>0){
			resetSelectedItem(menuAlink);
		}else{
			menuAlink = $('#'+ menuID,$('.hor-menu'));
			if(!!menuAlink.attr("defaultchildmenuid")&&menuAlink.attr("defaultchildmenuid").length>0){
				menuAlink = $('#'+ menuAlink.attr("defaultchildmenuid"),$('#pageableDiv'));
				if(menuAlink.length>0){
					resetSelectedItem(menuAlink);
				}
			}
		}
	}
}
var inter=null;
	
var clearMoreOperations=function(){
    $('#pageableDiv').removeClass("moreOpen");
	$('#pageableDiv').addClass("moreClose");
	$('.col-xs-12',$('#pageableDiv')).removeClass("moreOpen");
	$('.col-xs-12',$('#pageableDiv')).addClass("moreClose");	
    $(".carousel-inner").children().remove();
	if (inter) {
        clearInterval(inter);
    };
}

var moreOperations = function(html){
	$('#pageableDiv').removeClass("moreClose");
	$('#pageableDiv').addClass("moreOpen");
	$('.col-xs-12',$('#pageableDiv')).removeClass("moreClose");
	$('.col-xs-12',$('#pageableDiv')).addClass("moreOpen");	
	showArrow();
	$(".carousel-inner").children().remove();
    inter=setInterval(reSelected, 200);
	var moreViewData=[];	
	var div = document.createElement('div');
	//div.innerHTML = html;
	$(div).append(html);
	var liTages =$("ul:first",div).children(); //div.getElementsByTagName('li')
	for(var i=0;i<liTages.length;i++){
		if(!$(liTages[i]).hasClass("divider")){
			var aLink = {};
			if($(liTages[i]).hasClass("dropdown")){//???????????
			    var _litages=$(liTages[i]);
				aLink.html='<div class="box boxOperation">'+_litages.prop("outerHTML")+"</div>";
			}else{
			var aLinkTag = $("a", liTages[i]);
			aLink.id = aLinkTag.attr("id");
			var aLinkContent = aLinkTag.html();
			aLinkTag.empty().html('<div class="box boxOperation"></div>');
			$(".box", aLinkTag).html(aLinkContent);
			aLink.html = aLinkTag.prop("outerHTML");
			}
			moreViewData.push(aLink);
		}
	}

	var transformQueryViewData = function(queryViewData, pageSize){
		var newData = [];
		var pageNo = Math.floor(queryViewData.length / pageSize) + 1;
		if(queryViewData.length % pageSize == 0){
			pageNo--;
		}
		for(var i=0;i<pageNo;i++){
			newData.push({array:[]});
		}
		for(var j=0;j<queryViewData.length;j++){
			newData[Math.floor(j/pageSize)].array.push(queryViewData[j]);  
		}	
		return newData;
	}
	
	var moreOperationItems = [];
	
	var generateOperationItems = function(){	
		for(var i=0;i<moreOperationItems.length;i++){
			var itemHtml = '<div id="page_' + i + '" class="item moreButtonsTag">' + 
								  '<div class="col-xs-12" style="padding-right: 20px;">' + 
								  "</div>" + 
							   "</div>";	  
			$(".carousel-inner").append(itemHtml);
		}
		for(var i=0;i<moreOperationItems.length;i++){
			for(var j=0;j<moreOperationItems[i].array.length;j++){
				var buttonHtml = '<div class="moreButton boxPadding">' + moreOperationItems[i].array[j].html + '</div>';
				$(".col-xs-12", $("#page_" + i + ".item")).append(buttonHtml);				
			}
		}		
	}

	//moreOperationItems = transformQueryViewData(moreViewData, 14);
	
	var moreOperationPageSize = 14;	
	var windowWidth = $(window).width();
	if(windowWidth >= 1367 && windowWidth < 1441){
		moreOperationPageSize = 12;
	}else if(windowWidth >= 1281 && windowWidth < 1367){
		moreOperationPageSize = 11;
	}else if(windowWidth >= 1025 && windowWidth < 1281){
		moreOperationPageSize = 10;
	}else if(windowWidth >= 920 && windowWidth < 1281){
		moreOperationPageSize = 9;
	}else if(windowWidth >= 820 && windowWidth < 920){
		moreOperationPageSize = 8;
	}else if(windowWidth >= 680 && windowWidth < 820){
		moreOperationPageSize = 7;
	}else if(windowWidth >= 540 && windowWidth < 680){
		moreOperationPageSize = 4;
	}else if(windowWidth >= 390 && windowWidth < 540){
		moreOperationPageSize = 3;
	}else if(windowWidth < 390){
		moreOperationPageSize = 2;
	}

	moreOperationItems = transformQueryViewData(moreViewData, moreOperationPageSize);
	generateOperationItems();
	
	$(".box.boxOperation").click(function(){
		$(".box.boxOperation", $(".carousel-inner")).removeClass("moreButtonSelected");
		$(this).addClass("moreButtonSelected");
	});

	$($(".item", $(".carousel-inner"))[0]).addClass("active");	
	
	if($(".item.moreButtonsTag").length < 2){
		hideArrow();
	} 
}

var showArrow = function(){
	$(".carousel-control").show();
	$(".boxOperation").removeClass("boxOperationOnePage");
}
	
var hideArrow = function(){
	$(".carousel-control").hide();
	$(".boxOperation").addClass("boxOperationOnePage");
}

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
var lang = getLanguage();
//lang = 'en-US';

//加载主页面head部分国际化
function loadProperties(lang){
    jQuery.i18n.properties({
        language:lang,
        name:'web-framework-integration-i18n',
        path:'i18n/', // 资源文件路径
        mode:'map', // 用 Map 的方式使用资源文件中的值
        callback: function() {// 加载成功后设置显示内容
			var i18nItems = $('[name_i18n=com_zte_ums_ict_framework_ui_i18n]');
			for(var i=0;i<i18nItems.length;i++){
			    var $item = $(i18nItems.eq(i));
			    var itemId = $item.attr('id');
				if(typeof($item.attr("title"))!="undefined"){
					$item.attr("title", $.i18n.prop(itemId));
				}else{
					$item.text($.i18n.prop(itemId));
				}
			}			
        }
    });
}

function loadi18n_WebFramework_1(){
    $.getScript("js/tools.js", function(){
        var lang = getLanguage();
        loadProperties(lang);
    });
}

function loadi18n_WebFramework(){
    loadProperties(lang);
}

/*
function loadPropertiesSideMenu(lang){
    jQuery.i18n.properties({
        language:lang,
        name:'web-framework-i18n',
        path:'i18n/', // 资源文件路径
        mode:'map', // 用 Map 的方式使用资源文件中的值
        callback: function() {// 加载成功后设置显示内容
			var i18nItems = $('[name=com_zte_ums_ict_framework_ui_i18n]');
			for(var i=0;i<i18nItems.length;i++){
			    var $item = $(i18nItems.eq(i));
			    var itemId = $item.attr('id');
				if(typeof($item.attr("placeholder"))=="undefined"){
					$item.text($.i18n.prop(itemId));
				}else{
					$item.attr("placeholder", $.i18n.prop(itemId));
				}
			}			
        }
    });
}*/

/**
* 国际化资源文件加载函数；
* 相应参数为当前语言（由框架从后端取得），国际化资源文件名前缀，资源文件所在路径。
*/
/**
* 国际化资源文件加载函数；
* 相应参数为当前语言（由框架从后端取得），国际化资源文件名前缀，资源文件所在路径。
*/
function loadPropertiesSideMenu(lang, propertiesFileNamePrefix, propertiesFilePath , name_I18n){
	console.info('loadPropertiesSideMenu has been called  ' + propertiesFilePath);
	if(!name_I18n) name_I18n='com_zte_ums_ict_framework_ui_i18n_sideMenu';
    jQuery.i18n.properties({
        language:lang,
        name:propertiesFileNamePrefix,
        path:propertiesFilePath, // 资源文件路径
        mode:'map', // 用 Map 的方式使用资源文件中的值
        callback: function() {// 加载成功后设置显示内容
			var i18nItems = $('[name_i18n='+ name_I18n + ']');
			for(var i=0;i<i18nItems.length;i++){
			    var $item = $(i18nItems.eq(i));
			    var itemId = $item.attr('id');
				if(typeof($item.attr("placeholder"))=="undefined"){
					$item.text($.i18n.prop(itemId));
				}else{
					$item.attr("placeholder", $.i18n.prop(itemId));
				}
			}			
        }
    });
}

function loadi18n_WebFramework_sideMenu(){
	//默认0场景菜单资源文件
    //loadPropertiesSideMenu(lang, 'web-framework-i18n', 'i18n/');
	//加载各应用菜单资源文件
	var srcpath ="i18n/";
	loadPropertiesSideMenu(lang , 'web-framework-integration-i18n', srcpath);}

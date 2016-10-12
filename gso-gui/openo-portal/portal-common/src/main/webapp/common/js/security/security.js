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
var ErrResult_LOGIN_SUCCESS = 0;
var ErrResult_LOGIN_FAILURE = 4;
var ErrResult_LOGIN_SUCCESS_WARN = 1;
var ErrResult_LOGIN_SUCCESS_PASSWORD_WARN = 2;
var ErrResult_LOGIN_SUCCESS_PASSWORD_MUSTCHANGE = 3;
var ErrResult_LOGIN_SERV_ERROR = -1;

function processLoginResult(data,params){
   if(data.home="web/res/web-framework/index.html"||data.home.indexOf("index.html")>0){
       data.home=FrameConst.DEFAULT_LOGINSKIP_PAGE;
	   //下面这部分是为了演示需要临时增加的自动切换
       /*if(params.username=="admin1"){
			data.home="/web/res/web-framework/default.html?menu=1";
	   }else if(params.username=="admin2"){
			data.home="/web/res/web-framework/default.html?menu=2";
	   }else if(params.username=="admin3"){
			data.home="/web/res/web-framework/default.html?menu=3";
	   }else if(params.username=="admin4"){
			data.home="/web/res/web-framework/default.html?menu=4";
	   }else if(params.username=="admin5"){
			data.home="/web/res/web-framework/default.html?menu=5";
	   }else if(params.username=="admin6"){
			data.home="/web/res/web-framework/default.html?menu=6";
	   }else if(params.username=="admin7"){
			data.home="/web/res/web-framework/default.html?menu=7";
	   }*/
    }
	var toHomePage = function(){
		location.href = data.home;
	}
	
	var loginHander = function(inParams){
		if(inParams != undefined){
			login(inParams);
		}
		else{
			login(params);
		}
	}
	
	var errors = data.detail;
	if(data.result == 0){
		store('username',params.username);
		if(errors){
			if(errors.code==ErrResult_LOGIN_SUCCESS_PASSWORD_WARN){
				
				com_zte_ums_aos_portal_PasswordDialog.create({
					ID : "LOGIN_MODIFY_PASSWORD",
					username : params.username,
					oldPassword : ict_framework_func2(params.password),
					descLabel : errors[ErrResult_LOGIN_SUCCESS_PASSWORD_WARN],
					cancelHander : toHomePage,
					confirmHander : toHomePage
				});
				LOGIN_MODIFY_PASSWORD.show();
			}
			else if(errors.code==ErrResult_LOGIN_SUCCESS_WARN){
				window.alert(errors[ErrResult_LOGIN_SUCCESS_WARN],toHomePage);
			}
			else {
				location.href = data.home;
			}
		}
		else {
			location.href = data.home;
		}
	}
	else {
		if(errors.code==ErrResult_LOGIN_SUCCESS_PASSWORD_MUSTCHANGE){
				com_zte_ums_aos_portal_PasswordDialog.create({
					ID : "LOGIN_MODIFY_PASSWORD",
					username : params.username,
					oldPassword : ict_framework_func2(params.password),
					descLabel : errors[ErrResult_LOGIN_SUCCESS_PASSWORD_MUSTCHANGE],
					confirmHander : loginHander
					
				});
				LOGIN_MODIFY_PASSWORD.show();
		}
		else if(errors.code==ErrResult_LOGIN_FAILURE){
		    $("#nameOrpwdError").addClass('alert-danger');
			$("#com_zte_ums_ict_portal_login_userPassword").html(errors[ErrResult_LOGIN_FAILURE]);			
			var tip = $("#nameOrpwdError");
			if (tip.attr("tipstatus") == "normal") {
				tip.show();
			} else if (tip.attr("tipstatus") == "close") {
				tip.attr("tipstatus", "normal");
			}
			// if(0 < $("#inputPassword").length){
				// $("#inputPassword")[0].value = "";
			// }
		}
		else if(errors.code==ErrResult_LOGIN_SERV_ERROR){
			$("#loginConnError").addClass('alert-danger');
			var tip = $("#loginConnError");
			if (tip.attr("tipstatus") == "normal") {
				tip.show();
			} else if (tip.attr("tipstatus") == "close") {
				tip.attr("tipstatus", "normal");
			}
		}
	}
}
function login(params){
	$.post("login",{
		username : params.username,
		password : params.password,
		isEncypted:true
	},function(data){
		processLoginResult(data,params);
	},"json");
}

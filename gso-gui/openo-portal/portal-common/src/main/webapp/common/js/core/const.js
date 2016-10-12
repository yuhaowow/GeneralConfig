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
var fMenuSiderDivId = 'page-f-sidebar-menu';
var ICTFRAME_CONST_SPINNER_GIF_PATH="../../openoui/common/image/loading-spinner-grey.gif";
var ICTFRAME_CONST_IFRAME_HEIGHT_AJUST = 10;
var ICTFRAME_CONST_IFRAME_HEIGHT_AJUST_IE = 5;
var ICTFRAME_CONST_THEME_COLOR_CSS_PREFFIX = "css/themes/";
var ICTFRAME_CONST_DEFAULTPAGE_PATH = "default.html?";
var ICTFRAME_CONST_DATABACKUP_PATH = 'menus/dataBackup-mysql.html';
var IS_V5_TESTVERSION = true;


var FrameConst={};
//默认登录成功跳转页面
FrameConst.DEFAULT_LOGINSKIP_PAGE = "main-page.html";

FrameConst.do_heartbeat = false;
FrameConst.change_pass = false;
//是否加密
FrameConst.isEncypt = "false"; 
//FrameConst.REST_FRAMECOMMIFO = "/web/rest/web-common/getMenuItemVisible";
FrameConst.REST_FRAMECOMMIFO = "../../api/uiframe/v1/frameCommInfo";
//FrameConst.REST_HEARTBEAT = "/web/rest/web-common/common?action=heartbeat";
FrameConst.REST_HEARTBEAT = "../../api/uiframe/v1/heartbeat";
//FrameConst.REST_GETLICENSEINFO = "/web/rest/web-license/getlicensevalueinfo";
FrameConst.REST_GETLICENSEINFO = "../../api/uiframe/v1/licensevalueinfo";
//FrameConst.REST_CHECKRIGHT = "/web/rest/web-common/checkRight";
FrameConst.REST_CHECKRIGHT = "../../api/uiframe/v1/checkRight";
//FrameConst.REST_LOGIN = "/web/res/web-common/login";
FrameConst.REST_LOGIN = "../../api/uiframe/v1/login";
//FrameConst.REST_LOGOUT = "/web/res/web-common/loginOut?SSOAction=SSOLogout";
FrameConst.REST_LOGOUT = "../../api/uiframe/v1/loginOut?SSOAction=SSOLogout";
//FrameConst.REST_GET_FRAME_MENUDIRECTION = "/web/rest/web-common/GetConfByKey?key=usf.mainframe.web.navigation.direction";
FrameConst.REST_GET_FRAME_MENUDIRECTION = "../../api/uiframe/v1/confByKey?key=usf.mainframe.web.navigation.direction";
//FrameConst.REST_GET_USERNAME = "/web/rest/web-common/common?action=getUserName";
FrameConst.REST_GET_USERNAME = "../../api/uiframe/v1/userName";


//FrameConst.REST_GET_VERSIONINFO = "/web/rest/web-common/getVersionInfo";
FrameConst.REST_GET_VERSIONINFO = "../../api/uiframe/v1/versionInfo";
var zte_http_headers=new Array();
zte_http_headers.push({"key":"ICTAuthentication","value":"icttka","store":true});
zte_http_headers.push({"key":"isFromWeb","value":"1","store":false});
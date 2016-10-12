/*
主框架
*/ 
/*string类型的去前后空格和format方法*/
String.prototype.trim = function() { 
	return this.replace(/(^\s*)|(\s*$)/g, "");  
};
String.prototype.format=function() {  
	if(arguments.length==0) return this;  
	for(var s=this, i=0; i<arguments.length; i++)  
		s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
	return s;  
}; 
String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
};
String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
};

/*全屏 参考:http://www.alixixi.com/web/a/2015031794521.shtml */
var s=!function(w,d){
	var fs={
			supportsFullScreen:false,
			isFullScreen:false,
			requestFullScreen:'',
			exitFullScreen:'',
			fullscreenchange:'',
			prefix:''
		},
	aP=['webkit','moz','ms'],    //opera 15 支持全屏是webkit内核
	len=aP.length,
	i=0;
	if(d.exitFullscreen){
		fs.supportsFullScreen=true
	}else{
		for(; i<len; i++){
			if(d[aP[i]+'ExitFullscreen']||d[aP[i]+'CancelFullScreen']){
				fs.supportsFullScreen=true;
				fs.prefix=aP[i];
				break
			}
		}
	}        
	if(fs.supportsFullScreen){
		var p=fs.prefix;
		fs.fullscreenchange=function(fn){
			d.addEventListener(p=='ms' ? 'MSFullscreenChange' : p+'fullscreenchange',function(){
				fn && fn()
			},false)
		};
		fs.fullscreenchange(function(){
			fs.isFullScreen=(function(p){
				switch (p) {
					case '':
						return d.fullscreen;
					case 'webkit':
						return d.webkitIsFullScreen;
					case 'moz':
						return d.mozFullScreen;
					case 'ms':
						return d.msFullscreenElement ? true : false
				}
			})(p)
		});
		fs.requestFullScreen=function(elem){
			var elem=elem||d.documentElement;
			try{
				p ? elem[p+'RequestFullScreen']() : elem.requestFullScreen()    //chrome，ff，标准
			}catch(e){
				elem[p+'RequestFullscreen']()    //elem.msRequestFullscreen
			}
		};
		fs.exitFullScreen=function(){
			try{
				p ? d[p+'ExitFullscreen']() : d.exitFullscreen()    //ie，新版chrome或标准
			}catch(e){
				d[p+'CancelFullScreen']()    //老版chrome 火狐
			}
		}
	}
	w.screenfull=fs
}(window,document);
/*
 * Purl (A JavaScript URL parser) v2.3.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */
;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.purl = factory();
    }
})(function() {
    var tag2attr = {
            a       : 'href',
            img     : 'src',
            form    : 'action',
            base    : 'href',
            script  : 'src',
            iframe  : 'src',
            link    : 'href',
            embed   : 'src',
            object  : 'data'
        },

        key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query
		aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability
		parser = {
            strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
            loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
        },
		isint = /^[0-9]+$/;

    function parseUri( url, strictMode ) {
        var str = decodeURI( url ),
        res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
        uri = { attr : {}, param : {}, seg : {} },
        i   = 14;
        while ( i-- ) {
            uri.attr[ key[i] ] = res[i] || '';
        }
		// build query and fragment parameters
        uri.param['query'] = parseString(uri.attr['query']);
        uri.param['fragment'] = parseString(uri.attr['fragment']);
		// split path and fragement into segments
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
		// compile a 'base' domain attribute
        uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';

        return uri;
    }

    function getAttrName( elm ) {
        var tn = elm.tagName;
        if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
        return tn;
    }

    function promote(parent, key) {
        if (parent[key].length === 0) return parent[key] = {};
        var t = {};
        for (var i in parent[key]) t[i] = parent[key][i];
        parent[key] = t;
        return t;
    }

    function parse(parts, parent, key, val) {
        var part = parts.shift();
        if (!part) {
            if (isArray(parent[key])) {
                parent[key].push(val);
            } else if ('object' == typeof parent[key]) {
                parent[key] = val;
            } else if ('undefined' == typeof parent[key]) {
                parent[key] = val;
            } else {
                parent[key] = [parent[key], val];
            }
        } else {
            var obj = parent[key] = parent[key] || [];
            if (']' == part) {
                if (isArray(obj)) {
                    if ('' !== val) obj.push(val);
                } else if ('object' == typeof obj) {
                    obj[keys(obj).length] = val;
                } else {
                    obj = parent[key] = [parent[key], val];
                }
            } else if (~part.indexOf(']')) {
                part = part.substr(0, part.length - 1);
                if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
                parse(parts, obj, part, val);
                // key
            } else {
                if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
                parse(parts, obj, part, val);
            }
        }
    }

    function merge(parent, key, val) {
        if (~key.indexOf(']')) {
            var parts = key.split('[');
            parse(parts, parent, 'base', val);
        } else {
            if (!isint.test(key) && isArray(parent.base)) {
                var t = {};
                for (var k in parent.base) t[k] = parent.base[k];
                parent.base = t;
            }
            if (key !== '') {
                set(parent.base, key, val);
            }
        }
        return parent;
    }

    function parseString(str) {
        return reduce(String(str).split(/&|;/), function(ret, pair) {
            try {
                pair = decodeURIComponent(pair.replace(/\+/g, ' '));
            } catch(e) {
                // ignore
            }
            var eql = pair.indexOf('='),
                brace = lastBraceInKey(pair),
                key = pair.substr(0, brace || eql),
                val = pair.substr(brace || eql, pair.length);

            val = val.substr(val.indexOf('=') + 1, val.length);

            if (key === '') {
                key = pair;
                val = '';
            }

            return merge(ret, key, val);
        }, { base: {} }).base;
    }

    function set(obj, key, val) {
        var v = obj[key];
        if (typeof v === 'undefined') {
            obj[key] = val;
        } else if (isArray(v)) {
            v.push(val);
        } else {
            obj[key] = [v, val];
        }
    }

    function lastBraceInKey(str) {
        var len = str.length,
            brace,
            c;
        for (var i = 0; i < len; ++i) {
            c = str[i];
            if (']' == c) brace = false;
            if ('[' == c) brace = true;
            if ('=' == c && !brace) return i;
        }
    }

    function reduce(obj, accumulator){
        var i = 0,
            l = obj.length >> 0,
            curr = arguments[2];
        while (i < l) {
            if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
            ++i;
        }
        return curr;
    }

    function isArray(vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    }

    function keys(obj) {
        var key_array = [];
        for ( var prop in obj ) {
            if ( obj.hasOwnProperty(prop) ) key_array.push(prop);
        }
        return key_array;
    }

    function purl( url, strictMode ) {
        if ( arguments.length === 1 && url === true ) {
            strictMode = true;
            url = undefined;
        }
        strictMode = strictMode || false;
        url = url || window.location.toString();

        return {
            data : parseUri(url, strictMode),
            // get various attributes from the URI
            attr : function( attr ) {
                attr = aliases[attr] || attr;
                return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
            },
            // return query string parameters
            param : function( param ) {
                return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
            },

            // return fragment parameters
            fparam : function( param ) {
                return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
            },
            // return path segments
            segment : function( seg ) {
                if ( typeof seg === 'undefined' ) {
                    return this.data.seg.path;
                } else {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.path[seg];
                }
            },
            // return fragment segments
            fsegment : function( seg ) {
                if ( typeof seg === 'undefined' ) {
                    return this.data.seg.fragment;
                } else {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.fragment[seg];
                }
            }
        };
    }    
    purl.jQuery = function($){
        if ($ != null) {
            $.fn.url = function( strictMode ) {
                var url = '';
                if ( this.length ) {
                    url = $(this).attr( getAttrName(this[0]) ) || '';
                }
                return purl( url, strictMode );
            };
            $.url = purl;
        }
    };
    purl.jQuery(window.jQuery);
    return purl;
});
//把框架所有的ajax请求集中到一起，发一条请求，获取所有的配置信息。	
openoFrameWork_conf = {
	userName:store.get('username'),
	changePassItem:FrameConst.change_pass?FrameConst.change_pass:true,
	helpMenuItem:false,
	aboutMenuItem:false,
	flightMenuItem:false,
	fullscreenMenuItem:false,
	logoutMenuItem:true,
	defaultThemeColor:"ztebluelight2",
	dbType:"other",
	acceptLanguage:"en-US"
};
$("#currentUser").html(openoFrameWork_conf.userName);

$.ajax({ 			
	url : FrameConst.REST_FRAMECOMMIFO,  
	type : "GET",
	cache:false,			
	contentType : 'application/json; charset=utf-8',
	success: function(data){
		var tempConf = data;
		if(	tempConf.helpMenuItem && tempConf.helpMenuItem != "" ){
			openoFrameWork_conf.helpMenuItem = tempConf.helpMenuItem;
		}
		if(	tempConf.aboutMenuItem && tempConf.aboutMenuItem != "" ){
			openoFrameWork_conf.aboutMenuItem = tempConf.aboutMenuItem;
		}		
		if(	tempConf.flightMenuItem && tempConf.flightMenuItem != "" ){
			openoFrameWork_conf.flightMenuItem = tempConf.flightMenuItem;
		}
		if(	tempConf.fullscreenMenuItem && tempConf.fullscreenMenuItem != "" ){
			openoFrameWork_conf.fullscreenMenuItem = tempConf.fullscreenMenuItem;
		}
		if(	tempConf.logoutMenuItem && tempConf.logoutMenuItem != "" ){
			openoFrameWork_conf.logoutMenuItem = tempConf.logoutMenuItem;
		}
		if(	tempConf.defaultThemeColor && tempConf.defaultThemeColor != "" ){
			openoFrameWork_conf.defaultThemeColor = tempConf.defaultThemeColor;
		}
		if(	tempConf.dbType && tempConf.dbType != "" ){
			openoFrameWork_conf.dbType = tempConf.dbType;
		}	 
		if(	tempConf.acceptLanguage && tempConf.acceptLanguage != "" ){
			openoFrameWork_conf.acceptLanguage = tempConf.acceptLanguage;
		}
		if(	tempConf.changePassItem && tempConf.changePassItem != "" ){
			openoFrameWork_conf.changePassItem = tempConf.changePassItem;
		}
		
		setFrameWorkByConf();
		//userName = data;
		//console.info('login user is :' + data);
	},
	error:function(data){
		setFrameWorkByConf();
	}
}); 

function setThemeColor( configColor ){
	var panel = $('.zte-theme-panel');
    $('.theme-colors > ul > li', panel).each(function () {
        var color = $(this).attr("data-style");
        if (color == configColor) {
            // 匹配上了才重设默认主题
            $(this).addClass("current");
            $('#style_color').attr("href", "css/themes/" + color + ".css");
            //if (store) {
                store('style_color', color);
            //}
       }
    });
}; 

function setFrameWorkByConf(){
		//设置用户相关的框架下拉菜单是否可用
		    var helpMenuItem = openoFrameWork_conf.helpMenuItem;
			var aboutMenuItem = openoFrameWork_conf.aboutMenuItem;
            var flightMenuItem = openoFrameWork_conf.flightMenuItem;
			var fullscreenMenuItem = openoFrameWork_conf.fullscreenMenuItem;
			var logoutMenuItem = openoFrameWork_conf.logoutMenuItem;
			var changePassMenuItem = openoFrameWork_conf.changePassMenuItem;
            if (!helpMenuItem || helpMenuItem === "false") {
                $('#uep_ict_help_url').parent('li').remove();
            }
			if(!aboutMenuItem|| aboutMenuItem === "false"){
				$('[data-target="#aboutDlg"]').parent('li').remove();
			}
			if(!helpMenuItem && !aboutMenuItem){
				$('#uep_ict_help_div').remove();
			}
            if (!flightMenuItem|| flightMenuItem === "false") {
                $('#header_notification_bar').html("<div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>");
            }
			if (!fullscreenMenuItem|| fullscreenMenuItem === "false") {
				//$('#trigger_fullscreen').parent().css("display", "none");
				$('#trigger_fullscreen_div').html("");
			}
			if (!logoutMenuItem || logoutMenuItem === "false") {
				//$('#trigger_logout').parent().css("display", "none");
				$('#trigger_logout_div').html("");
			}
			if ((!fullscreenMenuItem && !logoutMenuItem) || (fullscreenMenuItem === "false" && logoutMenuItem === "false")) {				
				$('#full_logout_divider').css("display", "none");
			}
			if (!changePassMenuItem ) {				
				$('#changePwd_labellink').css('display','none');
				$('#full_logout_divider').css('display','none');
			}		
			
		//设置二次开发者选择的框架皮肤
		var defaultColor = openoFrameWork_conf.defaultThemeColor;
		var panel = $('.zte-theme-panel');
		$('ul > li', panel).removeClass("current"); 
        if (store && !store('style_color')) { // cookie没有才设置默认主题
            setThemeColor(defaultColor);
        }else{
			setThemeColor(store('style_color'));
		}
};

/*新增的hashtabel实现类，用户后续iframe的缓存，前进后退时打开过的页面的菜单id的缓存等*/
function Hashtable()  
{ 
  this._hash = {}; 
  this._count = 0; 
  this.add = function(key, value)  
  { 
    if (this._hash.hasOwnProperty(key)) 
      return false; 
    else { 
        this._hash[key] = value; this._count++; return true;
    } 
  } ;
  this.hash = function() { return this._hash; };
  this.remove = function(key) { delete this._hash[key]; this._count--; } ;
  this.count = function() { return this._count; };
  this.items = function(key) { if (this.contains(key)) return this._hash[key]; }; 
  this.contains = function(key) { return this._hash.hasOwnProperty(key); }; 
  this.clear = function() { this._hash = {}; this._count = 0; }; 
  this.replace = function(key, value)  
  { //有则删除后增加///相当于更新
	if(this.contains(key)){ 
	   this.remove(key);
    }
	return this.add(key, value);
  } ;
};

var fMenuSiderDivId = 'page-f-sidebar-menu';
var fMenuMegaDivId = 'f_hormenu';
var megaSiderDivId = 'page-megachild-sidebar-menu';
var megaDivId = 'main_hormenu';
var openoFrameWork_menu_horizontal = "horizontal";
var openoFrameWork_menu_vertical = "vertical";
var openoFrameWork_menu_fmenu = "fmenu";
var openoFrameWork_showNav = "true";
var openoFrameWork_smallView = 960;//原来为992，但是在投影仪上不准（投影仪设置为1024，但是实际尺寸比1024小），边栏菜单也会被移除，这个设置一个稍小的值。

/*下面是主框架的核心*/
var openoFrameWork = function () {
	var defaultLanage=getLanguage();
    var isRTL = false;//文档顺序
	var isTouch=function(){
		try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
	};
	var isDesktop = !isTouch;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;	
	var gdocTitle="";
    var _sidebarWidth = 225;
    var _sidebarCollapsedWidth = 35;
    var responsiveHandlers = [];    
    var cachedIframes=new Hashtable(); 
	var cachedIframesObject=new Hashtable();
	var breadcrumbBtnMenus=new Hashtable(); 
	var _menuCategorys=new Hashtable();
    var _iframe="page-mainIframe"; //全局变量保存的是当前正在打开使用的iframe
	var _sceneURLRootPath="";
	var _hashSource="";//信号量
	var _isClicked=false;//信号量
	//var _breadcrumbSource=false;
	
    // 皮肤颜色
    var layoutColorCodes = {
        'blue': '#4b8df8',
        'red': '#e02222',
        'green': '#35aa47',
        'purple': '#852b99',
        'grey': '#555555',
        'light-grey': '#fafafa',
        'yellow': '#ffb848',
		'ztebluelight': '#3366cc'
    };
    // 获取真实的设备窗口大小，参考了  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
    var _getViewPort = function () {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        }
    }
    // 初始化
    var dealInit = function () {
		var sence = '0';
		var menuSence = getUrlParam("menu");
		var confSence = 0;
		if (menuSence) {
		    sence = menuSence;
		} else {
		    sence = confSence;
		}
		switch (sence) {
		case "1":
		    gdocTitle = $('#com_zte_ums_ict_framework_ui_page_title_1').text().trim();
		    break;
		case "2":
		    gdocTitle = $('#com_zte_ums_ict_framework_ui_page_title_2').text().trim();
		    break;
		case "3":
		    gdocTitle = $('#com_zte_ums_ict_framework_ui_page_title_3').text().trim();
		    break;
		case "0":
		default:
		    gdocTitle = $('#com_zte_ums_ict_framework_ui_page_title').text().trim();
		    break;
		}		
        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }
        isIE8 = !! navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !! navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !! navigator.userAgent.match(/MSIE 10.0/);
        if (isIE10) {
            $('html').addClass('ie10'); // IE10 
        }        
        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); //  IE10 
        }        
        var deviceAgent = navigator.userAgent.toLowerCase();        
        if (deviceAgent.match(/(iphone|ipod|ipad)/)) {
            $(document).on('focus', 'input, textarea', function () {
                $('.page-header').hide();
                if($('.page-footer')&&$('.page-footer').length>0)
                  $('.page-footer').hide();
            });
            $(document).on('blur', 'input, textarea', function () {
                $('.page-header').show();
                if($('.page-footer')&&$('.page-footer').length>0)
                  $('.page-footer').show();
            });
        } else  {
             $(document).on('focus', 'input, textarea', function () {
                if($('.page-footer')&&$('.page-footer').length>0)
                  $('.page-footer').hide();
            });
            $(document).on('blur', 'input, textarea', function () {
                if($('.page-footer')&&$('.page-footer').length>0)
                  $('.page-footer').show();
            });
        }
    }
    //处理滚动到
    var dealScrollTo=function (el, offeset) {
	
    }     
    var dealstartPageLoading=function(message) {
            $('.page-loading').remove();
            $('body').append('<div class="page-loading"><img src="'+ ICTFRAME_CONST_SPINNER_GIF_PATH +'"/>&nbsp;&nbsp;<span>' + (message ? message : $.i18n.prop('com_zte_ums_ict_framework_ui_loading')) + '</span></div>');
	}
    var dealstopPageLoading=function() {
            $('.page-loading').remove();
    }        
    var dealSidebarState = function () {
        // 窗体宽度小尺寸（平板和iphone模式下）时移出左边栏
        var viewport = _getViewPort();
        if (viewport.width < openoFrameWork_smallView) {
            $('body').removeClass("page-sidebar-closed");
        }else{
			if (getCookie('sidebar_closed') === '1') {
				$('body').addClass('page-sidebar-closed');
			}
		}
    }
    //  openoFrameWork.addResponsiveHandler()回调函数.
    var runResponsiveHandlers = function () {
        //重新初始化其他订阅的元素elements
        for (var i = 0; i < responsiveHandlers.length; i++) {
            var each = responsiveHandlers[i];
            each.call();
        }
    }
    // 窗体重新调整大小时初始化调整边栏状态高度
    var dealResponsive = function () {
        dealSidebarState();
        ajustHorMenuDropDirection();
        dealSidebarAndContentHeight();
        dealFixedSidebar();
        runResponsiveHandlers();
    }
    // 页面重载入时初始化调整内部布局
    var dealResponsiveOnInit = function () {
        dealSidebarState();
        dealSidebarAndContentHeight();
        setTimeout(function () {
            ajustHorMenuDropDirection(true);
        }, 100);
    }
    // 窗体重新调整大小时初始化调整布局
    var dealResponsiveOnResize = function () {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function () {
                if (currheight == document.documentElement.clientHeight) {
                    return; 
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    dealResponsive();
                }, 50);            
                currheight = document.documentElement.clientHeight; 
            });
        } else {
            $(window).resize(function () {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    dealResponsive();
                }, 50); 
            });
        }
    }	
	var changeSiderBar = function(hideAllMenu){
		var siderbarpos = $(".nav-pos-direction", $(".zte-theme-panel")).val();
		var sidermenu  = $("#page-sidebar-menu");
		var hormenu = $("#main_hormenu");
        var fhorMenu = $("#" + fMenuMegaDivId);
        var fsiderMenu = $("#" + fMenuSiderDivId);
		if(hideAllMenu){
			sidermenu.css('display','block');// 侧边栏显示
			hormenu.css("display", "none");//隐藏水平菜单栏
            fhorMenu.css('display','none');
            fsiderMenu.css('display','none');
			return;
		}		
		if (openoFrameWork_menu_horizontal == siderbarpos) {
				sidermenu.css('display','none');// 侧边栏隐藏
                fhorMenu.css('display','none');// 侧边栏隐藏
                fsiderMenu.css('display','none');// 侧边栏隐藏
                hormenu.css("display", "block");//显示水平菜单栏
		} else if (openoFrameWork_menu_vertical == siderbarpos) {
				sidermenu.css('display','block');// 侧边栏显示
				hormenu.css("display", "none");//隐藏水平菜单栏
                fhorMenu.css('display','none');// 侧边栏隐藏
                fsiderMenu.css('display','none');// 侧边栏隐藏
		} else if (openoFrameWork_menu_fmenu == siderbarpos) {
			sidermenu.css('display','none');
			hormenu.css("display", "none");
			fhorMenu.css('display','block');
			fsiderMenu.css('display','block');
			//除了toggle按钮之外，是否还有其他儿子是要显示的，如果没有，那么竖菜单不显示；反之，显示。
			var lis = fsiderMenu.children(".sidebar-toggler-wrapper").siblings();
			if(lis.length > 0 && lis.css('display') != "none"){
				fsiderMenu.css('display','block');
				//
				$("body").removeClass("page-full-width");
				if ($('body').hasClass("page-sidebar-closed")) {
					$(".page-content").css("marginLeft", _sidebarCollapsedWidth);
				} else {
					$(".page-content").css("marginLeft", _sidebarWidth);
				}
			}
        }			
	}
    //根据当前菜单在屏幕的位置，和一级菜单下二级菜单的排列，来决定菜单是向左展开还是向右展开
    var ajustHorMenuDropDirection = function( isInit ){
        //获取屏幕宽度
        var bodyWidth = document.body.clientWidth;
        //循环，获取每个一级菜单在屏幕中的位置
        var levelOneAdropdowns = $('a.dropdown-toggle', '#main_hormenu' );
        //每一个文字span的图标、他父亲的margin\padding等占用的位置
        var marginCount = 5 * 2 + 17.5 + 2 * 2 + 30 + 15 * 2 + 3;
        for( var i = 0 ; i < levelOneAdropdowns.length ; i++ ){
            var a = $(levelOneAdropdowns[i]);
            var leftOffset = a.offset().left;
            //获取二级菜单的数量
            var ul = a.parent().children('.dropdown-menu');
            var groupDivs = $('.zteDivWidth' , ul);
            var widthOfDropDownMenu = 0;
            for(var j = 0 ; j < groupDivs.length && groupDivs.length >0 ; j++ ){//循环获取每个分组的宽度
                var eachDiv = groupDivs[j];
                var maxLengthText = "";
                var maxLength = 0;
                var spans = $('span' , eachDiv).each(function(){
                    var innerText = this.innerText;
                    if( innerText.length > maxLength ){
                        maxLength= innerText.length;
                        maxLengthText = innerText;
                    }
                });
                widthOfDropDownMenu = widthOfDropDownMenu + getStringWidth(maxLengthText , 14) + marginCount;
            }
            //预估每个组占宽度150PX，多预计一点
            if( widthOfDropDownMenu + leftOffset > bodyWidth ){
                console.log("ajust class dropdown-menu-right ,id = "+ a.attr("id") );
                ul.addClass('dropdown-menu-right');
                //var right = bodyWidth - (leftOffset + a.width() + 15);
                //ul.attr('style' ,'right:' + right );
            }else{
                ul.removeClass('dropdown-menu-right');
                //ul.removeAttr('style');
            }
        }
    }
    // 屏幕大小发生变化或者移动设备旋转屏幕时处理响应式布局.
    var dealSidebarAndContentHeight = function (isToggler) {
        var content = $('.page-content');		
        var contentbody = $('.page-content-body');
		var sidebar = $('.page-sidebar');
        var body = $('body');
        var height;
        var viewport = _getViewPort();
		var scrAvaHeight=Math.min(window.screen.availHeight,viewport.height)-5;
        var footer=$('.footer');                  
        var pgbread=$('.page-breadcrumb');
		var pageableDiv=$('#pageableDiv');
		console.log("pageableDiv height:"+pageableDiv.outerHeight(true));
		var pheader=$('.header');
		var childPagetype=!!cachedIframesObject.items(_iframe)?cachedIframesObject.items(_iframe).childpageType:"";
		if(childPagetype==="isc")//smartclient的子页面固定高度为视口可用内容区高度
		{
			$('.sidebar-option', panel).val("fixed");
		}	
		dealShownav();
		var available_height =scrAvaHeight - ((!footer||footer.length<=0)?0:footer.outerHeight(true)) - pheader.outerHeight(true);
		var _pageableDivHeight=(!pageableDiv||pageableDiv.length<=0||pageableDiv.is(":visible")==false)?0:pageableDiv.outerHeight(true);
		var h= scrAvaHeight-pheader.outerHeight(true)-((!footer||footer.length<=0||footer.is(":visible")==false)?0:footer.outerHeight(true))-pgbread.outerHeight(true)-_pageableDivHeight-(contentbody.outerHeight(true)-contentbody.height());
        var miframe=_iframe==""?"page-mainIframe": _iframe;
        var pagemyIframe=$('.page-content .page-content-body .'+miframe); //.page-mainIframe
        if(pagemyIframe&&pagemyIframe.length>0){    
            //处理iframe,下面计算中间iframe的高度
				var deviceAgent = navigator.userAgent.toLowerCase();        
				  if (deviceAgent.match(/(iphone|ipod|ipad)/)) { //||viewport.height<=480
				       var w=viewport.width-content.offset().left-(pagemyIframe.offset().left-content.offset().left)*2;//宽度=总宽度-左边栏宽度-内容区内边距。左右两个
					   pagemyIframe.width(w); 
			      }
			      //对桌面必须计算高度
				  var tmp_style = sidebar.attr('style');// firefox下执行 sidebar.height()会改变style样式，这里缓存下执行前的style样式，执行完后重新赋给页面元素
				  console.log("pym:parent iframe "+miframe+" sidebar.height:"+sidebar.height()+" h:"+h);
				  h=sidebar.height()>h?sidebar.height():h;
				  //IE下，把iframe的高度再减掉7，因为IE10及以下版本，计算的高度会比IE实际显示区域大，导致出现IE滚动条。
				  /*h=h-ICTFRAME_CONST_IFRAME_HEIGHT_AJUST;
				  if(isIE){
					h=h-ICTFRAME_CONST_IFRAME_HEIGHT_AJUST_IE;
				  }*/
				sidebar.attr('style',tmp_style);
				if (isDesktop) {
				    //pagemyIframe.attr("height",h); 
					if(cachedIframesObject.items(miframe).setMinHeight){
						var minHeight=Math.min(scrAvaHeight,h);
						console.log("pym:parent iframe "+miframe+" window.screen.availHeight:"+scrAvaHeight+" viewport.height:"+viewport.height+" h:"+h+" minHeight:"+minHeight);
						cachedIframesObject.items(miframe).setMinHeight(minHeight);
					}
			      }else{ 
						//pagemyIframe.attr("height","100%");//去掉这里错误的设置,ipad上测试高度不正确
						var _h=h;
						try{
							_h=pagemyIframe.contents().height();
						}catch(e){}
						h=_h>h?_h:h;
						if(cachedIframesObject.items(miframe).setMinHeight){
							var minHeight=Math.min(scrAvaHeight,h);
							console.log("pym:parent iframe "+miframe+" window.screen.availHeight:"+scrAvaHeight+" viewport.height:"+viewport.height+" h:"+h+" minHeight:"+minHeight);
							cachedIframesObject.items(miframe).setMinHeight(minHeight);
						}
			      }				  
        }
          
        if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === true) {              
            if (content.height() < available_height) {
                //content.attr('style', 'min-height:' + available_height + 'px !important');
				dealAddStyle(content,'min-height',available_height + 'px',true);
            }
        } else{
          if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
              if (content.height() < available_height) {
                  //content.attr('style', 'min-height:' + available_height + 'px !important');
				  dealAddStyle(content,'min-height',available_height + 'px',true);
              }
          } else {
              if (body.hasClass('page-sidebar-fixed')) {
                  height = _calculateFixedSidebarViewportHeight();
              } else {
                  // firefox下执行 sidebar.height()会改变style样式，这里缓存下执行前的style样式，执行完后重新赋给页面元素
                  var tmp_style = sidebar.attr('style');
                 // height = sidebar.height() + 20;
                  sidebar.attr('style',tmp_style);
                  var headerHeight = pheader.outerHeight(true);
                  var footerHeight = (!footer||footer.length<=0)?0:footer.outerHeight(true);                
                  if ($(window).width() > 1024 && (height + headerHeight + footerHeight)  < scrAvaHeight) {
                      height = scrAvaHeight - headerHeight - footerHeight;
                  }
              }            
              if (height <= content.height()) {//这里为了避免内容区域很小的时候出现内容区域无法充满屏幕,把min-height修改为height
                  //content.attr('style', 'min-height:' + height + 'px !important');
				  dealAddStyle(content,'min-height',height + 'px',true);
              }
          }
        }
		// 屏幕小尺寸时会隐藏边栏，这时菜单由小屏幕右上图标控制，当屏幕变化到大尺寸屏幕时，
		// 需要按原菜单出现方式恢复菜单显示。
		var screenwidth = $(window).width();
		if(screenwidth >= openoFrameWork_smallView){
			changeSiderBar();
			if($(".page-sidebar-menu li").css('display') != "none"){
				if ($('body').hasClass("page-sidebar-closed") && $(".sidebar-toggler").hasClass("close-by-viewportChange")) {	
					if( !isToggler ){
						$(".sidebar-toggler")[1].click();
					}
					$(".sidebar-toggler").removeClass("close-by-viewportChange");
				}
			}
		}
		else {
			changeSiderBar(true);
		}
    }
    var showIframe=function(iframe){
        var resize,pagemainIframe;             
        if (cachedIframes.count()>0) {
            for (var i in cachedIframes.hash()) {
                cachedIframes.replace(i,0);
                var pagemyIframe=$('.page-content .page-content-body .'+i);			      
			    if(pagemyIframe&&pagemyIframe.length>0){
					if(iframe==i){
						pagemyIframe.show();
						cachedIframes.replace(i,1); 								        								        
					} else{
						if("page-mainIframe"===i){//2015年12月10日 wimax要求页面切换后删除没有配置cacheNum的缓存页面
							pagemainIframe=i;
							pagemyIframe.attr("src","");
							pagemyIframe.remove();
						}else{
							pagemyIframe.hide();						
						}
						cachedIframes.replace(i,0);
					}
			    }
            }
        }
		if(pagemainIframe){
			delete cachedIframes._hash[pagemainIframe];
			delete cachedIframesObject._hash[pagemainIframe];
		}
		if (!cachedIframes.contains(iframe)) {
			cachedIframes.add(iframe,1);
            //增加的iframe加载完毕后 停止加载中提示信息
			myIframe=$('.'+iframe);
			myIframe.show();
    		myIframe.load(function(){
    		    /*if (!isDesktop) {
                    if (resize) {
                        clearInterval(resize);
                    }
                    resize = setInterval(dealIframeHeight, 400,$(this)); 
                }*/
    			openoFrameWork.stopPageLoading();
    		});     		             
        }                                  
    }
	var hidemenu=function(){
		$('.hor-menu').hide();
		dealAddStyle($('.page-content'),'margin-left','0px',true);
		dealAddStyle($('.page-sidebar'),'display','none',true);
        var fsiderMenu = $("#" + fMenuSiderDivId);
        fsiderMenu.children().css('display' , 'none');
	}
	var hideAlarmLight=function(){
		//$('#header_notification_bar').hide();
		//$('#header_notification_bar').empty();
		$('#header_notification_bar').html("<div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>");
	}
	var dealShownav=function(){
        var showNav=openoFrameWork.getLocationURLParameter('showNav');
		if( showNav=="false"){
            openoFrameWork_showNav = showNav;
			hidemenu();
			hideAlarmLight();
		}
	}
	/*  点击菜单时，处理对应该菜单项的横，左菜单项	*/
	var dealRelateMenu = function(source) {
		// 点击子菜单时，对应的横竖菜单项也联动为选择样式，(高亮,箭头变化)
		var panel = $('.zte-theme-panel');
		var navPosOption = $('.nav-pos-direction', panel).val();
		var targetsource = null;
		var targetContainer = null;
		if (navPosOption === "vertical") {
			// 当前是左菜单，则处理对应的横菜单
			targetsource = $("#"+source.attr("id"), $("#main_hormenu"));
			targetContainer = $(".header ul");				
		} else if (navPosOption === "horizontal") {
            var rtn = dealMgaBarRelated(source);
			dealFMenuRelated(source , megaSiderDivId);
            targetContainer = rtn[0];
            targetsource = rtn[1];
		}else if(navPosOption === openoFrameWork_menu_fmenu){
            dealFMenuRelated(source , fMenuSiderDivId);
        }
		if (targetContainer) {
			// 移除原有菜单项的活动及箭头样式
			targetContainer.children('li.active').removeClass('active');
			targetContainer.find('.arrow.open').removeClass('open');
		}
		if (targetsource) {
			// 增加活动及箭头样式
			targetsource.parents('li').each(function () {
				$(this).addClass('iframe active');
				$(this).find('a > span.arrow').addClass('open');
			});
			targetsource.parents('li').addClass('active');
			if (navPosOption === "horizontal") {
				if (targetsource.parent().parent().parent().is("li")) {
					$('.arrow', targetsource.parent().parent().parent()).addClass("open");
				}
			}
		}
	}
    var dealMgaBarRelated = function(source){
        // 当前是横菜单，则处理对应的左菜单
        targetsource = $("#"+source.attr("id"), $("[class='page-sidebar-menu']"));
        targetContainer = $("#page-sidebar-menu ul");
        // 将先前左菜单展开的子菜单收缩
        $("li.open",targetContainer).each(function() {
            var style = $("ul.sub-menu", this).attr("style");
            if (style) {
                $("ul.sub-menu", this).removeAttr("style");
                $(this).removeClass('open');
            }
        });
        // 当前是横菜单，但在屏幕缩小的情况下显示的是tip垂直菜单，而横菜单是隐藏的，所以需额外处理横菜单
        if (source.parent().parent().parent().parent().attr("class").indexOf("page-sidebar-menu") >= 0) {
            var tiptargetsource = $("#"+source.attr("id"), $("#main_hormenu"));
            var tiptargetContainer = $(".header ul");
            tiptargetContainer.children('li.active').removeClass('active');
            tiptargetContainer.find('.arrow.open').removeClass('open');
            tiptargetsource.parents('li').each(function () {
                $(this).addClass('iframe active');
                $(this).find('a > span.arrow').addClass('open');
            });
            tiptargetsource.parents('li').addClass('active');
        }
        return [targetContainer ,targetsource ];
    }
    var dealFMenuRelated = function(source , siderDivId ){
        var fsiderMenu = $("#" + siderDivId);
		if(isMoreMenuItemClick){//更多菜单点击 , 临时方案，增加信号量，使用之后就置为false
			isMoreMenuItemClick = false 
		}else if($(source).parents('li').hasClass('mega-menu-dropdown')){//F的横向菜单的点击
            var id = source.attr('id');            
            //非被点击的一级菜单的二级菜单都不显示
            $('#' + siderDivId + '>li').hide();
            var level2Lis =  $("a[hparentid= " + id + "]" , fsiderMenu).parent();
            level2Lis.show();
            if(level2Lis.length > 0){//把竖向菜单的收起放大按钮显示出来
                $('#' + siderDivId + '>li.sidebar-toggler-wrapper').show();
            }
            if($("a[hparentid= " + id + "]" , fsiderMenu).length > 0){ //有子孙菜单时，把F菜单的竖菜单显示出来
                dealFSidermenu(source ,siderDivId );
            }else{//否则隐藏竖菜单
                fsiderMenu.css('display','none');
                $("body").addClass("page-full-width");
                $(".page-content").css("marginLeft", _sidebarWidth);
            }

        }else{//F菜单的竖向菜单点击
            //处理一种特殊情况，告警灯打开新页面，所有的菜单都不出现，因此，虽然这个source在竖菜单，但竖菜单这个时候实际上是没有显示的
            if( openoFrameWork_showNav == "true") {
                $('#' + siderDivId + '>li').hide();     
				var lis = $(source).parents('li');	
				var id = lis.eq(lis.length-1).children( 'a' ).attr('hparentid');				
                //var id = $(source).parents('li').children('a').attr('hparentId');
                var level2Lis =  $("a[hparentid=" + id + "]" , fsiderMenu).parent();
                level2Lis.show();
                if(level2Lis.length > 0) {//把竖向菜单的收起放大按钮显示出来
                    $('#'+ siderDivId + '>li.sidebar-toggler-wrapper').show();
                }
                //$('#' + siderDivId + '>li')[0].show();
                dealFSidermenu(source , siderDivId);
            }
        }
    }
    var dealFSidermenu = function(source , siderDivId){
        var fsiderMenu = $("#" + siderDivId);
        fsiderMenu.css('display','block');
		$('ul.sub-menu',fsiderMenu).css('display','block');
		$('.arrow',fsiderMenu).addClass('open');
        $("body").removeClass("page-full-width");
        if ($('body').hasClass("page-sidebar-closed")) {
            $(".page-content").css("marginLeft", _sidebarCollapsedWidth);
        } else {
            $(".page-content").css("marginLeft", _sidebarWidth);
        }
        var href = source.attr("href");
        $('li.iframe' ,fsiderMenu ).removeClass('active');
        var selectedIframeLi = $("a[href ='" + href + "']"  ,fsiderMenu ).parent();
        selectedIframeLi.addClass('active');
        selectedIframeLi.parent().parent().addClass("open").addClass("active");
        selectedIframeLi.parent().css('display','block');
        selectedIframeLi.parent().parent().children('a').children('.arrow').addClass('open');
    }
	var dealMenuItemClick=function(source,e,menuContainerStr){
            var url = source.attr("href");
            if(!url||url.length<2)
              return;            
            e.preventDefault(); 			
			if(!_isClicked){//导航情况下,首先要模拟点开菜单分组
				_isClicked=true;//如果菜单有子菜单点击一次来展开子菜单，注意这个信号量的变化，避免死循环
				var mainMenu=source.parents('li').last();
				if(!mainMenu.hasClass('open')){
					dealLiAClick(mainMenu.children('a:eq(0)'));
				}
			}			
			if(menuContainerStr&&menuContainerStr.length>0){
				var menuContainer = $('.'+menuContainerStr+' ul');
				
				menuContainer.children('li.active').removeClass('active');
				// menuContainer.children('arrow.open').removeClass('open');
				//menuContainer.find('.arrow.open').addClass('open');
			}
			source.parents('li').each(function () {
                $(this).addClass('iframe active');
                $(this).children('a > span.arrow').addClass('open');
            });
            source.parents('li').addClass('active');			
			// 处理点击菜单对应的横或左菜单项的选择样式
			dealRelateMenu(source);			
            if(menuContainerStr&&menuContainerStr.length>0){
				if ($(window).width() <= 991 && $('.'+menuContainerStr).hasClass("in")) {
					$('.navbar-toggle').click();
				} 
			}			
            if(dealMultTabPage(source)) 
                return true;              
            dealScrollTo();
            var breadmenuID=e.data&&e.data.breadcrumbBtnMenuItem&&e.data.breadcrumbBtnMenuItem.length>0?e.data.breadcrumbBtnMenuItem:"";
			if(breadmenuID.length>0){//面包削导航来的，只需要重新生成面包削即可				
				//找到更多菜单按钮
				var moreMenuItem = $('#' + breadmenuID , $('#pageableDiv'));
				if( moreMenuItem.length == 0 ){
					moreMenuItem = $('#' + breadmenuID , $('.more-botton-zone'));
				}
				dealBreadcrumbBtnMenuItemClick(moreMenuItem,e); 
				//dealBreadcrumb(source,false,e); 
			}else{//非面包削导航来的，
				dealstartPageLoading(); 			
				if(dealIframe(source,e))//当返回true时说明是正常加载iframe了，否则面包削不能切换
					dealBreadcrumb(source,false,e);
			}
			//dealShownav();
    };	
	var dealMenuItemGetFocus=function(source,e,menuContainerStr){
            var url = source.attr("href");
            if(!url||url.length<2)
              return;            
            e.preventDefault();			
			if(!_isClicked){//导航情况下,首先要模拟点开菜单分组
				_isClicked=true;//如果菜单有子菜单点击一次来展开子菜单，注意这个信号量的变化，避免死循环
				var mainMenu=source.parents('li').last();
				dealLiAClick(mainMenu.children('a:eq(0)'));
			}			
			if(menuContainerStr&&menuContainerStr.length>0){
				var menuContainer = $('.'+menuContainerStr+' ul');
				
				menuContainer.children('li.active').removeClass('active');
				menuContainer.children('arrow.open').removeClass('open');
			}
			source.parents('li').each(function () {
                $(this).addClass('iframe active');
                $(this).children('a > span.arrow').addClass('open');
            });
            source.parents('li').addClass('active');
			
            if(menuContainerStr&&menuContainerStr.length>0){
				if ($(window).width() <= 991 && $('.'+menuContainerStr).hasClass("in")) {
					$('.navbar-toggle').click();
				} 
			}
    };	
     //处理iframe的核心处理类，逻辑较为复杂，注意各种参数的处理
    var dealIframe=function(aObject,e){
			_hashSource="";
            var url = aObject.attr("href");
            if(!url||url.length<2)
              return;
			url=openoFrameWork.handlBaseURL(url);
		    //-----------2015年9月21日新增V5中大O需要的按照实例（根据选择的系统实例变化url的ip和端口地址）进行动态切换菜单的功能
		    var category= aObject.attr("category");//处理菜单中定义的Category属性
			if(category&&category.length>0){//处理Category属性
				var newIpPort=_menuCategorys.items(category);
				if(newIpPort&&newIpPort.ipPort&&newIpPort.ipPort.trim()!=""){//如果找到了
					var newIpPortstr=openoFrameWork.getDomainURL(newIpPort.ipPort);//去掉ip和port后多余的部分
					var urlipport=openoFrameWork.getDomainURL(url);
					console.log("old url:"+url);
					url=newIpPortstr+url.replace(urlipport,"");
					console.log("newIpPort:"+newIpPortstr+"      newURL:"+url);					
				}				
			}
			//------------
            dealstartPageLoading();
            var cacheNum= aObject.attr("cacheNum");//当第三方应用需要框架缓存曾经打开过的页面时使用。
            var shiftJS= aObject.attr("shiftJS");//当第三方应用不需要后面的href页面进行重新加载仅仅执行某个脚本打开某个功能时使用
			var _iframeName= aObject.attr("iframeName");//对有些第三方应用设置了顶层frame名字的，这个必须设置
			var _iframeAutoScroll= aObject.attr("iframeAutoScroll");//设置iframe的滚动条是否出现,可以设置为auto,yes或者no,默认为no 不出现.
			_iframeAutoScroll=!!_iframeAutoScroll?(_iframeAutoScroll==='yes'?'yes':_iframeAutoScroll==='auto'?'auto':'no'):'no';
			_xdomain= aObject.attr("xdomain");//对有些第三方应用如果跨域了,需要设置这个信任域属性,以便于来跨域通讯.这里取值是一个正则表达式
			_xdomain=_xdomain&&_xdomain.length>0?_xdomain:"*";
			var _cssfile= aObject.attr("cssSrc");//设置iframe中页面需要动态加载的css文件.
			_cssfile=(_cssfile&&_cssfile.length>0)?_cssfile:"";
			var _runShiftJS="";
			var pageContentBody=$('.page-content .page-content-body');
			var tabHtml="";			
			var tabContentHtml="";
			var tabID="";
			var tabContentID="";
            var iframename='';
			function createIframe(pdiv,url,id,name,clsname,xdom,autoScroll){
				var pymParent = new pym.Parent(pdiv, url, {xdomain:xdom});
				pymParent.iframe.id=id;
				pymParent.iframe.name=name;
				//pymParent.iframe.setAttribute('display', "none");
				//pymParent.iframe.style.height="100%";
				//pymParent.iframe.setAttribute('height', "100%");
				pymParent.iframe.setAttribute('class', clsname);
				pymParent.iframe.setAttribute('allowfullscreen','');
				pymParent.iframe.setAttribute('mozallowfullscreen','');
				pymParent.iframe.setAttribute('oallowfullscreen','');
				pymParent.iframe.setAttribute('msallowfullscreen','');
				pymParent.iframe.setAttribute('webkitallowfullscreen',''); 
				//pymParent.iframe.setAttribute('scrolling',autoScroll);
				pymParent.iframe.setAttribute('onload', 'openoFrameWork.SyncCSS(this,0,"'+_cssfile+'");openoFrameWork.stopPageLoading();');
				cachedIframesObject.replace(id,pymParent);//缓存iframe对象实体
				pymParent.onMessage('height', function(he){
					  console.log("The frame "+id+" receive message height is "+he);
					  var pagemyIframe=$('.page-content .page-content-body .'+id);
					  var h=Math.max(this.minHeight,he);
					  pagemyIframe.height(h);
				});
				return pymParent;
			};		
			
            if(cacheNum){//处理缓存iframe和iframename标签
                cacheNum="page-mainIframe"+cacheNum; 
				iframename="fraMain"+cacheNum;                
            }else{
                cacheNum="page-mainIframe";
				iframename="fraMain";        
            }
			iframename=!!_iframeName?_iframeName:iframename;
            _iframe= cacheNum;//注意这里_iframe是一个全局变量
                
            var miframe=_iframe==""?"page-mainIframe": _iframe;
            var pagemyIframe=$('.page-content .page-content-body .'+miframe);
			var nagivJS=e&&e.data&&e.data.action?e.data.action:"";
			nagivJS=(!!nagivJS&&nagivJS.length>0)?(nagivJS.trim().toLowerCase()=="null"?nagivJS:"javascript:$('.page-content .page-content-body ."+miframe+"')[0].contentWindow."+nagivJS.trim()+";"):"";      
			nagivJS=nagivJS.trim();
			
			_runShiftJS=(!!shiftJS&&shiftJS.length>0)?(shiftJS.trim().toLowerCase()=="null"?shiftJS:"javascript:$('.page-content .page-content-body ."+miframe+"')[0].contentWindow."+shiftJS+";"):"";      
			if(pagemyIframe&&pagemyIframe.length>0){//如果iframe已经添加了，则直接更改url或者执行切换或导航函数
			    var src=pagemyIframe.attr("src"); 					
			    if((!!shiftJS||nagivJS.length>0)&&(src==url||src.split('?')[0]==url.split('?')[0])&& cacheNum!="page-mainIframe") {    //url相同时,处理缓存shiftJS标签
					//这里shiftJS必须定义iframe中的页面定义到window上的函数；
					//pagemyIframe.attr("scrolling",_iframeAutoScroll);
					cachedIframesObject.items(miframe).settings.xdomain=_xdomain;	
					if(nagivJS.length>0&&nagivJS.toLowerCase()!="null")
						_runShiftJS=nagivJS;//如果是nagivJS导航过来的，nagivJS优先级高于shiftJS，如果有nagivJS就用nagivJS替换_runShiftJS； 直接执行一次导航切换
					try{	
						if(_runShiftJS.trim().toLowerCase()!="null")
							eval(_runShiftJS);
					}catch(e){
						if  (e  instanceof  EvalError)   {
							console.log(e.name  +   " EvalError:  "   +  e.message);
						}   else   if  (e  instanceof  SyntaxError)   {
							console.log(e.name  +   " SyntaxError:  "   +  e.message);
						}else   if  (e  instanceof  Error)   {
						    if(e.name.toLowerCase().trim()=="typeerror")
							{
							   //console.log($.i18n.prop('com_zte_ums_ict_framework_ui_clickTooFast'));
								var parm={runShiftJS:_runShiftJS};
								pagemyIframe.one('load',parm,function(e){ 
									var runShiftJS=e&&e.data&&e.data.runShiftJS?e.data.runShiftJS:"";
									if(runShiftJS.length>0&&runShiftJS.toLowerCase()!="null")
										eval(runShiftJS);//点击太快了，页面没有加载完毕，那就加载完毕了再次执行
								})
							}							
						} 
						return false;//返回false 后续不再做其他动作了
					}
					finally{
						openoFrameWork.stopPageLoading();
					}
				}else{//否则url不同,或者url相同但没有shiftjs
					if(nagivJS.length>0&&nagivJS.toLowerCase()!="null"){//如果是代码导航过来的去掉url参数中的默认action动作
						url=url.split('?')[0];//去掉？参数，防止默认执行动作，只响应nagivJS指定的动作；
					}
					if(src.split('#')[0]!=url.split('#')[0])//如果相等说明是通过锚点导航的，真实url没有变化，对SPA应用比较普遍
					{
						pagemyIframe.attr("src","");//url和src不同说明更换了页面，需要清空重新加载
					}else //if (src.trim()==url.trim()) //没有shiftjs并且url相同，说明不需要再次加载了,已经加载过了
					{
						openoFrameWork.stopPageLoading();
					}	
					pagemyIframe.attr("src",url);
					
					if(nagivJS.length>0&&nagivJS.toLowerCase()!="null"){//如果是nagivJS导航过来的，iframe加载完毕后执行一次导航切换脚本
						var parm={nagivJS:nagivJS};
						pagemyIframe.one('load',parm,function(e){ 
							var nagivJS=e&&e.data&&e.data.nagivJS?e.data.nagivJS:"";
							if(nagivJS.length>0&&nagivJS.toLowerCase()!="null")
								eval(nagivJS);//如果没有加载过，加载后也要执行跳转的函数
						});						
					}
					if(_cssfile.length>0&&_cssfile.toLowerCase()!="null"){//如果配置了cssSrc，每次切换都重新执行一边这个css文件，防止有遗漏
						parm={syncCSSJS:'openoFrameWork.SyncCSS(this,10,"'+_cssfile+'");openoFrameWork.stopPageLoading();'};
						pagemyIframe.one('load',parm,function(e){ 
							var syncCSSJS=e&&e.data&&e.data.syncCSSJS?e.data.syncCSSJS:"";
							if(syncCSSJS.length>0&&syncCSSJS.toLowerCase()!="null")
								eval(syncCSSJS);
						});
					}					
				}
				
			}else{//否则添加新的iframe元素     overflow:visible;
				if(nagivJS.length>0&&nagivJS.toLowerCase()!="null"){//如果是代码导航过来的去掉url参数中的默认action动作
						url=url.split('?')[0];//去掉？参数，防止默认执行动作，只响应nagivJS指定的动作；
				}
				var pdiv="pdiv_"+miframe;
				if($("#"+pdiv).length<=0){//检查下，如果该div没有添加过就添加
					pageContentBody.append("<div id='"+pdiv+"'></div>");
				}	
				dealstartPageLoading(); 				
				pymParent=createIframe(pdiv, url,miframe,miframe,miframe,_xdomain,_iframeAutoScroll);				
				pagemyIframe=$(pymParent.iframe);
				
				if(nagivJS.length>0&&nagivJS.toLowerCase()!="null"){//如果是nagivJS导航过来的，iframe加载完毕后执行一次导航切换
					var parm={nagivJS:nagivJS};
					pagemyIframe=$('.page-content .page-content-body .'+miframe);
					if(pagemyIframe&&pagemyIframe.length>0){	
						pagemyIframe.one('load',parm,function(e){ 
							var nagivJS=e&&e.data&&e.data.nagivJS?e.data.nagivJS:"";
							if(nagivJS.length>0&&nagivJS.toLowerCase()!="null")
								eval(nagivJS);//如果没有加载过，加载后也要执行跳转的函数
						})
					}
				}			
				
			}  					
            showIframe(miframe);                  
            openoFrameWork.fixContentHeight(); // 调整高度  
			return true;
   }
    // 处理边栏菜单
	var dealLiAClick=function(source){
		if (source.next().hasClass('sub-menu') == false) {
			if ($('.btn-navbar').hasClass('collapsed') == false) {
				$('.btn-navbar').click();
			}
			return;
		}

		if (source.next().hasClass('sub-menu always-open')) {
			return;
		}
		var parent = source.parent().parent();
		var the = source;
		var menu = $('.page-sidebar-menu');
		var sub = source.next();
		var autoScroll = menu.data("auto-scroll") ? menu.data("auto-scroll") : true;
		var slideSpeed = menu.data("slide-speed") ? parseInt(menu.data("slide-speed")) : 200;
		parent.children('li.open').children('a').children('.arrow').removeClass('open');
		parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(200);
		parent.children('li.open').removeClass('open');		
		var slideOffeset = -200;
		if (sub.is(":visible")) {
			$('.arrow', source).removeClass("open");
			source.parent().removeClass("open");
			sub.slideUp(slideSpeed, function () {
				if (autoScroll == true && $('body').hasClass('page-sidebar-closed') == false) {
					if ($('body').hasClass('page-sidebar-fixed')) {
						
					} else {
						dealScrollTo(the, slideOffeset);
					}
				}
				dealSidebarAndContentHeight();
			});
		} else {
			$('.arrow', source).addClass("open");
			source.parent().addClass("open");
			sub.slideDown(slideSpeed, function () {
				if (autoScroll == true && $('body').hasClass('page-sidebar-closed') == false) {
					if ($('body').hasClass('page-sidebar-fixed')) {
						dealScrollTo(the, slideOffeset);
					}
				}
				dealSidebarAndContentHeight();
			});
		}	
	}	
    var dealSidebarMenu = function () {//这里注册和处理边栏菜单的各类点击事件
        $('.page-sidebar').on('click', 'li > a', function (e) {
            if ($(this).next().hasClass('sub-menu') == false) {
                if ($('.btn-navbar').hasClass('collapsed') == false) {
                    $('.btn-navbar').click();
                }
                return;
            }
            if ($(this).next().hasClass('sub-menu always-open')) {
                return;
            }
            dealLiAClick($(this));
            e.preventDefault();
        });

        // 处理左边导航中的菜单连接，显示在iframe中
        $('.page-sidebar').on('click', ' li > a.iframe', function (e) {
			//dealMenuItemClick($(this),e,"page-sidebar")
			e.preventDefault();
			var menuItemID=$(this).attr("id");
			if(!!menuItemID&&menuItemID.length>0){
				_setLocationHash(menuItemID);
				_hashSource="dhByInterface";				
			}//else{
			_isClicked=true;
			dealMenuItemClick($(this),e,"page-sidebar");
			//}	
		}); 
        // 处理更多菜单的菜单连接，显示在iframe中dropdown-menu
        $('.page-breadcrumb').on('click', ' li > a.iframe', function (e) {
			var url = $(this).attr("href");
			if(url.length<2)
			  return;
			e.preventDefault();
			dealBreadcrumbBtnMenuItemClick($(this),e);   			
		}); 
        // 处理可翻页更多菜单中的菜单连接，显示在iframe中dropdown-menu
        $('#pageableDiv').on('click', ' div > a.iframe', function (e) {
			var url = $(this).attr("href");
			if(url.length<2)
			  return;
			e.preventDefault();
			dealBreadcrumbBtnMenuItemClick($(this),e);   			
		}); 
		// 处理可翻页更多菜单中的菜单连接，显示在iframe中dropdown-menu
        $('#pageableDiv').on('click', ' li > a.iframe', function (e) {
			var url = $(this).attr("href");
			if(url.length<2)
			  return;
			e.preventDefault();
			if(e.target){
				var tg=$("span",e.target);
				tg=tg.length>0?tg[0]:e.target;
				$(".open a>div>span",e.target.parentNode.parentNode.parentNode.parentNode.parentNode).replaceWith(tg.outerHTML);
			}
			dealBreadcrumbBtnMenuItemClick($(this),e);   			
		}); 	
			
         // 处理header下拉菜单中的菜单连接，显示在iframe中
         $('.dropdown').on('click', ' li > a.iframe', function (e) {
			var url = $(this).attr("href");
			if(url.length<2)
			  return;
			e.preventDefault();
			dealScrollTo();
			dealstartPageLoading();
			
			dealIframe($(this),e)
			dealBreadcrumb($(this),false,e);    			
		});
    }      
	var getSceneURL=function(url){
		if(url&&url.trim().length>0){
			url=url.trim();
			//url=
			_sceneURLRootPath=_sceneURLRootPath+url;
		}
	}	
	var gurl="";//临时全局变量，存储当前加载的more菜单，如果加载过了，就不再加载了。下面的方法中会用到	
	var moreMenusisLoaded=true;
	var waittime=null;
    var getBreadcrumbRightButtons=function(url,e){					
			if (url.length<2){
				return;
			}
			url=openoFrameWork.handlBaseURL(url);
			if (gurl==url){				
				if(e===true){
					$('#pageableDiv').show();
				}else if(e&&e.target&&e.currentTarget){
					var defaultDisplay=$(e.target).attr("defaultDisplay");
					defaultDisplay=(!defaultDisplay)?$(e.currentTarget).attr("defaultDisplay"):defaultDisplay;
					if(defaultDisplay&&defaultDisplay.trim()=="false"){
						$('#pageableDiv').hide();
					}else{
						$('#pageableDiv').show();
					}
				}
				return;
				
			}else{
				gurl=url;
				clearMoreOperations();
			}
			//处理e参数，注意e可能为null
			var breadmenuID=e&&e.data&&e.data.breadcrumbBtnMenuItem&&e.data.breadcrumbBtnMenuItem.length>0?e.data.breadcrumbBtnMenuItem:"";
			breadmenuID=breadmenuID.length<=0?(e&&e.breadcrumbBtnMenuItem&&e.breadcrumbBtnMenuItem.length>0?e.breadcrumbBtnMenuItem:""):breadmenuID;
            moreMenusisLoaded=false;
            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                dataType: "html", 
                success: function (res) {
					try{
						//$('.page-breadcrumb').append(res);					
						var resScriptsSriped = stripHtmlScripts(res);
						//$('.page-breadcrumb').append(resScriptsSriped);
						$('.more-botton-zone').children().remove();
						//V5新增逻辑，如果displayType = pageableDiv,那么就用滑动的DIV来显示更多菜单里面的内容，如果没有配置，或为其他值，就按原有方式显示
						var tempDiv = $('<div style="display:none"></div>');
						tempDiv.children().remove();
						tempDiv.append(resScriptsSriped);
						
						//获取UL属性
						var displayType = $('.dropdown-menu',tempDiv).attr('displayType');
						if( displayType && displayType != 'pageableDiv'){
							$('.more-botton-zone').append(resScriptsSriped);
							$('#pageableDiv').hide();						
						}else{
							var tempUl = $('.dropdown-menu',tempDiv);
							if(tempUl.length>0){
								moreOperations(tempUl[0]);							
								if(e&&e.target&&e.currentTarget){
									var defaultDisplay=$(e.target).attr("defaultDisplay");
									defaultDisplay=(!defaultDisplay)?$(e.currentTarget).attr("defaultDisplay"):defaultDisplay;
									if(defaultDisplay&&defaultDisplay.trim()=="false"){
										$('#pageableDiv').hide();
									}else{
										$('#pageableDiv').show();							
									}
								}
							}
						}					
						runHtmlScripts(res);						
					}catch(ex){
					}finally{
						moreMenusisLoaded=true;                    
					}
					groupButtonAuthentication();
					if(breadmenuID.length>0){//面包削导航来的，只需要重新生成面包削即可
						var menuitem=undefined;
						var panel = $('.zte-theme-panel');
						var navPosOption = $('.nav-pos-direction', panel).val();
						//var items=$("a[id='"+breadmenuID+"']");
						var items = undefined;
						if (navPosOption === "vertical"){ //从垂直菜单里面找
							items=$("#page-sidebar-menu a[id='"+breadmenuID+"']");
							
						}else{//从水平菜单里面找
							items=$(".hor-menu a[id='"+breadmenuID+"']");
						}
						if (!items || items.length < 1) {
							items=$(".page-content a[id='"+breadmenuID+"']");
						}						
						if(items.length>0){
							for(var i=0;i<items.length;i++){
                                if($(items[i]).parentsUntil('.more-botton-zone .btn-group').hasClass('dropdown-menu')){
									menuitem=$(items[i]);
									break;
								}
								if($(items[i]).parentsUntil('#pageableDiv').hasClass('row1')){
									menuitem=$(items[i]);
									break;
								}								
							}
						}
						if(!!menuitem&&menuitem.length>0)
							dealBreadcrumbBtnMenuItemClick(menuitem,e); 	
					}                    
                },
				error: function (xhr, ajaxOptions, thrownError) {//加载操作菜单失败!com_zte_ums_ict_framework_ui_loadmenuerror
                    $('.page-breadcrumb').append('<h4>'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');
					moreMenusisLoaded=true;
            }
        });
    }        
    
	//处理多tab也场景   ----redirect 该标签暂时保留,不建议使用了
    dealMultTabPage=function(clickedObject){
            var url = clickedObject.attr("href");
            if(!url||url.length<2)
              return;
           var redirect=clickedObject.attr("redirect"); //处理多tab页面的需求
           if (!!redirect&&redirect.length>0){
                 var miframe=_iframe==""?"page-mainIframe": _iframe;
                 var pagemyIframe=$('.page-content .page-content-body .'+miframe); //.page-mainIframe
                 //var pagemyIframe=$('.page-content .page-content-body .page-mainIframe');
                 var oldhref="";
			           if(pagemyIframe&&pagemyIframe.length>0){
                    oldhref=pagemyIframe.attr("src");
                    if(url.split("?")[0]==oldhref.split("?")[0])
                    {
                      eval(redirect);                      
                      dealBreadcrumb(clickedObject,false,e);
                      return true; 
                    }                    
                }
            };
            return false;   
    };	
    //处理主菜单面包削导航
    var globleCurrentBreadcrumb="";
	var globleCurrentMainMenuItemID="";
	var dhByBreadcrumb = false;
    var dealBreadcrumb=function(clickedObject,notGenUID,e){//notGenUID为true就不重新生成id
		var mbreadcrumb=$('.breadcrumbUl');
		openoFrameWork.setPageTitle(clickedObject.find('span').text().trim());              
		var clieckedObj= clickedObject.parent('li');
		if(clieckedObj.length == 0){ //分页式更多菜单，a链接的父亲是div
			clieckedObj= clickedObject.parent('div');
		}
		  //如果点击的是F菜单的竖菜单，还需要找到横菜单上的对应父亲加入到clieckedObj
		var navPosOption = $('.nav-pos-direction', panel).val();			 
		var parentid = clickedObject.attr('hparentid');						  			 
		var breadcrumGroupButtonSrc=clickedObject.attr("breadcrumGroupButtonSrc"); 
		globleCurrentMainMenuItemID=clickedObject.attr("id"); 
		var mhmtl="";
		var url="";
		var tempObj=null;
		//var breadChangeType = e? (e.data ? e.data.breadChangeType:null):null;
		if( dhByBreadcrumb ){
			mhmtl = dealClickBreadcrumb(clieckedObj);
			dhByBreadcrumb = "";
		}else{
			while  (clieckedObj&&clieckedObj.length>0){
			   if(clieckedObj.children('a')){
					if(!notGenUID){
						url=openoFrameWork.getUniqueID("aid");//+Math.floor(Math.random() * (new Date()).getTime());
						clieckedObj.children('a').attr("name",url);
					}else{
						url=clieckedObj.children('a').attr("name");
					}
					tempObj=clieckedObj.clone();
					tempObj.children('a').removeClass('iframe');
					tempObj.children('a').removeClass('active');
					tempObj.children('a').attr("href","javascript:openoFrameWork.goToURL('"+url+"');");
					var arrowdown = $(".fa-angle-down", tempObj.children('a'));
					if (arrowdown) {
						arrowdown.remove();
					}
					if(tempObj.children('a').length>0){
						  mhmtl=tempObj.children('a')[0].outerHTML+"<i class='fa fa-angle-right'></i>"+mhmtl;
					}                            
					//如果是F菜单和横菜单的子竖菜单点击，需要做特殊处理
					if( clieckedObj.parent('ul').attr('id') == fMenuSiderDivId || clieckedObj.parent('ul').attr('id') == megaSiderDivId){																		
						var id = clieckedObj.children( 'a' ).attr('hparentid');									
						//判断是F菜单还是横菜单
						var megaMenu = null;
						if(navPosOption ==  openoFrameWork_menu_horizontal){
							magaMenu = $('#'+megaDivId);
						}else if(navPosOption ==  openoFrameWork_menu_fmenu){
							magaMenu = $('#'+fMenuMegaDivId);
						}
						clieckedObj =  $("a[id=" + id + "]" , magaMenu).parent('li');								
					}else{
						clieckedObj=clieckedObj.parents('li');
					}	
			   }
			}			  
			if(clieckedObj[0]&&clieckedObj[0].length>0) {
				mhmtl=clieckedObj.children('a')[0].outerHTML+"<i class='fa fa-angle-right'></i>"+mhmtl;
			}
		}		
		mbreadcrumb.empty();
		$('.more-botton-zone').empty();
		globleCurrentBreadcrumb=mhmtl;
		store("globleCurrentBreadcrumb",globleCurrentBreadcrumb);
		mbreadcrumb.append(mhmtl);			  
		if(breadcrumGroupButtonSrc&&breadcrumGroupButtonSrc.length>0){				  
			getBreadcrumbRightButtons(breadcrumGroupButtonSrc,e);
		}else{
			$('#pageableDiv').hide();
		}                            
              
    };	
	//面包屑发起的点击，就不重新生成面包屑，只是把该面包屑的后续节点移出。
	var dealClickBreadcrumb = function(clieckedObj){
		var index = globleCurrentBreadcrumb.indexOf(clieckedObj.children('a').attr("name"));
		if( index > -1 ){//截取
			var indexofSign = globleCurrentBreadcrumb.indexOf("<i class='fa fa-angle-right'>",index);
			var newBreadcrumb = globleCurrentBreadcrumb.substring(0,indexofSign) + "<i class='fa fa-angle-right'></i>";
			return newBreadcrumb;
		}	
	}		
    //处理面包削中菜单点击后的导航(更多菜单的面包屑)
    var dealBreadcrumbBtnGroupMenus=function(clickedObject,notGenUID , e ){
        var mbreadcrumb=$('.breadcrumbUl');
		var clieckedObj= clickedObject.parent();			  
        var breadcrumGroupButtonSrc=clickedObject.attr("breadcrumGroupButtonSrc");
        var mhmtl="";
        var url="";
        var tempObj=null;
		var menuid=clickedObject.attr("id");
		if (!breadcrumbBtnMenus.contains(menuid)) {//把当前面包削中的菜单id和该子菜单对应的父菜单关联缓存起来
			breadcrumbBtnMenus.add(menuid,globleCurrentMainMenuItemID);
		}			 
		while  (clieckedObj&&clieckedObj.length>0){ 
			tempObj=clieckedObj.clone();
			if(tempObj.children('a')){
				tempObj.children('a').removeClass('iframe');
				url=tempObj.children('a').attr("href");
				tempObj.children('a').attr("onclick","openoFrameWork.openbreadcrumbLink($(this),event);");
				var tempdiv = tempObj.children('a').children('div');
				if( tempdiv.length > 0 ){
					var innerofDiv = tempdiv[0].innerHTML;
					tempdiv.remove();
					tempObj.children('a')[0].innerHTML = innerofDiv;
				} 
				if(tempObj.children('a').length>0){                   
					  mhmtl=tempObj.children('a')[0].outerHTML+"<i class='fa fa-angle-right'></i>"+mhmtl;
				}
				clieckedObj=clieckedObj.parents('li');
			}
			   
		}
		if(clieckedObj[0]&&clieckedObj[0].length>0) {
			mhmtl=clieckedObj.children('a')[0].outerHTML+"<i class='fa fa-angle-right'></i>"+mhmtl;
		}
		  
		if(breadcrumGroupButtonSrc&&breadcrumGroupButtonSrc.length>0){
			getBreadcrumbRightButtons(breadcrumGroupButtonSrc,true);
		}else{
			$('#pageableDiv').hide();
		}
		mbreadcrumb.empty();
		var category= clickedObject.attr("category");//处理菜单中定义的Category属性
		if(category&&category.length>0){//处理Category属性
			var newIpPort=_menuCategorys.items(category);
			if(newIpPort&&newIpPort.ipTitle&&newIpPort.ipTitle.trim()!=""){//如果找到了
				mhmtl=newIpPort.ipTitle+'<i class="fa fa-angle-right"></i>'+mhmtl;
			}				
		}
		mhmtl=globleCurrentBreadcrumb+mhmtl;
		mbreadcrumb.append(mhmtl);		
	};
	var isMoreMenuItemClick = false;
	var dealBreadcrumbBtnMenuItemClick=function(clickObj,e){		
		dealScrollTo();
		var menuItemID=clickObj.attr("id");
		if(!!menuItemID&&menuItemID.length>0){
			_setLocationHash(menuItemID);
			var breadmenuID=e&&e.data&&e.data.breadcrumbBtnMenuItem&&e.data.breadcrumbBtnMenuItem.length>0?e.data.breadcrumbBtnMenuItem:"";
			_hashSource=breadmenuID&&breadmenuID.length>0?"":"dhByInterface";//hash进来的，不是导航进来的。
		}
		if(!(e&&e.breadcrumbBtnMenuItem&&e.breadcrumbBtnMenuItem.length>0)){//如果仅仅是tab跳转设置bread进来的，就框架不处理菜单点击，直接重新建立bread即可
			dealstartPageLoading();                
			dealIframe(clickObj,e);
		}
		dealBreadcrumbBtnGroupMenus(clickObj,false,e); 	
	}
    // 固定边栏布局时计算边栏高度.
    var _calculateFixedSidebarViewportHeight = function () {
        var viewport = _getViewPort();
        var sidebarHeight =viewport.height - $('.header').height() + 1;
        if ($('body').hasClass("page-footer-fixed")) {
            sidebarHeight = sidebarHeight - (!$('.footer')||$('.footer').length<=0)?0:$('.footer').outerHeight();
        }
        return sidebarHeight;
    }
    // 处理固定边栏
    var dealFixedSidebar = function () {
        var menu = $('.page-sidebar-menu');
        if (menu.parent('.slimScrollDiv').size() === 1) { 
            menu.removeAttr('style');
            $('.page-sidebar').removeAttr('style');
        }

       if ($('.page-sidebar-fixed').size() === 0) {
            dealSidebarAndContentHeight();
            return;
        }

        var viewport = _getViewPort();
        if (viewport.width >= openoFrameWork_smallView) {
            var sidebarHeight = _calculateFixedSidebarViewportHeight();
            dealSidebarAndContentHeight();
        }
    }
    // 固定边栏时处理菜单 hover 效果.
    var dealFixedSidebarHoverable = function () {
        if ($('body').hasClass('page-sidebar-fixed') === false) {
            return;
        }
        $('.page-sidebar').off('mouseenter').on('mouseenter', function () {
             dealSiderBarMouseenter();
        });
        $('.page-sidebar').off('mouseleave').on('mouseleave', function () {
             dealSiderBarMouseLeave();
        });
    }
    var dealSiderBarMouseenter=function(){
            var body = $('body');
            var siderbar=$('.page-sidebar');
            if ((body.hasClass('page-sidebar-closed') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }
            body.removeClass('page-sidebar-closed').addClass('page-sidebar-hover-on');
            var siderbartoggle=$('.sidebar-toggler');
            
            if (body.hasClass("page-sidebar-reversed")) {
                siderbar.width(_sidebarWidth);
                dealSiderBarWidthChange();
            } else {
                siderbar.addClass('page-sidebar-hovering');
                siderbar.animate({
                    width: _sidebarWidth
                }, 350, '', function () {
                    siderbar.removeClass('page-sidebar-hovering');
                    dealSiderBarWidthChange();
                });
            }
    }
    var dealSiderBarMouseLeave=function(){
            var body = $('body');
            if ((body.hasClass('page-sidebar-hover-on') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }
            var siderbar=$('.page-sidebar');
            var siderbartoggle=$('.sidebar-toggler');
            if (body.hasClass("page-sidebar-reversed")) {
                body.addClass('page-sidebar-closed').removeClass('page-sidebar-hover-on');
                siderbar.width(_sidebarCollapsedWidth);
                if(siderbartoggle){
                     siderbartoggle.removeAttr('style');
                }
                dealSiderBarWidthChange();
            } else {
                siderbar.addClass('page-sidebar-hovering');
                siderbar.animate({
                    width: _sidebarCollapsedWidth
                }, 350, '', function () {
                    body.addClass('page-sidebar-closed').removeClass('page-sidebar-hover-on');
                    dealSiderBarWidthChange();
                    siderbar.removeClass('page-sidebar-hovering');
                    if(siderbartoggle){         
                        siderbartoggle.removeAttr('style');
                    }
                });
            }
    
    }
    //处理style css
    var dealAddStyle=function(element, property, value, important) {
		var styleText=element.attr('style')?element.attr('style'):"";
		styles=styleText.split(";");
		var find="";
		for(i=0;i<styles.length;i++){
			if(styles[i].indexOf(property)>=0){
				find=styles[i];//看是否已经添加过,如果添加过就需要替换掉
				break;
			}
		}
		styleText=find.length>0?styleText.replace(find,""):styleText;
		styleText=(styleText + ';'+property + ':' + value + ((important) ? ' !important' : '') + ';').replace(/;;/g,";");
        element.attr('style',styleText );
    }
    var dealSiderBarWidthChange=function(){
	
    }
    // 处理边栏菜单切换时的关闭和隐藏.
    var dealSidebarToggler = function () {
        var viewport = _getViewPort();
        if (getCookie('sidebar_closed') === '1' && viewport.width >= openoFrameWork_smallView) {
            $('body').addClass('page-sidebar-closed');
        }
        $('.page-sidebar, .sidebar-toggler').on('click', '.sidebar-toggler', function (e) {
              e.preventDefault();
              var body = $('body');
              var sidebar = $('.page-sidebar');
              if(body.hasClass('page-sidebar-closed')){
                  $(this).removeAttr('style');  
              }           
        } );        
        $('.page-sidebar, .header').on('click', '.sidebar-toggler', function (e) {
            var body = $('body');
            var sidebar = $('.page-sidebar');
            if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
                body.removeClass('page-sidebar-hover-on');
                sidebar.css('width', '').hide().show();
                dealSidebarAndContentHeight(); //fix content & sidebar height
                setCookie('sidebar_closed', '0');
                dealSiderBarWidthChange(); 
                e.stopPropagation();
                runResponsiveHandlers();
                return;
            }
            $(".sidebar-search", sidebar).removeClass("open");
			var panel = $('.zte-theme-panel');
			var sidebarPosOption = $('.sidebar-pos-option', panel).val();
			var pcontent = $("[class='page-content']");
            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                if (body.hasClass('page-sidebar-fixed')) {
                    sidebar.css('width', '');                     
                }
				setCookie('sidebar_closed', '0');
				pcontent.css("marginLeft",_sidebarWidth);
				dealSiderBarWidthChange(); 
            } else {
                body.addClass("page-sidebar-closed");
                $(this).removeAttr('style');
				setCookie('sidebar_closed', '1');
				pcontent.css("marginLeft", _sidebarCollapsedWidth);
				dealSiderBarWidthChange(); 
            }
			//针对侧边栏伸缩的情况需加入对.page-content的判断。
            dealSidebarAndContentHeight(true); 
            runResponsiveHandlers();
        });
    }
    // 处理水平菜单
    var dealHorizontalMenu = function () {
        $('.header').on('click', '.hor-menu .hor-menu-search-form-toggler', function (e) {
            if ($(this).hasClass('off')) {
                $(this).removeClass('off');
                $('.header .hor-menu .search-form').hide();
            } else {
                $(this).addClass('off');
                $('.header .hor-menu .search-form').show();
            }
            e.preventDefault();
        });
		// 处理水平菜单 处理header下拉菜单中的菜单连接，显示在iframe中
        $('.header').on('click', ' li > a.iframe', function (e) {
			//dealMenuItemClick($(this),e,"header"); 
			e.preventDefault();
			var menuItemID=$(this).attr("id");
			if(!!menuItemID&&menuItemID.length>0){
				_setLocationHash(menuItemID);	
				_hashSource="dhByInterface";
			}//else{
			_isClicked=true;
			   dealMenuItemClick($(this),e,"header"); 
			//}		
        });   
        //处理TAB点击
        $('.header').on('click', '.hor-menu a[data-toggle="tab"]', function (e) {     
            e.preventDefault();
            var nav = $(".hor-menu .nav");
            var active_link = nav.find('li.current');
            $('li.active', active_link).removeClass("active");
            $('.selected', active_link).remove();
            var new_link = $(this).parents('li').last();
            new_link.addClass("current");
            new_link.find("a:first").append('<span class="selected"></span>');
        });
    }	
	// 增加一个对服务端的心跳
	var doHeartbeat = function() {		
		//心跳超时次数		
		var heartBeatTimes = 0;
		return setInterval(function() {
			var userName;
			if( userName == null ){
				var userName = openoFrameWork_conf.userName;
			}
			var heartUrl = FrameConst.REST_HEARTBEAT + "?username=" + encodeURIComponent(userName);
			$.ajax(heartUrl, {
				dataType : "text",
				cache : false
			}).done(function(data) {
				// if (data != "true") { //收到不属于取值范围内的回复，说明出现不可预知情况，取消心跳。是原framework.js中的逻辑，比较奇怪，先保留注释。
					// disableHeartbeat();
				// }
				//收到心跳回应消息，心跳超时次数置0
				if( data == "true" ){
					heartBeatTimes = 0;	
				}				
			});
			heartBeatTimes++;
			//心跳超时6次即1分钟，转到登录界面，认为链路断。
			if(heartBeatTimes >= 6){
				disableHeartbeat();
				//console.log(com_zte_ums_aos_framework_ui_heartbeat_timeout);										   
				bootbox.alert($.i18n.prop('com_zte_ums_aos_framework_ui_heartbeat_fail'), function () {                    
					window.location.replace("login.html");
				});
			}
		}, 10000);
	};	
	if( FrameConst.do_heartbeat ){
		var heartbeatTimer = doHeartbeat();
	}
	window.enableHeartbeat = function() {
		if (!heartbeatTimer) {
			//重新启动心跳功能，心跳超时次数置0
			heartBeatTimes = 0;
			heartbeatTimer = doHeartbeat();
			return "Enabled";
		}
		return "Already enabled!";
	};
	window.disableHeartbeat = function() {
		if (heartbeatTimer) {
			clearInterval(heartbeatTimer);
			heartbeatTimer = null;
			return "Disabled";
		}
		return "Already disabled!";
	};	
	window.doLogout = function(){
		window.location=FrameConst.REST_LOGOUT;
	};
    //处理ict注销确认
    $('#trigger_logout').click(function(){
                bootbox.confirm($.i18n.prop('com_zte_ums_ict_framework_ui_confirmlogout'), function(result) { //你确认要注销吗?
                   if(result){
                     doLogout();
                    }
                }); 
            });
    // Handle full screen mode toggle
    var isscreenFull=false;
    var dealFullScreenMode = function() {
        // 处理全屏事件
        function toggleFullScreen() {
            if(!screenfull.supportsFullScreen){//不支持全屏
                if (isIE&&typeof window.ActiveXObject !== "undefined") { // Older IE.
                    var wscript = new ActiveXObject("WScript.Shell");
			              if (wscript !== null) {
				                wscript.SendKeys("{F11}");
                        isscreenFull=!isscreenFull;                                                
			               }
		            }else{
                    isscreenFull=screenfull.supportsFullScreen;
                }; 
            }else{
              screenfull.isFullScreen?screenfull.exitFullScreen():screenfull.requestFullScreen();
              isscreenFull= screenfull.isFullscreen;
            }
            setTimeout(function(){
              if(isscreenFull){
                  $("#fullscreen_label").text($.i18n.prop('com_zte_ums_ict_framework_ui_group_exitfullscreen'));
              }else{
                  $("#fullscreen_label").text($.i18n.prop('com_zte_ums_ict_framework_ui_group_fullscreen'));
              }
           },500);    
        } 
                 
        $('#trigger_fullscreen').click(function() {
            toggleFullScreen();
        });
    }    
    //清理当前正在显示的iframe之外缓存的iframe，
    var dealClearCachedIframes=function(isall){
            if (cachedIframes.count()>0) {
                for (var i in cachedIframes.hash()) {
                    var pagemyIframe=$('.page-content .page-content-body .'+i);			      
                    if(pagemyIframe&&pagemyIframe.length>0){
                         if(isall==true){
							pagemyIframe.attr("src","");
						    pagemyIframe.remove();
						 }else if(i!=_iframe)
							pagemyIframe.attr("src","");
        					pagemyIframe.remove();						
					}
				}
           }
           cachedIframes.clear();
		   if (cachedIframesObject.count()>0) {//清理缓存的iframe实体对象。
                for (var i in cachedIframesObject.hash()) {
                    if(i!=_iframe)
        				cachedIframesObject.remove(i);
				}
           }
        }
    var lastSelectedLayout = '';    
    var dealTheme = function () {
        var panel = $('.zte-theme-panel');
        if ($('body').hasClass('page-boxed') == false) {
            $('.layout-option', panel).val("fluid");
        }
        $('.sidebar-option', panel).val("default");
		$('.language-option', panel).val(defaultLanage);
        $('.header-option', panel).val("fixed");
        $('.footer-option', panel).val("default");
        if ( $('.sidebar-pos-option').attr("disabled") === false) {
            $('.sidebar-pos-option', panel).val(openoFrameWork.isRTL() ? 'right' : 'left');
        }		
        var _resetLayout = function () {
            dealResetLayout();
        }   
        var _setLayout = function () {
			dealSetLayout();
        }
        var setColor = function (color) {
            var color_ = (openoFrameWork.isRTL() ? color + '-rtl' : color);
            $('#style_color').attr("href", ICTFRAME_CONST_THEME_COLOR_CSS_PREFFIX + color_ + ".css");
            setCookie('style_color', color);
			syncColorCSS();
        }		
        $('.toggler', panel).click(function () {
            $('.toggler').hide();
            $('.toggler-close').show();
            $('.zte-theme-panel > .theme-options').show();
        });

        $('.toggler-close', panel).click(function () {
            $('.toggler').show();
            $('.toggler-close').hide();
            $('.zte-theme-panel > .theme-options').hide();
        });
        $('.theme-colors > ul > li', panel).click(function () {
            var color = $(this).attr("data-style");
            setColor(color);
            $('ul > li', panel).removeClass("current");
            $(this).addClass("current");
        });
        $('.layout-option,.header-option, .sidebar-option, .footer-option, .sidebar-pos-option, .nav-pos-direction', panel).change(_setLayout);
		if (getCookie('style_color') != undefined) {
			setColor(getCookie('style_color'));
		}
		$('.language-option', panel).change(function(){
			var languageOption = $('.language-option', panel).val();
			setCookie('language-option', languageOption);		
			window.location.reload();
		});		
    }	
	var dealResetLayout = function () {
            $("body").
            removeClass("page-boxed").
            removeClass("page-footer-fixed").
            removeClass("page-sidebar-fixed").
            removeClass("page-header-fixed").
            removeClass("page-sidebar-reversed");
            $('.header > .header-inner').removeClass("container");
            if ($('.page-container').parent(".container").size() === 1) {
                $('.page-container').insertAfter('body > .clearfix');
            }
            if ($('.footer > .container').size() === 1) {
                $('.footer').html($('.footer > .container').html());
            } else if ($('.footer').parent(".container").size() === 1) {
                $('.footer').insertAfter('.page-container');
            }
            $('body > .container').remove();			
    }	
    /*
     * 此方法在客户端初始化和设置面板上选择菜单方向的时候用。
     * param navPosOption
     */
	var dealNavPos = function(navPosOption) {
		// 横竖边栏切换功能禁用，则返回
		var panel = $('.zte-theme-panel');
		if ($('.nav-pos-direction', panel).attr("disabled") == "disabled") {
			return;
		}
		var sidermenu = $("#page-sidebar-menu");
		var hormenu = $("#main_hormenu");
        var sidermenu = $("#page-sidebar-menu");
        var hormenu = $("#main_hormenu");
		var horSiderMenu = $('#' + megaSiderDivId );
        var fhorMenu = $("#" + fMenuMegaDivId);
        var fsiderMenu = $("#" + fMenuSiderDivId);
		var pcontent = $("[class='page-content']");
		if (sidermenu && sidermenu.length > 0 && hormenu && hormenu.length  > 0 && fhorMenu && fhorMenu.length  > 0) {
			if (navPosOption === openoFrameWork_menu_horizontal) {
				sidermenu.css('display','none');// 侧边栏隐藏
                fhorMenu.css('display','none');
                fsiderMenu.css('display','none');
				pcontent.css("marginLeft",0);
				$("body").addClass("page-full-width");//调整内容显示
				hormenu.css("display", "block");//显示水平菜单栏
				// 导航位置为水平菜单时，边栏和边栏位置为默认和靠左，且将其切换功能禁用掉
				$('.sidebar-option', panel).val("default");
				$('.sidebar-option', panel).attr("disabled", true);
				$('.sidebar-pos-option', panel).val("left");
				$('.sidebar-pos-option', panel).attr("disabled", true);
			} else if (navPosOption === openoFrameWork_menu_vertical ) {
				$("body").removeClass("page-full-width");
				sidermenu.css('display','block');//侧边栏显示
				var body = $('body');
				if (body.hasClass("page-sidebar-closed")) {
					pcontent.css("marginLeft", _sidebarCollapsedWidth);
				} else {
					pcontent.css("marginLeft", _sidebarWidth);
				}
				hormenu.css("display", "none");//隐藏水平菜单栏
                fhorMenu.css('display','none');
                fsiderMenu.css('display','none');
				horSiderMenu.css('display','none');
				$('.sidebar-option', panel).attr("disabled", false);
				$('.sidebar-pos-option', panel).attr("disabled", false);
			} else if(navPosOption === openoFrameWork_menu_fmenu ){
                sidermenu.css('display','none');// 侧边栏隐藏
                hormenu.css("display", "none");//隐藏水平菜单栏
                fsiderMenu.css('display','none');
                fhorMenu.css('display','block');
                pcontent.css("marginLeft",0);
                $("body").addClass("page-full-width");//调整内容显示
                // 导航位置为水平菜单时，边栏和边栏位置为默认和靠左，且将其切换功能禁用掉
                $('.sidebar-option', panel).val("default");
                $('.sidebar-option', panel).attr("disabled", true);
                $('.sidebar-pos-option', panel).val("left");
                $('.sidebar-pos-option', panel).attr("disabled", true);
            }
		}
	}	
    var dealSetLayout = function(){
	    var panel = $('.zte-theme-panel');
        var layoutOption = $('.layout-option', panel).val();  
		var languageOption = $('.language-option', panel).val();		
		var headerOption = $('.header-option', panel).val();
        var footerOption = $('.footer-option', panel).val();        
		var navPosOption = $('.nav-pos-direction', panel).val();		
		dealNavPos(navPosOption);
		var sidebarOption = $('.sidebar-option', panel).val();
		var sidebarPosOption = $('.sidebar-pos-option', panel).val();
        if (sidebarOption == "fixed" && headerOption == "default") {
            alert($.i18n.prop('com_zte_ums_ict_framework_ui_fixedsidedefaultheaderError'));  //页头不支持固定边栏,先固定页头才能固定边栏.
            $('.header-option', panel).val("fixed");
            $('.sidebar-option', panel).val("fixed");
            sidebarOption = 'fixed';
            headerOption = 'fixed';
        }
        if (sidebarOption == "fixed" && sidebarPosOption == "right") {
            alert($.i18n.prop('com_zte_ums_ict_framework_ui_fixedsiderightpositionError'));  //固定边栏情况下，边栏不能靠右。.
            $('.sidebar-pos-option', panel).val("left");
            sidebarPosOption = 'left';
        }
        dealResetLayout(); // reset layout to default state
        if (layoutOption === "boxed") {
                $("body").addClass("page-boxed");
                // set header
                $('.header > .header-inner').addClass("container");
                var cont = $('body > .clearfix').after('<div class="container"></div>');
                // set content
                $('.page-container').appendTo('body > .container');
                // set footer
                if (footerOption === 'fixed') {
                    $('.footer').html('<div class="container">' + $('.footer').html() + '</div>');
                } else {
                    $('.footer').appendTo('body > .container');
                }
        }		
        if (lastSelectedLayout != layoutOption) {
                runResponsiveHandlers();
        }
        lastSelectedLayout = layoutOption;
            //header
        if (headerOption === 'fixed') {
                $("body").addClass("page-header-fixed");
                $(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");
        } else {
                $("body").removeClass("page-header-fixed");
                $(".header").removeClass("navbar-fixed-top").addClass("navbar-static-top");
        }
            //sidebar
        if ($('body').hasClass('page-full-width') === false) {
                if (sidebarOption === 'fixed') {
                    $("body").addClass("page-sidebar-fixed");
                } else {
                    $("body").removeClass("page-sidebar-fixed");
                }
        }
            //footer 
        if (footerOption === 'fixed') {
                $("body").addClass("page-footer-fixed");
        } else {
                $("body").removeClass("page-footer-fixed");
        }
            //sidebar position
        if (openoFrameWork.isRTL()) {
                if (sidebarPosOption === 'left') {
                    $("body").addClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({placement: 'right'});
                } else {
					var pcontent = $("[class='page-content']");
					pcontent.css("marginLeft",0);//侧边栏靠右，则左边内容填充为0
                    $("body").removeClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({placement: 'left'});
                }
        } else {
                if (sidebarPosOption === 'right') {
					var pcontent = $("[class='page-content']");
					pcontent.css("marginLeft",0);//侧边栏靠右，则左边内容填充为0
                    $("body").addClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({placement: 'left'});
                } else {
                    $("body").removeClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({placement: 'right'});
                }
        }
        dealSidebarAndContentHeight();   
        dealFixedSidebar(); 
        dealFixedSidebarHoverable(); 		
		dealSiderBarWidthChange();
		setCookie('layout-option', layoutOption);
		setCookie('language-option', languageOption);
		setCookie('header-option', headerOption);
		setCookie('sidebar-option', sidebarOption);
		setCookie('sidebar-pos-option', sidebarPosOption);
		setCookie('nav-pos-direction', navPosOption);
    }
	var setCookie = function (key, value) {
	    if (store) {
	        store(key, value);
	    }
	}	
	var getCookie = function (key) {
	    if (store) {
	        return store(key);
	    } else {
	        return undefined;
	    }
	}	
	/*下面处理前进后退和锚点访问*/
	var _getLocationHash = function() {
		    return location.hash.replace("#_", "");
	}
	/*统一入口设置锚点*/
	var _setLocationHash = function(menuItemID) {
		    location.hash = getLocationHashByMenuId(menuItemID);
	}
    var getLocationHashByMenuId = function(menuItemID){
        return "#_" + menuItemID;
    }
	// hash control
	var loadCurrentHash = function(e,data){
		var locationhash = _getLocationHash();	//important
		if(!!locationhash&&locationhash.length>0){
			if(_hashSource.trim()=="dhByInterface"){
				_hashSource="";
			}else{
				processChangedHash(locationhash,data);
			}
		}
	}	
	// hash control  这种写法安全点	
	var processChangedHash = function(path) {
		var id = path;
		var action = undefined;
		var spIndex = path.indexOf("/");
		if(spIndex != -1) {
			id = path.substring(0,spIndex);
			action = path.substring(spIndex+1);
		}
		openoFrameWork.goToURLByIDAndNewAction(id,action);
	}
	var syncColorCSS=function(){//注册皮肤切换事件处理函数，处理iframe中的皮肤切换
		var pagemyIframe=null;
		if (cachedIframes.count()>0) {
            for (var i in cachedIframes.hash()) {                			      
			    pagemyIframe=$('.page-content .page-content-body .'+i);
			    if(pagemyIframe&&pagemyIframe.length>0){
					openoFrameWork.SyncCSS(pagemyIframe[0],1,"");
				}
            }
        }
	}	
	var getCurrentVisibleIframe=function(){
		var pagemyIframe=null;
        if (cachedIframes.count()>0) {
            for (var i in cachedIframes.hash()) {                			      
			    if(cachedIframes.items(i)===1){
					pagemyIframe=$('.page-content .page-content-body .'+i);
			    }
            }
        }
		return pagemyIframe;		                                
    }
	//处理跨域请求代理，通过该代理进行iframe间传递参数，注意这里的代理页面proxy.html必须部署到要跨域的对端域的服务器web根目录下
	var dealCrossProxy=function(ifrm,crossproxysrc,ifmHeadlins,flag){//crossproxysrc这个是proxy.html对应的url根路径
		var url=$.url(openoFrameWork.getCurrentScript(document));
		var proxyHtmlPath=url.attr("directory")+"proxy/proxy.html"//这中情况适用于使用了该界面集成框架的应用系统
	    var _ifmProxy=$('<iframe id="ifm_Proxy" name="ifm_Proxy" oldproxyorigin="'+crossproxysrc+'" src="'+crossproxysrc+proxyHtmlPath+'" style="border: 0px; margin: 0px; padding: 0px; width: 100%; display:none;" ></iframe>');
		var _ifm=$('#ifm_Proxy');
		_ifm.hide();
		var pageContentBody=$('.page-content .page-content-body');
		var linksrcs=new Array();
		var linksids=new Array();
		var linktyps=new Array();
		var _src="";
		for (i=0;i<ifmHeadlins.length;i++){
			if(typeof ifmHeadlins[i].link.href!== "undefined"){
				_src=ifmHeadlins[i].link.href;
				linktyps.push("css");			
			}
			else if(typeof ifmHeadlins[i].link.src!== "undefined"){
				if(!!ifmHeadlins[i].link.src&&ifmHeadlins[i].link.src.length>0){
					_src=ifmHeadlins[i].link.src;
					linktyps.push("javascriptfile");
				}else{
					_src=ifmHeadlins[i].link.text;
					linktyps.push("javascripttext");
				}
			}else{
				linktyps.push("undefined");
			}
			linksrcs.push(_src);
			linksids.push({"pos":ifmHeadlins[i].pos,"scope":ifmHeadlins[i].scope,"id":ifmHeadlins[i].link.id});
		}
		var parm={iFrame:ifrm,cssLinktyps:linktyps,cssLinksrcs:linksrcs,cssLinkids:linksids,origin:crossproxysrc,flag:flag};
		if(_ifm&&_ifm.length<=0){//没有添加过
		    _ifmProxy.appendTo(pageContentBody);
			_ifmProxy.one('load',parm,function(e){ 
			    var data={iFrame:e.data.iFrame,cssLinktyps:e.data.cssLinktyps,cssLinksrcs:e.data.cssLinksrcs,cssLinkids:e.data.cssLinkids,flag:flag};
				$('#ifm_Proxy')[0].contentWindow.postMessage(data,e.data.origin);//window.location.origin
			});
		}else if(_ifm.attr("oldproxyorigin")!=crossproxysrc){//代理已经添加过了，看是否是同一个网站的代理，如果不是需要重新加载
			_ifm.attr("src","");
			_ifm.attr("oldproxyorigin",crossproxysrc);
			_ifm.one('load',parm,function(e){ 
			    var data={iFrame:e.data.iFrame,cssLinktyps:e.data.cssLinktyps,cssLinksrcs:e.data.cssLinksrcs,cssLinkids:e.data.cssLinkids,flag:flag};
				$('#ifm_Proxy')[0].contentWindow.postMessage(data,e.data.origin);//window.location.origin
			});
			_ifm.attr("src",_ifmProxy.attr("src"));
		}else{//已经添加过，直接触发消息发送即可		
			var data={iFrame:parm.iFrame,cssLinktyps:parm.cssLinktyps,cssLinksrcs:parm.cssLinksrcs,cssLinkids:parm.cssLinkids,flag:flag};
			_ifm[0].contentWindow.postMessage(data,parm.origin);//window.location.origin
		}
	}
    return {  
        init: function () {
			if(zte_http_headers){
				store("zte_http_headers",zte_http_headers);
			}
            dealInit(); 
            dealResponsiveOnResize(); 
            dealResponsiveOnInit(); 
            dealClearCachedIframes(true); ////清理当前正在显示的iframe之外缓存的iframe，
			breadcrumbBtnMenus.clear();
            dealFixedSidebar(); // deals fixed sidebar menu
            dealFixedSidebarHoverable(); // deals fixed sidebar on hover effect 
            dealSidebarMenu(); // deals main menu
            dealHorizontalMenu(); // deals horizontal menu
            dealSidebarToggler(); // deals sidebar hide/show            
            dealTheme(); // deals style customer tool		
			dealSetLayout();			
			$(function() {
				$(window).on('hashchange',function(){
                    loadCurrentHash();
                });
			});            
            dealFullScreenMode(); // deals full screen
			$("#header_dropdown_user").css('display','block');
			$("#com_zte_ums_ict_framework_img_netnumenLogo").css('display','inline');
			$("#com_zte_ums_ict_framework_ui_main_title").css('display','inline');
			handeCtxMenuitem();
        },
        //公开清理缓存的所有Iframe的方法：isALL==true则清理所有，否则清理当前正在显示的iframe之外缓存的iframe，。
        clearCachedIframes:function(isAll){
          dealClearCachedIframes(isAll);
        },
		
		setBaseURLRoot:function(ipportStr){//菜单url的跟ip和端口例如:http://10.74.151.122:21180
			if (store) {
				store('baseURLRoot', ipportStr);
			}
			var url = $.url(ipportStr);
			location.hash=url.attr('fragment');
			var auth=url.attr('query');
			if (store) {
				store('baseURLRootAuth', auth);
			}
		},
		getBaseURLRoot:function(ipportStr){//菜单url的跟ip和端口例如:http://10.74.151.122:21180
			var rooturl="";
			if (store) {
				rooturl=store('baseURLRoot');
			}
			return !rooturl?"":rooturl;
		},
		clearBaseURLRoot:function(){//菜单url的跟ip和端口例如:http://10.74.151.122:21180
			if (store) {
				store('baseURLRoot', "",-1);
			}
		},
		setPageTitle:function(title){//设置页面标题
			$('title').html(title+" - "+gdocTitle); 
		},
		getLanguage:function(){//获取语言
			return openoFrameWork_conf.acceptLanguage;
		},
        
		getLocationHash:function(){
			return _getLocationHash();
		},
		setSceneURLRootPath:function(sceneURLRootPath){
			if(sceneURLRootPath&&sceneURLRootPath.trim().length>0){//如果定义了场景的全局参数
				_sceneURLRootPath=sceneURLRootPath.trim();
				if(_sceneURLRootPath.charAt(_sceneURLRootPath.length-1)!='/')
				{
				   _sceneURLRootPath=_sceneURLRootPath+'/';
				}
			}
		},
        //public function to add callback a function which will be called on window resize
        addResponsiveHandler: function (func) {
            responsiveHandlers.push(func);
        },

		hiddenAlarmLight:function(){
		   hideAlarmLight();
		},
		
		hiddenMenu:function(){
			hidemenu();
		},		
		setBreadcrumbByMenuID:function(id){
			//var breaditem=$('#'+id);
			var menuitem=undefined;
			// var items=$("a[id='"+id+"']");
			var items = undefined;
			var panel = $('.zte-theme-panel');
			var navPosOption = $('.nav-pos-direction', panel).val();
			if (navPosOption === "vertical"){ //从垂直菜单里面找
				items=$("#page-sidebar-menu a[id='"+id+"']");
				if (!items || items.length < 1) {
					items=$(".page-content a[id='"+id+"']");
				}
			}else if(navPosOption === openoFrameWork_menu_horizontal){//从水平菜单里面找
                items=$("#main_hormenu a[id='"+id+"']");
                if(items.length == 0){
                    //横菜单没有找到，再在横菜单的子菜单找一次
                    items=$("#page-megachild-sidebar-menu a[id='"+id+"']");
                }
            }else if(navPosOption === openoFrameWork_menu_fmenu){
                items=$("#f_hormenu a[id='"+id+"']");
                if(items.length == 0){
                    //横菜单没有找到，再在竖菜单找一次。
                    items=$("#page-f-sidebar-menu a[id='"+id+"']");
                }
            }
			var isbreadcrumbMenuItem=false;
			if(items.length>0){
				for(var i=0;i<items.length;i++){
					if($(items[i]).parentsUntil('.header-inner').hasClass('hor-menu')){
						menuitem=$(items[i]);
						break;
					}else if($(items[i]).parentsUntil('.page-container').hasClass('page-sidebar')){
						menuitem=$(items[i]);
						break;
                    }else if($(items[i]).parentsUntil('.more-botton-zone .btn-group').hasClass('dropdown-menu')){
						menuitem=$(items[i]);
						isbreadcrumbMenuItem=true;
						break;
					}else if($(items[i]).parentsUntil('#pageableDiv').hasClass('row1')){
						menuitem=$(items[i]);
						isbreadcrumbMenuItem=true;
						break;
					}
				}
			}
			
			if(menuitem&&menuitem.length>0){				
				if(isbreadcrumbMenuItem){
					dealBreadcrumbBtnGroupMenus(menuitem,false);
				}else{
					dealBreadcrumb(menuitem,true,null);				
				}	
			}else{
				var breadcrumbBtnMenuItemParent="";
				if(!menuitem||menuitem.length<=0){//没有找到该菜单，可能是面包削中的，需要额外处理
					var menuItemID=id;
					if (breadcrumbBtnMenus.contains(menuItemID)) {//有缓存
						breadcrumbBtnMenuItemParent="#"+breadcrumbBtnMenus.items(menuItemID);
						menuitem=$(breadcrumbBtnMenuItemParent);	
						//_breadcrumbSource=true;
					}
				}
				var parm=undefined;
				if(breadcrumbBtnMenuItemParent&&breadcrumbBtnMenuItemParent.length>0){
					parm={breadcrumbBtnMenuItem:menuItemID};
				}
				if(parm&&menuitem&&menuitem.length>0) {
					dealBreadcrumb(menuitem,true,parm);
				}
			}						
		},				
        setSiderbarCollapseWidth:function(width){
            _sidebarCollapsedWidth = width;
        },
        getSiderbarCollapseWidth:function(){
            return _sidebarCollapsedWidth;
        },
        setSidebarWidth:function(width){
            _sidebarWidth = width;
        },
        getSidebarWidth:function(){
            return _sidebarWidth;
        },
        //2015年10月26日新增动态切换菜单的功能，这里的菜单还需要再次更换菜单项访问的ip端口信息				
		handlBaseURL:function(url){
			var baseURLRoot=openoFrameWork.getBaseURLRoot();
			if (baseURLRoot.length>0) {//2015年10月26日新增动态切换菜单的功能，这里的菜单还需要再次更换菜单项访问的ip端口信息
					baseURLRoot=openoFrameWork.getDomainURL(baseURLRoot);//去掉ip和port后多余的部分
					console.log("old a link href url:"+url);
					url=baseURLRoot+url.replace(openoFrameWork.getDomainURL(url),"");
					console.log("baseURLRoot:"+baseURLRoot+"      newURL:"+url);			
			};
			return url;
		},
		
        startPageLoading: function(message) {
            dealstartPageLoading(message);
        },
        stopPageLoading: function() {
            dealstopPageLoading();
        },
        //public function to get a paremeter by name from URL
        getLocationURLParameter: function (paramName,separator) {
            var searchString = decodeURIComponent(window.location.search.substring(1)).toLowerCase(),
                i, val, params = searchString.split(separator?separator:"&");
			paramName=paramName.toLowerCase();
            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },
        //public function to get a paremeter by name from URL
        getURLParameter: function (paramName,url) {
            var searchString = decodeURIComponent(url).toLowerCase(),
                i, val, params = searchString.split("&");
			paramName=paramName.toLowerCase();
            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },
        // check for device touch support
        isTouchDevice: function () {
            return isTouch;
        },
        getUniqueID: function(prefix) {
            return prefix+'_' + Math.floor(Math.random() * (new Date()).getTime());
        },
        // check IE8 mode
        isIE8: function () {
            return isIE8;
        },
        // check IE9 mode
        isIE9: function () {
            return isIE9;
        },
        //check RTL mode
        isRTL: function () {
            return isRTL;
        },
		getViewPort:function(){
		    return _getViewPort();
		},
        // get layout color code by color name
        getLayoutColorCode: function (name) {
            if (layoutColorCodes[name]) {
                return layoutColorCodes[name];
            } else {
                return '';
            }
        } , 
		fixContentHeight: function () {
            dealSidebarAndContentHeight();
        },
		dealAtoIframe:function(aObj,event){
			var containerStr=aObj.parentsUntil('.page-container').hasClass('page-sidebar')?'page-sidebar':"";//
			containerStr=aObj.parentsUntil('.header-inner').hasClass('hor-menu')?'header':containerStr;			
			dealMenuItemClick(aObj,event,containerStr);
			_isClicked=false;
		},
		getDomainURL:function(urlAddress){
			var url = $.url(urlAddress);
			var protocol=url.attr('protocol');
			var host=url.attr('host');
			var port=url.attr('port');
			var crossOrign=protocol+"://"+host+(port.length>0?":"+port:"");	
			return crossOrign;
		},
		getCurrentScript:function(doc) {//doc为 document对象
			/*	注意该功能在其他脚本中调用时出safari获取到的脚本路径为本方法所在脚本的路径，
				其他浏览器获取到的为调用该方法的脚本所在路径
				取得正在解析的script节点
			*/
			if(doc&&doc.currentScript) { //firefox 4+
				console.log("0、 "+doc.currentScript.src);
				return doc.currentScript.src;
			}
			// 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
			var stack;
			try {
				a.b.c(); //强制报错,以便捕获e.stack
			} catch(e) {//safari的错误对象只有line,sourceId 或者高版本还有sourceURL
				stack = e.stack;		
				if(e.sourceURL){//safari 浏览器没有e.stack但有e.sourceURL
					stack=e.sourceURL;			
				}else if(!stack && window.opera){
					//opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
					stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
				}
				console.log("1、 "+stack);
			}
			if(stack) {
				/*e.stack最后一行在所有支持的浏览器大致如下:
				*chrome23:
				* at http://113.93.50.63/data.js:4:1
				*firefox17:
				*@http://113.93.50.63/query.js:4
				*opera12:
				*@http://113.93.50.63/data.js:4
				*IE10:
				*  at Global code (http://113.93.50.63/data.js:4:1)
				*/
				console.log("2、 "+stack);
				stack = stack.split( /[@ ]/g).pop();//取得最后一行,最后一个空格或@之后的部分
				stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
				console.log("3、 "+stack);
				return stack.replace(/(:\d+)?:\d+$/i, "");//去掉行号与或许存在的出错字符起始位置
			}
			if(doc){
				var nodes = doc.getElementsByTagName("script"); //只在head标签中寻找
				for(var i = 0, node; node = nodes[i++];) {
					if(node.readyState === "interactive") {
						console.log("4、 "+(node.className = node.src));
						return node.className = node.src;
					}
				}
			}
		},
		/*下面的flag为0表示默认不触发孙子iframe中的onload事件,为1表示要触发,flag为10则对cssSrc重复执行，其他不做重复执行*/
		SyncCSS:function(ifrm,flag,cssSrc){//将主框架中的皮肤css应用到打开的iframe页面中
			if(!ifrm)return;
			var ifmHeadlins = new Array();
			if(cssSrc&&cssSrc.length>0&&cssSrc.endWith(".css")){
			    var _div = $('<a href="'+cssSrc+'"></a>');  
				var csslink=document.createElement("link");			
				csslink.href=_div[0].href;//这里同步菜单定义中cssSrc属性指定的css文件到iframe
				 _div = null; 
				csslink.rel="stylesheet";
				csslink.type="text/css";
				csslink.id="ifram_csssrc";
				ifmHeadlins.push({"pos":"head","scope":"all","link":csslink});//pos是添加到子iframe中的位置，scope是子窗体作用返回，one表示直接子窗体，all表示嵌套所有子窗体
			}
			if(flag!=10){//当flag为10时下面的css和js都不执行
				if($('#style_color').length>0){
					var csslink=document.createElement("link");			
					csslink.href=$('#style_color')[0].href.replace(".css","_ifrm.css");//这里同步的皮肤页面修改为原皮肤页面文件名后缀添加ifrm的css皮肤文件
					csslink.rel="stylesheet";
					csslink.type="text/css";
					csslink.id="style_color";
					ifmHeadlins.push({"pos":"head","scope":"all","link":csslink});//pos是添加到子iframe中的位置，scope是子窗体作用返回，one表示直接子窗体，all表示嵌套所有子窗体
				}
				// 将 font-awesome字体图标应用到模块iframe
				if($('#font_awesome').length>0){
					var awesomelink=document.createElement("link");			
					awesomelink.href=$('#font_awesome')[0].href;
					awesomelink.rel="stylesheet";
					awesomelink.type="text/css";
					awesomelink.id="font_awesome";
					ifmHeadlins.push({"pos":"head","scope":"all","link":awesomelink});
				}
				// 将pym.js or pym.min.js应用到模块iframe
				var pymjsObj=$("script[src*='/pym.']");//模糊查找
				pymjsObj=pymjsObj.length>0?pymjsObj:$("script[src*='/pym1.']");
				if(pymjsObj.length>0){
					var pymjs=document.createElement("script");	
					pymjs.src=pymjsObj[0].src;
					pymjs.type="text/javascript";
					pymjs.id=!!pymjsObj[0].id?pymjsObj[0].id:"pymjs";
					ifmHeadlins.push({"pos":"head","scope":"one","link":pymjs});
					pymjs=document.createElement("script");	//pym脚本文件加载后要执行new pym.Child()进行iframe子窗体实例化,便于子窗体和父窗体通讯new pym.Child({ id: '"+_iframe+"' ,polling: 1000})
					var frameid=(_iframe.split('-').length>0?_iframe.split('-')[1]:"1");
					pymjs.text="var t1;function pmchd(){console.log('In the frame "+_iframe+",pym code call is begining; '+(typeof pym!= 'undefined'));if(typeof pym != 'undefined'){pymChild"+frameid+" = new pym.Child({ id: 'pdiv_"+_iframe+"' ,polling: 500});window.clearInterval(t1); }};t1 = window.setInterval(pmchd,5);";
					pymjs.type="text/javascript";
					pymjs.id="pymChild";
					ifmHeadlins.push({"pos":"htmlend","scope":"one","link":pymjs});				
				}
				// 将hk.js or hk.min.js应用到模块iframe
				var hkjsObj=$("script[src*='/hk.']");//模糊查找
				hkjsObj=hkjsObj.length>0?hkjsObj:$("script[src*='/hk1.']");
				if(hkjsObj.length>0){
					var hkjs=document.createElement("script");	
					hkjs.src=hkjsObj[0].src;
					hkjs.type="text/javascript";
					hkjs.id=!!hkjsObj[0].id?hkjsObj[0].id:"hkjs";
					ifmHeadlins.push({"pos":"head","scope":"one","link":hkjs});
					hkjs=document.createElement("script");	////hk.js 加载后拦截ajax请求进行转发				
				}
			}
			var crossOrign=openoFrameWork.getDomainURL(ifrm.src);					
			if(	window.location.origin==crossOrign){	//第一层同域处理	
				for (i=0;i<ifmHeadlins.length;i++){
					var link=ifrm.contentDocument.getElementById(ifmHeadlins[i].link.id);
					if(link){
							if(link.parentNode.tagName.toUpperCase==="HEAD"){
								ifrm.contentDocument.head.removeChild(link);
							}else if(link.parentNode.tagName.toUpperCase==="HTML"){
								ifrm.contentDocument.removeChild(link);
							}
					}
					if(ifmHeadlins[i].pos=="head")
						ifrm.contentDocument.head.appendChild(ifmHeadlins[i].link);
					else if (ifmHeadlins[i].pos=="bodyend")
						ifrm.contentDocument.body.appendChild(ifmHeadlins[i].link);
					else if (ifmHeadlins[i].pos=="htmlend")
						ifrm.contentDocument.body.parentNode.appendChild(ifmHeadlins[i].link);
				}
				//对iframe中又有嵌套一级iframe的地方进行同步，只同步scope为all的
				var childifrms=ifrm.contentDocument.getElementsByTagName("iframe");
				if(childifrms&&childifrms.length>0){
					var ifmHeadlins2 = new Array();
					for (i=0;i<ifmHeadlins.length;i++){//筛选出scope为all的
						if(ifmHeadlins[i].scope=="one") break;
						ifmHeadlins2.push(ifmHeadlins[i]);		
					}
					for(j=0;j<childifrms.length;j++){
						var parm={ifmHeadlins:ifmHeadlins2};
						var childOrign=openoFrameWork.getDomainURL(childifrms[j].src);
						if(window.location.origin==childOrign){//同域
							var ifrmload=function(e){ 
								for (i=0;i<e.data.ifmHeadlins.length;i++){
									var ifmheadlink=$(e.data.ifmHeadlins[i].link).clone()[0];////注意这里必须克隆，否则会出现元素移动，前面ifrm添加的都会被移出
									var link=this.contentDocument.getElementById(ifmheadlink.id);
									if(link){
										if(link.parentNode.tagName.toUpperCase==="HEAD"){
											this.contentDocument.head.removeChild(link);
										}else if(link.parentNode.tagName.toUpperCase==="HTML"){
											this.contentDocument.removeChild(link);
										}
									}
									if(e.data.ifmHeadlins[i].pos=="head"){
										this.contentDocument.head.appendChild(ifmheadlink);
									}else if(e.data.ifmHeadlins[i].pos=="bodyend"){
										this.contentDocument.body.appendChild(ifmheadlink);
									}else if (ifmHeadlins2[i].pos=="htmlend"){
										this.contentDocument.body.parentNode.appendChild(ifmheadlink);
									}
								}
							}
							$(childifrms[j]).off('onload',parm,ifrmload);
							$(childifrms[j]).on('onload',parm,ifrmload);
							$(childifrms[j]).trigger("onload");
							
						}else{
							if(ifmHeadlins2.length>0){
								console.log('跨域访问: 系统将进入跨域访问代理处理流程 ');
								dealCrossProxy(childifrms[j].name,childOrign,ifmHeadlins2,flag);
							}
						}
					}				
				}
			}else{
				if(ifmHeadlins.length>0){
						console.log('跨域访问: 系统将进入跨域访问代理处理流程 ');
						dealCrossProxy(ifrm.name,crossOrign,ifmHeadlins,flag);
				}
			}			
		},	
	    goToURL:function(url){
			dhByBreadcrumb = true;//全局变量，声明此次事件是由点击面包屑发起的
			var showNav=openoFrameWork.getLocationURLParameter('showNav');
			if(showNav=="false"){//如果不显示菜单,就强制刷新本页
				location.reload();
			}else{
	           url="a[name='"+url+"']";
               $(url).click(); 
			}
         },
		goToURLByName:function(name){
	        var showNav=openoFrameWork.getLocationURLParameter('showNav');
			if(showNav=="false"){//如果不显示菜单,就强制刷新本页
				location.reload();
			}else{
				url="a[name='"+name+"']";
				$(url).click(); 
			}	
		},
		goToURLByID:function(id){
			if(!id){
				return;
			}  
			var showNav=openoFrameWork.getLocationURLParameter('showNav');
			if(showNav=="false"){//如果不显示菜单,就强制刷新本页
				location.reload();
			}else{
				if(id.indexOf("#")<0){
					id="#"+id;        
				}
				$(id).click(); 
			}
        },
		goToPortal:function(id){
			var _url=top.location.href;
			console.log(_url);
			//_url="/ngict/iui/framework/";
			var url=$.url(_url);
			top.location=url.attr("directory")+"uifportal.html#"+id+"/";
		},
		//Category
		goToURLByIDAndNewIPPort:function(id,newIPPort,newActionStr){
			//先把NewIPPort对象:newIPPort={menuCategoryID:'vim',ipPortStr:'htpp://10.74.151.123:31180',newTitle:''}缓存到Category数组中，
			//menuCategoryID属性是更多菜单上配置的菜单的分类id，;
			//ipPortStr属性是该id的菜单要替换的新的ip和端口地址字符串，包括协议部分，比如http://10.74.151.64:21169
			//newTitle属性用于放置新开ip的页面对应到面包屑上的名字，可以为“”，空标识不关注
			_menuCategorys.replace(newIPPort.menuCategoryID,{ipPort:newIPPort.ipPortStr,ipTitle:newIPPort.newTitle});//把当前面包削中的菜单id和该子菜单对应的父菜单关联缓存起来
			if (store) {
                store('menuCategoryID', newIPPort.menuCategoryID+"[menuCategoryID]"+newIPPort.ipPortStr+"[menuCategoryID]"+(!!newIPPort.newTitle?newIPPort.newTitle:""));
            }
			//这里增加按照newIPPort.menuCategoryID分类加载more菜单的处理逻辑
			//首先根据id找到对应的主菜单菜单项
			var menuitem = this.findMenuItemByMenuId(id);	
			if(!menuitem||menuitem.length<=0){//主菜单中没有找到，就找more菜单，找到id对应的more菜单项所属的主菜单项
				var mainMenuId = this.getMenuItemId_From_MoreMenuRelation(id);	
				if( !!mainMenuId&&mainMenuId.length>0 ){//more菜单中找到了id对应的主菜单项id，根据id返回主菜单项
					menuitem = this.findMenuItemByMenuId(mainMenuId);
					if(!!menuitem&&menuitem.length>0){
						var more=$("#"+id,$('#pageableDiv')).parent();
						$(".box.boxOperation", $(".carousel-inner")).removeClass("moreButtonSelected");
						more=$('a>div.box',more);
						if (more.hasClass('moreButtonSelected') == false){
							more.addClass('moreButtonSelected');
						}
						var pagesTags=$('.item.moreButtonsTag');
						if(pagesTags.length>0){
							for(var i=0;i<pagesTags.length;i++){
								var tags=$(pagesTags[i]);
								tags.removeClass('active');					
								if($('.moreButtonSelected',tags).length>0){
									tags.addClass('active');
								}
							}
						}	
					}					
				}
			}						
			//其次找到的菜单项中newIPPort.menuCategoryID对应的src覆盖breadcrumgroupbuttonsrc属性值，
			if(!!menuitem&&menuitem.length>0){
				var mulsrc=menuitem.attr(newIPPort.menuCategoryID+"-multiInsrc");
				if(!!mulsrc){
					menuitem.attr("breadcrumgroupbuttonsrc" ,mulsrc);
					getBreadcrumbRightButtons(mulsrc,true);
				}				
			}
			if (waittime) {
                    clearInterval(waittime);
            }
            waittime = setInterval(function () {
                    if(moreMenusisLoaded==true){
						clearInterval(waittime);
						openoFrameWork.goToURLByIDAndNewAction(id,newActionStr,null);
					}
                }, 10); 
		},
		goToURLByIDAndNewAction:function(id,newActionStr,newBrowserPageOption){
			if(!id){
				return;
			}

			/*if(id.indexOf("#")<0){
				id="#"+id;        
			}*/
			var menuitem = this.findMenuItemByMenuId(id);
			//处理新开页面情况
            if(newBrowserPageOption){
                var href = ICTFRAME_CONST_DEFAULTPAGE_PATH;
                var hash = getLocationHashByMenuId(id);
                var newin=window.open(href + newBrowserPageOption.paramStr + hash,newBrowserPageOption.windowTitle);
					newin.name=newActionStr;//注意这种传递参数的方法，被打开的页面中需要通过top.name中获取该传递的参数。
                return;
            }
			//$(window).off('hashchange', loadCurrentHash);				
			var menuItemID=menuitem?menuitem.attr("id"):"";
			if(!!menuItemID&&menuItemID.length>0){
				//menuItemID="#" + menuItemID;
				//menuItemID=!!newActionStr?menuItemID:menuItemID+"/no";
				_setLocationHash(menuItemID);					
			}
			var breadcrumbBtnMenuItemParent="";
			if(!menuitem||menuitem.length<=0){//没有找到该菜单，可能是面包削中的，需要额外处理
				menuItemID=id;
				if (breadcrumbBtnMenus.contains(menuItemID)) {//有缓存
					breadcrumbBtnMenuItemParent=breadcrumbBtnMenus.items(menuItemID);
					menuitem=this.findMenuItemByMenuId(breadcrumbBtnMenuItemParent);	
					//_breadcrumbSource=true;
				}
				// else{//在新增的可翻页的更多菜单里面找
					// var pageDiv = $('#pageableDiv');
					// menuitem=$('#' + menuItemID , pageDiv);
				// }
				if( menuitem && menuitem.length > 0){
					isMoreMenuItemClick = true;		
				}
			}
			if(!menuitem||menuitem.length<=0){
				//面包屑和主菜单都没有找到，情况可能是：更多菜单点击打开后，刷新，hash已经更改，但是对应的更多菜单的html没有加载，需要找到更多菜单和主菜单的对应关系
				var mainMenuId = this.getMenuItemId_From_MoreMenuRelation( id );
				if( mainMenuId ){
					menuitem = this.findMenuItemByMenuId(mainMenuId);
				}
				
			}
			if (store&&store("globleCurrentBreadcrumb")){
				 globleCurrentBreadcrumb=store("globleCurrentBreadcrumb");
				 //下面处理下刷新整个页面后从cookie中获取来的最后一次操作的面包屑对应的对应菜单的name属性回写，便于面包屑事件响应能够找到对应的菜单
				 var al=$("a",$("<div>"+globleCurrentBreadcrumb+"</div>"));
				 var alink,gal;
				 for(i=0;i<al.length;i++){
					alink=$(al[i]);
					gal=$("a[id='"+alink.attr("id")+"']");//从整个页面查找
					for(j=0;j<gal.length;j++){
						$(gal[j]).attr("name",alink.attr("name"));
					}
				 }
			}
			if(menuitem&&menuitem.length>0){
				var panel = $('.zte-theme-panel');
				var navPosOption = $('.nav-pos-direction', panel).val();
				if(navPosOption === openoFrameWork_menu_fmenu){
					var hparentid=menuitem.attr("hparentid");
					var id=menuitem.attr("id");
					var i=0,menuItemH=menuitem;
					while (id!=hparentid&&i<20){
						menuItemH=openoFrameWork.findMenuItemByMenuId(hparentid);
						hparentid=menuItemH.attr("hparentid");
						id=menuItemH.attr("id");
						i++;
					};
					if(!menuItemH.hasClass('active'))
						menuItemH.parent().addClass("active");
				}
			}else{
				console.log("goToURLByIDAndNewAction():Can't find the menuitem.The menu ID is:"+id+".Please check if the ID or ID cache is correct.");
			}
			//try{
				var parm=undefined;
				if(!!newActionStr&&breadcrumbBtnMenuItemParent&&breadcrumbBtnMenuItemParent.length>0){
					parm={action:newActionStr,breadcrumbBtnMenuItem:menuItemID};
				}else if(!!newActionStr){
					parm={action:newActionStr};
				}else if(breadcrumbBtnMenuItemParent&&breadcrumbBtnMenuItemParent.length>0){
					parm={breadcrumbBtnMenuItem:menuItemID};
				}else if(mainMenuId){
					isMoreMenuItemClick = true;		
					parm={breadcrumbBtnMenuItem:menuItemID};
				}
				//if(breadChangeType){
				//	if(!parm){
				//		parm = {};
				//	}
				//	parm.breadChangeType = breadChangeType;
				//}
				if(parm&&parm.action || parm&&parm.breadChangeType) {
					_hashSource="dhByInterface";
				}
				
				if(menuitem&&menuitem.length>0){
					menuitem.one('click',parm,function(e){	//临时一次性的注册一次click事件处理函数，执行完毕会自动删除			
						openoFrameWork.dealAtoIframe($(this),e);
						//$(window).one('hashchange', loadCurrentHash);
						return false;
					}); 
					menuitem.click();//后执行	
				}					
			/*}catch(e){}
			finally{
				//$(window).on('hashchange', loadCurrentHash);
			}*/				
        },

        getBreadcrumbEle:function(){
            return $('.breadcrumbUl')[0];
        },


        findMenuItemByMenuId:function( id ){
			var menuitem=undefined;
			var panel = $('.zte-theme-panel');
			var navPosOption = $('.nav-pos-direction', panel).val();			
			
			var items = undefined;
			if (navPosOption === "vertical"){ //从垂直菜单里面找
				items=$("#page-sidebar-menu a[id='"+id+"']");
			}else if(navPosOption === openoFrameWork_menu_horizontal){//从水平菜单里面找
				items=$("#main_hormenu a[id='"+id+"']");
				if(items.length == 0){
                    //横菜单没有找到，再在横菜单的子菜单找一次
                    items=$("#page-megachild-sidebar-menu a[id='"+id+"']");
                }
			}else if(navPosOption === openoFrameWork_menu_fmenu){
                items=$("#f_hormenu a[id='"+id+"']");
                if(items.length == 0){
                    //横菜单没有找到，再在竖菜单找一次。
                    items=$("#page-f-sidebar-menu a[id='"+id+"']");

                }
				
            }
			if( items&&items.length == 0 ){
					console.log( 'fmenu alink length is :' + $("#page-f-sidebar-menu a").length );
					console.log( 'cant find menu in sidemenu、megamenu and fmenu , the menu id is ' + id );					
			}
			if(items&&items.length>0){
				for(var i=0;i<items.length;i++){
					if($(items[i]).parentsUntil('.header-inner').hasClass('hor-menu')){
						menuitem=$(items[i]);
						break;
					}else if($(items[i]).parentsUntil('.page-container').hasClass('page-sidebar')){
						menuitem=$(items[i]);
						break;
					}
				}
			}
			return menuitem;
		},
		
		getMenuItemId_From_MoreMenuRelation:function( id ){
			var panel = $('.zte-theme-panel');              
			var navPosOption = $('.nav-pos-direction', panel).val();
			var mainMenuId = null;
			if (navPosOption === openoFrameWork_menu_vertical){
				relationAry=sideBarMenu_to_moreMenu_frame;					
			}else if(navPosOption === openoFrameWork_menu_horizontal){
				relationAry=horBarMenu_to_moreMenu_frame;
			}else if(navPosOption === openoFrameWork_menu_fmenu){
				relationAry=horBarMenu_to_moreMenu_frame;
			}				
			if ( !relationAry || !id ){
				return;
			}
			for ( var i = 0 ; i < relationAry.length ; i++ ){
				var eachMain = relationAry[i];
				var moreMenuIds = eachMain.moreMenuIds;
				for ( var j = 0 ; j < moreMenuIds.length ; j++ ){
					if( moreMenuIds[j] && moreMenuIds[j] == id ){
						return eachMain.mainMenuId;
					}
				}
			}
			return null;			
		},
		
		getMenuItemFoucsByID : function (id) {
		    if(!id){
				return;
			}
			var menuitem=undefined;
			// var items=$("a[id='"+id+"']");
			var items = undefined;
			var panel = $('.zte-theme-panel');
			var navPosOption = $('.nav-pos-direction', panel).val();
            if (navPosOption === "vertical"){ //从垂直菜单里面找
                items=$("#page-sidebar-menu a[id='"+id+"']");
            }else if(navPosOption === openoFrameWork_menu_horizontal){//从水平菜单里面找
                items=$("#main_hormenu a[id='"+id+"']");
                if(items.length == 0){
                    //横菜单没有找到，再在横菜单的子菜单找一次
                    items=$("#page-megachild-sidebar-menu a[id='"+id+"']");
                }
            }else if(navPosOption === openoFrameWork_menu_fmenu){
                items=$("#f_hormenu a[id='"+id+"']");
                if(items.length == 0){
                    //横菜单没有找到，再在竖菜单找一次。
                    items=$("#page-f-sidebar-menu a[id='"+id+"']");

                }
            }
			if(items.length>0){
				for(var i=0;i<items.length;i++){
					if($(items[i]).parentsUntil('.header-inner').hasClass('hor-menu')){
						menuitem=$(items[i]);
						break;
					}else if($(items[i]).parentsUntil('.page-container').hasClass('page-sidebar')){
						menuitem=$(items[i]);
						break;
					}
				}
			}
			var breadcrumbBtnMenuItemParent="";
			if(!menuitem||menuitem.length<=0){//没有找到该菜单，可能是面包削中的，需要额外处理
				menuItemID=id;
				if (breadcrumbBtnMenus.contains(menuItemID)) {//有缓存
					breadcrumbBtnMenuItemParent="#"+breadcrumbBtnMenus.items(menuItemID);
					menuitem=$(breadcrumbBtnMenuItemParent);
				}
			}
			var parm = undefined;
			if (breadcrumbBtnMenuItemParent && breadcrumbBtnMenuItemParent.length > 0) {
			    parm = {
			        breadcrumbBtnMenuItem : menuItemID
			    };
			}
		    if (menuitem && menuitem.length > 0) {
		        menuitem.one('click', parm, function (e) { //临时一次性的注册一次click事件处理函数，执行完毕会自动删除
		            var containerStr = $(this).parentsUntil('.page-container').hasClass('page-sidebar') ? 'page-sidebar' : ""; //
		            containerStr = $(this).parentsUntil('.header-inner').hasClass('hor-menu') ? 'header' : containerStr;
		            _isClicked = false;
		            dealMenuItemGetFocus($(this),e,containerStr);
		            return false;
		        });
		        menuitem.click(); //后执行
		    }
		},     
      // 处理面包削中的按钮菜单增加的导航连接，显示在iframe中
		openbreadcrumbLink:function(aObject,e) {
                var url = aObject.attr("href");
                if(!url||url.length<2)
                    return;
				e.preventDefault();				
                dealScrollTo(); 
				var menuItemID=aObject.attr("id");
				if(!!menuItemID&&menuItemID.length>0){
					_setLocationHash(menuItemID);	
					_hashSource="dhByInterface";
				}
					dealstartPageLoading();
    			   	dealIframe(aObject,e);
		},
		getURLParam:function(name){
            var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var search =decodeURIComponent(location.search.substring(1)).toLowerCase(); 
            var r =search.match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); 
            return null; //返回参数值
		}
    };
    
}();

var currentRunningScriptSrcPath = {};
//抽取html片段中任意位置的script标签（包括代码是内嵌的情况）逐个运行（不会在单个script加载不到的时候停下来）
function runHtmlScripts(s) {
	var div = document.createElement('div');
	div.innerHTML = s;
	var scripts = div.getElementsByTagName('script');				
	$(scripts).each(function(){
		var src = this.src;
		src=openoFrameWork.handlBaseURL(src);
		if(src){
			//存储当前Script标签的绝对路径以适应该js被其他系统跨域引用的情况
			currentRunningScriptSrcPath[src.substring(src.lastIndexOf("/") + 1)] = src.substring(0, src.lastIndexOf("/")+1);
			$.getScript(src);			
		}else{
			$.globalEval(this.text || this.textContent || this.innerHTML || '');
		}
	});
}
function stripHtmlScripts(s) {
	var div = document.createElement('div');
	div.innerHTML = s;
	var scripts = div.getElementsByTagName('script');				
	$(scripts).each(function(){
		/* if(this.src){
			$.getScript(this.src);
		}else{
			$.globalEval(this.text || this.textContent || this.innerHTML || '');
		} */
		this.src=openoFrameWork.handlBaseURL(this.src);
		this.parentNode.removeChild(this);
	});
	return div.innerHTML;
}
function getsiderBarMenu(url){
    if (url.length<2){
        return;
    }
	url=openoFrameWork.handlBaseURL(url);	   
    openoFrameWork.startPageLoading();//菜单加载中请稍候....
    var pagesidebar=$('#page-sidebar-menu');
    pagesidebar.empty();
    pagesidebar.append("<li class='sidebar-toggler-wrapper'><div class='sidebar-toggler hidden-xs hidden-sm'></div></li>");
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        dataType: "html", 
        success: function (res) {		
			//去除script标签以后添加到主框架以防止append方法因为加载script标签失败导致后面的代码无法运行
			//res = stripHtmlScripts(res);
			var resScriptsSriped = stripHtmlScripts(res);
            pagesidebar.append(resScriptsSriped);
			runHtmlScripts(res);			
			
            siderBarMenuAuthentication();
            dealMysqlBackupMenu();
            //loadi18n_WebFramework_sideMenu();
			setTimeout(function () {
                openoFrameWork.stopPageLoading();
			    goToHomePage();
            }, 1000);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //$('#page-sidebar-menu').append('<h4 class="nav-load-error">'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');//加载系统菜单失败!;//加载系统菜单失败!
        }
    });
};
var setLayoutValueByCookie = function () {
	    var panel = $('.zte-theme-panel');
	    if (store('layout-option') != undefined) {
	        $('.layout-option', panel).val(store('layout-option'));
	    }
		if (store('language-option') != undefined) {
	        $('.language-option', panel).val(store('language-option'));
	    }
		if (store('sidebar-option') != undefined) {
	        $('.sidebar-option', panel).val(store('sidebar-option'));
	    }
		if (store('header-option') != undefined) {
	        $('.header-option', panel).val(store('header-option'));
	    }
		if (store('sidebar-pos-option') != undefined) {
	        $('.sidebar-pos-option', panel).val(store('sidebar-pos-option'));
	    }
		var horMenuLoadTip = $("[class='nav-load-error']", $(".hormenu"));
		var sideMenuLoadTip = $("[class='nav-load-error']", $("[class='page-sidebar-menu']"));
		// 横竖菜单都无错误提示,都正确加载
	//	if ((!horMenuLoadTip || horMenuLoadTip.length <= 0) && (!sideMenuLoadTip || sideMenuLoadTip.length <= 0)) {
			// if (store('nav-pos-direction') != undefined) {
				// var navPosOption = store('nav-pos-direction');
				// $('.nav-pos-direction', panel).val(navPosOption);
			// } else {
				$('.nav-pos-direction', panel).val('fmenu');
				// $.ajax({
					// "dataType" : 'json',
					// "type" : "GET",
					// "async" : false,
					 // url : FrameConst.REST_GET_FRAME_MENUDIRECTION + "&tmpstamp=" + new Date().getTime(),
					// "success" : function (obj) {
						// if (obj.value && (obj.value != "")) {
							// $('.nav-pos-direction', panel).val(obj.value);
						// }
					// }
				// });
			//}
		// } else {
			// $('.nav-pos-direction', panel).attr("disabled", true);
		// }
}
function getHorMenu(url){
	setLayoutValueByCookie();
    if (url.length<2){
        return;
    }
	url=openoFrameWork.handlBaseURL(url);    
    openoFrameWork.startPageLoading();//菜单加载中请稍候....	
    var pagehorbar=$('#main_hormenu')
    pagehorbar.empty();
    $.ajax({
        type: "GET",
        async : false,
        cache: false,
        url: url,
        dataType: "html", 
        success: function (res) {
			//去除script标签以后添加到主框架以防止append方法因为加载script标签失败导致后面的代码无法运行
			//res = stripHtmlScripts(res);
			var resScriptsSriped = stripHtmlScripts(res);			
            $('#main_hormenu').append(resScriptsSriped);
			runHtmlScripts(res);
			// 增加mysql判断，如果数据库为mysql，去掉基础数据备份功能菜单项
			var dbType = openoFrameWork_conf.dbType;
			if (dbType == "mysql") {
				var item=$(".hor-menu a[id='uep-ict-backup-baseDataBack']");
				item.parent().remove();
			}
            horMenuAuthentication('main_hormenu');
            openoFrameWork.stopPageLoading();
			if($('.nav-pos-direction', panel).val() === "horizontal"){
			setTimeout(function () {
                //goToHomePage();//注意这里由于水平和左边栏菜单都在一个页面中出现，所以这里只调用一次
            }, 150);
			}
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //$('#main_hormenu').append('<h4 class="nav-load-error">'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');//加载系统菜单失败!
			var pcontent = $("[class='page-content']");
			//pcontent.css("marginLeft",225);
			$('.nav-pos-direction', panel).attr("disabled", true);
        }
    });
};
//加载横菜单的子菜单，加到左边的siderbar里面
function getMegaFMenu( url ){
    if (url.length<2){
        return;
    }
	url=openoFrameWork.handlBaseURL(url);       
    openoFrameWork.startPageLoading();//菜单加载中请稍候....	
    var siderDiv =$( '#' + megaSiderDivId );
    siderDiv.empty();
	siderDiv.append("<li class='sidebar-toggler-wrapper'><div class='sidebar-toggler hidden-xs hidden-sm'></div></li>");
    $.ajax({
        type: "GET",
        async : false,
        cache: false,
        url: url,
        dataType: "html", 
        success: function (res) {
			//去除script标签以后添加到主框架以防止append方法因为加载script标签失败导致后面的代码无法运行			
			var resScriptsSriped = stripHtmlScripts(res);			
            siderDiv.append(resScriptsSriped);
			runHtmlScripts(res);
            FMenuAuthentication( megaDivId ,megaSiderDivId );
			rebuildHorMenu();
			ajustFMenu( megaDivId ,megaSiderDivId );
            openoFrameWork.stopPageLoading();			
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //siderDiv.append('<h4 class="nav-load-error">'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');//加载系统菜单失败!
			//var pcontent = $("[class='page-content']");
			//pcontent.css("marginLeft",225);
        }
    });
}

function iniHorMenu(){
    var hormenu=$('#main_hormenu');
	if(!hormenu) return;
    var url=hormenu.attr("menuSrc");
    if(url&&url.length>0){
       getHorMenu(url);
    }
	//
	var megaFMenu = $('#'+megaSiderDivId);
	if(!megaFMenu) return;
    var url = 	megaFMenu.attr("menuSrc");
	if(url&&url.length>0){
       getMegaFMenu(url);
    }
};
function iniFMenu(){
    var fhormenu=$('#f_hormenu');
    var fsidemenu=$('#page-f-sidebar-menu');
    if(!fhormenu || !fsidemenu) return;
    var urlmega=fhormenu.attr("menuSrc");
    var urlsider=fsidemenu.attr("menuSrc");
    if(urlmega&&urlmega.length>0 && urlsider && urlsider.length > 0){
        getFMenu(urlmega , urlsider);
    }
};
function getFMenu( urlMega , urlSider ){
    if (urlMega.length<2 || urlSider.length<2){
        return;
    }
	urlMega=openoFrameWork.handlBaseURL(urlMega);
    urlSider=openoFrameWork.handlBaseURL(urlSider);		
    openoFrameWork.startPageLoading();//菜单加载中请稍候....
    var fhorbar=$('#f_hormenu');
    fhorbar.empty();
    var fSideBar= $("#page-f-sidebar-menu");
    fSideBar.empty();
    $.ajax({
        type: "GET",
        async : false,
        cache: false,
        url: urlMega,
        dataType: "html",
        success: function (res) {
			var resScriptsSriped = stripHtmlScripts(res);
            $('#f_hormenu').append(resScriptsSriped);
            horMenuAuthentication('f_hormenu');
			runHtmlScripts(res);
            dealMysqlBackupMenu();
            openoFrameWork.stopPageLoading();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#f_hormenu').append('<h4 class="nav-load-error">'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');//加载系统菜单失败!
            var pcontent = $("[class='page-content']");           
			$('.nav-pos-direction', panel).attr("disabled", true);
        }
    });
    var fpagesidebar=$('#' + fMenuSiderDivId);
    fpagesidebar.empty();
    fpagesidebar.append("<li class='sidebar-toggler-wrapper'><div class='sidebar-toggler hidden-xs hidden-sm'></div></li>");
    $.ajax({
        type: "GET",
        cache: false,
        url: urlSider,
        dataType: "html",
        success: function (res) {
			var resScriptsSriped = stripHtmlScripts(res);
			fpagesidebar.append(resScriptsSriped);
            //先全部隐藏，后面根据与hash的匹配情况来显示
            fpagesidebar.children().css('display','none');
			runHtmlScripts(res);
            dealMysqlBackupMenu();
            FMenuAuthentication( fMenuMegaDivId ,fMenuSiderDivId );
			ajustFMenu( fMenuMegaDivId ,fMenuSiderDivId );				
            openoFrameWork.stopPageLoading();
            loadi18n_WebFramework_sideMenu();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('.page-f-sidebar-menu').append('<h4 class="nav-load-error">'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');//加载系统菜单失败!;//加载系统菜单失败!
        }
    });
};
function iniSidebarMenu(){
	var sidermenu=$('#page-sidebar-menu');
	if(!sidermenu) return;
    var url=sidermenu.attr("menuSrc");
    if(url&&url.length>0){
       getsiderBarMenu(url);
    }          
};
function getChangePWDDlg(url){
    if (url.length<2){
        return;
    }
    openoFrameWork.startPageLoading();//加载中....
    var pageChangepasswd=$('.modal-dialog .Changepasswd');
    pageChangepasswd.empty();
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        dataType: "html", 
        success: function (res) {
            $('.modal-dialog .Changepasswd').append(res);
            ChangePWD.init();
            openoFrameWork.stopPageLoading();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('.modal-dialog .Changepasswd').append('<h4>'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadchgpwdpageError')+'</h4>');//加载修改密码页面失败!
        }
    });
};
function iniChangePWDDlg(){
    var url=$('.modal-dialog .Changepasswd').attr("dlgsrc");
    if(url&&url.length>0){
        getChangePWDDlg(url);
    }
};
function getHeaderMenu(url){
    if (url.length<2){
        return;
    }
    openoFrameWork.startPageLoading();//加载中请稍候....
    var headerMenu=$('#headerMenu');
    headerMenu.empty();
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: url,
        dataType: "html", 
        success: function (res) {
            $('#headerMenu').append(res);
            openoFrameWork.stopPageLoading();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //$('#headerMenu').append('<h4>'+$.i18n.prop('com_zte_ums_ict_framework_ui_loadmenuerror')+'</h4>');//加载系统菜单失败!
        }
    });
};
function goToHomePage(){
    locationhash = openoFrameWork.getLocationHash();
	if(!!locationhash&&locationhash.length>0){//有锚点，直接触发
		var newIPPort=null;				
		if (store&&store('menuCategoryID')) {
			var s=store('menuCategoryID').split('[menuCategoryID]');
			if(s.length>2){
			   newIPPort={menuCategoryID:s[0],ipPortStr:s[1],newTitle:s[2]};
			}				
        }
		if(!!newIPPort){
			openoFrameWork.goToURLByIDAndNewIPPort(locationhash,newIPPort,null);
		}else{
			openoFrameWork.goToURLByIDAndNewAction(locationhash,null,null);
		}
	}else{//否则还是模拟点击配置了start类的菜单
	    var containerStr = "";
		//var sidermenu = $("[class='page-sidebar-menu']", $("[class='page-sidebar navbar-collapse collapse']"));
		var sidermenu = $("#page-sidebar-menu");
		var hormenu = $("#main_hormenu");
        var fhormenu = $('#' + fMenuMegaDivId);
		var fhormenusider = $('#page-f-sidebar-menu');		
        var startmenu = null;
		var navPosOption = $('.nav-pos-direction', panel).val();		
		// 侧边栏显示，根据侧边栏CSS选择
		if (navPosOption === "vertical") {
		    //containerStr=$('.page-sidebar').length>0?'.page-sidebar':"";
            startmenu = $('.iframe.start' , sidermenu);
			dealStartMenu( startmenu, sidermenu );									
		}
		// 水平菜单显示，根据水平菜单CSS选择
		else if (navPosOption === "horizontal") {
		    //containerStr=$('.hor-menu').length>0?'.header':containerStr;
            startmenu = $('.iframe.start' , hormenu);
			dealStartMenu( startmenu, hormenu );

		}
        //F菜单的恒菜单显示
        else if (navPosOption === openoFrameWork_menu_fmenu) {
            //containerStr=$('.hor-menu').length>0?'.header':containerStr;
            startmenu = $('.iframe.start' ,fhormenu);
			if (startmenu && startmenu.length < 1) {
				startmenu = $('.iframe.start' ,fhormenusider);
			}
			dealStartMenu( startmenu, fhormenu,fhormenusider );			
        }
	}	
}; 
var dealStartMenu = function(startmenu , menuContainer,menuContainer2 ){
		var timer =setInterval(function () {
			if(startmenu&&startmenu.length>0){
				startmenu.click();
				clearInterval(timer);
			}else{
				console.log('the start menu click event is not be triggerd ,so do it repeat!!');
				$('a[operation]', menuContainer).each(function () {
					startmenu = $(this);
					return false;
				});
				if (menuContainer2&&startmenu && startmenu.length < 1) {
					$('a[operation]', menuContainer2).each(function () {
						startmenu = $(this);
						return false;
					});
				}
			}
		}, 100);
		handeCtxMenuitem();
	}
// 屏蔽横竖菜单项的右键功能
function handeCtxMenuitem() {
	$(".page-sidebar ul li a").each(function() {
		if ($(this).attr("href") && $(this).attr("href") != "javascript:;" && $(this).attr("href") != "#") {
			$(this).attr("oncontextmenu", "return false");
		}
	});
	$(".hormenu li a").each(function() {
		if ($(this).attr("href") && $(this).attr("href") != "javascript:;" && $(this).attr("href") != "#") {
			$(this).attr("oncontextmenu", "return false");
		}
	});
}
function initBaseInfo(){    
    $("#logout_label").text($.i18n.prop('com_zte_ums_ict_framework_ui_group_logout'));
    $("#fullscreen_label").text($.i18n.prop('com_zte_ums_ict_framework_ui_group_fullscreen'));
    $("#changePwd_label").text($.i18n.prop('com_zte_ums_ict_framework_ui_changePwd'));
    $("#com_zte_ums_ict_framework_moudle_about").text($.i18n.prop('com_zte_ums_ict_framework_moudle_about'));
	$("#com_zte_ums_ict_framework_moudle_help").text($.i18n.prop('com_zte_ums_ict_framework_moudle_help'));
	$("#zte_menu-toggler").attr("title",$.i18n.prop('com_zte_ums_ict_framework_moudle_menutoggler'));	
};
window.closeModal = function(modalid) {
    if(!modalid){
       return;
    }    
    if(modalid.indexOf("#")<0){
      modalid="#"+modalid;        
    }
    $(modalid).modal('hide');  
};
function getLcsRight(lcsoperations) {
	var lcsrights = new Array();
	if (lcsoperations && (lcsoperations.length > 0)) {
		// 请求后台license value
		//----test data----
		// var testjson = '{"data":[{"id":"mylcs","name":"xxx","value":"false"}]}';
		// var testopt = eval('(' + testjson + ')');
		// var testarray = testopt.data;		
		//-----end test data---				
		var keys = {
			"keys" : lcsoperations
		};
		var jsonvalues = JSON.stringify(keys);
		var data = {
			"data" : jsonvalues
		};
		var url=FrameConst.REST_GETLICENSEINFO + "?tmpstamp=" + new Date().getTime();
		url=openoFrameWork.handlBaseURL(url);
		$.ajax({
			"dataType" : 'json',
			"type" : "GET",
			"async" : false,
			"url" : url,
			"data" : data,
			//"contentType" : 'application/json; charset=utf-8',
			"success" : function (response) {
				if (response) {
					lcsrights = response.data;
				}
			},
			"error" : function (XMLHttpRequest, textStatus, errorThrown) {
				lcsrights = null;
			}
		});
		return lcsrights;
	}
	return lcsrights;
}
// 侧边栏菜单鉴权
function siderBarMenuAuthentication() {
	// license 鉴权
	var menuids = new Array();
	var lcsoperations = new Array();
	//从页面DOM取得菜单license项。
	$('a[licenseid]', $('.page-sidebar-menu')).each(function () {
		var licenseid = $(this).attr("licenseid");
		if (licenseid) {
			lcsoperations.push(licenseid);
			var id = $(this).attr("id");
			menuids.push(id);
		}
	});
	var lcsrights = getLcsRight(lcsoperations);// 取得license数据。
	if (lcsrights && (lcsrights.length == menuids.length)) {
		// 根据后台license值判断所在菜单项是否显示
		for (var i = 0; i < menuids.length; i++) {
			var id = menuids[i];
			var lcskey = lcsoperations[i];
			var lcsitem = lcsrights[i];
			// 菜单项如果配了licenseid, 并且不是true字符串, 则移除菜单项
			if (lcsitem.value != "True") {
				$('#'+id, $('.page-sidebar-menu')).parent().remove();
			}
		}
	}	
    var operations = new Array();
    $('a[operation]', $('.page-sidebar-menu')).each(function () {
        var operation = $(this).attr("operation");
		if (operation) {
			operations.push(operation);
		}
    }); // 遍历菜单项，提取所有的操作码
    var rightObj = getAllOperCodeRights(operations); // 对操作码进行鉴权判断
    $('a[operation]', $('.page-sidebar-menu')).each(function () {
        var operation = $(this).attr("operation");
		if (operation) {
			if (!hasRight(operation, rightObj)) {
				$(this).parent("li").remove(); // 删除没有权限的菜单项
			}
		}
    });
    rebuildSiderBarMenu();
};
// 横向菜单栏鉴权
function horMenuAuthentication( horMenuId ) {
	// license 鉴权
	var menuids = new Array();
	var lcsoperations = new Array();
	//从页面DOM取得菜单license项。
	$('a[licenseid]', $('#'+ horMenuId)).each(function () {
		var licenseid = $(this).attr("licenseid");
		if (licenseid) {
			lcsoperations.push(licenseid);
			var id = $(this).attr("id");
			menuids.push(id);
		}
	});
	var lcsrights = getLcsRight(lcsoperations);// 取得license数据。
	if (lcsrights && (lcsrights.length == menuids.length)) {
		// 根据后台license值判断所在菜单项是否显示
		for (var i = 0; i < menuids.length; i++) {
			var id = menuids[i];
			var lcskey = lcsoperations[i];
			var lcsitem = lcsrights[i];
			// 菜单项如果配了licenseid, 并且不是true字符串, 则移除菜单项
			if (lcsitem.value != "True") {
				$('#'+id, $('#'+ horMenuId)).parent().remove();
			}
		}
	}
    var operations = new Array();
    $('a[operation]', $('#'+ horMenuId)).each(function () {
        var operation = $(this).attr("operation");
		if (operation) {
			operations.push(operation);
		}
    }); // 遍历菜单项，提取所有的操作码
    var rightObj = getAllOperCodeRights(operations); // 对操作码进行鉴权判断
    $('a[operation]', $('#'+ horMenuId)).each(function () {
        var operation = $(this).attr("operation");
		if (operation) {
			if (!hasRight(operation, rightObj)) {
				$(this).parent("li").remove(); // 删除没有权限的菜单项
			}
		}
    });
    rebuildHorMenu();
};
//根据F菜单的竖菜单来调整横菜单。获取hparentid相同的竖菜单中的第一个，来更新横菜单上对应父亲菜单的href、catchnum等信息
function ajustFMenu(megaBarDivId , siderbarDivId){
    var hparentIds = {};
    $('a[hparentid]', $('#'+ siderbarDivId)).each(function () {
        var hparentId = $(this).attr("hparentId");
        var parentMenu = $('a[id = ' + hparentId + ']', $('#' + megaBarDivId));
        var oldAHref = parentMenu.attr("href");
        if (oldAHref == null || oldAHref.trim() == "#" || oldAHref == "javascript") {
            var hrefMenu = $(this);
            //竖菜单的第一级有可能是虚菜单，则找这个虚节点下面的第一个有href的菜单
            if(  $(this).attr('href') == null || $(this).attr('href') == "#" || $(this).attr('href') == "javascript:;"){
                $('a[href]', $(this).parent().children('ul')).each(function () {
                    hrefMenu = $(this);
                    if (hrefMenu != null && hrefMenu != "#" && hrefMenu != "javascript") {
                        return false; //跳出循环
                    }
                })
            }
            parentMenu.attr("href", hrefMenu.attr("href"));
            parentMenu.attr("shiftjs", hrefMenu.attr("shiftjs"));
            parentMenu.attr("cachenum", hrefMenu.attr("cachenum"));
			parentMenu.attr("iframeName", hrefMenu.attr("iframeName"));
			parentMenu.attr("xdomain", hrefMenu.attr("xdomain"));
			parentMenu.attr("cssSrc", hrefMenu.attr("cssSrc"));	
			parentMenu.attr("category", hrefMenu.attr("category"));				
            parentMenu.attr("breadcrumgroupbuttonsrc", hrefMenu.attr("breadcrumgroupbuttonsrc"));
            parentMenu.attr("operation", hrefMenu.attr("operation"));
            parentMenu.attr("iframeautoscroll", hrefMenu.attr("iframeautoscroll"));
        }
    });
}
function FMenuAuthentication(megaBarDivId , siderbarDivId){
    var beforeHparentId = {};
    $('a[hparentid]', $('#'+ siderbarDivId)).each(function(){
        var parentid = $(this).attr("hparentid");
        beforeHparentId[parentid] = 1;
    });
	checkFmenuRightByAttr('licenseid' , megaBarDivId , siderbarDivId , getLcsRight);
	checkFmenuRightByAttr('operation' , megaBarDivId , siderbarDivId,  getAllOperCodeRights);
    rebuildSiderBarMenu();
	var afterHparentId={};
    $('a[hparentid]', $('#'+ siderbarDivId)).each(function(){
        var parentid = $(this).attr("hparentid");
        afterHparentId[parentid] = 1;
    });
    //比较鉴权前后的父菜单差异，如果这个父菜单自己没有href属性，且鉴权后，所有的子菜单都没有权限，那么这个父菜单需要从界面上去掉
    for( var parentid in beforeHparentId ){
        if( afterHparentId[parentid] == null ){
            var parent = $('#'+ parentid , $('#'+ megaBarDivId));
            if(parent.attr('href') == null || parent.attr('href') == "javascript:;" || parent.attr('href') == "#"){
                parent.parent().remove();
            }
        }
    }
}
function checkFmenuRightByAttr( attrName, megaBarDivId , siderbarDivId ,callback ){
	// license 鉴权
	var menuids = new Array();
	var parentMenuId = new Array();
	var operations = new Array();
	//从页面DOM取得菜单license项。
	$('a['+ attrName+']', $('#'+ siderbarDivId)).each(function () {
		var attrValue = $(this).attr(attrName);
		if (attrValue) {
			operations.push(attrValue);
			var id = $(this).attr("id");
			menuids.push({'id':id });
		}
	});
	var rights = callback(operations);// 取得license数据。
	if (rights && (rights.length == menuids.length)) {
		// 根据后台license值判断所在菜单项是否显示
		for (var i = 0; i < menuids.length; i++) {
			var id = menuids[i].id;
			var hparentId =menuids[i].hParentId;
			var key = operations[i];
			var item = rights[i];
			// 菜单项如果配了licenseid, 并且不是true字符串, 则移除菜单项
			if (item.value != "True") {
				$('#'+id, $('#'+ siderbarDivId)).parent().remove();
			}
		}
	}
}
// “更多操作”分组按钮鉴权
function groupButtonAuthentication() {
	// license 鉴权
	var menuids = new Array();
	var lcsoperations = new Array();
	//从页面DOM取得菜单license项。
    $('a[licenseid]', $('.more-botton-zone > li.btn-group')).each(function () {
		var licenseid = $(this).attr("licenseid");
		if (licenseid) {
			lcsoperations.push(licenseid);
			var id = $(this).attr("id");
			menuids.push(id);
		}		
	});
	var lcsrights = getLcsRight(lcsoperations);// 取得license数据。
	if (lcsrights && (lcsrights.length == menuids.length)) {
		// 根据后台license值判断所在菜单项是否显示
		for (var i = 0; i < menuids.length; i++) {
			var id = menuids[i];
			var lcskey = lcsoperations[i];
			var lcsitem = lcsrights[i];
			// 菜单项如果配了licenseid, 并且不是true字符串, 则移除菜单项
			if (lcsitem.value != "True") {
                $('#'+id, $('.more-botton-zone > li.btn-group')).parent().remove();
			}
		}
	}
	// 增加mysql判断，如果数据库为mysql，去掉基础数据备份功能菜单项
	var dbType = openoFrameWork_conf.dbType;
	if (dbType == "mysql") {
        $("#uep-ict-backup-baseDataBack",$('.more-botton-zone > li.btn-group')).parent().remove();
	}	
    var operations = new Array();
    $('a[operation]', $('.more-botton-zone > li.btn-group')).each(function () {
        var operation = $(this).attr("operation");
		if (operation) {
			operations.push(operation);
		}
    }); // 遍历菜单项，提取所有的操作码
    var rightObj = getAllOperCodeRights(operations); // 对操作码进行鉴权判断
    $('a[operation]', $('.more-botton-zone > li.btn-group')).each(function () {
        var operation = $(this).attr("operation");
		if (operation) {
			if (!hasRight(operation, rightObj)) {
				$(this).parent("li").remove(); // 删除没有权限的菜单项
			}
		}
    });
    // 如果“更多菜单”下没有子菜单了，则删除整个“更多菜单”下拉框。
    if ($('li > a', $('.more-botton-zone > li.btn-group')).length == 0) {
        $('.more-botton-zone > li.btn-group').remove();
    }
};
// 删除没有子菜单的一级菜单，查看新菜单是否配了登录默认页面，如没有则指定第一个有权限的菜单作为登录后默认页面
function rebuildSiderBarMenu() {
    if ($('a.start').length == 0) {
        $('li > a[href!="javascript:;"]', $('.page-sidebar-menu')).eq(0).addClass("start");
    }
    $('ul.sub-menu', $('.page-sidebar-menu')).each(function () {
        if ($(this).has('li').length == 0) {
            $(this).parent("li").remove();
        }
    });
};
// 删除没有子菜单的一级菜单，查看新菜单是否配了登录默认页面，如没有则指定第一个有权限的菜单作为登录后默认页面
function rebuildHorMenu() {
    if ($('a.start').length == 0) {
        $('li > a[href!="#"]', $('#main_hormenu')).eq(0).addClass("start");
    }
    $('ul.mega-menu-submenu', $('#main_hormenu')).each(function () {
        if ($(this).has('li > a').length == 0) {
            $(this).remove(); // 删空的分组列
        }
    });
    //删除增加的分组div
    $('div.zteDivWidth', $('#main_hormenu')).each(function () {
        if ($(this).has('ul').length == 0) {
            $(this).remove(); // 删空的分组列
        }
    });
    $('ul.dropdown-menu', $('#main_hormenu')).each(function () {
        if ($(this).has('ul').length == 0) {
            $(this).parent("li").remove(); // 删空的一级菜单栏
        }
    });
    $('li.divider', $('#main_hormenu')).each(function () {
        if ($(this).next().hasClass('divider')) {
            $(this).remove(); // 连续出现分隔线则删除一个
        }
    });
    $('li.divider', $('#main_hormenu')).each(function () {
        if ($(this).next().length == 0) {
            $(this).remove(); // 如果分隔线在最后一行，则删除之
        }
    });
}
//获取页面菜单栏所有的操作码权限
function getAllOperCodeRights(operations) {
    var rights = new Array();
	if( operations && operations.length > 0 ){
		var data = {
			"operations" : operations
		};
		var sendData = JSON.stringify(data);
		var url=FrameConst.REST_CHECKRIGHT + "?data=" + sendData + "&tmpstamp=" + new Date().getTime();
		url=openoFrameWork.handlBaseURL(url);
		$.ajax({
			"dataType" : 'json',
			"type" : "GET",
			"async" : false,
			"url" : url,
			"data" : null,
			//"contentType" : 'application/json; charset=utf-8',
			"success" : function (response) {
				rights = response.value;
			},
			"error" : function (XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 401) {
					window.location.replace("login.html");
				 } else {
					console.log('Communication Error!');
				}
			}
		});
	}
    return {
        opCodes : operations,
        rights : rights
    };
};
// 判断操作码是否有权限
function hasRight(opCode, rightObj) {
    for (var i = 0; i < rightObj.opCodes.length; i++) {
        if (rightObj.opCodes[i] == opCode) {
            return (rightObj.rights[i] == true);
        }
    }
    return false;
};
// 处理mysql环境下备份菜单的合并问题
function dealMysqlBackupMenu() {
	var dbType = openoFrameWork_conf.dbType;
    if (dbType !== undefined && dbType !== "mysql") {
        return;
    }
    var sidermenu = $("[class='page-sidebar-menu']");
    var hormenu = $(".hormenu");
	//这段代码先这么写,html的位置不一定正确，如果后面位置不一致，再修改。
    if (sidermenu.length > 0 && $('#uep-ict-backup-dataBackup').length > 0) {
		$('#uep-ict-backup-dataBackup', sidermenu).attr("breadcrumGroupButtonSrc", ICTFRAME_CONST_DATABACKUP_PATH);
    }
	if (hormenu.length > 0 && $('#uep-ict-backup-dataBackup').length > 0) {
		$('#uep-ict-backup-dataBackup', hormenu).attr("breadcrumGroupButtonSrc", ICTFRAME_CONST_DATABACKUP_PATH);
        $('#uep-ict-backup-dataBackup').parent('li').attr('style', 'display:block');
        $('#uep-ict-backup-allDbStructBackup').parent('li').attr('style', 'display:none');
        $('#uep-ict-backup-baseDataBack').parent('li').attr('style', 'display:none');
    }
};
// 浏览器缩小后导航栏隐藏的情况下点击navbar-toggle显示菜单的前置工作，
// 浏览器缩小后导航栏隐藏的情况下点击navbar-toggle显示菜单的前置工作，
function dealMavToggle(navtoggle) {
    var sidermenu  = $("#page-sidebar-menu");
	var hormenu = $("#main_hormenu");
	var panel = $(".zte-theme-panel");
	var siderbarpos = $(".nav-pos-direction", panel).val()
	if ("hidden" == $(navtoggle).attr("navtoggledispattr")) {
		$(navtoggle).attr("navtoggledispattr", "display");
		sidermenu.css('display','block');//侧边栏显示
		hormenu.css("display", "none");//隐藏水平菜单栏		
	} else {
		$(navtoggle).attr("navtoggledispattr", "hidden");
		sidermenu.css('display','none');//侧边栏隐藏
		hormenu.css("display", "none");
	}	
};

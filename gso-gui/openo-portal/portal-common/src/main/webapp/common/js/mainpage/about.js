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
var iniAboutInfo = function() {

    //转换colomn

    var divId = "ict_about_table_div";
    var tableId = "abouttable";
    var column = [
        {"mData": "name", name: $.i18n.prop('com_zte_ums_ict_about_ppu_field_name'), "sWidth": '20%'},
        {"mData": "version", name: $.i18n.prop('com_zte_ums_ict_about_ppu_field_version'), "sWidth": '25%'},
        {"mData": "describe", name: $.i18n.prop('com_zte_ums_ict_about_ppu_field_desc'), "sWidth": '25%'},
        {"mData": "time", name: $.i18n.prop('com_zte_ums_ict_about_ppu_field_time'), "sWidth": '30%'}
    ];
    //先把原来的表格清空
    $('#' + divId).children().remove();
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= ' + tableId + '>'
        + '<thead>'
        + '<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        + '<tbody>'
        + '</tbody>'
        + '</table>';
    $('#' + divId).append(tableEleStr);
    var trEle = $('#' + tableId + ' > thead >tr');

    for (var one in column) {
        var th = '<th>' + column[one].name + '</th>';
        trEle.append(th);
    }
    var table = $("#" + tableId).dataTable({
        "bFilter": false,// 搜索栏
        "bPaginate":false,
        "bInfo":false,
        "bSort":false,
        'bAutoWidth':true
    });
    $.ajax({
        type: "GET",
        cache: false,
        url: FrameConst.REST_GET_VERSIONINFO,
        dataType: "json",
        success: function (data) {
            console.log(data);
            //主版本号
            $(".ict_main_version").append('<span>' + data.mainversion + '</span>');
            //表格数据填充
            for( var i = 0 ; i < data.ppuinfo.length ; i++ ) {
                var eachPPU = data.ppuinfo[i];
                $('#'+ tableId).dataTable().fnAddData([eachPPU.name ,eachPPU.version ,eachPPU.describe , eachPPU.time ]);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
           
        }
    });
};

function internationalization(){
    var lang = getLanguage();
    //加载国际化
    jQuery.i18n.properties({
        language:lang,
        name:'web-framework-mainPage-i18n',
        path:'i18n/', // 资源文件路径
        mode:'map', // 用 Map 的方式使用资源文件中的值
        callback: function() {// 加载成功后设置显示内容
            var i18nItems = $('[name_i18n=com_zte_ums_ict_framework_ui_i18n]' , '.aboutDlg');
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

function getAboutDlg(url){
    if (url.length<2){
        return;
    }
    openoFrameWork.startPageLoading();//加载中....
    var aboutDiv =jQuery('.modal-dialog .aboutDlg');
    aboutDiv.empty();
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        dataType: "html",
        success: function (res) {
            jQuery('.modal-dialog .aboutDlg').append(res);
            iniAboutInfo();
            internationalization();
            openoFrameWork.stopPageLoading();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            
        }
    });
};

function iniAboutDlg(){
    var url=jQuery('.modal-dialog .aboutDlg').attr("dlgsrc");
    if(url&&url.length>0){
        getAboutDlg(url);
    }
};

var ict_about_dlg_close = function(){
    link_click('about');
    console.log("about click close");
    $('#aboutDlg').modal('hide');
};
var link_click = function( pageName ){
    console.log("about click change");
    if(pageName === 'info'){
        $('.aboutmain').attr("style" , "display:none");
        $('.aboutinfo').attr("style" , "display:block");
    }else{
        $('.aboutmain').attr("style" , "display:block");
        $('.aboutinfo').attr("style" , "display:none");
    }
};

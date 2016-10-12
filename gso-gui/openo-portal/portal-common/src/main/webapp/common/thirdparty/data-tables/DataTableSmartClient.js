/***
 Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
 ***/
var DatatableICT = function () {

    var tableOptions;  // main options
    var dataTable; // datatable object
    var table;    // actual table jquery object
    var tableContainer;    // actual table container object
    var tableWrapper; // actual table wrapper jquery object
    var tableInitialized = false;
    var ajaxParams = []; // set filter mode
    var columns;
    var xsHiddenColumns;
    var smHiddenColumns;
    var columnMaxLength = 30;
    var columnsTooLong;
    var hidden_xs_maxWidth = 768;
    var hidden_sm_maxWidth = 991;

    var openRowFlag = false;
    var rowOverFlag = false;
    var rowCheckable = false;

    var aTargetsAll;
    var sTotalRecordsSource;
    var tableHeight;

    var includedInXsHiddenColumns = function(columnId){
        for(var i=0;i<xsHiddenColumns.length; i++ ){
            var column = xsHiddenColumns[i];
            if(columnId == column.columnId){
                return true;
            }
        }
        return false;
    }

    var includedInSmHiddenColumns = function(columnId){
        for(var i=0;i<smHiddenColumns.length; i++ ){
            var column = smHiddenColumns[i];
            if(columnId == column.columnId){
                return true;
            }
        }
        return false;
    }

    var countSelectedRecords = function() {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        var text = tableOptions.dataTable.oLanguage.sGroupActions;
        if (selected > 0) {
            $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        } else {
            $('.table-group-actions > span', tableWrapper).text("");
        }
    }

    var jsonObjectToArray = function(json, columns, iDraw){
        var jsonToDatatable = {aaData:[], sEcho:iDraw, iTotalRecords:0, iTotalDisplayRecords:0 };
        for(var i=0; i<json.response.data.length; i++){
            jsonToDatatable.aaData[i] = [];
            var resRowObject = json.response.data[i];
            if(rowCheckable){
                jsonToDatatable.aaData[i].push("<input type=\"checkbox\" name=\"id[]\" value=\"1\">");
            }
            if(openRowFlag){
                jsonToDatatable.aaData[i].push("<span class=\"row-details row-details-close\"></span>");
            }
            for(var j=0; j<columns.length; j++){

                if($(window).width() >= hidden_xs_maxWidth && $(window).width() < hidden_sm_maxWidth && includedInSmHiddenColumns(columns[j].columnId )){
                    /*隐藏pad尺寸需要隐藏的列*/
                }else if($(window).width() < hidden_xs_maxWidth && includedInXsHiddenColumns(columns[j].columnId )){
                    /*隐藏手机尺寸需要隐藏的列*/
                }else{
                    var currentColumnId = columns[j].columnId;
                    if(jQuery.inArray(currentColumnId, columnsTooLong) > -1){
                        var rawText = "";                        
                        for(var k=0;k<columnsTooLong.length;k++){
                            if(currentColumnId == columnsTooLong[k]){
                                rawText = resRowObject[currentColumnId];
                                break;
                            }
                        }
                        if(rawText.length > columnMaxLength){
                            jsonToDatatable.aaData[i].push(rawText.slice(0, columnMaxLength) + '...');
                        }else{
                            jsonToDatatable.aaData[i].push(resRowObject[currentColumnId]);
                        }
                    } else {
                        jsonToDatatable.aaData[i].push(resRowObject[currentColumnId]);
                    }

                }
            }
        }
        jsonToDatatable.sEcho++;
        var totalRow = 0;
        var totalRecordsSource = eval('json.' + sTotalRecordsSource);
        if(totalRecordsSource && totalRecordsSource.length >0){
            totalRow = parseInt(totalRecordsSource);
        }
        if(isNaN(totalRow)){
            alert('All rows counting number got fail!');
        }else{
            jsonToDatatable.iTotalRecords = totalRow;
            jsonToDatatable.iTotalDisplayRecords = totalRow;
        }
        return jsonToDatatable;
    }

    var singleAlarmDel = function(divOverlay){

        //根据浮动框的当前id获取需要删除的行
        var trId = divOverlay.attr('id_tr');
        tr=$('tr#' + trId);
        var tds =  $(tr).children();
        var tdAlarmId = $(tds.eq(2)).text();

        var data= {
            "alarmId":[parseInt(tdAlarmId)]
        };

        var sSource = "/web/rest/web/fm/curalarms?data=" + JSON.stringify(data) + "&_operationType=remove&_dataSource=isc_PageRestDataSource_0&isc_metaDataPrefix=_&isc_dataFormat=json";

        $.ajax( {
            "dataType": 'json',
            "type": "DELETE",
            "url": sSource,
            "data" : null,
            "contentType" : 'application/json; charset=utf-8',
            "success": function(json) {
                if(json.response.status == 0){
                    var resRowObject = json.response.data[0];
                    //alert('删除成功');
                }
                if(json.response.status == -1){
                    //alert('删除失败');
                }
            },
            "error": function() {
                alert('Communication Error!');
            }
        } );
    }

    var singleAlarmAckUnAck = function(divOverlay, ackType){

        //根据浮动框的当前id获取需要确认的行
        var trId = divOverlay.attr('id_tr');
        var tr = $('tr#' + trId);

        //取得隐藏的头部表格的相应行
        var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable');
        //var trHead = $('tbody > tr:nth-child(' + trId + ')', $tableHead);
        var trHead = $('tr#' + trId.replace('body', 'head'), $tableHead);
        var tdDivs = $('td > div', trHead);

        var tds =  $(tr).children();
        var tdAlarmId = "";
        if(rowCheckable){
            tdAlarmId = $(tds.eq(2)).text();
        }else{
            tdAlarmId = $(tds.eq(1)).text();
        }

        var aoData =
        {
            "dataSource":"isc_PageRestDataSource_0",
            "operationType":"update",
            "componentId":"isc_com_zte_ums_aos_fm_view_eventview_table_AlarmTable_0",
            "data":{
                "viewType":1,
                "state":ackType,
                "alarmId":[
                    parseInt(tdAlarmId)
                ]
            },
            "oldValues":null
        };

        var sSource = "/web/rest/web/fm/curalarms?isc_dataFormat=json";

        $.ajax( {
            "dataType": 'json',
            "type": "PUT",
            "url": sSource,
            "contentType": 'application/json; charset=utf-8',
            "data": JSON.stringify(aoData),
            "success": function(json) {
				json = AlarmLabels.transformFieldNames(json);
                if(json.response.status == 0){
                    var resRowObject = json.response.data[0];
                    var columnsCopy = $.extend(true, [], columns);
                    //隐藏列的情况下需要特殊处理
                    if($(window).width()>=hidden_xs_maxWidth && $(window).width()<hidden_sm_maxWidth){
                        columnsCopy = [];
                        for(var i=0;i<columns.length;i++){
                            if(!includedInSmHiddenColumns(columns[i].columnId)){
                                columnsCopy.push(columns[i]);
                            }
                        }
                    } else if($(window).width()<hidden_xs_maxWidth){
                        columnsCopy = [];
                        for(var i=0;i<columns.length;i++){
                            if(!includedInXsHiddenColumns(columns[i].columnId)){
                                columnsCopy.push(columns[i]);
                            }
                        }
                    }
                    var iIndex = 1;
                    if(rowCheckable){
                        iIndex = 2;
                    }
                    for(var i=iIndex;i<tds.length && (i-iIndex)<columnsCopy.length;i++){
                        var currentColumnId = columnsCopy[i-iIndex].columnId;
                        if(jQuery.inArray(currentColumnId, columnsTooLong) > -1) {
                            var rawText = "";                            
                            for(var k=0;k<columnsTooLong.length;k++){
                                if(currentColumnId == columnsTooLong[k]){
                                    rawText = resRowObject[currentColumnId];
                                    break;
                                }
                            }
                            if(rawText.length > columnMaxLength){
                                $(tds.eq(i)).html(rawText.slice(0, columnMaxLength) + '...');
                                $(tdDivs.eq(i)).html(rawText.slice(0, columnMaxLength) + '...');
                            }else{
                                $(tds.eq(i)).html(resRowObject[currentColumnId]);
                                $(tdDivs.eq(i)).html(resRowObject[currentColumnId]);
                            }
                        } else {
                            $(tds.eq(i)).html(resRowObject[currentColumnId]);
                            $(tdDivs.eq(i)).html(resRowObject[currentColumnId]);
                        }
                    }
                    //更新缓存中的当前行数据
                    for (var t = 0; t < dataTable.datas.length; t++) {
                        var temp = dataTable.datas[t];
                        if (temp.alarmId == resRowObject['alarmId']) {
                            dataTable.datas[t] = resRowObject;
                            break;
                        }
                    }
                }
                if(json.response.status == -1){
                    $('div#myModalConfirm').modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                    $('span#alarm_number').html(tdAlarmId);
                    //国际化信息
                    if(ackType==1){
                        $('span#aos_fm_alarm_opeater_ack_already').html($.i18n.prop('aos_fm_alarm_opeater_ack_already_ok'));
                    }else{
                        $('span#aos_fm_alarm_opeater_ack_already').html($.i18n.prop('aos_fm_alarm_opeater_ack_already_un'));
                    }
                }
            },
            "error": function() {
                alert('Communication Error!');
            }
        } );
    }

    var addRowOverlap = function(){
        var $tableData = $('table#datatable_ajax');
        //取得隐藏的头部表格的相应行
        var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable');
        var trHeads = $tableHead.find('tr').get();
        $.each( trHeads, function( index, trHead ){
            $(trHead).attr('id', 'headTableTR' + index);
        });
        //取得浮动div
        var $divOverlay = $('div#divOverlay');
        var divScrollHead = $('div.dataTables_scrollHead');
        var divRightPadding = $('div#divRightPadding');
        //取表头下边沿位置
        var tableHeadBottomHeight = $(divScrollHead).position().top + $(divScrollHead).height();
        var tableBottom = $tableData.position().top + $tableData.height();
        //取表格右边沿位置
        var tableRightEdgePosition = $(divRightPadding).position().left;
        var trs = $tableData.find('tr').get();
        $.each( trs, function( index, tr ){
            var tdEmpty = $('td.dataTables_empty',tr);
            if(!tdEmpty || tdEmpty.length ==0 ){
                $(tr).attr('id', 'bodyTableTR' + index);
				//$divOverlay.attr('id_tr', 'bodyTableTR' + index);
                $(tr).one('hover', function(){
                    var rowPos = $(tr).position();
                    var currentTrTop = rowPos.top;
                    //var bottomLeft = rowPos.left;
                    $divOverlay.attr('id_tr', 'bodyTableTR' + index);
                    $divOverlay.css({
                        display: 'block',
                        position: 'absolute',
                        'background-color': '#e5e5e5',
                        //opacity: 0.7,
                        border: 'solid 0px',
                        top: currentTrTop + 6,
                        left: tableRightEdgePosition - 308,
                        width: 300,
                        height: 30
                    });
                    //防止浮动框跳出表格内容区域
                    if( $divOverlay.position().top < tableHeadBottomHeight || $divOverlay.position().top + $divOverlay.height() > tableBottom){
                        $divOverlay.css('display', 'none');
                    }					
                    var buttonConfirm = $('div#buttonConfirm', $divOverlay);
                    var buttonUnConfirm = $('div#buttonUnConfirm', $divOverlay);
                    $(buttonConfirm).one('click', function(){
                        var buttonRoundedTDsConfirm = $(buttonConfirm).find('td.buttonRounded');
                        var buttonRoundedTDsUnConfirm = $(buttonUnConfirm).find('td.buttonRoundedDisabled');
                        if(buttonRoundedTDsConfirm && buttonRoundedTDsConfirm.length > 0){
                            $.each(buttonRoundedTDsConfirm, function(index, td){
                                $(td).removeClass('buttonRounded').addClass('buttonRoundedDisabled');
                            });
                            $.each(buttonRoundedTDsUnConfirm, function(index, td){
                                $(td).removeClass('buttonRoundedDisabled').addClass('buttonRounded');
                            });
                            $divOverlay.css('display', 'none');
                            singleAlarmAckUnAck($divOverlay, 1);
                        }
                    });
                    $(buttonUnConfirm).one('click', function(){
                        var buttonRoundedTDsUnConfirm = $(buttonUnConfirm).find('td.buttonRounded');
                        var buttonRoundedTDsConfirm = $(buttonConfirm).find('td.buttonRoundedDisabled');
                        if(buttonRoundedTDsUnConfirm && buttonRoundedTDsUnConfirm.length > 0){
                            $.each(buttonRoundedTDsUnConfirm, function(index, td){
                                $(td).removeClass('buttonRounded').addClass('buttonRoundedDisabled');
                            });
                            $.each(buttonRoundedTDsConfirm, function(index, td){
                                $(td).removeClass('buttonRoundedDisabled').addClass('buttonRounded');
                            });
                            $divOverlay.css('display', 'none');
                            singleAlarmAckUnAck($divOverlay, 2);
                        }
                    });
                    var buttonDelete = $('div#buttonDelete', $divOverlay);
                    $(buttonDelete).die().live('click', function(){
                        //弹出删除确认对话框
                        $('div#myModal').modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                        $('#delConfirm').die().live('click', function(){
                            $divOverlay.css('display', 'none');
                            dataTable.fnClose(tr);
                            $(tr).remove();
                            //删除表头表格的相应行
                            $('tr#' + $(tr).attr('id').replace('body', 'head'), $tableHead).remove();
                            //删除后端数据
                            singleAlarmDel($divOverlay);
                            //刷新表格
                            dataTable.fnAdjustColumnSizing();
                        });
                    });
					//展开行的情况隐藏
					$('td.details > table.detailTable').on('hover', function(){
						$divOverlay.css('display', 'none');
					});
				});				
            }
        });		
    }

    return {

        //main function to initiate the module
        init: function (options, columnsDefined, xsHiddenColumnsDefined, smHiddenColumnsDefined) {

            if (!$().dataTable) {
                return;
            }

            var the = this;

            //记录需要禁掉默认排序的列
            var aTargets = [];
            var targetsLength = columnsDefined.length;
            if(rowCheckable)targetsLength++;
            if(openRowFlag)targetsLength++;
            for(var i=0;i<targetsLength;i++){
                aTargets.push(i);
            }
            aTargetsAll = aTargets;

            // default settings
            options = $.extend(true, {
                src: "",  // actual table 
                filterApplyAction: "filter",
                filterCancelAction: "filter_cancel",
                resetGroupActionInputOnSuccess: true,
                dataTable: {
                    //"sDom" : "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-scrollable't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>r>>", // datatable layout

                    "aoColumnDefs" : [{  // define columns sorting options(by default all columns are sortable extept the first checkbox column)
                        'bSortable' : false,
                        'aTargets' : aTargets
                    }],

                    "bAutoWidth": false,   // disable fixed width and enable fluid table
                    //"bSortCellsTop": true, // make sortable only the first row in thead
                    "sPaginationType": "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                    "bProcessing": true, // enable/disable display message box on record load
                    "bServerSide": true, // enable/disable server side ajax loading
                    "sAjaxSource": "", // define ajax source URL 
                    //"sServerMethod": "GET",

                    // handle ajax request
                    "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
                        //for ICT Paging
                        //var startIndex = aoData[3].value;//"iDisplayStart"
                        //var pageLength = aoData[4].value;//"iDisplayLength"
                        var oPaging = oSettings.oInstance.fnPagingInfo();
                        //var startIndex = oPaging.iStart;
                        var pageLength = oPaging.iLength;
                        var curPageNo = oPaging.iPage + 1;

                        for(var k=aoData.length-1;k>=0;k--){
                            var flag = -1;
                            if(aoData[k].name=='pageSize'){
                                aoData[k].value=pageLength;
                                flag++;
                            }
                            if(aoData[k].name=='pageNo'){
                                aoData[k].value=curPageNo;
                                flag++
                            }
                            if(flag == 1)break;
                        }

                        oSettings.jqXHR = $.ajax( {
                            "dataType": 'json',
                            "type": "GET",
                            "url": sSource,
                            "data": aoData,
                            "success": function(res, textStatus, jqXHR) {
                                if (res.sMessage) {
                                    openoFrameWork.alert({type: (res.sStatus == 'OK' ? 'success' : 'danger'), icon: (res.sStatus == 'OK' ? 'check' : 'warning'), message: res.sMessage, container: tableWrapper, place: 'prepend'});
                                }
                                if ($('.group-checkable', tableContainer).size() === 1) {
                                    $('.group-checkable', tableContainer).attr("checked", false);
                                    $.uniform.update($('.group-checkable', tableContainer));
                                }
                                if (tableOptions.onSuccess) {
                                    tableOptions.onSuccess.call(the);
                                }
                                //保存数据在dataTable对象中给行详细信息面板用
                                dataTable.datas = res.response.data;
								if(res.response.status < 0){
									alert(res.response.data);
									return;
								}
								
								//告警字段值转换
								res = AlarmLabels.transformFieldNames(res);
								
                                res = jsonObjectToArray(res, columns, oSettings.iDraw);
                                
                                //重绘表格
                                fnCallback(res, textStatus, jqXHR);
                            },
                            "error": function() {
                                if (tableOptions.onError) {
                                    tableOptions.onError.call(the);
                                }
                                openoFrameWork.alert({type: 'danger', icon: 'warning', message: tableOptions.dataTable.oLanguage.sAjaxRequestGeneralError, container: tableWrapper, place: 'prepend'});
                                $('.dataTables_processing', tableWrapper).remove();
                            }
                        } );

                    },

                    // pass additional parameter
                    "fnServerParams": function ( aoData ) {
                        //here can be added an external ajax request parameters.
                        //for(var i in ajaxParams) { 
                        for(var i=0; i<ajaxParams.length; i++){
                            var param = ajaxParams[i];
                            aoData.push({"name" : param.name, "value": param.value});
                        }
                    },

                    "fnDrawCallback": function( oSettings ) { // run some code on table redraw
                        if (tableInitialized === false) { // check if table has been initialized
                            tableInitialized = true; // set table initialized
                            table.show(); // display table
                        }
                        openoFrameWork.initUniform($('input[type="checkbox"]', tableContainer));  // reinitialize uniform checkboxes on each table reload
                        countSelectedRecords(); // reset selected records indicator
                        //所有td不换行
                        $('table#datatable_ajax').find('td').css('white-space', 'nowrap');

                        //自适应对齐表头
                        var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable', tableWrapper);
                        var tbodyHead = $('tbody', $tableHead);
                        if(tbodyHead && tbodyHead.length >0){
                            $(tbodyHead).remove();
                        }

                        var $tableBody = $('table#datatable_ajax', tableWrapper);
                        var trIn = $('thead > tr:nth-child(1)', $tableHead);
                        var trBodyHead = $('thead > tr:nth-child(1)', $tableBody);
                        var tds = $(trIn).children();
                        var ths = $(trBodyHead).children();
                        for(var k=0;k<tds.length;k++){
                            $(ths.eq(k)).html('<div style="height: 0;overflow: hidden;">' + tds.eq(k).html() + '</div>');
                        }
                        var bodyRows = $('tbody > tr', $tableBody);
                        for(var i=0;i<bodyRows.length;i++){
                            var rowClone = $(bodyRows.eq(i)).clone();
                            var tds = $(rowClone).children();
                            for(var j=0;j<tds.length;j++){
                                $(tds.eq(j)).html('<div style="height: 0;overflow: hidden;">' + tds.eq(j).html() + '</div>');
                                $(tds.eq(j)).height('0px');
                                $(tds.eq(j)).css('padding-top','0px');
                                $(tds.eq(j)).css('padding-bottom','0px');
                                $(tds.eq(j)).css('border-top-width','0px');
                                $(tds.eq(j)).css('border-bottom-width','0px');
                            }
                            $(rowClone).height('0px');
                            $tableHead.append($(rowClone).prop("outerHTML"));
                        }

                        $('.dataTables_scrollBody').css('width','100%');
                        $('.dataTables_scrollHead').css('width','98.5%');
                        $('.dataTables_scrollHeadInner').css('padding-right', 0);

                        //添加浮动确认反确认按钮
                        if(rowOverFlag){
                            addRowOverlap();
                        }
                        
                        //设置表格本体高度
                        $('div.dataTables_scrollBody').css('height', tableHeight);
                    }
                }
            }, options);

            tableOptions = options;

            columns = columnsDefined;
            xsHiddenColumns = xsHiddenColumnsDefined;
            smHiddenColumns = smHiddenColumnsDefined;
            // create table's jquery object
            table = $(options.src);
            tableContainer = table.parents(".table-container");
            // apply the special class that used to restyle the default datatable

            $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";

            // initialize a datatable
            dataTable = table.dataTable(options.dataTable);

            tableWrapper = table.parents('.dataTables_wrapper');

            // modify table per page dropdown input by appliying some classes
            $('.dataTables_length select', tableWrapper).addClass("form-control input-xsmall input-sm");

            // handle group checkboxes check/uncheck
            $('.group-checkable', tableContainer).change(function () {
                var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
                var checked = $(this).is(":checked");
                $(set).each(function () {
                    $(this).attr("checked", checked);
                });
                $.uniform.update(set);
                countSelectedRecords();
            });

            // handle row's checkbox click
            table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function(){
                countSelectedRecords();
            });

            //填充表头右边界
            $('.dataTables_scrollHead').css('display','inline-block');
            //var dataTables_scrollHead_height = $('.dataTables_scrollHead').css( "height" );
            $(".dataTables_scrollHead").after("<div id='divRightPadding' style='overflow: hidden; background:#eee; position: relative; float:right; border: 1px solid #ddd; height:" + 38 + "px; width: 1.4%;'></div>");
            if($.browser.mozilla){
                $('#divRightPadding').css('height', '40');
            }

            //隐藏掉某些列
            var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable', tableWrapper);
            var $tableBody = $('table#datatable_ajax', tableWrapper);

            for(var i=0;i<xsHiddenColumns.length;i++){
                for(var j=0;j<columns.length;j++){
                    if(xsHiddenColumns[i].columnId == columns[j].columnId){
                        $('thead >  tr > th#' + columns[j].columnId, $tableHead).addClass('hidden-xs');
                        $('thead >  tr > th#' + columns[j].columnId, $tableBody).addClass('hidden-xs');
                        break;
                    }
                }
            }

            for(var i=0;i<smHiddenColumns.length;i++){
                for(var j=0;j<columns.length;j++){
                    if(smHiddenColumns[i].columnId == columns[j].columnId){
                        $('thead >  tr > th#' + columns[j].columnId, $tableHead).addClass('hidden-sm');
                        $('thead >  tr > th#' + columns[j].columnId, $tableBody).addClass('hidden-sm');
                        break;
                    }
                }
            }
        },//end init------------------------------------------------------------------------------------

        getSelectedRowsCount: function() {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        },

        getSelectedRows: function() {
            var rows = [];
            $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function(){
                rows.push({name: $(this).attr("name"), value: $(this).val()});
            });

            return rows;
        },

        addAjaxParam: function(name, value) {
            ajaxParams.push({"name": name, "value": value});
        },

        clearAjaxParams: function(name, value) {
            ajaxParams = [];
        },

        getDataTable: function() {
            return dataTable;
        },

        getTableWrapper: function() {
            return tableWrapper;
        },

        gettableContainer: function() {
            return tableContainer;
        },

        getTable: function() {
            return table;
        },

        setOpenRowFlag: function(openRowFlagInput) {
            openRowFlag = openRowFlagInput;
        },

        setRowOverFlag: function(rowOverFlagInput) {
            rowOverFlag = rowOverFlagInput;
        },

        setRowCheckable: function(rowCheckableInput) {
            rowCheckable = rowCheckableInput;
        },

        setColumnsTooLong: function(columnsTooLongInput) {
            columnsTooLong = columnsTooLongInput;
        },

        setSTotalRecordsSource: function(sTotalRecordsSourceInput){
            sTotalRecordsSource = sTotalRecordsSourceInput;
        },

        setTableHeight: function(tableHeightInput){
            tableHeight = tableHeightInput;
        }

    };

};

var TableAjaxICT = function () {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            //rtl: App.isRTL(),
            autoclose: true
        });
    }

    //判断a数组是否包含b数组
    function isContained(largeArray, smallArray){
        if(!(largeArray instanceof Array) || !(smallArray instanceof Array))
            return false;
        if(largeArray.length < smallArray.length)
            return false;
        for(var i = 0; i < smallArray.length; i++){
            var flag = false;
            for(j=0;j<largeArray.length;j++){
                if(largeArray[j].columnId == smallArray[i].columnId){
                    flag = true;
                    break;
                }
            }
            if(flag==false)return false;
        }
        return true;
    }

    var grid = new DatatableICT();

    /* Formatting function for row details */
    function fnFormatDetails(oTable, nTr, columns, rowCheckable) {
        //取得当前行显示数据
        var tds = $(nTr).children();
        var alarmId="";
        if(rowCheckable){
            alarmId = $(tds.eq(2)).html();
        }else{
            alarmId = $(tds.eq(1)).html();
        }
        //取得当前行完整数据
        var systemType = 0;
        var code = 0;
        //所有字段
        var resDisplayName="";
        var moc="";
        var alarmRaisedTime="";
        var perceivedSeverity="";
        var probableCauseDesc="";
        var neip="";
        var alarmType="";
        var ackState="";
        var ackTime="";
        var ackUserId="";
        var ackSystemId="";
        var alarmChangedTime="";
        var componentname="";
        var position1="";
        var specificproblem="";
        var additionalText="";
        for (var i = 0; i < oTable.datas.length; i++) {
            var temp = oTable.datas[i];
            if (temp.alarmId == alarmId) {
                alarmId = temp.alarmId;
                resDisplayName = temp.resDisplayName;
                alarmRaisedTime = temp.alarmRaisedTime;
                perceivedSeverity = temp.perceivedSeverity;
                probableCauseDesc = temp.probableCauseDesc;
                neip = temp.neip;
                alarmType = temp.alarmType;
                ackState = temp.ackState;
                ackTime = temp.ackTime;
                ackUserId = temp.ackUserId;
                ackSystemId = temp.ackSystemId;
                alarmChangedTime = temp.alarmChangedTime;

                systemType = temp.systemType;
                code = temp.probableCauseCode;
                moc = temp.moc;
                componentname = temp.componentname;
                position1 = temp.position1;
                specificproblem = temp.specificproblem;
                additionalText = temp.additionalText;
                break;
            }
        }

        var id = alarmId;
        var sOut = '<table class = "detailTable" width = 900>';
        sOut += '<tr class="oddDetailTable"><td class = "detailTitleStyle" width = 80><span class = "labelDetailTable">' + columns[0].columnTitle + '</span></td><td class = "detailCellStyle" width = 160>' + alarmId + '</td>';
        sOut += '<td class = "detailTitleStyle" width = 80><span class = "labelDetailTable">' + columns[4].columnTitle + '</span></td><td class = "detailCellStyle" width = 160>' + perceivedSeverity + '</td>';
        sOut += '<td class = "detailTitleStyle" width = 80><span class = "labelDetailTable">' + columns[9].columnTitle + '</span></td><td class = "detailCellStyle" width = 160>' + alarmType + '</td>';
        sOut += '<td class = "detailTitleStyle" width = 80><span class = "labelDetailTable">' + columns[3].columnTitle + '</span></td><td class = "detailCellStyle" width = 160>' + alarmRaisedTime + '</td></tr>';

        sOut += '<tr class="evenDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[5].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 3>' + probableCauseDesc + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[15].columnTitle + '</span></td><td class = "detailCellStyle">' + alarmChangedTime + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[11].columnTitle + '</span></td><td class = "detailCellStyle">' + ackState + '</td></tr>';

        sOut += '<tr class="oddDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[12].columnTitle + '</span></td><td class = "detailCellStyle">' + ackTime + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[13].columnTitle + '</span></td><td class = "detailCellStyle">' + ackUserId + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[14].columnTitle + '</span></td><td class = "detailCellStyle">' + ackSystemId + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[7].columnTitle + '</span></td><td class = "detailCellStyle">' + neip + '</td></tr>';

        sOut += '<tr class="evenDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[2].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 3>' + moc + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[1].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 3>' + resDisplayName + '</td></tr>';

        sOut += '<tr class="oddDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[8].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 3>' + componentname + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[16].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 3>' + position1 + '</td></tr>';

        sOut += '<tr class="evenDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[10].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 7>' + specificproblem + '</td></tr>';

        sOut += '<tr class="oddDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + columns[6].columnTitle + '</span></td><td class = "detailCellStyle" colspan = 7>' + additionalText + '</td></tr>';

        sOut += '<tr class="evenDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + $.i18n.prop('aos_fm_SuggestionSetting_view_DefaultSuggestionGroupTitle').replace(';', '').replace(/\"/g,'') + '</span></td><td id = "defaulInfo' + id + '" class = "detailCellStyle" colspan = 7>' + '</td></tr>';

        sOut += '<tr class="oddDetailTable"><td class = "detailTitleStyle"><span class = "labelDetailTable">' + $.i18n.prop('aos_fm_SuggestionSetting_view_SettingSuggestionGroupTitle').replace(';', '').replace(/\"/g,'') + '</span></td><td id = "customInfo' + id + '" class = "detailCellStyle" colspan = 7><td align="right"><button id = "customInfoModify' + id + '" class="btn-toolbar" type="button"><span  id = "modifyBtnSpan' + id + '"class="fa fa-pencil-square-o"></span></button></td><td id="cancelDiv' + id + '"></td></td></tr>';

        sOut += '</table>';

        /*
         var systemType = 0;
         var code = 0;
         for (var i = 0; i < oTable.datas.length; i++) {
         var temp = oTable.datas[i];
         if (temp.alarmId == oTr['alarmId'].value) {
         systemType = temp.systemType;
         code = temp.probableCauseCode;
         }
         }*/
        var data = {
            "systemType" : systemType,
            "code" : code
        };
        var sendData = JSON.stringify(data);
        $.ajax({
            "dataType" : 'json',
            "type" : "GET",
            "url" : "/web/rest/web/fm/Maintenance" + "?" + "data=" + sendData,
            "contentType" : 'application/json; charset=utf-8',
            "data" : null,
            "success" : function (json) {
                $('tr').find('td#defaulInfo' + id).text(json.defaulInfo);
                $('tr').find('td#customInfo' + id).text(json.customInfo);
                var modify = $('#customInfoModify' + id);
                modify.on('click', function () {
                    var span = $('#modifyBtnSpan' + id);
                    var customInfo = $('tr').find('td#customInfo' + id);
                    var cancel = $('#cancelDiv' + id);
                    if (span['0'].className === 'fa fa-pencil-square-o') {
                        var value = customInfo['0'].textContent;
                        customInfo['0'].textContent = '';
                        customInfo['0'].innerHTML = '<textarea  id="customInfoInput' + id + '" type="textarea" cols=100 rows=4>' + value + '</textarea>';
                        span['0'].className = 'fa fa-floppy-o';
                        cancel['0'].innerHTML = '<button id = "cancelBtn' + id + '" class="btn-toolbar" type="button"><span class="fa fa-sign-out"></span></button>';
                        $('#cancelBtn' + id).on('click', function () {
                            customInfo['0'].innerHTML = '';
                            customInfo['0'].textContent = value;
                            cancel['0'].innerHTML = '';
                            span['0'].className = 'fa fa-pencil-square-o';
                        });
                    } else {
                        var inputValue = $('#customInfoInput' + id)['0'].value;
                        customInfo['0'].innerHTML = '';
                        customInfo['0'].textContent = inputValue;
                        span['0'].className = 'fa fa-pencil-square-o';
                        cancel['0'].innerHTML = '';
                        var modifyData = {
                            "systemType" : systemType,
                            "code" : code,
                            "defaulInfo" : json.defaulInfo,
                            "customInfo" : inputValue
                        };
                        $.ajax({
                            "dataType" : 'json',
                            "type" : "PUT",
                            "url" : "/web/rest/web/fm/Maintenance",
                            "contentType" : 'application/json; charset=utf-8',
                            "data" : JSON.stringify(modifyData),
                            "error" : function () {
                                alert('Modify Error!');
                            }
                        });
                    }
                });
            },
            "error" : function () {
                alert('Communication Error!');
            }
        });

        return sOut;
    }

    var generateColumns = function(columns, openRowFlag, rowCheckable){
        var $tableData = $('table#datatable_ajax');
        var theadTR = $('thead > tr', $tableData);
        if(rowCheckable){
            theadTR.append('<th><input type="checkbox" class="group-checkable"></th>');
        }
        if(openRowFlag){
            theadTR.append('<th>&nbsp;&nbsp;</th>');
        }
        for(var i=0;i<columns.length;i++){
            theadTR.append('<TH id="' + columns[i].columnId + '" style="white-space: nowrap;">' + columns[i].columnTitle + '</TH>');
        }
    }

    var sortHandling = function(oTable, openRowFlag, rowCheckable){
        var indexSkip = -1;
        if(openRowFlag&&rowCheckable){
            indexSkip = 1;
        }else if(openRowFlag&&!rowCheckable||!openRowFlag&&rowCheckable){
            indexSkip = 0;
        }
        var $sortOrder = 0;   //排序类型 1表示升序，0表示降序
        var tableWrapper = $('div#datatable_ajax_wrapper');
        var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable', tableWrapper);
        var $tableData = $('table#datatable_ajax');
        var clearSort = function(currentTh){
            var ths = $tableHead.find('th').get();
            var tableDataHeadTHs = $tableData.find('th').get();
            $.each( ths, function( index, th ){
                if(index > indexSkip){
                    if($(th).text() != currentTh.text()){
                        if($(th).is('.sorting_disabled')){
                            //do nothing;
                        }else if($(th).is('.sorting_asc')){
                            $(th).removeClass('sorting_asc').addClass('sorting_disabled');
                            $(tableDataHeadTHs[index]).removeClass('sorting_asc').addClass('sorting_disabled');
                        }else if($(th).is('.sorting_desc')){
                            $(th).removeClass('sorting_desc').addClass('sorting_disabled');
                            $(tableDataHeadTHs[index]).removeClass('sorting_desc').addClass('sorting_disabled');
                        }
                    }
                }
            });
        }

        $('th', $tableHead).each(function( column )
        {
            if(column>indexSkip){
                //处理三种有可能存在的排序字段，比较方法
                var findSortKey;
                if( $(this).is('.sort-title') || $(this).is('.sorting_disabled') )
                {
                    findSortKey = function( $cell )
                    {
                        var cellText = $cell.text();
                        if(isNaN(cellText)){
                            return $cell.text().toUpperCase();
                        }else{
                            return parseFloat(cellText);
                        }
                        //return $cell.text().toUpperCase();
                    }
                }
                else if( $(this).is('.sort-date') )
                {
                    findSortKey = function( $cell )
                    {
                        return Date.parse('1' + $cell.text());
                    }
                }
                else if( $(this).is('.sort-price') )
                {
                    findSortKey = function( $cell )
                    {
                        var key =  parseFloat($cell.text().replace(/^[^\d.]*/, ''))
                        return isNaN(key) ? 0 : key;
                    }
                }

                //排序
                if( findSortKey )
                {
                    $(this).click(function()
                    {
                        $sortOrder = $sortOrder == 0 ? 1 : 0;
                        var tableDataHeadTHs = $tableData.find('th').get();

                        if($sortOrder == 1){
                            if($(this).is('.sorting_disabled')){
                                $(this).removeClass('sorting_disabled').addClass('sorting_asc');
                                $(tableDataHeadTHs[column]).removeClass('sorting_disabled').addClass('sorting_asc');
                            }else if($(this).is('.sorting_asc')){
                                $(this).removeClass('sorting_asc').addClass('sorting_desc');
                                $(tableDataHeadTHs[column]).removeClass('sorting_asc').addClass('sorting_desc');
                            }else if($(this).is('.sorting_desc')){
                                $(this).removeClass('sorting_desc').addClass('sorting_asc');
                                $(tableDataHeadTHs[column]).removeClass('sorting_desc').addClass('sorting_asc');
                            }
                        }else{
                            if($(this).is('.sorting_disabled')){
                                $(this).removeClass('sorting_disabled').addClass('sorting_desc');
                                $(tableDataHeadTHs[column]).removeClass('sorting_disabled').addClass('sorting_desc');
                            }else if($(this).is('.sorting_asc')){
                                $(this).removeClass('sorting_asc').addClass('sorting_desc');
                                $(tableDataHeadTHs[column]).removeClass('sorting_asc').addClass('sorting_desc');
                            }else if($(this).is('.sorting_desc')){
                                $(this).removeClass('sorting_desc').addClass('sorting_asc');
                                $(tableDataHeadTHs[column]).removeClass('sorting_desc').addClass('sorting_asc');
                            }
                        }
                        clearSort($(this));

                        var rows = $tableData.find('tbody > tr').get();

                        $.each( rows, function( index, row )
                        {
                            //先关掉所有行
                            if ( oTable.fnIsOpen(row) )
                            {
                                $(row).find('.row-details').click();
                            }
                        });

                        //重新取得所有行，否则排序后表格显示异常
                        rows = $tableData.find('tbody > tr').get();

                        $.each( rows, function( index, row )
                        {
                            row.sortKey = findSortKey($(row).children('td').eq(column));
                        });
                        //排序方法
                        rows.sort(function( a, b )
                        {
                            if( $sortOrder == 1 )
                            {
                                //升序
                                if(a.sortKey < b.sortKey)   return -1;
                                if(a.sortKey > b.sortKey)   return  1;
                                return 0;
                            }
                            else
                            {
                                //降序
                                if(a.sortKey < b.sortKey)   return  1;
                                if(a.sortKey > b.sortKey)   return -1;
                                return 0;
                            }
                        });
                        //排序后的对象添加给$table
                        $.each( rows, function( index, row )
                        {
                            $tableData.children('tbody').append(row);
                            row.sortKey = null;
                        });
                    });
                }
            }
        });
    }

    var handleRecords = function(requestStr, columns, xsHiddenColumns, smHiddenColumns, oLanguage, openRowFlag, rowCheckable, rowOverFlag, requestURL, requestParameters, tableHeight, columnsTooLong, sTotalRecordsSource) {

        /*
         jQuery.getJSON('/web/newict/framework/thirdparty/data-tables/app-universal-i18n-datatable-' + lang + '.json',
         function(data) {
         oLanguage = data;
         });
         */
        grid.setOpenRowFlag(openRowFlag);
        grid.setRowCheckable(rowCheckable);
        grid.setRowOverFlag(rowOverFlag);
        grid.setColumnsTooLong(columnsTooLong);
        grid.setSTotalRecordsSource(sTotalRecordsSource);
        grid.setTableHeight(tableHeight);
        //取得查询条件
//        if(!requestStr || requestStr.length == 0){
//            requestStr = JSON.stringify(requestAllData);
//        }
		grid.clearAjaxParams();
        grid.addAjaxParam('data', requestStr);
        //取得其他参数
        for(var i=0;i<requestParameters.length;i++){
            grid.addAjaxParam(requestParameters[i].paraId,requestParameters[i].paraValue);
        }

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function(grid) {
                // execute some code after table records loaded
                var tableWrapper = $('div#datatable_ajax_wrapper');
                var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable', tableWrapper);
                var ths = $tableHead.find('th').get();
                var $tableData = $('table#datatable_ajax');
                var tableDataHeadTHs = $tableData.find('th').get();
                $.each( ths, function( index, th ){
                    //clear all sort direction
                    if($(th).is('.sorting_disabled')){
                        //do nothing;
                    }else if($(th).is('.sorting_asc')){
                        $(th).removeClass('sorting_asc').addClass('sorting_disabled');
                        $(tableDataHeadTHs[index]).removeClass('sorting_asc').addClass('sorting_disabled');
                    }else if($(th).is('.sorting_desc')){
                        $(th).removeClass('sorting_desc').addClass('sorting_disabled');
                        $(tableDataHeadTHs[index]).removeClass('sorting_desc').addClass('sorting_disabled');
                    }
                });

            },
            onError: function(grid) {
                // execute some code on network or other general error
            },
            dataTable: {
                "sDom" : "tr<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'pli>>", // datatable layout
                "oLanguage": oLanguage,
                //"bAutoWidth": true,
                "sScrollY": tableHeight,
                "bScrollCollapse": true,
                "sScrollX": "100%",
                //"sScrollXInner": "110%",
                "aLengthMenu": [
                    [20, 50, 100],
                    [20, 50, 100] // change per page values here
                ],
                "iDisplayLength": 20, // default record count per page
                "bServerSide": true, // server side processing
                "sAjaxSource": requestURL // ajax source
            }
        }, columns, xsHiddenColumns, smHiddenColumns, openRowFlag, rowCheckable);
    }

    /*
     * Insert a 'details' column to the table
     */
    var insertDetails = function (oTable, columns, rowCheckable) {

        var $tableData = $('table#datatable_ajax');

        $tableData.on('click', ' tbody td .row-details', function () {
            var nTr = $(this).parents('tr')[0];
            if (oTable.fnIsOpen(nTr)) {
                /* This row is already open - close it */
                $(this).addClass("row-details-close").removeClass("row-details-open");
                oTable.fnClose(nTr);
            } else {
                /* Open this row */
                $(this).addClass("row-details-open").removeClass("row-details-close");
                oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr, columns, rowCheckable), 'details');
            }
        });
    }

    return {

        //main function to initiate the module
        init: function (requestStr, lang, configPathPrefix) {

            var oLanguage;
            var columns;
            var xsHiddenColumns;
            var smHiddenColumns;
            var columnsAll;

            var openRowFlag = false;
            var rowOverFlag = false;
            var rowCheckable = false;
            var requestURL="";
            var requestAllData;
            var requestParameters;

            var tableHeight;
            var tableWidth;

            var columnsTooLong;
            var sTotalRecordsSource="";

            //取得当前配置及国际化信息
            $.ajax({
                dataType:   'json',
                url:        configPathPrefix + '-' + lang + '.json',
                async:      false,
                contentType:'application/json; charset=utf-8',
                "success":  function(data) {
                    oLanguage = data.language;
                    columns = data.columns;
                    xsHiddenColumns = data.xsHiddenColumns;
                    smHiddenColumns = data.smHiddenColumns;
                    columnsAll = data.columnsAll;
                    openRowFlag = data.openRowFlag == 'true'? true: false;
                    rowOverFlag = data.rowOverFlag == 'true'? true: false;
                    rowCheckable = data.rowCheckable == 'true'? true: false;
                    requestURL = data.requestURL;
                    //requestAllData = data.requestAllData;
                    requestParameters = data.requestParameters;
                    tableHeight = data.tableHeight;
                    tableWidth = data.tableWidth;
                    columnsTooLong = data.columnsTooLong;
                    sTotalRecordsSource = data.sTotalRecordsSource;
                },
                "error" : function (xhr, info) {
                    alert('Communication Error! Error reason:' + info);
                }
            });

            $('#dataTableWrapperDiv').css('width', tableWidth);

            if(!isContained(xsHiddenColumns, smHiddenColumns) || !isContained(columns, xsHiddenColumns) || !isContained(columnsAll, columns)){
                alert('Columns claim error: (smHiddenColumns <= xsHiddenColumns <= columns <= columnsAll) Please!');
                return;
            }

            generateColumns(columns, openRowFlag, rowCheckable);
            //initPickers();
            handleRecords(requestStr, columns, xsHiddenColumns, smHiddenColumns, oLanguage, openRowFlag, rowCheckable, rowOverFlag, requestURL, requestParameters, tableHeight, columnsTooLong, sTotalRecordsSource);
            //获得初始化完毕的DataTable对象
            var oTable = grid.getDataTable();
            if(openRowFlag){
                insertDetails(oTable, columnsAll, rowCheckable);
            }
            sortHandling(oTable, openRowFlag, rowCheckable);
            //oTable.fnAdjustColumnSizing(true);
            return oTable;
        }

    };

}();

var DataTableSmartClient = function(datas, configPathPrefix){

    var requestStr = "";
    if(datas){
        requestStr = JSON.stringify(datas);
    }
	
	var lang = getLanguage();
	//lang = 'en-US';
	loadi18n_FM(lang);
	//requestStr = "";
	var oTable = TableAjaxICT.init(requestStr, lang, configPathPrefix);

	//重新调节列宽以适应window resize
	$(window).one('resize', function () {
		//oTable.DataTable.models.oSettings.bAjaxDataGet = false;
		oTable.fnAdjustColumnSizing(false);
	} );
}

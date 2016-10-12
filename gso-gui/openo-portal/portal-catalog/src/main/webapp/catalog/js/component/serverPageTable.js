/*
 * Copyright 2016 ZTE Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var serverPageTable = {};
/* Bootstrap style full number pagination control */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
    return {
        "iStart":         oSettings._iDisplayStart,
        "iEnd":           oSettings.fnDisplayEnd(),
        "iLength":        oSettings._iDisplayLength,
        "iTotal":         oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
        "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
    };
};

$.extend( $.fn.dataTableExt.oPagination, {
    "bootstrap_extended": {
        "fnInit": function( oSettings, nPaging, fnDraw ) {
            var oLang = oSettings.oLanguage.oPaginate;
            var oPaging = oSettings.oInstance.fnPagingInfo();

            var fnClickHandler = function ( e ) {
                e.preventDefault();
                if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                    fnDraw( oSettings );
                }
            };

            $(nPaging).append(
                '<div class="pagination-panel"> ' + oLang.sPage + ' ' +
                '<a href="#" class="btn btn-sm default prev disabled" title="' + oLang.sPrevious + '"><i class="fa fa-angle-left"></i></a>' +
                '<input type="text" class="pagination-panel-input input-mini input-inline input-sm" maxlenght="5" style="text-align:center; margin: 0 4px; border: 1px solid rgb(169, 169, 169);height: 28px;">' +
                '<a href="#" class="btn btn-sm default next disabled" title="' + oLang.sNext + '"><i class="fa fa-angle-right"></i></a> ' +
                oLang.sPageOf + ' <span class="pagination-panel-total"></span>' +
                '</div>'
            );

            var els = $('a', nPaging);

            $(els[0]).bind('click.DT', { action: "previous" }, fnClickHandler );
            $(els[1]).bind('click.DT', { action: "next" }, fnClickHandler);

            $('.pagination-panel-input', nPaging).bind('change.DT', function(e) {
                var oPaging = oSettings.oInstance.fnPagingInfo();
                e.preventDefault();
                var page = parseInt($(this).val());
                if (page > 0 && page < oPaging.iTotalPages) {
                    if ( oSettings.oApi._fnPageChange(oSettings, page-1) ) {
                        fnDraw( oSettings );
                    }
                } else {
                    $(this).val(oPaging.iPage + 1);
                }
            });

            $('.pagination-panel-input', nPaging).bind('keypress.DT', function(e) {
                var oPaging = oSettings.oInstance.fnPagingInfo();
                if (e.which == 13) {
                    var page = parseInt($(this).val());
                    if (page > 0 && page < oSettings.oInstance.fnPagingInfo().iTotalPages) {
                        if ( oSettings.oApi._fnPageChange(oSettings, page-1) ) {
                            fnDraw( oSettings );
                        }
                    } else {
                        $(this).val(oPaging.iPage + 1);
                    }
                    e.preventDefault();
                }
            });
        },

        "fnUpdate": function ( oSettings, fnDraw ) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

            if ( oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if ( oPaging.iPage <= iHalf ) {
                iStart = 1;
                iEnd = iListLength;
            } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }


            for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                var wrapper = $(an[i]).parents(".dataTables_wrapper");

                if (oPaging.iTotalPages <= 0) {
                    $('.pagination-panel, .dataTables_length', wrapper).hide();
                } else {
                    $('.pagination-panel, .dataTables_length', wrapper).show();
                }

                $('.pagination-panel-total', an[i]).html(oPaging.iTotalPages);
                $('.pagination-panel-input', an[i]).val(oPaging.iPage + 1);

                // Remove the middle elements
                $('li:gt(1)', an[i]).filter(':not(.next)').remove();

                // Add the new list items and their event handlers
                for ( j=iStart ; j<=iEnd ; j++ ) {
                    sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                    $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                        .insertBefore( $('li.next:first', an[i])[0] )
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                            fnDraw( oSettings );
                        } );
                }

                // Add / remove disabled classes from the static elements
                if ( oPaging.iPage === 0 ) {
                    $('a.prev', an[i]).addClass('disabled');
                } else {
                    $('a.prev', an[i]).removeClass('disabled');
                }

                if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                    $('a.next', an[i]).addClass('disabled');
                } else {
                    $('a.next', an[i]).removeClass('disabled');
                }
            }
        }
    }
} );

serverPageTable.getRestPara = function( cond , tableSetting ){
    var pageNo=tableSetting._iDisplayStart/tableSetting._iDisplayLength+1;
    var pageSize = tableSetting._iDisplayLength;
    var queryParameter={"pageNo":pageNo,"pageSize":tableSetting._iDisplayLength,groupId:["it.group.database=02","it.group.server=01"]},
        newData={"data":JSON.stringify(queryParameter)};
    //put the pageinfo in cond if there is a pageinfo 
    var pageInfo = vm.logInfo[vm.logType].pageInfo;
    if(pageInfo != null && serverPageTable.perpagenumber == pageSize){ 
        cond.idEnd = pageInfo.pageStart[pageNo - 1];
        cond.idStart = pageInfo.pageStart[pageNo];
        if(!cond.idStart){ //the last page
            cond.idStart = 0;
        }

    }else{
        delete cond.idStart;
        delete cond.idEnd;
        vm.logInfo[vm.logType].pageInfo = null;
        pageNo = 1;
        tableSetting._iDisplayStart = 0;
    }
    var data = {
        cond:JSON.stringify(cond),
        perpagenumber:pageSize,
        pageNo:pageNo,
        needPageInfo:vm.logInfo[vm.logType].pageInfo == null
    };
    serverPageTable.perpagenumber = pageSize;
    return data;
};

serverPageTable.initTableWithoutLib = function( setting ,cond , divId) {
    //transform colomn
    var column = setting.columns;
    //empty table
    $('#'+ divId).children().remove();
    var tableId = setting.tableId;
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= '+ tableId + '>'
        + '<thead>'
        +'<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        +'<tbody>'
        +'</tbody>'
        +'</table>';
    $('#'+ divId).append(tableEleStr);
    //$('#'+ tableId).append(' <thead><tr role="row" class="heading" ></tr></thead><tbody></tbody>');
    var trEle = $('#'+ tableId  + ' > thead >tr');
    //var dataTableColumn = [];
    for ( var one in column){
        var th = '<th>' + column[one].name + '</th>';
        trEle.append(th);
    }
    var table = $("#" + tableId).dataTable({
        //"sDom" : "tr<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'pli>>", // datatable layout
        //"sDom" : "<'row'<'col-md-12 col-sm-12'lip>r><'table-scrollable't>>",
        //"sDom": '<"top"rt><"bottom"lip>',
        "sDom": '<"top"rt>',
        "oLanguage": setting.language,//language
        //"bJQueryUI": true,
        "bPaginate": setting.paginate,// page button
        "bFilter": false,// search bar
        "bAutoWidth":true,//automatically set colum width
        "bLengthChange": true,// record number in each row
        "iDisplayLength": 10,// row number in each page
        "bSort": setting.sort ? true : false,// sort
        "bInfo": setting.info,// Showing 1 to 10 of 23 entries
        "bWidth": true,
        "bScrollCollapse": true,
        "sPaginationType": "bootstrap_extended", // page, a total of two kinds of style, another one is two_button
        "bProcessing": true,
        "bServerSide": false,
        "bDestroy": true,
        "bSortCellsTop": true,
        "sAjaxSource": setting.restUrl,
        "aoColumns": setting.columns,
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                "type": 'get',
                "url": sSource,
                "dataType": "json",
                //"data":serverPageTable.getRestPara(cond,oSettings),
                "success": function (resp) {
                    oSettings.iDraw = oSettings.iDraw + 1;

                    resp = resp || [];
                    var data = {};
                    data.aaData = resp;
                    var totalCounts = resp.length;

                    data.iTotalRecords = totalCounts;
                    data.iTotalDisplayRecords = totalCounts;
                    data.sEcho = oSettings;
                    fnCallback(data);
                },
                "error": function(resp) {
                    var data = {};
                    data.aaData = [];
                    var totalCounts = 0;

                    data.iTotalRecords = totalCounts;
                    data.iTotalDisplayRecords = totalCounts;
                    data.sEcho = oSettings;
                    fnCallback(data);
                }
            });
        }
    });
};

serverPageTable.initDataTable = function( setting ,cond , divId) {
    //transform colomn
    var column = setting.columns;
    //empty table
    $('#'+ divId).children().remove();
    var tableId = setting.tableId;
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= '+ tableId + '>'
        + '<thead>'
        +'<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        +'<tbody>'
        +'</tbody>'
        +'</table>';
    $('#'+ divId).append(tableEleStr);
    //$('#'+ tableId).append(' <thead><tr role="row" class="heading" ></tr></thead><tbody></tbody>');
    var trEle = $('#'+ tableId  + ' > thead >tr');
    //var dataTableColumn = [];
    for ( var one in column){
        var th = '<th>' + column[one].name + '</th>';
        trEle.append(th);
    }
    var table = $("#" + tableId).dataTable({
        //"sDom" : "tr<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'pli>>", // datatable layout
        //"sDom" : "<'row'<'col-md-12 col-sm-12'lip>r><'table-scrollable't>>",
        "sDom": '<"top"rt><"bottom"lip>',
        "oLanguage": setting.language,//language
        //"bJQueryUI": true,
        "bPaginate": setting.paginate,// page button
        "bFilter": false,// search bar
        "bAutoWidth":true,//automatically set colum width
        "bLengthChange": true,// record number in each row
        "iDisplayLength": 10,// row number in each page
        "bSort": setting.sort ? true : false,// sort
        "bInfo": setting.info,// Showing 1 to 10 of 23 entries 
        "bWidth": true,
        "bScrollCollapse": true,
        "sPaginationType": "bootstrap_extended", // page, a total of two kinds of style, another one is two_button
        "bProcessing": true,
        "bServerSide": false,
        "bDestroy": true,
        "bSortCellsTop": true,
        "sAjaxSource": setting.restUrl,
        "aoColumns": setting.columns,
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                "type": 'get',
                "url": sSource,
                "dataType": "json",
                //"data":serverPageTable.getRestPara(cond,oSettings),
                "success": function (resp) {                                       
                    oSettings.iDraw = oSettings.iDraw + 1;
                    
                    resp = resp || [];
                    var data = {};
                    data.aaData = resp;
                    var totalCounts = resp.length;
                    
                    data.iTotalRecords = totalCounts;
                    data.iTotalDisplayRecords = totalCounts;
                    data.sEcho = oSettings;
                    fnCallback(data);
                },
                "error": function(resp) {
                    var data = {};
                    data.aaData = [];
                    var totalCounts = 0;
                    
                    data.iTotalRecords = totalCounts;
                    data.iTotalDisplayRecords = totalCounts;
                    data.sEcho = oSettings;
                    fnCallback(data);
                }
            });
        }
    });
};

serverPageTable.initTableWithData = function( setting , divId , tableData) {
    //transform colomn
    var column = setting.columns;
    //empty table
    $('#'+ divId).children().remove();
    var tableId = setting.tableId;
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= '+ tableId + '>'
        + '<thead>'
        +'<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        +'<tbody>'
        +'</tbody>'
        +'</table>';
    $('#'+ divId).append(tableEleStr);
    var trEle = $('#'+ tableId  + ' > thead >tr');
    for ( var one in column){
        var th = '<th>' + column[one].name + '</th>';
        trEle.append(th);
    }
    var table = $("#" + tableId).dataTable({
        "sDom" : "<'row'<'col-md-12 col-sm-12'lip>r>>",
        "oLanguage": setting.language,//language
        //"bJQueryUI": true,
        "bPaginate": setting.paginate,// page button
        "bFilter": false,// search bar
        "bAutoWidth":true,//automatically set the column width
        "bLengthChange": true,// record number in each row
        "iDisplayLength": 10,// row number in each page
        "bSort": setting.sort ? true : false,// sort
        "bInfo": setting.info,// Showing 1 to 10 of 23 entries
        "bWidth": true,
        "bScrollCollapse": true,
        "sPaginationType": "bootstrap_extended", // page, a total of two kinds of style, another one is two_button
        "bProcessing": false,
        "bServerSide": false,
        "bDestroy": true,
        "bSortCellsTop": true,
        "sAjaxSource": tableData,
        "aoColumns": setting.columns,
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {                    
            oSettings.iDraw = oSettings.iDraw + 1;            
            var resp = tableData || [];
            var data = {};
            data.aaData = resp;
            var totalCounts = resp.length;
            
            data.iTotalRecords = totalCounts;
            data.iTotalDisplayRecords = totalCounts;
            data.sEcho = oSettings;
            fnCallback(data); 
        }
    });
};


serverPageTable.initDataTableForEvent = function( setting ,cond , divId) {
    //transform colomn
    var column = setting.columns;
    //empty table
    $('#'+ divId).children().remove();
    var tableId = setting.tableId;
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= '+ tableId + '>'
        + '<thead>'
        +'<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        +'<tbody>'
        +'</tbody>'
        +'</table>';
    $('#'+ divId).append(tableEleStr);
    var trEle = $('#'+ tableId  + ' > thead >tr');
    for ( var one in column){
        var th = '<th>' + column[one].name + '</th>';
        trEle.append(th);
    }
    var table = $("#" + tableId).dataTable({
        "sDom": '<"top"rt><"bottom"lip>',
        "oLanguage": setting.language,//language
        //"bJQueryUI": true,
        "bPaginate": setting.paginate,// page button
        "bFilter": false,// search bar
        "bAutoWidth":true,//automatically set the column width
        "bLengthChange": true,// record number in each row
        "iDisplayLength": 10,// row number in each page
        "bSort": setting.sort ? true : false,
        "bInfo": setting.info,// Showing 1 to 10 of 23 entries 
        "bWidth": true,
        "bScrollCollapse": true,
        "sPaginationType": "bootstrap_extended", // page, a total of two kinds of style, another one is two_button
        "bProcessing": true,
        "bServerSide": false,
        "bDestroy": true,
        "bSortCellsTop": true,
        "sAjaxSource": setting.restUrl,
        "aoColumns": setting.columns,
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ],
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                "type": 'get',
                "url": sSource,
                "dataType": "json",
                //"data":serverPageTable.getRestPara(cond,oSettings),
                "success": function (resp) {                                       
                    oSettings.iDraw = oSettings.iDraw + 1;
                    
                    var result = [];
                    for(var i=0;i<resp.length;i++) {
                        result.push(resp[i].currentStepInfo);
                    }
                    var data = {};
                    data.aaData = result;
                    var totalCounts = result.length;
                    
                    data.iTotalRecords = totalCounts;
                    data.iTotalDisplayRecords = totalCounts;
                    data.sEcho = oSettings;
                    fnCallback(data);
                },
                "error": function(resp) {
                    var data = {};
                    data.aaData = [];
                    var totalCounts = 0;
                    
                    data.iTotalRecords = totalCounts;
                    data.iTotalDisplayRecords = totalCounts;
                    data.sEcho = oSettings;
                    fnCallback(data);
                }
            });
        }
    });
};
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
(function($) {
    String.prototype.trim = function() { 
		return this.replace(/(^\s*)|(\s*$)/g, ""); 
	};
	String.prototype.format=function() {  
		if(arguments.length==0) return this;  
			for(var s=this, i=0; i<arguments.length; i++)  
			s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
		return s;  
   };  
   //告警计数点击事件
	$(function(){
		   $("#hd_alarmcount_critical_value").parentsUntil('a').parent().click(function() {
			      openNewPage(1);
				});

		   $("#hd_alarmcount_major_value").parentsUntil('a').parent().click(function() {
			      openNewPage(2);
				});

		   $("#hd_alarmcount_minor_value").parentsUntil('a').parent().click(function() {
			      openNewPage(3);
				});

		   $("#hd_alarmcount_warning_value").parentsUntil('a').parent().click(function() {
			      openNewPage(4);
				});
		   function openNewPage(severity)
		   {
			   window.open("default.html?showNav=false&severity=" + severity + "#_uep-ict-fm-currentAlarm",
			             "fm_portlet_page_title");
		   }
		});	
    try{
  	  //base版本不加载告警统计，并在界面隐藏
    $().ready(function(){
		if(typeof(base) == "undefined" || !base){
			 if($("#header_notification_bar")&&$("#header_notification_bar").length>0&&$("#header_notification_bar").children().length>0){
				// 对告警灯进行鉴权，如果有当前告警权限，显示告警灯，否则返回�?
				var operations = new Array();
				operations.push("common.fm.currentview");		
				var rightObj = getAllOperCodeRights(operations);
				var operation = $("#uep-ict-fm-currentAlarm").attr("operation");;
				if (!hasRight(operation, rightObj)) {
					$('#header_notification_bar').html("<div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>");
					return;
				}
				// get total alarm count
				$("#hd_heighestAlarmcount_label").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_none_label'));
				$("#hd_alarmcount_total_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_total_label'));
				$("#hd_alarmcount_critical_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_critical_label'));
				$("#hd_alarmcount_major_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_major_label'));
				$("#hd_alarmcount_minor_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_minor_label'));
				$("#hd_alarmcount_warning_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_warning_label'));
			
				function alarmLight(alarmcount){
				    if (!alarmcount || !alarmcount.unAckedCount || (alarmcount.unAckedCount.length < 4) || !alarmcount.ackedCount || (alarmcount.ackedCount.length < 4)) {
						return;
					}
					var criticalNum = alarmcount.unAckedCount[0] + alarmcount.ackedCount[0];
					var majorNum = alarmcount.unAckedCount[1] + alarmcount.ackedCount[1];
					var minorNum = alarmcount.unAckedCount[2] + alarmcount.ackedCount[2];
					var warningNum = alarmcount.unAckedCount[3] + alarmcount.ackedCount[3];
					var totalNum= criticalNum+ majorNum+  minorNum+  warningNum;
					var heighestAlarmcount=0;
					var hd_heighestAlarmcount_label="";
					if(criticalNum>0){
						heighestAlarmcount =criticalNum;
						hd_heighestAlarmcount_label=$.i18n.prop('com_zte_ums_ict_alarmcount_critical_label');
						// $("#hd_heighestAlarmcount_li").attr("class",$("#hd_alarmcount_critical_li").attr("class"));
					}else if(majorNum>0){
						heighestAlarmcount =majorNum;
						hd_heighestAlarmcount_label=$.i18n.prop('com_zte_ums_ict_alarmcount_major_label');
					}else if(minorNum>0){
						heighestAlarmcount =minorNum;
						hd_heighestAlarmcount_label=$.i18n.prop('com_zte_ums_ict_alarmcount_minor_label');
					}else if(warningNum>0){
						heighestAlarmcount =warningNum;
						hd_heighestAlarmcount_label=$.i18n.prop('com_zte_ums_ict_alarmcount_warning_label');
					}else{
						heighestAlarmcount =0;
						hd_heighestAlarmcount_label=$.i18n.prop('com_zte_ums_ict_alarmcount_none_label');
					}
						 
						$("#hd_heighestAlarmcount_value").text(heighestAlarmcount);
						$("#hd_alarmcount_total_value").text(totalNum);
						$("#hd_alarmcount_critical_value").text(criticalNum);
						$("#hd_alarmcount_major_value").text(majorNum);
						$("#hd_alarmcount_minor_value").text(minorNum);
						$("#hd_alarmcount_warning_value").text(warningNum);

						$("#hd_heighestAlarmcount_value").attr("title",hd_heighestAlarmcount_label.format(heighestAlarmcount ));  
					  $("#hd_alarmcount_total_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_total_label').format(totalNum ));  									
					  $("#hd_alarmcount_critical_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_critical_label').format( criticalNum ));
						$("#hd_alarmcount_major_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_major_label').format(majorNum));
						$("#hd_alarmcount_minor_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_minor_label').format(minorNum));
						$("#hd_alarmcount_warning_value").attr("title",$.i18n.prop('com_zte_ums_ict_alarmcount_warning_label').format(warningNum));
				
						$("#hd_alarmcount_critical_text").text($.i18n.prop('com_zte_ums_ict_alarmcount_critical_text'));
						$("#hd_alarmcount_major_text").text($.i18n.prop('com_zte_ums_ict_alarmcount_major_text'));
						$("#hd_alarmcount_minor_text").text($.i18n.prop('com_zte_ums_ict_alarmcount_minor_text'));
						$("#hd_alarmcount_warning_text").text($.i18n.prop('com_zte_ums_ict_alarmcount_warning_text'));
					
						$("#hd_alarmcount_total_before_text").text($.i18n.prop('com_zte_ums_ict_alarmcount_total_before_text'));
						$("#hd_alarmcount_total_after_text").text($.i18n.prop('com_zte_ums_ict_alarmcount_total_after_text'));
						$("#header_notification_bar").css('display','block');
				}
				function queryAlarmTotalCount() {
					$.getJSON("/web/rest/web/fm/count/total", function(data) {
						//var alarmcount = $.parseJSON(data);
						alarmLight(data);
						if($("#header_notification_bar")&&$("#header_notification_bar").length>0&&$("#header_notification_bar").children().length>0){
							registerAlarmTotalCountToCometd();
						}
					})
				}
				if($("#header_notification_bar")&&$("#header_notification_bar").length>0&&$("#header_notification_bar").children().length>0){
					queryAlarmTotalCount();
				}
				var registerAlarmTotalCountToCometd = function () {
					var self = this;
					var cometd = $.cometd;
					var cometURL = location.protocol + "//" + location.host + "/web/cometd";
					cometd.configure({
					url: cometURL,
					logLevel: 'debug'
					});
					cometd.addListener('/meta/handshake', function (handshake){          	
						if (handshake.successful === true) {
							cometd.batch(function () {   			 
								cometd.subscribe('/alarm/usercount', function (message) {
								var alarmcount =message.data;
								alarmLight(alarmcount);  	        				 
								})
							})
						}
					});
					cometd.handshake();
				};
					
				// if($("#header_notification_bar")&&$("#header_notification_bar").length>0&&$("#header_notification_bar").children().length>0){
					// registerAlarmTotalCountToCometd();
				// }
				//setInterval(queryAlarmTotalCount, 30 * 1000);		
			}
		}
		else if(base){
			//$("#header_notification_bar").hide();
			//$('#header_notification_bar').empty();
			$('#header_notification_bar').html("<div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>");
		}
    });
    }catch(e){} 
})(jQuery); 

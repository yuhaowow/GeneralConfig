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
var ChangePWD = function () {
	$.validator.addMethod("passwordCheck", function() {
		if( $('#password').attr('type') == 'text' && $('#rpassword').attr('type') == 'text'){
			return true;
		} 
		if( $('#password').attr('type') == 'password' && $('#rpassword').attr('type') == 'password' ){
			if($('#password').val() == $('#rpassword').val() ){
				return true;
			}
		}
		if($('#password').val() =='' && $('#rpassword').attr('type') == 'text' || $('#rpassword').val() =='' && $('#password').attr('type')){
			return true;
		}
		return false;
	});
    var handleLogin = function () {
        $('.login-form').validate({
            errorElement : 'span', //default input error message container
            errorClass : 'help-block', // default input error message class
            focusInvalid : true, // do not focus the last invalid input
            onfocusout : function (element) {
                $(element).valid();
            },
            rules : {
                oldpassword : {
                    required : false
                },
                password : {
                    required : false
                },
                rpassword : {
                    required : false,
                    passwordCheck : true
                }
            },

            messages : {
                oldpassword : {
                    required : $.i18n.prop('com_zte_ums_ict_sm_user_inputoldpwd')
                },
                password : {
                    required : $.i18n.prop('com_zte_ums_ict_sm_user_inputnewpwd')
                },
                rpassword : {
                    required : $.i18n.prop('com_zte_ums_ict_sm_user_inputnewpwdagain'),
                    equalTo : $.i18n.prop('com_zte_ums_ict_sm_password_confirm_not_consistent'),
					passwordCheck : $.i18n.prop('com_zte_ums_ict_sm_password_confirm_not_consistent'),
                }
            },

            invalidHandler : function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('.login-form')).show();
            },

            highlight : function (element) { // hightlight error inputs
                $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success : function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement : function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler : function (form) {
                // form.submit();
                var params = {};
                var currentUser = httpRequest("GET", FrameConst.REST_GET_USERNAME, "");
                params["userName"] = currentUser;
                params["password"] = $("#oldpassword").attr('type')=='password' ? $("#oldpassword").val() : '';
                params["newPassword"] = $("#password").attr('type')=='password' ? $("#password").val() : '';
                params["confirmPassword"] = $("#rpassword").attr('type')=='password' ? $("#rpassword").val() : '';

				 
                jQuery('#submitBtn').prop("disabled", true);
                $.ajax({
                    type : "POST",
                    url : "/web/rest/sm/user/modifyCurrentPassword",
                    data : params,
                    dataType : "json",
                    success : function (data) {
                        var returnValue = data;
						
                        if (returnValue && returnValue.result == 1) {
                            bootbox.alert($.i18n.prop('com_zte_ums_ict_sm_user_op_ok'), function () {								
                                window.closeModal('changepwdDlg');
                            });
                        } else {
                            bootbox.alert(returnValue.response.data);                         
                        }
						jQuery('#submitBtn').prop("disabled", false);
                    },
                    error : function (xhr, ajaxOptions, thrownError) {
                        jQuery('#submitBtn').prop("disabled", false);
                    }
                });

            }
        });

        $('.login-form input').keypress(function (e) {
            $("#nameOrpwdError").hide();
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit();
                }
                return false;
            }
        });
    }
    var handleI18n = function () {
        $("#com_zte_ums_ict_sm_user_modify_current_password").text($.i18n.prop('com_zte_ums_ict_sm_user_modify_current_password'));
        $("#com_zte_ums_ict_sm_user_old_password").text($.i18n.prop('com_zte_ums_ict_sm_user_old_password'));
        $("#com_zte_ums_ict_sm_user_password").text($.i18n.prop('com_zte_ums_ict_sm_user_password'));
        $("#com_zte_ums_ict_sm_user_confirmpassword").text($.i18n.prop('com_zte_ums_ict_sm_user_confirmpassword'));

        $("#oldpassword").attr("placeholder", $.i18n.prop('com_zte_ums_ict_sm_user_old_password'));
        $("#password").attr("placeholder", $.i18n.prop('com_zte_ums_ict_sm_user_password'));
        $("#rpassword").attr("placeholder", $.i18n.prop('com_zte_ums_ict_sm_user_confirmpassword'));

        $("#com_zte_ums_ict_sm_user_ok").text($.i18n.prop('com_zte_ums_ict_sm_user_ok'));
        $("#com_zte_ums_ict_sm_user_cancel_button").text($.i18n.prop('com_zte_ums_ict_sm_user_cancel_button'));

    }
	var handleShowModalEvent = function () {
	    $('#changepwdDlg').on('show.bs.modal', function (e) {
	        $("#oldpassword").val("");
	        $("#password").val("");
	        $("#rpassword").val("");
			$(".has-error", this).removeClass("has-error");
			$("span.help-block", this).hide();
			
			if(!('placeholder' in document.createElement('input'))){   // �ж�������Ƿ�֧�� placeholder,ie9��֧�֣���Ҫ���⴦��
					$("#rpassword").rules("remove", "equalTo");
					$('[placeholder]').focus(function() {
						var input = $(this);
						input.attr('type','password');
						$("#rpassword").rules("add", {    
							passwordCheck :true
						});					
						if (input.val() == input.attr('placeholder')) {
							input.val('');
							
						}
					}).blur(function() {
						var input = $(this);
						if (input.val() == '' || input.val() == input.attr('placeholder')) {
							input.attr('type','text');
							$("#rpassword").rules("remove", "passwordCheck");
							
							input.val(input.attr('placeholder'));
							
						}
					}).blur();
			
			
			//
			};
			

	    });
	}
    return {
        //main function to initiate the module
        init : function () {
            handleI18n();
			handleShowModalEvent();
            handleLogin();
        }
    };
}
();

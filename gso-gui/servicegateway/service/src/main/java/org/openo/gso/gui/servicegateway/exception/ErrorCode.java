/*
 * Copyright (c) 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.openo.gso.gui.servicegateway.exception;

/**
 * Constant Class.<br/>
 * <p>
 * Define constant for recording error.
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/4
 */
public class ErrorCode {

    /**
     * Fail to operate database.
     */
    public static final String SVCMGR_OPER_MYSQL_DB_ERROR = "servicemgr.mysql.oper_mysql_db_error";

    /**
     * Parameter is wrong.
     */
    public static final String SVCMGR_SERVICEMGR_BAD_PARAM = "servicemgr.bad_param";

    /**
     * Operation is failure.
     */
    public static final String SVCMGR_SERVICEMGR_FAIL_OPERATION = "servicemgr.fail.operation";

    /**
     * Package is being deleted.
     */
    public static final String SVCMGR_PACKAGE_BEING_DELETED = "servicemgr.package.beingDelete";
    
    /**
     * operation fail
     */
    public static final int FAIL = 3;

    /**
     * operation partial success
     */
    public static final int PARTIAL_SUCCESS = 1;
    
    /**
     * operation success
     */
    public static final int SUCCESS = 0;

    /**
     * Constructor<br/>
     * <p>
     * </p>
     * 
     * @since GSO 0.5
     */
    private ErrorCode() {

    }
}

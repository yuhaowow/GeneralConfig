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

package org.openo.gso.gui.servicegateway.constant;

/**
 * Constant definition.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/22
 */
public class Constant {

	 /**
     * Service instance ID.
     */
    public static final String SERVICE_INDENTIFY = "service";
    
    /**
     * Service instance ID.
     */
    public static final String SERVICE_INSTANCE_ID = "serviceId";

    /**
     * Service package ID.
     */
    public static final String SERVICE_DEF_ID = "serviceDefId";

    /**
     * Service gateway URL.
     */
    public static final String SERVICE_GATEWAY_URI = "gatewayUri";

    /**
     * Service operation.
     */
    public static final String SERVICE_OPERATION = "operation";

    /**
     * Service delete operation.
     */
    public static final String SERVICE_DELETE_OPERATION = "delete";

    /**
     * Create workflow name.
     */
    public static final String WORK_FLOW_PLAN_CREATE = "create";

    /**
     * Delete workflow name.
     */
    public static final String WORK_FLOW_PLAN_DELETE = "delete";

    /**
     * filed in wso2 body.
     */
    public static final String WSO_PROCESSID = "processId";

    /**
     * filed in wso2 body.
     */
    public static final String WSO_PARAMS = "params";

    /**
     * Response result;
     */
    public static final String RESPONSE_RESULT = "result";

    /**
     * Response status.
     */
    public static final String RESPONSE_STATUS = "status";

    /**
     * Response status description.
     */
    public static final String RESPONSE_STATUS_DESCRIPTION = "statusDescription";

    /**
     * Error code of response.
     */
    public static final String RESPONSE_ERRORCODE = "errorCode";

    /**
     * Operations success.
     */
    public static final String RESPONSE_STATUS_SUCCESS = "success";

    /**
     * Operation failed.
     */
    public static final String RESPONSE_STATUS_FAIL = "fail";

    /**
     * ID of instance.
     */
    public static final String NS_INSTANCE_ID = "nsInstanceId";

    /**
     * service identify.
     */
    public static final String SERVICE_ID = "serviceId";

    /**
     * job Id
     */
    public static final String JOB_ID = "jobId";
    
    /**
     * service file Path:etc
     */
    public static final String FILE_PATH_ETC = "etc";

    /**
     * service file Path:register
     */
    public static final String FILE_PATH_REGISTER = "register";

    /**
     * service file Path:file name
     */
    public static final String FILE_PATH_JSON = "service.json";
    
    /**
     * the head type for Restful
     */
    public static final String HEAD_ERMAP_TYPE = "Content-Type";

    /**
     * the head value for Restful
     */
    public static final String HEAD_ERMAP_VALUE = "application/json;charset=UTF-8";
    
    /**
     * the URL for Register service to the M-service Bus
     */
    public static final String M_BUS_REGISTER_URL = "/openoapi/microservices/v1/services";

    /**
     * the IP key for the service file
     */
    public static final String SERVICE_KEY_IP = "getInputIP";

    /**
     * constant:0
     */
    public static final int ZERO = 0;

    /**
     * Constructor<br/>
     * <p>
     * </p>
     * 
     * @since GSO 0.5
     */
    private Constant() {

    }
}

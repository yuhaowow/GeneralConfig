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

package org.openo.gso.gui.servicegateway.util.http;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.type.TypeReference;
import org.openo.baseservice.remoteservice.exception.ExceptionArgs;
import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.roa.util.restclient.RestfulResponse;
import org.openo.gso.gui.servicegateway.constant.Constant;
import org.openo.gso.gui.servicegateway.exception.ErrorCode;
import org.openo.gso.gui.servicegateway.exception.HttpCode;
import org.openo.gso.gui.servicegateway.util.json.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Interface to deal response result.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/9/1
 */
public class ResponseUtils {

    /**
     * Log server
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ResponseUtils.class);

    /**
     * Constructor<br/>
     * <p>
     * </p>
     * 
     * @since GSO 0.5
     */
    private ResponseUtils() {
    }

    /**
     * Check whether there is exception.<br/>
     * <p>
     * If fail, throw the exception.
     * </p>
     * 
     * @param response rest response
     * @param function function name
     * @throws ServiceException when the result of rest request is failure.
     * @since GSO 0.5
     */
    public static void checkResonseAndThrowException(RestfulResponse response, String function)
            throws ServiceException {
        if(!HttpCode.isSucess(response.getStatus())) {
            ServiceException roaExceptionInfo = null;
            try {
                roaExceptionInfo = JsonUtil.unMarshal(response.getResponseContent(), ServiceException.class);
            } catch(ServiceException e) {
                LOGGER.error("transfer the response json string has some error: {}", e);

                ExceptionArgs args = new ExceptionArgs();
                args.setDescArgs(new String[] {"Fail to " + function});

                throw new ServiceException(ServiceException.DEFAULT_ID, response.getStatus(), args);
            }

            throw roaExceptionInfo;
        }
    }

    /**
     * Parse data to assigned type model.<br/>
     * 
     * @param request restful request
     * @param key key
     * @param type type
     * @return model data
     * @throws ServiceException when transfer failed
     * @since SDNO 0.5
     */
    @SuppressWarnings("unchecked")
    public static <T> List<T> getDataModelFromRsp(String request, String key, Class<T> type) throws ServiceException {
        //ValidateUtil.assertStringNotNull(request);
        Map<String, Object> requestMap = JsonUtil.unMarshal(request, Map.class);
        Object data = requestMap.get(key);
        List<T> dataModelList = new LinkedList<T>();
        if(data instanceof List) {
            for(Object model : (List<T>)data) {
                if(!(model instanceof Map)) {
                    LOGGER.error("The format of response content is wrong! Not Map.");
                    throw new ServiceException(ErrorCode.SVCMGR_SERVICEMGR_BAD_PARAM,
                            "The format of response content is wrong.");
                }

                dataModelList.add(JsonUtil.unMarshal(JsonUtil.marshal(model), type));
            }
        }

        return dataModelList;
    }

    /**
     * Parse data to assigned type model.<br/>
     * 
     * @param request restful request
     * @param type type
     * @return model data
     * @throws ServiceException when transfer failed
     * @since SDNO 0.5
     */
    public static <T> T getDataModelFromRspList(String request, TypeReference<T> type) throws ServiceException {
        //ValidateUtil.assertStringNotNull(request);
        return JsonUtil.unMarshal(request, type);
    }

    /**
     * Set operation result.<br/>
     * 
     * @param status status fail or success
     * @param exception operation exception information
     * @param errorCode error code
     * @return result in form of map
     * @since GSO 0.5
     */
    public static Map<String, Object> setOperateStatus(String status, ServiceException exception, String errorCode) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(Constant.RESPONSE_STATUS, status);
        if(null == exception) {
            result.put(Constant.RESPONSE_STATUS_DESCRIPTION, status);
        } else {
            if((null != exception.getExceptionArgs()) && (null != exception.getExceptionArgs().getDescArgs())) {
                result.put(Constant.RESPONSE_STATUS_DESCRIPTION, exception.getExceptionArgs().getDescArgs().toString());
            }
        }
        result.put(Constant.RESPONSE_ERRORCODE, errorCode);

        return result;
    }
    
    /**
     * Assemble operation result.<br/>
     * 
     * @param objectId instance ID
     * @param operateCode operation result
     * @return Response result
     * @since GSO 0.5
     */
    public static Map<String, Object> setResult(String objectId, Object operateCode) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(Constant.RESPONSE_RESULT, operateCode);
        String serviceId = (null != objectId) ? objectId : null;
        result.put(Constant.SERVICE_INSTANCE_ID, serviceId);

        return result;
    }
}

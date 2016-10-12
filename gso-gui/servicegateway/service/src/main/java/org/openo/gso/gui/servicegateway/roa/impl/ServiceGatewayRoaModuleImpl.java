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

package org.openo.gso.gui.servicegateway.roa.impl;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;

import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.util.RestUtils;
import org.openo.gso.gui.servicegateway.constant.Constant;
import org.openo.gso.gui.servicegateway.exception.HttpCode;
import org.openo.gso.gui.servicegateway.roa.inf.IServiceGatewayRoaModule;
import org.openo.gso.gui.servicegateway.service.impl.ServiceGatewayImpl;
import org.openo.gso.gui.servicegateway.service.inf.IServiceGateway;
import org.openo.gso.gui.servicegateway.util.http.ResponseUtils;
import org.openo.gso.gui.servicegateway.util.validate.ValidateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implement class for restful interface.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/4
 */
public class ServiceGatewayRoaModuleImpl implements IServiceGatewayRoaModule {

    /**
     * Log server.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceGatewayRoaModuleImpl.class);

    /**
     * Service manager.
     */
    private IServiceGateway serviceGateway = new ServiceGatewayImpl();

    /**
     * Create service instance.<br/>
     * 
     * @param servletReq http request
     * @return response
     * @throws ServiceException when operate database or parameter is wrong.
     * @since GSO 0.5
     */
    @Override
    public Response createService(HttpServletRequest servletReq) {
    	Map<String, Object> operateStatus = null;
        Map<String, Object> result = null;
        String serviceId = null;
        try {
            // 1. Check validation
            String reqContent = RestUtils.getRequestBody(servletReq);
            ValidateUtil.assertStringNotNull(reqContent);

            // 2. Create service
            serviceId = serviceGateway.createService(reqContent, servletReq);
        } catch(ServiceException exception) {
            LOGGER.error("Fail to create service instance.");
            operateStatus = ResponseUtils.setOperateStatus(Constant.RESPONSE_STATUS_FAIL, exception,
                    String.valueOf(exception.getHttpCode()));            
            result = ResponseUtils.setResult(serviceId, operateStatus);

            return Response.accepted().entity(result).build();
        }

        operateStatus = ResponseUtils.setOperateStatus(Constant.RESPONSE_STATUS_SUCCESS, null,
                String.valueOf(HttpCode.RESPOND_OK));
        result = ResponseUtils.setResult(serviceId, operateStatus);

        return Response.accepted().entity(result).build();
    }

    /**
     * Delete service instance.<br/>
     * 
     * @param serviceId service instance id
     * @param servletReq http request
     * @return response
     * @throws ServiceException when operate database or parameter is wrong.
     * @since GSO 0.5
     */
    @Override
    public Response deleteService(String serviceId, HttpServletRequest servletReq) {
        Map<String, Object> operateStatus = null;
        Map<String, Object> result = null;
        try {
            // 1. Check validation
            String reqContent = RestUtils.getRequestBody(servletReq);
            ValidateUtil.assertStringNotNull(reqContent);

            // 2. Delete service
            serviceGateway.deleteService(serviceId, servletReq);
        } catch(ServiceException exception) {
            LOGGER.error("Fail to delete service instance.");
            operateStatus = ResponseUtils.setOperateStatus(Constant.RESPONSE_STATUS_FAIL, exception,
                    String.valueOf(exception.getHttpCode()));
            result = ResponseUtils.setResult(serviceId, operateStatus);

            return Response.accepted().entity(result).build();
        }

        operateStatus = ResponseUtils.setOperateStatus(Constant.RESPONSE_STATUS_SUCCESS, null,
                String.valueOf(HttpCode.RESPOND_OK));
        result = ResponseUtils.setResult(serviceId, operateStatus);

        return Response.accepted().entity(result).build();
    }

	public IServiceGateway getServiceGateway() 
	{
		return serviceGateway;
	}

	public void setServiceGateway(IServiceGateway serviceGateway) 
	{
		this.serviceGateway = serviceGateway;
	}
    
}

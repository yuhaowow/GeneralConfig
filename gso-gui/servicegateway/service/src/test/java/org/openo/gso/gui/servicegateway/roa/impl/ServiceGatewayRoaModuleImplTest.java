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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.roa.util.restclient.RestfulResponse;
import org.openo.baseservice.util.RestUtils;
import org.openo.gso.gui.servicegateway.exception.HttpCode;
import org.openo.gso.gui.servicegateway.service.impl.ServiceGatewayImpl;
import org.openo.gso.gui.servicegateway.util.http.HttpUtil;

import mockit.Mock;
import mockit.MockUp;

/**
 * Test ServicemgrRoaModuleImpl class.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/3
 */
public class ServiceGatewayRoaModuleImplTest {

	/**
     * File path
     */
    private static final String FILE_PATH = "src/test/resources/json/";
	
    /**
     * Service ROA.
     */
	ServiceGatewayRoaModuleImpl serviceRoa = new ServiceGatewayRoaModuleImpl();

    /**
     * Service manager.
     */
	ServiceGatewayImpl serviceManager = new ServiceGatewayImpl();


    /**
     * Http request.
     */
    HttpServletRequest httpRequest;
    
    /**
     * Rest response.
     */
    RestfulResponse responseSuccess;

    /**
     * Before executing UT, start sql.<br/>
     * 
     * @since GSO 0.5
     */
    @Before
    public void start() throws IOException, SQLException {
    	responseSuccess = new RestfulResponse();
    	responseSuccess.setStatus(HttpCode.RESPOND_OK);
    }



    /**
     * After executing UT, close session<br/>
     * 
     * @since GSO 0.5
     */
    @After
    public void stop() {

    }

    /**
     * Test create service.<br/>
     * 
     * @throws ServiceException when fail to operate database or parameter is wrong.
     * @since GSO 0.5
     */
    @Test
    public void testCreateService() throws ServiceException {
    	// mock request body
        mockGetRequestBody(FILE_PATH + "createServiceInstance.json");
        
        mockPost(responseSuccess);

        serviceRoa.createService(httpRequest);
    }

    /**
     * Test delete service.<br/>
     * 
     * @throws ServiceException when fail to operate database or parameter is wrong.
     * @since GSO 0.5
     */
    @Test
    public void testDeleteService() throws ServiceException {
        mockGetRequestBody(FILE_PATH + "createServiceInstance.json");        
        mockPost(responseSuccess);
        serviceRoa.deleteService("1", httpRequest);
    }

    /**
     * Mock to get request body.<br/>
     * 
     * @param file json file path.
     * @since GSO 0.5
     */
    private void mockGetRequestBody(final String file) {
        new MockUp<RestUtils>() {

            @Mock
            public String getRequestBody(HttpServletRequest request) {
                return getJsonString(file);
            }
        };
    }
    
    /**
     * Mock rest request for post.<br/>
     * 
     * @param response rest response
     * @since GSO 0.5
     */
    private void mockPost(final RestfulResponse response) {
        new MockUp<HttpUtil>() {

            @Mock
            public RestfulResponse post(final String url, Object sendObj, HttpServletRequest httpRequest) {
                return response;
            }
        };
    }
    
    /**
     * Get json string from file.<br/>
     * 
     * @param file the path of file
     * @return json string
     * @throws IOException when fail to read
     * @since GSO 0.5
     */
    private String getJsonString(final String file) {
        if(StringUtils.isEmpty(file)) {
            return "";
        }

        String json = null;
        try {
            FileInputStream fileStream = new FileInputStream(new File(file));
            json = IOUtils.toString(fileStream);
        } catch(Exception e) {
            Assert.fail(e.getMessage());
        }

        return json;
    }
}

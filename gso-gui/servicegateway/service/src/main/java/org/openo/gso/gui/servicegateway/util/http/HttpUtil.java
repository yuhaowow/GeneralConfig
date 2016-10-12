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

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.roa.util.restclient.RestfulFactory;
import org.openo.baseservice.roa.util.restclient.RestfulParametes;
import org.openo.baseservice.roa.util.restclient.RestfulResponse;
import org.openo.gso.gui.servicegateway.util.json.JsonUtil;

/**
 * Method class that provides interface to do http request.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/9/1
 */
public class HttpUtil {

    /**
     * Constructor<br/>
     * <p>
     * </p>
     * 
     * @since GSO 0.5
     */
    private HttpUtil() {

    }

    /**
     * Get operation.<br/>
     * 
     * @param url request location
     * @param httpHeaders request headers
     * @param httpRequest http request
     * @return response
     * @throws ServiceException when request is failure.
     * @since GSO 0.5
     */
    public static RestfulResponse get(final String url, final Map<String, String> httpHeaders,
            HttpServletRequest httpRequest) throws ServiceException {
        final RestfulParametes restfulParametes = getRestfulParametes(httpRequest);
        for(Map.Entry<String, String> entry : httpHeaders.entrySet()) {
            restfulParametes.putHttpContextHeader(entry.getKey(), entry.getValue());
        }

        return RestfulFactory.getRestInstance(RestfulFactory.PROTO_HTTP).get(url, restfulParametes);
    }

    /**
     * Post operation.<br/>
     * 
     * @param url request location
     * @param sendObj request body
     * @param httpRequest http request
     * @return response
     * @throws ServiceException when request is failure.
     * @since GSO 0.5
     */
    public static RestfulResponse post(final String url, Object sendObj, HttpServletRequest httpRequest)
            throws ServiceException {

        final RestfulParametes restfulParametes = getRestfulParametes(httpRequest);
        if(sendObj != null) {
            String strJsonReq = JsonUtil.marshal(sendObj);
            restfulParametes.setRawData(strJsonReq);
        }

        return RestfulFactory.getRestInstance(RestfulFactory.PROTO_HTTP).post(url, restfulParametes);
    }

    /**
     * Delete operation.<br/>
     * 
     * @param url request location
     * @param httpRequest http request
     * @return response
     * @throws ServiceException when request is failure.
     * @since GSO 0.5
     */
    public static RestfulResponse delete(final String url, HttpServletRequest httpRequest) throws ServiceException {
        final RestfulParametes restfulParametes = getRestfulParametes(httpRequest);
        return RestfulFactory.getRestInstance(RestfulFactory.PROTO_HTTP).delete(url, restfulParametes);
    }

    /**
     * Put operation.<br/>
     * 
     * @param url request location
     * @param httpHeaders request headers
     * @param httpRequest http request
     * @return response
     * @throws ServiceException when request is failure.
     * @since GSO 0.5
     */
    public static RestfulResponse put(final String url, final Map<String, String> httpHeaders,
            HttpServletRequest httpRequest) throws ServiceException {
        final RestfulParametes restfulParametes = getRestfulParametes(httpRequest);
        for(Map.Entry<String, String> entry : httpHeaders.entrySet()) {
            restfulParametes.putHttpContextHeader(entry.getKey(), entry.getValue());
        }

        return RestfulFactory.getRestInstance(RestfulFactory.PROTO_HTTP).put(url, restfulParametes);
    }

    /**
     * Fill in request parameters.<br/>
     * 
     * @param httpRequest http request
     * @return rest parameters
     * @since GSO 0.5
     */
    public static RestfulParametes getRestfulParametes(HttpServletRequest httpRequest) {
        final RestfulParametes restfulParametes = new RestfulParametes();
        restfulParametes.putHttpContextHeader("Content-Type", "application/json;charset=UTF-8");
        return restfulParametes;
    }
}

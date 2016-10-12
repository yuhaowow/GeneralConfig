/*
 * Copyright 2016 Huawei Technologies Co., Ltd.
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

package org.openo.gso.gui.servicegateway.util.register;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import org.apache.commons.lang.StringUtils;
import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.roa.util.restclient.RestfulFactory;
import org.openo.baseservice.roa.util.restclient.RestfulParametes;
import org.openo.baseservice.roa.util.restclient.RestfulResponse;
import org.openo.gso.commsvc.common.constant.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Register Tool <br/>
 * 
 * @author
 * @since GSO 0.5, 2016-8-9
 */
public class RegisterUtil {

    /**
     * Logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(RegisterUtil.class);

    private RegisterUtil() {
    }
    
    /**
     * register the service to M-Bus by the parameter<br/>
     * 
     * @author
     * @param jsonInfo
     *            register body Data
     * @since GSO 0.5, 2016-8-9
     */
    public static void registerService(final String jsonInfo) {
        // check the parameter
        if (StringUtils.isEmpty(jsonInfo)) {
            LOGGER.error("RegisterUtil registerService jsonInfo is null");
            return;
        }

        // replace the remote IP Address by the jsonInfo
        String bodyData = jsonInfo;
        boolean isIPExist = bodyData.indexOf(Constant.SERVICE_KEY_IP) > Constant.ZERO;
        try {
            // get the local IP address
            String localIP = InetAddress.getLocalHost().getHostAddress();

            // if the jsonInfo have the getInputIP string,start to replace the
            // local IP
            if (isIPExist) {
                if (!StringUtils.isEmpty(localIP)) {
                    bodyData = bodyData.replace(Constant.SERVICE_KEY_IP, localIP);
                } else {
                    LOGGER.error("RegisterUtil registerService localIP is null");
                    return;
                }
            }
        } catch (UnknownHostException e) {
            LOGGER.error("RegisterUtil registerService getHostAddress fail:", e);
            if (isIPExist) {
                // if get local IP failed In the isIPExist is true ,operation is
                // stopped.
                return;
            }
        }

        // register the service to M-bus by the restful Interface
        try {
            RestfulResponse restfulRsp = RestfulFactory.getRestInstance("http").post(Constant.M_BUS_REGISTER_URL,
                    getRestfulParameters(bodyData));
            if (null != restfulRsp) {
                // Record the result of registration
                // (201:success;415:Invalid Parameter;500:Internal Server Error)
                LOGGER.info("RegisterUtil registerService register result:", restfulRsp.getStatus());
            }
        } catch (ServiceException e) {
            LOGGER.error("RegisterUtil registerService post fail:", e);
        }
    }

    /**
     * get the parameters for restful<br/>
     * 
     * @author
     * @param bodyData
     *            Json Body
     * @return the RestfulParametes Instance
     * @since GSO 0.5, 2016-8-9
     */
    private static RestfulParametes getRestfulParameters(final String bodyData) {
        RestfulParametes param = new RestfulParametes();
        param.putHttpContextHeader(Constant.HEAD_ERMAP_TYPE, Constant.HEAD_ERMAP_VALUE);
        param.setRawData(bodyData);
        return param;
    }

    /**
     * read the service file<br/>
     * 
     * @param path
     *            the service File Path
     * @return jsonString
     * @since GSO 0.5, 2016-8-9
     */
    public static String readFile(String path) {
        // check parameter
        if (StringUtils.isEmpty(path)) {
            return null;
        }

        File file = new File(path);
        BufferedReader reader = null;
        String laststr = "";
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            // Read one line at a time until the end of the null file.
            while ((tempString = reader.readLine()) != null) {
                // add the line
                laststr = laststr + tempString;
            }
            reader.close();
        } catch (IOException e) {
            LOGGER.error("GSO ReadFile fail.", e);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                    LOGGER.error("GSO ReadFile reader close fail.", e1);
                }
            }
        }
        return laststr;
    }
}

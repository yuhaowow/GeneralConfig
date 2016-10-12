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

import static org.junit.Assert.assertEquals;

import org.junit.Test;

/**
 * Test Constant class.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/4
 */
public class ErrorCodeTest {

    @Test
    public void test() {
        assertEquals("servicemgr.mysql.oper_mysql_db_error", ErrorCode.SVCMGR_OPER_MYSQL_DB_ERROR);
        assertEquals("servicemgr.bad_param", ErrorCode.SVCMGR_SERVICEMGR_BAD_PARAM);
    }

}

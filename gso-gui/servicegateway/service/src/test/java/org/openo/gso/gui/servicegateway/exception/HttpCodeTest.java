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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * Test Constant class.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/4
 */
public class HttpCodeTest {

    @Test
    public void test() {
        assertEquals(400, HttpCode.BAD_REQUEST);
        assertEquals(500, HttpCode.INTERNAL_SERVER_ERROR);
        assertEquals(406, HttpCode.NOT_ACCEPTABLE);
        assertEquals(404, HttpCode.NOT_FOUND);
        assertEquals(202, HttpCode.RESPOND_ACCEPTED);
        assertEquals(200, HttpCode.RESPOND_OK);
        assertTrue(HttpCode.isSucess(200));
        assertFalse(HttpCode.isSucess(400));
    }

}

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
package org.openo.gso.gui.servicegateway.testsuite;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.openo.gso.gui.servicegateway.activator.ActivatorTest;
import org.openo.gso.gui.servicegateway.exception.HttpCodeTest;
import org.openo.gso.gui.servicegateway.roa.impl.ServiceGatewayRoaModuleImplTest;
import org.openo.gso.gui.servicegateway.service.impl.ServiceGatewayImplTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({
	ActivatorTest.class,
	ServiceGatewayImplTest.class,	
	HttpCodeTest.class,
	ServiceGatewayRoaModuleImplTest.class
        
})
public class SuiteSGTest {

}

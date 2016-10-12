/*
 * Copyright 2016, CMCC Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ict_framework_func1(word){  
         var a1 = CryptoJS.enc.Utf8.parse(ict_framework_aes_a1);   
         var a2  = CryptoJS.enc.Utf8.parse(ict_framework_aes_a2);   
		 var srcs = CryptoJS.enc.Utf8.parse(word);  
         var encrypted = CryptoJS.AES.encrypt(srcs, a1, { iv: a2,mode:CryptoJS.mode.CBC});  
         return encrypted.toString();  
}
  
function ict_framework_func2(word){  
        var a1 = CryptoJS.enc.Utf8.parse(ict_framework_aes_a1);   
        var a2  = CryptoJS.enc.Utf8.parse(ict_framework_aes_a2);   
        var decrypt = CryptoJS.AES.decrypt(word, a1, { iv: a2,mode:CryptoJS.mode.CBC});  
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();  
} 







var ict_framework_aes_a1 = "9763853428462486";
var ict_framework_aes_a2 = "9763853428462486";
/*
 * Copyright 2016 ZTE Corporation.
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
function loadPropertiesSideMenu(lang, propertiesFileNamePrefix, propertiesFilePath) {
    jQuery.i18n.properties({
        language: lang,
        name: propertiesFileNamePrefix,
        path: propertiesFilePath, // resource path
        mode: 'map', 
        callback: function () {
            var i18nItems = $('[name_i18n=com_zte_conductor_ui_i18n]');
            for (var i = 0; i < i18nItems.length; i++) {
                var $item = $(i18nItems.eq(i));
                var itemId = $item.attr('id_i18n');
                var itemTitle = $item.attr('title');                
                if (typeof($item.attr("title")) == "string") {
                    $item.attr("title", ($.i18n.prop(itemTitle)));
                }
                if (undefined != itemId && typeof($item.attr("placeholder")) == "undefined") {
                    $item.text($.i18n.prop(itemId));
                } else if (undefined != itemId && typeof($item.attr("placeholder")) != "undefined") {
                    $item.attr("placeholder", $.i18n.prop(itemId));
                }
            }
        }
    });
}
var lang = getLanguage();
loadPropertiesSideMenu(lang, 'roc-vim-iui-i18n', 'i18n/');


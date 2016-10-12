/*
 * Copyright 2016 ZTE Corporation.
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
var templateParameters = {
    changed: true,
    parameters: []
};

var lcmHandler = function () {
    this._addOwnEvents();
};

lcmHandler.prototype = {
    _addOwnEvents: function () {
        $('#createNS').click(this.okAction);
    },
    okAction: function () {
        var vimLocation = $('#vim_location').val();
        if(vimLocation == 'select') {
            alert('Location must be selected in Template Parameters');
            return;
        }

        var serviceInstance = {
            serviceTemplateId: $("#svcTempl").val(),
            serviceName: $('#svcName').val(),
            description: $('#svcDesc').val(),
            inputParameters: collectServiceParameters(templateParameters.parameters),
            vimLocation: vimLocation
        };
        var gatewayService = '/openoapi/servicegateway/v1/services';
        $.when(
            fetchServiceTemplateBy(serviceInstance.serviceTemplateId)
        ).then(
            function(template) {
                serviceInstance.templateName = template.name;
                serviceInstance.serviceType = template.serviceType;
                return createNetworkServiceInstance(template, serviceInstance, gatewayService);
            }
        ).then(
            function(serviceInstance) {
                updateTable(serviceInstance);
                $('#vmAppDialog').removeClass('in').css('display', 'none');
            }
        );
    }
};

function initParameterTab() {
    // Service template was not changed. Do not re-initiate the parameter tab.
    if (!templateParameters.changed) {
        return;
    }
    var templateId = $("#svcTempl").val();
    if ('select' === templateId) {
        document.getElementById("templateParameterTab").innerHTML = '';
        return;
    }
    $.when(
        generateTemplateParametersComponent(templateId),
        generateLocationComponent(templateId)
    ).then(
        function (templateParameters, location) {
            document.getElementById("templateParameterTab").innerHTML = templateParameters + location;
        }
    );
}

function generateTemplateParametersComponent(templateId) {
    var defer = $.Deferred();
    $.when(
        fetchTemplateParameterDefinitions(templateId)
    ).then(
        function (templateParameterResponse) {
            templateParameters = translateToTemplateParameters(templateParameterResponse.inputs);
            defer.resolve(transformToComponents(templateParameters.parameters));
        }
    );
    return defer;
}

function generateLocationComponent(templateId) {
    var defer = $.Deferred();
    $.when(
        fetchServiceTemplateBy(templateId)
    ).then(
        function (template) {
            if(template.serviceType === 'SDNO') {
                // SDNO need not config location parameter.
                defer.resolve('');
                return;
            }
            $.when(
                fetchVimInfo()
            ).then(
                function (vimsResponse) {
                    var vims = translateToVimInfo(vimsResponse);
                    defer.resolve(transformToLocationComponent(vims));
                }
            )
        }
    );
    return defer;
}

function fetchTemplateParameterDefinitions(templateId) {
    var queryParametersUri = '/openoapi/catalog/v1/servicetemplates/' + templateId + '/parameters';
    return $.ajax({
        type: "GET",
        url: queryParametersUri
    });
}

function fetchVimInfo() {
    var vimQueryUri = '/openoapi/extsys/v1/vims';
    return $.ajax({
        type: "GET",
        url: vimQueryUri
    });
}

function translateToTemplateParameters(inputs) {
    var inputParameters = [];
    var i;
    for (i = 0; i < inputs.length; i += 1) {
        inputParameters[i] = {
            name: inputs[i].name,
            type: inputs[i].type,
            description: inputs[i].description,
            defaultValue: inputs[i].defaultValue,
            required: inputs[i].required,
            id: 'parameter_' + i,
            value: inputs[i].defaultValue
        };
    }
    return {changed: false, parameters: inputParameters};
}

function translateToVimInfo(vims) {
    var result = [];
    var i;
    for (i = 0; i < vims.length; i += 1) {
        var option = '<option value="' + vims[i].vimId + '">' + vims[i].name + '</option>';
        result[i] = {
            vimId: vims[i].vimId,
            vimName: vims[i].name
        };
    }
    return result;
}

function transformToComponents(parameters) {
    var components = '';
    var i;
    for (i = 0; i < parameters.length; i += 1) {
        var component = '<div class="mT15 form-group" style="margin-left:25px;">' +
            '<label class="col-sm-3 control-label">' +
            '<span>' + parameters[i].description + '</span>' + generateRequiredLabel(parameters[i]) +
            '</label>' +
            '<div class="col-sm-7">' +
            '<input type="text" id="' + parameters[i].id + '" name="parameter description" class="form-control" placeholder="' +
            parameters[i].description + '" value="' + parameters[i].value + '" />' +
            '</div></div>';
        components = components + component;
    }
    return components;
}

function generateRequiredLabel(parameter) {
    var requiredLabel = '';
    if (parameter.required === 'true') {
        requiredLabel = '<span class="required">*</span>';
    }
    return requiredLabel;
}

function transformToLocationComponent(vims) {
    var component = '<div class="form-group" style="margin-left:25px;margin-bottom:15px;">' +
        '<label class="col-sm-3 control-label">' +
        '<span>Location</span>' +
        '<span class="required">*</span>' +
        '</label>' +
        '<div class="col-sm-7">' +
        '<select class="form-control" style ="padding-top: 0px;padding-bottom: 0px;"' +
        ' id="vim_location" name="vim_location">' +
        transformToOptions(vims) +
        '</select></div></div>';
    return component;
}

function transformToOptions(vims) {
    var options = '<option value="select">--select--</option>';
    var i;
    for (i = 0; i < vims.length; i += 1) {
        var option = '<option value="' + vims[i].vimId + '">' + vims[i].vimName + '</option>';
        options = options + option;
    }
    return options;
}

function fetchServiceTemplateBy(templateId) {
    var defer = $.Deferred();
    var serviceTemplateUri = '/openoapi/catalog/v1/servicetemplates/' + templateId;
    var template = {};
    $.when(
        $.ajax({
            type: "GET",
            url: serviceTemplateUri,
            contentType: "application/json"
        })
    ).then(
        function(response) {
            template.name = response.templateName;
            template.gsarId = response.csarId;
            var queryCsarUri = '/openoapi/catalog/v1/csars/' + template.gsarId;
            return $.ajax({
                type: "GET",
                url: queryCsarUri,
                contentType: "application/json"
            });
        }
    ).then(
        function(response) {
            if(response.type === 'GSAR') {
                template.serviceType = 'GSO';
            } else if(response.type === 'NSAR' || response.type === 'NFAR') {
                template.serviceType = 'NFVO';
            } else if(response.type === 'SSAR') {
                template.serviceType = "SDNO";
            }
            defer.resolve(template)
        }
    );
    return defer;
}

function createNetworkServiceInstance(template, serviceInstance, gatewayService) {
    if (template.serviceType === 'GSO') {
        return createGsoServiceInstance(gatewayService, serviceInstance, template);
    } else if (template.serviceType === 'NFVO') {
        return createNfvoServiceInstance(gatewayService, serviceInstance);
    } else if (template.serviceType === 'SDNO') {
        return createSdnoServiceInstance(gatewayService, serviceInstance);
    }
}

function createGsoServiceInstance(gatewayService, serviceInstance, serviceTemplate) {
    var defer = $.Deferred();
    serviceInstance.inputParameters.location = serviceInstance.vimLocation;
    var gsoLcmUri = '/openoapi/lifecyclemgr/v1/services';
    var parameter = {
        'name': serviceInstance.serviceName,
        'description': serviceInstance.description,
        'serviceDefId': serviceTemplate.gsarId,
        'templateId': serviceInstance.serviceTemplateId,
        'templateName': serviceTemplate.templateName,
        'gatewayUri': gsoLcmUri,
        'parameters': serviceInstance.inputParameters
    };
    $.when($.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter)
    })).then(function(response) {
        serviceInstance.serviceId = response.serviceId;
        defer.resolve(serviceInstance);
    });
    return defer;
}

function createNfvoServiceInstance(gatewayService, serviceInstance) {
    var nfvoLcmNsUri = '/openoapi/nslcm/v1.0/ns';
    serviceInstance.inputParameters.location = serviceInstance.vimLocation;
    return createServiceInstance(gatewayService, nfvoLcmNsUri, serviceInstance);
}

function createSdnoServiceInstance(gatewayService, serviceInstance) {
    var sdnoLcmNsUri = '/openoapi/sdnonslcm/v1.0/ns';
    return createServiceInstance(gatewayService, sdnoLcmNsUri, serviceInstance);
}

function createServiceInstance(gatewayService, nsUri, serviceInstance) {
    var defer = $.Deferred();
    var sParameter = {
        'nsdId': serviceInstance.serviceTemplateId,
        'nsName': serviceInstance.serviceName,
        'description': serviceInstance.description,
        'gatewayUri': nsUri
    };
    $.when($.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(sParameter)
    })).then(function(response) {
        var nsInstanceId = response.nsInstanceId;
        serviceInstance.serviceId = nsInstanceId;
        var initNsUrl = nsUri + '/' + nsInstanceId + '/Instantiate';
        var parameter = {
            'gatewayUri': initNsUrl,
            'nsInstanceId': nsInstanceId,
            'additionalParamForNs': serviceInstance.inputParameters
        };
        return $.ajax({
            type: "POST",
            url: gatewayService,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(parameter)
        });
    }).then(function() {
        defer.resolve(serviceInstance);
    });
    return defer;
}


function collectServiceParameters(parameters) {
    var serviceParameters = {};
    var i;
    for (i = 0; i < parameters.length; i += 1) {
        serviceParameters[parameters[i].name] = $('#' + parameters[i].id).val();
    }
    return serviceParameters;
}

function updateTable(serviceInstance) {
    serviceInstance.createTime = formatDate(new Date());
    $('#sai').bootstrapTable("append", serviceInstance);
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
}

function deleteNe(rowId, row) {
    var instanceId = row.serviceId;
    var serviceType = row.serviceType;
    var gatewayService = '/openoapi/servicegateway/v1/services';
    var remove = function () {
        $('#sai').bootstrapTable('remove', {field: 'serviceId', values: [instanceId]});
    };
    if(serviceType === 'GSO') {
        deleteGsoServiceInstance(gatewayService, instanceId, remove)
    } else if (serviceType === 'NFVO') {
        var nfvoNsUri = '/openoapi/nslcm/v1.0/ns';
        deleteNonGsoServiceInstance(gatewayService, nfvoNsUri, instanceId, remove);
    } else if (serviceType === 'SDNO') {
        var sdnoNsUri = '/openoapi/sdnonslcm/v1.0/ns';
        deleteNonGsoServiceInstance(gatewayService, sdnoNsUri, instanceId, remove);
    }
}

function deleteGsoServiceInstance(gatewayService, instanceId, remove) {
    var gsoLcmUri = '/openoapi/lifecyclemgr/v1/services';
    $.when(
        deleteNetworkServiceInstance(gatewayService, gsoLcmUri, instanceId)
    ).then(
        function() {
            remove();
        }
    );
}

function deleteNonGsoServiceInstance(gatewayService, nsUri, instanceId, remove) {
    $.when(
        terminateNetworkServiceInstance(gatewayService, nsUri, instanceId)
    ).then(
        function() {
            return deleteNetworkServiceInstance(gatewayService, nsUri, instanceId);
        }
    ).then(
        function() {
            remove();
        }
    )
}

function deleteNetworkServiceInstance(gatewayService, nsUri, instanceId) {
    var instanceUri = nsUri + '/' + instanceId;
    var parameter = {
        'operation': "DELETE",
        'gatewayUri': instanceUri
    };
    return $.ajax({
        type: "DELETE",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter)
    });
}

function terminateNetworkServiceInstance(gatewayService, nsUri, instanceId) {
    var instanceUri = nsUri + '/' + instanceId;
    var nsTerminateUri = instanceUri + '/terminate';
    var terminateParameter = {
        'nsInstanceId': instanceId,
        'terminationType': "graceful",
        'gracefulTerminationTimeout': "60",
        'operation': "POST",
        'gatewayUri': nsTerminateUri
    };
    return $.ajax({
        type: "DELETE",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(terminateParameter)
    });
}

var sendMsg = {
    get: "get",
    post: "post"
}

function request(url, requestType, data, success, error, async) {
    var setting = {
        url: url,
        async: async ? async : false,
        type: requestType,
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        data: data,
        success: success,
        error: error
    }

    $.ajax(setting);

}

$.ajaxSetup({
    cache: false
});

function callAjax(data_type, url, callback, input_data, form) {
    $.ajax({
        url: url,
        data: input_data,
        dataType: data_type,
        type: 'POST',
        error: function(jqxhr, ts, err) {
            //console.error(jqxhr);
        },
        success: function(data) {
            isAuthError(data);
            if(data_type.toLowerCase() == 'html'){
                callback(data);
            }else{
//                     if(typeof(form) != "undefined"){
            if (!(is_error = isError(data, form)) && typeof(form) == "object"){
//            console.log(isError(data, form));
                callback(data);
			}else{
                callback(data, is_error);
			}
            }
        }
    })
}

function callAjaxFileUpload(url, form_object, callback) {
    var form_data = new FormData($(form_object)[0]);

    $.ajax({
        url: url,
        type: 'post',
        data: form_data,
        dataType: 'json',
        processData: false,
        contentType: false,
        error: function(jqxhr, ts, err) {
            callback(false, true);
            console.log(ts);
        },
        success: function(data) {
            isAuthError(data);
            if(!isError(data, $(form_object))) { 
                callback(data);
            } else {
                callback(data, true);
            }
        }
    });
    
}

function isError(data_array, element) {
    var result = false;
    $.each(data_array, function(key, value) {
		if(value == null) return false;
        if (typeof(value.error) == "string") {

            //alert(key, "Attention", value.error);
            result = true;
        } else if (typeof(value.error) == "object") {
            $.each(value.error, function(name, text) {
                if (typeof(element) == "object")
                    showFormElemError(element, name, text);
                else{
                    //console.error(text);
                }
            })
            result = true;
        } else if ($.isArray(value)) {
            result = isError(value, element);
        }
    })
    return result;
}

function isAuthError(response) {
    return false;
    /*if (response != null)
        if (typeof(response["auth_error"]) != "undefined") {
            top.location.href = "/" + response["auth_error"]["auth_controller"];
        } else if (typeof(response["debug"]) != "undefined") {
            $.each(response["debug"], function(key, item) {
                alert("debug info key=" + key + " item=" + item);
            });
        }*/
}
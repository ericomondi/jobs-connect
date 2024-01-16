var validator_default_txt = {
    "1": {
        "JQVname": ["required"],
        "text": "Please select a valid value"
    },
    "5": {
        "JQVname": ["maxlength", "minlength"],
        "text": "Length failed"
    },
    "9": {
        "JQVname": ["equalTo"],
        "text": "Not match"
    },
    "6": {
        "JQVname": ["email", "url", "date", "digits"],
        "text": "Incorrect value"
    }
};
var FORM_VALIDATOR_CONFIGS_DIR = "/public_new/assets/js/form_validate_configs/";
var FORM_VALIDATORS = new Array();
var FORM_VALIDATE_CONFIGS = {};

function validationFormByConfig($form, customCallbackError, customCallbackNoError, fileConfigName, pathToFile, noValidateOnFocus) {
    if (!$form.length) {
        return;
    }
    if (typeof customCallbackError === 'undefined') {
        customCallbackError = null;
    }
    if (typeof customCallbackNoError === 'undefined') {
        customCallbackNoError = null;
    }
    if (typeof fileConfigName === 'undefined' || fileConfigName === null) {
        fileConfigName = $form.attr('id').replace('form_', '');
    }
    if (typeof pathToFile === 'undefined' || pathToFile === null) {
        pathToFile = FORM_VALIDATOR_CONFIGS_DIR;
    }
    
    if (typeof noValidateOnFocus === 'undefined' || noValidateOnFocus === null) {
        noValidateOnFocus = false;
    }

    if (typeof FORM_VALIDATE_CONFIGS[fileConfigName] === 'undefined') {
        $.ajax({
            dataType: "json",
            url: pathToFile + fileConfigName + '.json',
            success: function (data) {
                FORM_VALIDATE_CONFIGS[fileConfigName] = data;
                bindValidate($form, fileConfigName, customCallbackError, customCallbackNoError, noValidateOnFocus);
            },
            error: function () {
                //console.log('config ' + fileConfigName + ' has not been found');
            }
        });
    } else {
        bindValidate($form, fileConfigName, customCallbackError, customCallbackNoError, noValidateOnFocus);
    }
    
    //THAT FOR CHECKING ELEMENTS IMMEDIATELY AFTER TYPING IN FORM
    $form.find('input,textarea').on('input', function () {
        if ($form.validate().checkForm()) {
            $form.find('[data-submit-button-validate="immediately"]').removeClass('submit_btn-disabled');
        } else {
            $form.find('[data-submit-button-validate="immediately"]').addClass('submit_btn-disabled');
        }
    });
}

function showFormElemError(form, element_name, text, noValidateOnFocus) {
    var element = form.find("[name='" + element_name + "']");
    clearFormElemErrors(element);

    if (noValidateOnFocus) {
        if (element.is(":focus")) {
            return false;
        }
    }
    
    if (typeof text === 'number' && validator_default_txt[text]) {
        text = validator_default_txt[text].text;
    }

    if (typeof (element.attr("error")) === "undefined" || element.attr("error") !== text) {
        var error_data = {
            error_id: element_name,
            text: text
        };

        var cont = element.closest(".block_element");
        switch (element.attr("type")) {
            case("checkbox"):
            case("radio"):
                element.closest(".block_element").find(".block-error").html((new jSmart($("#error-alert").html())).fetch(error_data));
                element.closest(".block_element").find(".form-check-label").addClass('alert-control-check');
                break;
            default:
                if (element.is('select') && element.closest(".block_element").find('.select2-container').length) {//select2
                    element.closest(".block_element").find('.select2-container').addClass('alert-control');
                }
                
                element.addClass('error').attr("error", text);
                
                if (element.closest(".block_element").find("[data-input-error='" + element.attr('name') + "']").length > 0) {//for multiple inputs in one block-element
                    element.closest(".block_element").find("[data-input-error='" + element.attr('name') + "']").html((new jSmart($("#error-alert").html())).fetch(error_data));
                } else if (element.closest(".block_element").find(".block-error").length > 0) {
                    element.closest(".block_element").find(".block-error").html((new jSmart($("#error-alert").html())).fetch(error_data));
                } else {
                    element.after((new jSmart($("#error-alert").html())).fetch(error_data));
                }
                break;
        }
    }
}

function clearFormElemErrors(input) {
    input.attr("error", false);
    input.closest(".block_element").find("[data-input]").empty();
    if (input.closest(".block_element").find("[data-input-error='" + input.attr('name') + "']").length) { //for inputs imputs in one block-element
        input.closest(".block_element").find("[data-input-error='" + input.attr('name') + "']").empty();
    } else {
        input.closest(".block_element").find(".block-error").empty();
        input.closest(".block_element").find(".alert-required").remove();
    }

    input.removeClass('error');
    input.closest(".block_element").find('.select2-container').removeClass('alert-control error');
    input.closest(".block_element").find(".form-check-label.alert-control-check").removeClass('alert-control-check');
}



function bindValidate(form, config_name, customCallbackError, customCallbackNoError, noValidateOnFocus) {
    data = FORM_VALIDATE_CONFIGS[config_name];
    var field_name = [];
    var settings = {
        messages: {},
        rules: {}
    };
    for (field_name in data) {
        var rules = {};
        var messages = {};
        if (data[field_name]['error_txt']) {
            var err_name;
            for (err_name in data[field_name]['error_txt']) {
                if (data[field_name]['error_txt']['0'] != undefined) {
                    messages = data[field_name]['error_txt']['0'];
                    break;
                }
                msg = data[field_name]['error_txt'][err_name];
                switch (err_name) {
                    case "password_mismatch":
                        messages["equalTo"] = msg;
                        break;
                    case 'wrong_symbols':
                        messages["email"] = msg;
                        messages["url"] = msg;
                        messages["date"] = msg;
                        messages["digits"] = msg;
                        break;
                    case "wrong_length":
                        messages['maxlength'] = msg;
                        messages['minlength'] = msg;
                        break;
                    case 'not_defined':
                        messages['required'] = msg;
                        break;
                    case 'no_equal':
                        messages['equalTo'] = msg;
                        break;
                    case 'min_words':
                        messages['minWords'] = msg;
                    case 'max_words':
                        messages['maxWords'] = msg;
                        break;
                    default :
                        messages[err_name] = msg;
                }
            }
        }
        var rule_name;
        for (rule_name in data[field_name]) {
            if (rule_name === 'error_txt') {
                continue;
            }
            switch (rule_name) {
                case 'max_length':
                    rules['maxlength'] = data[field_name][rule_name] * 1;
                    break;
                case 'min_length' :
                    rules['minlength'] = data[field_name][rule_name] * 1;
                    break;
                case 'not_null':
                    rules['required'] = (data[field_name][rule_name] == "1");
                    break;
                case 'min_words':
                    rules['minWords'] = data[field_name][rule_name] * 1;
                    break;
                case 'lettersonly':
                    rules['lettersonly'] = data[field_name][rule_name] * 1;
                    break;
                case 'letterswithbasicpunc':
                    rules['letterswithbasicpunc'] = data[field_name][rule_name] * 1;
                    break;
                case 'digits':
                    rules['digits'] = data[field_name][rule_name] * 1;
                    break;
                case 'equal_to':
                    rules['equalTo'] = '#' + form.attr('id') + ' input[name=\'' + data[field_name][rule_name] + '\']';
                    break;
                case 'type':
                    switch (data[field_name][rule_name] * 1) {
                        case 6:
                            rules['email'] = {
                                depends: function () {
                                    $(this).val($.trim($(this).val()));
                                    return true;
                                }};
                            break;
                        case 7:
                            rules['digits'] = {
                                depends: function () {
                                    $(this).val($.trim($(this).val()));
                                    return true;
                                }};

                            break;
                        case 8:
                            rules['date'] = true;
                            break;

                    }
                    break;
                default:
                    rules[rule_name] = data[field_name][rule_name];
            }
        }
        settings['rules'][field_name] = rules;
        settings['messages'][field_name] = messages;
        settings.errorPlacement = function (error, element) {
            showFormElemError(form, element.attr("name"), error.html(), noValidateOnFocus);
            if (typeof customCallbackError === 'function') {
                customCallbackError(form, element, error);
            }
        };
        settings.invalidHandler = function (form, validator) {
            if (!validator.numberOfInvalids()) {
                return;
            }
            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 30
            });

        };
        settings.unhighlight = function (input) {
            clearFormElemErrors($(input));
            if (typeof customCallbackNoError === 'function') {
                customCallbackNoError(form, $(input));
            }
        };
        delete settings;
        delete rules;
        delete messages;
    }
    FORM_VALIDATORS[form.attr('id')] = form.validate(settings);
}

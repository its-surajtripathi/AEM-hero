$(document).ready(function() {
    $('input:not(:hidden),select').on('blur change', function() {
        validatingForm($(this).closest('.form-group'));
    });

});
//validations
function appendErrorElem(element, errMsg) {
    var $errorElem;
    if (!element.find('.hasError').length) {
        $errorElem = $('<span class="hasError" />');
        $errorElem.html(errMsg || '');
        element.append($errorElem);
    }
}

function validateInputRegex(str, regex) {
    var inputRegex = new RegExp(regex);
    if (str !== undefined && regex !== undefined) {
        if (str && inputRegex.test(str)) {
            return true;
        }
        return false;
    }
}

function validatingForm($elem) {
    var flag = true;
    var errorText;
    if ($elem.length) {
        var $self = $elem,
            $inputReq = $self.find('[required=true]'),
            selfReqvalue = $inputReq.val(),
            regexValidation = $inputReq.attr('data-regex'),
            isSpecialCase = $inputReq.attr('type') === 'checkbox' || $inputReq.attr('type') === 'radio';
        var isInputType = $inputReq.attr('type') === 'text' || $inputReq.attr('type') === 'password' || $inputReq.attr('type') === 'tel' || $inputReq.attr('type') === 'number' || $inputReq.attr('type') === 'email';
        $elem.find('.hasError').remove();
        if (!(selfReqvalue === '' || selfReqvalue === null) && isSpecialCase) {
            // checkbox and radio button code goes here
            if (!$inputReq.is(':checked')) {
                errorText = $inputReq.attr('data-required-msg') || 'Required Field';
                appendErrorElem($self, errorText);
                flag = false;
            } else {
                $self.find('.hasError').remove();
            }
        } else if (selfReqvalue == "" && isInputType) {
             errorText = $inputReq.attr('data-required-msg') || 'Required Field';
                appendErrorElem($self, errorText);
                flag = false;

        }else if ((isInputType && (regexValidation !== undefined) && !validateInputRegex(selfReqvalue, regexValidation))) {
            errorText = $inputReq.attr('data-regex-constraint-message') || 'Validation For Regular Expression Has Failed.';
            appendErrorElem($self, errorText);
            flag = false;
        } else {
            if (selfReqvalue === '' || selfReqvalue === null) {
                errorText = $inputReq.attr('data-required-msg') || 'Required Field';
                appendErrorElem($self, errorText);
                flag = false;
            } else {
                $self.find('.hasError').remove();
            }
        }

    }
    return flag;
}


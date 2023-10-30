function SetView_Sms_SMSAuthentication(utilsScriptLocation, resources) {

    window.addEventListener('load', function () {
        
        delegateValidateFormError.push(setErrorAuthentication);

        //inputmask plugin and validation from jquery conflict because of their events order, we will use two fields to prevent it : 
        //this will display the input mask for UX experience, 
        var $userNameWithMask = $("#UsernameMasked");
        //this other will actually send data to the server
        var $userName = $("#SMSAuthentication_Username");

        //check if value is pre-filled by browser/cookie BEFORE setting up the validators
        if ($userName.val() != null && $userName.val().trim() != "") {
            $userNameWithMask.val($userName.val());
        }

        //enable validation on hidden fields
        /*$("form").data("validator").settings.ignore = "";*/ // Done in cshtml for testing => implement a cleaner/reusable solution afterwards

        try {
            //extend validation
            $userName.validate({
                normalizer: function (value) {
                    // Trim the value of the `field` element before validating. this trims only the value passed to the attached validators, not the value of the element itself.
                    return $.trim(value);
                }
            });
        } catch (e) {
            console.debug('validate with normalizer failed');
        }

        //copy the displayed value inside the field that will be posted back, without mask for validation
        //$userNameWithMask.on("focusout", function () {
        //    copyValueinMaskedField($userNameWithMask, $userName);
        //    setErrorAuthentication();
        //});

        SetPhoneNumberFormInput("#SMSAuthentication_MobileNumber", "#SMSAuthentication_InternationalizedMobileNumber", utilsScriptLocation, resources);
    });

    function setErrorAuthentication() {
        AddErrorClassForField($("#SMSAuthentication_Username"), $("#UsernameMasked"));
    }
}

$(document).ready(function () {
    $('#todosForm').validate(
        {
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: getPasswordRules()
            },
            debug: true,
            onsubmit: false,
            highlight: function (element) {
                $(element).closest('.control-group').removeClass('success').addClass('error');
            },
            success: function (element) {
                element
                .text('OK!').addClass('valid')
                .closest('.control-group').removeClass('error').addClass('success');
            }
        });
});

function getPasswordRules() {
    if (location.pathname.toLowerCase().indexOf("login") != -1) {
        return {
            required: true
        };
    }
    else
        return {
            required: true,
            minlength: 8
        };
}
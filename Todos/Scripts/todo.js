
var CUC = 'cuc';
var FORMID = "todosForm";
var EMAIL_CTL = "email";
var PASS_CTL = "password";
var ERROR_CTL = "errorContainer";


$(document).ready(function () {
    ko.applyBindings(new AppViewModel(), $("#navbar")[0]);
    setNavActive();
});

function AppViewModel() {
    this.isUserLoggedIn = ko.observable(Application.isUserLoggedIn());
}

function setNavActive() {
    if (location.pathname == "/")
        $('#navbar li').first().addClass("active");
    else
        $('#navbar a[href^="/' + location.pathname.split("/")[1] + "/" + location.pathname.split("/")[2] + '"]').parent().addClass('active');
}

Application = {
    isUserLoggedIn: function () {
        return (this._getUserContent() != null);
    },

    createUser: function () {
        if (this._pageIsValid()) {
            var options = {
                email: $("#" + EMAIL_CTL).val(),
                password: $("#" + PASS_CTL).val(),
                success: function (data) {
                    Application.saveUserContent(data);
                    Application.redirectToHome();
                },
                error: function () {
                    $("#" + ERROR_CTL).html("Create User Failed!");
                }
            }

            Todo.createUser(options);
        }
    },

    logIn: function () {
        if (this._pageIsValid()) {
            var options = {
                email: $("#" + EMAIL_CTL).val(),
                password: $("#" + PASS_CTL).val(),
                success: function (data) {
                    Application.saveUserContent(data);
                    Application.redirectToHome();
                },
                error: function () {
                    $("#" + ERROR_CTL).html("Login Failed!");
                }
            }

            Todo.startSession(options);
        }
    },

    logOut: function () {
        if (this.isUserLoggedIn()) {
            var options = {
                success: function () {
                    $.removeCookie(CUC);
                    Application.redirectToHome();
                },
                error: function () {
                    alert('Log Out Error');
                    console.log(data);
                }
            }
            Todo.endSession(options);
        }
    },

    redirectToHome: function () {
        window.location.href = "/";
    },

    saveUserContent: function (data) {
        $.cookie(CUC, JSON.stringify(data), { path: "/" });
    },

    _getUserContent: function () {
        return ($.cookie(CUC)) ? JSON.parse($.cookie(CUC)) : null;
    },

    _pageIsValid: function () {
        return $("#" + FORMID).valid();
    }    
}

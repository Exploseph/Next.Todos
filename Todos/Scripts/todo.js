var CUC = 'cuc';
var FORMID = "todosForm";
var EMAIL_CTL = "email";
var PASS_CTL = "password";
var ERROR_CTL = "errorContainer";

$(document).ready(function () {
    ko.bindingHandlers.sortable.options.handle = ".drag-handle";
    // Show hide edit
    ko.bindingHandlers.visibleAndSelect = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, valueAccessor);
            if (valueAccessor()) {
                setTimeout(function () {
                    $(element).find("input").focus().select();
                }, 0);
            }
        }
    };

    ko.applyBindings(new todoViewModel());
    setNavActive();
});

function todoViewModel() {
    var self = this;
    self.isUserLoggedIn = ko.observable(Application.isUserLoggedIn());
    self.todos = Application.usersTodos;
    self.itemChanged = function (todo) {
        Application.updateTodo(todo);
        return true;
    };
    self.clearTodo = function (data, event) {
        if (data === self.selectedTodo()) {
            self.selectedTodo(null);
        }
    };
    self.selectedTodo = Application.selectedTodo;
    self.selectTodo = function (todo) {
        self.selectedTodo = todo;
    };
    self.isTodoSelected = function (todo) {
        return todo === self.selectedTodo();
    };
    self.addTodo = function () {
        var todo = new observableTodo(null, "", false);
        Application.addTodo(todo);
    }
}

function observableTodo(id, description, is_complete) {
    this.id = id;
    this.description = ko.observable(description);
    this.is_complete = ko.observable(is_complete);
}

function setNavActive() {
    if (location.pathname == "/")
        $('#navbar li').first().addClass("active");
    else
        $('#navbar a[href^="/' + location.pathname.split("/")[1] + "/" + location.pathname.split("/")[2] + '"]').parent().addClass('active');
}

Application = {
    isUserLoggedIn: function () {
        if (Todo.USER == null && this.getUserContent() != null) {
            Todo.USER = this.getUserContent();
            this.loadTodos();
        }
        return (this.getUserContent() != null);
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

    getUserContent: function () {
        return ($.cookie(CUC)) ? JSON.parse($.cookie(CUC)) : null;
    },

    loadTodos: function () {
        var options = {
            success: function (data) {
                $.each(data, function (i, o) { Application.usersTodos.push(new observableTodo(o.id, o.description, o.is_complete)); });
            },
            error: function (data) {
                alert('Error getting todos');
            }
        };

        Todo.loadTodos(options);
    },

    selectedTodo: ko.observable(),

    usersTodos: ko.observableArray(),

    addTodo: function (todo) {
        var options = {
            success: function (newTodo) {
                var obTodo = new observableTodo(newTodo.id, newTodo.description, newTodo.is_complete);
                Application.usersTodos.splice(0, 0, obTodo);
                Application.selectedTodo(obTodo);
            },
            error: function () {
                alert('Error adding todo');
            },
            todo: {
                "description": todo.description(),
                "is_complete": todo.is_complete()
            }
        };

        Todo.createTodo(options);
    },

    updateTodo: function (todo) {
        if (todo.id == null) {
            this.addTodo(todo);
        }
        else {
            var options = {
                data: {
                    description: todo.description,
                    is_complete: todo.is_complete
                },
                todoId: todo.id,
                success: function (t) {

                },
                error: function () {
                    alert("Update todo error");
                }
            };

            Todo.updateTodo(options);
        }
    },

    _pageIsValid: function () {
        return $("#" + FORMID).valid();
    }
}

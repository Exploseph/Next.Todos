var CUC = 'cuc';
var CSO = 'cso';
var FORMID = "todosForm";
var EMAIL_CTL = "email";
var PASS_CTL = "password";
var ERROR_CTL = "errorContainer";

$(document).ready(function () {
    ko.bindingHandlers.sortable.options.handle = ".drag-handle";

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

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.bindingHandlers.returnKey = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            ko.utils.registerEventHandler(element, 'keydown', function (evt) {
                if (evt.keyCode === 13) {
                    evt.preventDefault();
                    evt.target.blur();
                    valueAccessor().call(viewModel);
                }
            });
        }
    };

    ko.applyBindings(new todoViewModel());
    setNavActive();
});

function todoViewModel() {
    var self = this;
    self.isUserLoggedIn = ko.observable(Application.isUserLoggedIn());
    self.todos = Application.usersTodos;
    self.itemChanged = function (todo, event) {
        Application.updateTodo(todo);
        if (event.target.type == "checkbox")
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
    self.moveCallback = function (args) {
        if (Application.usersTodos().length > 0) {
            Application.setTodoOrder();
        }
    }
    self.showCompleted = ko.observable(true);
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

function sortTodos(todos) {
    var order = Application.getTodoOrder();
    if (order && order.length > 0) {
        results = [];
        $.each(order, function (i, key) {
            var found = false;
            $.each(todos, function (j, item) {
                if (!found && item.id == key) {
                    results.push(item);
                    found = true;
                    return false;
                } else
                    return true;
            })
        })

        // verify all todos are returned
        if (results.length == todos.length)
            return results;
        else {
            $.removeCookie(CSO);
            return todos;
        }
    }
    else
        return todos;
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

    getTodoOrder: function () {
        return ($.cookie(CSO)) ? JSON.parse($.cookie(CSO)) : null;
    },

    setTodoOrder: function () {
        var sortOrder = $.map(Application.usersTodos(), function (val, i) { return val.id; });
        $.cookie(CSO, JSON.stringify(sortOrder), { expires: 7, path: '/' });
    },

    loadTodos: function () {
        var options = {
            success: function (data) {
                var sortedData = sortTodos(data);
                $.each(sortedData, function (i, o) { Application.usersTodos.push(new observableTodo(o.id, o.description, o.is_complete)); });
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

                var sortOrder = Application.getTodoOrder();
                if (!sortOrder || sortOrder.length == 0) {
                    Application.setTodoOrder();
                    sortOrder = Application.getTodoOrder();
                }

                var newOrder = sortOrder.splice(0, 0, obTodo.id);
                Application.setTodoOrder(newOrder);
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
                    description: todo.description(),
                    is_complete: todo.is_complete()
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

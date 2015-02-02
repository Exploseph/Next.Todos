<%@ Page Title="" Language="C#" MasterPageFile="~/Todo.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div data-bind="visible: !Application.isUserLoggedIn()">
        Please <a href="/Account/Login.aspx">log in</a> or <a href="/Account/Signup.aspx">sign up</a> to see Todos.
    </div>
    <div class="applicationContainer" data-bind="visible: Application.isUserLoggedIn()">
        <div class="row">
            <div class="col-md-6">
                <a href="#" data-bind="click: addTodo">Add todo</a>
            </div>
            <div class="col-md-6">
                <div class="pull-right">
                    <label class="control-label" for="cbShowCompleted">Show completed</label>
                    <input type="checkbox" id="cbShowCompleted" name="cbShowCompleted" data-bind="checked: showCompleted" />
                </div>
            </div>
        </div>
        <div class="container" data-bind="sortable: { data: todos, afterMove: moveCallback }">
            <div class="row" data-bind="fadeVisible: $root.showCompleted() || !is_complete()">
                <div class="todo-row">
                    <div class="todo-container">
                        <div class="drag-handle pull-left"></div>
                        <div class="todo-checkbox pull-left">
                            <input type="checkbox" data-bind="checked: is_complete, value: is_complete, event: { click: $root.itemChanged }" />
                        </div>
                        <div class="col-md-10 pull-left" data-bind="visible: !$root.isTodoSelected($data)">
                            <a href="#" title="Click to edit" data-bind="html: description, click: $root.selectedTodo, css: { completed: is_complete }"></a>
                            <a href="#" title="Click to edit" data-bind="visible: (description && !description()), click: $root.selectedTodo, css: { completed: is_complete }"><span class="empty-message">click to add description</span></a>
                        </div>
                        <div class="col-md-10 pull-left" data-bind="visibleAndSelect: $root.isTodoSelected($data)">
                            <input class="todo-input" data-bind="value: description, returnKey: function () { }, event: { blur: $root.clearTodo, change: $root.itemChanged }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="display: none;">
        <!-- needed to prevent postback when single input is on page and enter key is pressed.-->
        <input class="todo-input" />
    </div>
</asp:Content>


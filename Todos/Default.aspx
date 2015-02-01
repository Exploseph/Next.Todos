<%@ Page Title="" Language="C#" MasterPageFile="~/Todo.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <a href="#" data-bind="click: addTodo">Add todo</a>
    <div class="container" data-bind="sortable: todos">
        <div class="row">
            <div class="todo-row">
                <div class="todo-container">
                    <div class="drag-handle pull-left"></div>
                    <div class="todo-checkbox pull-left">
                        <input type="checkbox" data-bind="checked: is_complete, value: is_complete, event: { click: $root.itemChanged }" />
                    </div>
                    <div class="col-md-10 pull-left" data-bind="visible: !$root.isTodoSelected($data)">                        
                        <a href="#" title="Click to edit" data-bind="html: description, click: $root.selectedTodo"></a>                        
                        <a href="#" title="Click to edit" data-bind="visible: (description && !description()), click: $root.selectedTodo">edit</a>                        
                    </div>
                    <div class="col-md-10 pull-left" data-bind="visibleAndSelect: $root.isTodoSelected($data)">
                        <input data-bind="value: description, event: { blur: $root.clearTodo, change: $root.itemChanged }" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>


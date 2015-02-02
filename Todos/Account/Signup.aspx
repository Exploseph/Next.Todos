<%@ Page Title="" Language="C#" MasterPageFile="~/Todo.master" AutoEventWireup="true" CodeFile="Signup.aspx.cs" Inherits="Account_Signup" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="form-horizontal todo-login-forms" >
        <fieldset>
            <div class="control-group">
                <div id="errorContainer" class="errorMessage"></div>
            </div>
            <div class="control-group">
                <label class="control-label" for="email">Email*</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" name="email" id="email" autofocus="autofocus" />
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="password">Password*</label>
                <div class="controls">
                    <input type="password" class="input-xlarge" name="password" id="password" />
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-large" id="btn_loginUser" onclick="javascript:Application.createUser(); return false;" >Sign up</button>
                <button type="reset" class="btn" onclick="javascript:Application.redirectToHome(); return false;">Cancel</button>
            </div>
        </fieldset>
    </div>
</asp:Content>


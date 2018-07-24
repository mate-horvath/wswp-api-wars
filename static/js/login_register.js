let login = {
    loadLogin: function () {
        $("#loginButton").bind("click", function () {
            let loginInfo = {};
            loginInfo["username"] = document.getElementById("inputUserName").value;
            loginInfo["password"] = document.getElementById("inputPassword").value;
            apiHandler.sendLoginData(loginInfo)
        })
    },
    clearForm: function () {
        document.getElementById("loginForm").reset();
    }
};

let register = {
    loadRegister: function () {
        $("#registerButton").bind("click", function () {
            let registerInfo = {};
            registerInfo["username"] = document.getElementById("inputUserName").value;
            registerInfo["password"] = document.getElementById("inputPassword").value;
            apiHandler.sendRegisterData(registerInfo)
        })
    },
    clearForm: function () {
        document.getElementById("registerForm").reset();
    }
};

register.loadRegister();
login.loadLogin();
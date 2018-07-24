let apiHandler = {
    _data: {},
    getAllData: function (callback, url) {
        $.ajax({
            dataType: "json",
            url: url,
            success: function (response) {
                this._data = response;
                callback(response);
            }
        });
    },
    getModalData: function (planetName, urls, callback) {
        Promise.all(urls.map(url =>
            fetch(url).then(resp => resp.text())
        )).then(residents => {
            callback(planetName, residents);
        })
    },
    sendVoteData: function (planetInfo) {
        $.ajax({
            type: "POST",
            url: "/vote",
            data: planetInfo,
            success: function () {
                alert("Vote is Successful")
            }
        });
    },
    getVoteData: function (callback) {
        $.ajax({
            type: "POST",
            url: "/voteStatistics",
            success: function (response) {
                callback(response)
            }
        });
    },
    sendLoginData: function (loginInfo) {
        $.ajax({
            type: "POST",
            url: "/login",
            data: loginInfo,
            success: function (data) {
                data = JSON.parse(data);
                if (data['status'] === 'FAILED') {
                    alert("Incorrect Credentials");
                    login.clearForm();
                }
                else {
                    window.location.href = data['status'];
                }

            }
        });
    },
    sendRegisterData: function (registerInfo) {
        $.ajax({
            type: "POST",
            url: "/registration",
            data: registerInfo,
            success: function (data) {
                data = JSON.parse(data);
                if (data['status'] === 'FAILED') {
                    alert("Invalid username");
                    register.clearForm();
                }
                else {
                    window.location.href = data['status'];
                }
            },
        });
    },
};
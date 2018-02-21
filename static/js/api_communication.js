let apiHandler = {
    _data: {},
    getAllData: function (callback, url) {
        $.ajax({
            dataType: "json",
            url: url,
            success: function(response) {
                this._data = response;
                callback(response);
        }
});
    },
};
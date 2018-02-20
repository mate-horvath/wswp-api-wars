let apiHandler = {
    getAllData: function (callback, url) {
        $.ajax({
            dataType: "json",
            url: url,
            success: function(response) {
                callback(response);
        }
});
    },
};
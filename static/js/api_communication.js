let apiHandler = {
    getAllData: function (callback) {
        $.ajax({
            dataType: "json",
            url: 'https://swapi.co/api/planets/',
            success: function(response) {
                callback(response);
        }
});
    },
};
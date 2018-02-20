let dom = {
    loadData: function (url) {
        apiHandler.getAllData(this.showData, url);
    },
    showData: function (data) {
        $("#tableBody").empty();
        $.each(data["results"], function (idx, val) {
            let content = `<tr>
            <td>${val["name"]}</td>
            <td>${val["diameter"]}</td>
            <td>${val["climate"]}</td>
            <td>${val["terrain"]}</td>
            <td>${val["surface_water"]}</td>
            <td>${val["population"]}</td>
            </tr>`;
            let newNode = $(content);
            newNode.appendTo("#tableBody");
        });
        dom.loadListeners(data["previous"],data["next"])
    },
    loadListeners: function (previous, next) {
        $("#previousPage").bind("click", function () {
            dom.loadData(previous)
        });
        $("#nextPage").bind("click", function () {
            dom.loadData(next)
        })
    }
};
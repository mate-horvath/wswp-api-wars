let dom = {
    loadData: function (url) {
        apiHandler.getAllData(this.showData, url);
    },
    showData: function (data) {
        $("#tableBody").empty();
        $.each(data["results"], function (idx, val) {
            //Add the required postfix when needed
            if (val["diameter"] !== "unknown") {
                val["diameter"] += " km"
            }
            if (val["population"] !== "unknown") {
                val["population"] += " people"
            }
            if (val["surface_water"] !== "unknown") {
                val["surface_water"] += "%"
            }

            //Create content with the given info
            let content = `<tr>
            <td>${val["name"]}</td>
            <td>${val["diameter"]}</td>
            <td>${val["climate"]}</td>
            <td>${val["terrain"]}</td>
            <td>${val["surface_water"]}</td>
            <td>${val["population"]}</td>
            <!-- Button trigger modal -->
            <td id="${val["name"]}ModalButton"></td>
            </tr>`;
            let newNode = $(content);
            newNode.appendTo("#tableBody");

            //Add modal if residents are present
            if (val["residents"].length > 0) {
                let modal = `
            <div class="modal" id="${val["name"]}Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="${val["name"]}ModalLabel">Resident of ${val["name"]}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                  <table class="table table-bordered">
                  <thead>
                    <tr>
                        <th>Name</th>
                        <th>Height</th>
                        <th>Mass</th>
                        <th>Hair color</th>
                        <th>Skin color</th>
                        <th>Eye color</th>
                        <th>Birth year</th>
                        <th>Gender</th>
                    </tr>
                  </thead>
            <tbody id="${val["name"]}ModalBody">
            </tbody>
                  </table>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>`;
            let newNode = $(modal);
            newNode.appendTo("#tableBody");
            }

            //Add modal button to table if residents are present
            if (val["residents"].length > 0) {
                let modalButton = `<button type="button" class="btn" data-toggle="modal" data-target="#${val["name"]}Modal">${val["residents"].length} resident(s)</button>`;
                $(modalButton).appendTo("#" + val["name"] + "ModalButton");
                $("#" + val["name"] + "ModalButton").bind("click", function () {
                    apiHandler.getModalData(val["name"] ,val["residents"], dom.showModalData)
                })
            }
        });

        //Attach the right eventListeners to the previous and next page
        dom.loadListeners(data["previous"], data["next"])
    },
    loadListeners: function (previous, next) {
        //Run loadData with the new URL
        $("#previousPage").bind("click", function () {
            dom.loadData(previous)
        });
        $("#nextPage").bind("click", function () {
            dom.loadData(next)
        })
    },
    showModalData: function (planetName, residents) {
        $("#" + planetName + "ModalBody").empty();
        $.each(residents, function (index, values) {
        values = JSON.parse(values);
            let content = `<tr>
            <td>${values["name"]}</td>
            <td>${values["height"]}</td>
            <td>${values["mass"]}</td>
            <td>${values["hair_color"]}</td>
            <td>${values["skin_color"]}</td>
            <td>${values["eye_color"]}</td>
            <td>${values["birth_year"]}</td>
            <td>${values["gender"]}</td>
            </tr>`;
        let newNode = $(content);
        newNode.appendTo("#" + planetName + "ModalBody")
        })
    }
};
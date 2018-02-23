let dom = {
    loadData: function (url) {
        $("#tableBody").empty();
        $("#contentPart").after($($("#loadingMessageTemplate").html()));
        apiHandler.getAllData(this.showData, url);
    },

    showData: function (data) {
        $("#loadingMessage").remove();
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
            <td id="${val["name"].replace(/ /g, '')}ModalButtonPlace"></td>
            </tr>`;
            let newNode = $(content);
            newNode.appendTo("#tableBody");

            //Save the name of the planet and get rid of space in the name of planet so it can be used as an id
            let planetName = val["name"];
            val["name"] = val["name"].replace(/ /g, '');

            //Create vote button
            if ($("#VoteButtonTemplate").length > 0) {
                let voteButton = $("#VoteButtonTemplate").html().replace("VoteButton", val["name"] + "VoteButton");
                let newButton = $(voteButton);
                newButton.insertAfter("#" + val["name"] + "ModalButtonPlace");
            }

            //Add EventListener to Vote button
            $("#" + val["name"] + "VoteButton").bind("click", function () {
                let planetInfo = {"planet_name": planetName, "planet_url": val["url"]};
                apiHandler.sendVoteData(planetInfo)
            });

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
                  <table class="table table-bordered" id="${val["name"]}ModalBody">
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
                let modalButton = `<button type="button" id="${val["name"]}ModalButton" class="btn" data-toggle="modal" data-target="#${val["name"]}Modal">${val["residents"].length} resident(s)</button>`;
                $(modalButton).appendTo("#" + val["name"] + "ModalButtonPlace");
                $("#" + val["name"] + "ModalButton").bind("click", function () {
                    apiHandler.getModalData(val["name"], val["residents"], dom.showModalData);
                    $("#" + planetName + "ModalBody").empty().after($($("#loadingMessageTemplate").html()));
                })
            }
            else {
                let content = `<div>No known residents</div>`;
                $(content).appendTo("#" + val["name"] + "ModalButtonPlace")
            }
        });

        //Attach the right eventListeners to the previous and next page
        dom.loadListeners(data["previous"], data["next"])
    },

    loadListeners: function (previous, next) {
        //Run loadData with the new URL
        //Add EventListener to previous page button and remove next page when triggered
        $("#previousPage").one("click", function () {
            if (previous === null) {

            }
            else {
                dom.loadData(previous);
                $("#nextPage").off("click")
            }

        });
        //Add EventListener to next page button and remove next page when triggered
        $("#nextPage").one("click", function () {
            if (next === null) {

            }
            else {
                dom.loadData(next);
                $("#previousPage").off("click")
            }
        });
        //Add listener to vote statistics link
        $("#voteStatisticsButton").bind("click", function () {
            apiHandler.getVoteData(dom.showVoteStatistics)
        })
    },

    showModalData: function (planetName, residents) {
        $("#loadingMessage").remove();
        let content = `<thead>
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
                  </thead>`;
        let newNode = $(content);
        newNode.appendTo("#" + planetName + "ModalBody");
        $.each(residents, function (index, values) {
            values = JSON.parse(values);
            let content = `
            <tbody>
            <tr>
            <td>${values["name"]}</td>
            <td>${values["height"]}</td>
            <td>${values["mass"]}</td>
            <td>${values["hair_color"]}</td>
            <td>${values["skin_color"]}</td>
            <td>${values["eye_color"]}</td>
            <td>${values["birth_year"]}</td>
            <td>${values["gender"]}</td>
            </tr>
            </tbody>`;
            let newNode = $(content);
            newNode.appendTo("#" + planetName + "ModalBody")
        })
    },

    showVoteStatistics: function (votes) {
        $("#voteStatisticsModalBody").empty();
        $.each(votes, function (index, values) {
            let content = `<tr>
            <td>${values["planet_name"]}</td>
            <td>${values["vote_count"]}</td>
            </tr>`;
            let newNode = $(content);
            newNode.appendTo("#voteStatisticsModalBody")
        })
    }
};
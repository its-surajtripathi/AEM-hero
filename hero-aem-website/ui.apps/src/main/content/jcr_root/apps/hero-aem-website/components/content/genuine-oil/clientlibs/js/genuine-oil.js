$(document).ready(function () {
  let bike_engine_container = $("#engine");
  if (bike_engine_container.length > 0) {
    let data = bike_engine_container.data("jsonvalue");
    let jsonData = data;
    if (typeof data != "object"){
      jsonData = data && JSON.parse(data);
    }
    let bike_model_name = $("#bike-model-name");
    let bike_engine_dropdown = [];
    let bike_model_dropdown = [];
    jsonData.forEach(function (ele) {
      if (ele["BS IV / BS VI"]) {
        bike_engine_dropdown.push(ele["BS IV / BS VI"]);
      }
      if (ele["MODEL"]) {
        bike_model_dropdown.push(ele["MODEL"]);
      }
    });

    let filtered_engine_dropdown = bike_engine_dropdown.filter(
      (item, index) => bike_engine_dropdown.indexOf(item) === index
    );

    let filtered_model_dropdown = bike_model_dropdown.filter(
      (item, index) => bike_model_dropdown.indexOf(item) === index
    );
    bike_model_name.append(`<option>BIKE/ SCOOTER MODEL</option>`);
    bike_engine_container.html("");
    filtered_engine_dropdown.forEach(function (params) {
      let options = "";
      if (params) {
        options = `<option value=${params}>${params}</option>`;
      }
      bike_engine_container.append(options);
    });
    filtered_model_dropdown.forEach(function (params) {
      let options = "";
      if (params) {
        options = `<option value=${params}>${params}</option>`;
      }
      bike_model_name.append(options);
    });

    bike_engine_container.on("change", function () {
      console.log($(this).val());
      // bike_model_name.trigger('change');
      let option_value = $(this).val();
      let model_name = jsonData.filter(
        (ele) => ele["BS IV / BS VI"] == option_value
      );
      let arr = [];
      model_name.forEach(function (ele) {
        if (ele["MODEL"]) {
          arr.push(ele["MODEL"]);
        }
      });
      arr = arr.filter((item, index) => arr.indexOf(item) === index);
      bike_model_name.html("");
      bike_model_name.append(`<option>BIKE/ SCOOTER MODEL</option>`);
      arr.forEach(function (params) {
        let options = "";
        if (params) {
          options = `<option>${params}</option>`;
        }
        bike_model_name.append(options);
      });
      bike_model_name.trigger("change");
    });

    bike_model_name.on("change", function () {
      let bike_name = $(this).val();
      let option_value = bike_engine_container.val();
      let updated_data = jsonData.filter((ele) => ele.MODEL == bike_name);
      console.log(updated_data);
      if (updated_data.length > 0) {
        table(updated_data);
      } else {
        table(jsonData.filter((ele) => ele["BS IV / BS VI"] == option_value));
      }
    });

    bike_engine_container.trigger("change");

    function table(json_data) {
      let container = $("#geniue-oil-table");
      container.html("");
      // Create the table element
      let table = $("<table>");

      // Get the keys (column names) of the first object in the JSON data
      let cols = Object.keys(json_data[0]);

      // Create the header element
      let thead = $("<thead>");
      let tr = $("<tr>");

      // Loop through the column names and create header cells
      $.each(cols, function (i, item) {
        let th = $("<th>");
        th.text(item); // Set the column name as the text of the header cell
        tr.append(th); // Append the header cell to the header row
      });
      thead.append(tr); // Append the header row to the header
      table.append(tr); // Append the header to the table

      // Loop through the JSON data and create table rows
      $.each(json_data, function (i, item) {
        let tr = $("<tr>");

        // Get the values of the current object in the JSON data
        let vals = Object.values(item);

        // Loop through the values and create table cells
        $.each(vals, (i, elem) => {
          let td = $("<td>");
          td.text(elem); // Set the value as the text of the table cell
          tr.append(td); // Append the table cell to the table row
        });
        table.append(tr); // Append the table row to the table
      });
      container.append(table); // Append the table to the container element
    }
  }
});

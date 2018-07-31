/**
 * Return the unique values of ufo_data.key
 * @param {Array} data - Array of ufo_data objects.
 * @param {string} key - Key to get unique values
 */
function get_uniques(data, key) {
    let uniques = {};
    for (let i = 0; i < data.length; i++) {
        if (!(data[i][key] in uniques)) {
            uniques[data[i][key]] = 1;

        }
    }
    return Object.keys(uniques);
}


/**
 *
 * @param form_id
 * @param options
 */
function create_select_options(form_id, options) {

    let $selectForm = document.getElementById(form_id);
    for (let i=0; i<options.length; i++){
        let $elem = document.createElement("option");
        $elem.innerHTML = options[i];
        $selectForm.appendChild($elem);
    }
}


/**
 * Create a table given table id, column headers and table caption.
 * @param {string} table_id - The table id.
 * @param {Array} headers - The array of column headers.
 * @param {string} table_caption - The table caption.
 */
function create_table(table_id, headers, table_caption) {
    let $table = document.getElementById(table_id);
    let $thead = $table.createTHead();
    let $row = $thead.insertRow();
    let $caption = $table.createCaption();
    $caption.innerHTML = table_caption;

    for (let i=0; i<headers.length; i++){
        let $elem = document.createElement("th");
        $elem.innerHTML = headers[i];
        $row.appendChild($elem);
    }
}

/**
 *
 * @param data
 * @param table_id
 * @param keys
 * @param start
 * @param end
 */
function fill_table(data, keys) {

    let $table = document.getElementById(table_id);
    let $maxrowInput = document.getElementById(maxrow_id);

    // delete tbody
    let nm_rows = $table.rows.length;
    for (let i=1; i < nm_rows; i++) {
        $table.deleteRow(1);
    }
    let $tbody = $table.createTBody();
    for (let i=0; i<data.length; i++) {
        // console.log(i);
        let $row = $tbody.insertRow();
        for (let j=-0; j<keys.length; j++){
            let $elem = $row.insertCell(j);
            $elem.innerHTML = data[i][keys[j]];
            $elem.style.wordWrap = "break-word";
            $elem.style.textAlign = "left";
            $elem.style.verticalAlign = "middle";
            $elem.style.maxWidth = "10%";
            $elem.style.minWidth = "10%";
        }
    }

    let max_rows = parseInt($maxrowInput.value);
    let total_rows = $table.rows.length;

    console.log("max-rows=", max_rows, "total-rows=", total_rows);
    let page_num = 1;

    // create pagination
    create_pagination(list_id, total_rows, max_rows);

    for (let i=1; i<total_rows; i++) {
        if (i>max_rows) {
            $table.rows[i].style.display = "none";
        } else {
            console.log($table[i]);
            $table.rows[i].style.display = "";
        }
    }
    page_num_ref = page_num;
    max_rows_ref = max_rows;
}




function search_handler(event) {

    console.log("search activated");
    // prevent submit button from submitting a form
    event.preventDefault();

    // parse form inputs
    let date_in = $dateInput.value.toString();
    console.log(date_in)
    if (date_in) {
        let date_arr = date_in.split("-");
        date_in = date_arr[1] + "/" + date_arr[2] + "/" + date_arr[0];
        // alert(date_in);
    }
    console.log(date_in)

    let city_in = $cityInput.value.replace("/[^0-9a-z]/gi", "").trim().toLowerCase();
    let state_in = $stateInput.value.replace("[^0-9a-z]//gi", "").trim().toLowerCase();
    let country_in = $countryInput.value.replace("[^0-9a-z]//gi", "").trim().toLowerCase();
    let shape_in = $shapeInput.value.replace("[^0-9a-z]//gi", "").trim().toLowerCase();

    if (city_in.indexOf("-- all --")>-1) city_in = "";
    if (state_in.indexOf("-- all --")>-1) state_in = "";
    if (country_in.indexOf("-- all --")>-1) country_in = "" ;
    if (shape_in.indexOf("-- all --")>-1) shape_in = "";

    let filtered_data = ufo_data.filter(function (record) {

        let date_rc = record.datetime.substring(0, date_in.length);
        let city_rc = record.city.replace("[^0-9a-z]//gi", "").trim().toLowerCase().substring(0, city_in.length);
        let state_rc = record.state.replace("[^0-9a-z]//gi", "").trim().toLowerCase().substring(0, state_in.length);
        let country_rc = record.country.replace("[^0-9a-z]//gi", "").trim().toLowerCase().substring(0, country_in.length);
        let shape_rc = record.shape.replace("[^0-9a-z]//gi", "").trim().toLowerCase().substring(0, shape_in.length);
        if ((date_in === date_rc || date_in === "") &&
            (city_in === city_rc || city_in === "") &&
            (state_in === state_rc || state_in === "") &&
            (country_in === country_rc || country_in === "") &&
            (shape_in === shape_rc || shape_in === "")) {

            return true;
        } else {
            return false;
        }
    });

    fill_table(filtered_data, keys);
}

function render_table(table_id, list_id, page_num, max_rows){

    let $table = document.getElementById(table_id);
    let $pageList = document.getElementById(list_id);


    for (let i=0; i<$pageList.children.length; i++) {
        if ($pageList.children[i].id === "active-page"){
            let current_page_num = i+2;
        }
        // deactivate all pages
        $pageList.children[i].setAttribute("class", "page-item")
    }
    // activate new page
    $pageList.children[page_num].setAttribute("class", "page-item active")
    // $pageList.children[0].removeAttribute("class")

    let nm_rows = 0;
    let total_rows = $table.rows.length;
    let max_rows_ = Math.max(max_rows, max_rows_ref);

    // console.log("max-rows=", max_rows, "max-rows-ref=", max_rows_ref);
    for (let i=(page_num-1)*max_rows_+1; i<Math.min(page_num*max_rows_+1, total_rows); i++) {
        nm_rows++;
        if (nm_rows>max_rows) {
            $table.rows[i].style.display = "none";
            console.log("hide", i, nm_rows)
        } else {
            $table.rows[i].style.display = "";
            console.log("show", i, nm_rows)
        }
    }
    max_rows_ref = max_rows;
}


function create_pagination(list_id, total_rows, max_rows) {
    let $pageList = document.getElementById(list_id);

    // remove all child li elements
    while ($pageList.firstElementChild) {
        $pageList.removeChild($pageList.firstElementChild);
    }

    let total_pages = 1;
    // create next button
    let i = 0;
    let $elem = document.createElement("li");
    $elem.setAttribute("data-page", i.toString());
    $elem.setAttribute("class", "page-item");
    $elem.setAttribute("id", "next-button");
    // $elem.innerHTML = "<span>" + i++ + "<span class='sr-only'>(current)</span></span>";
    $elem.innerHTML =
        "<a class='page-link' href='#' aria-label='Next'>" +
        "<span aria-hidden='true'>&raquo;</span>" +
        "<span class='sr-only'>Next</span></a>";
    $pageList.append($elem);

    // create pagination buttons
    if (total_rows > max_rows) {
        total_pages = Math.ceil((total_rows-1) / max_rows);
        for (let i = 1; i <= total_pages; i++) {
            let $elem = document.createElement("li");
            $elem.setAttribute("data-page", i.toString());
            $elem.setAttribute("class", "page-item");
            // $elem.innerHTML = "<span>" + i++ + "<span class='sr-only'>(current)</span></span>";
            $elem.innerHTML = "<a class='page-link' href='#'>" + i + "</a>";
            $pageList.append($elem)

        }
    }

    // create previous buttons
    i = total_pages + 1;
    $elem = document.createElement("li");
    $elem.setAttribute("data-page", i.toString());
    $elem.setAttribute("class", "page-item");
    $elem.setAttribute("id", "back-button");
// $elem.innerHTML = "<span>" + i++ + "<span class='sr-only'>(current)</span></span>";
    $elem.innerHTML =
        "<a class='page-link' href='#' aria-label='Previous'>" +
        "<span aria-hidden='true'>&laquo;</span>" +
        "<span class='sr-only'>Previous</span></a>";
    $pageList.append($elem);

    $pageList.children[1].setAttribute("class", "page-item active");
    $pageList.children[1].setAttribute("id", "active-page");
}

function page_handler(element){

    let $table = document.getElementById(table_id);
    let $pageList = document.getElementById(list_id);

    let page_num = parseInt(element.target.innerHTML);
    console.log("page num=", page_num, "page num old=", page_num_ref);
    for (let i=0; i<$pageList.children.length; i++) {
        if ($pageList.children[i].id === "active-page"){
            let current_page_num = i+2;
        }
        // deactivate all pages
        $pageList.children[i].setAttribute("class", "page-item")
    }
    // activate new page
    $pageList.children[page_num].setAttribute("class", "page-item active")
    // $pageList.children[0].removeAttribute("class")

    let total_rows = $table.rows.length;
    let nm_rows = 0;
    for (let i=(page_num_ref-1)*max_rows_ref+1; i<Math.min(page_num_ref*max_rows_ref+1, total_rows); i++) {
        nm_rows++;
        console.log("hide", i, nm_rows);
        $table.rows[i].style.display = "none";
    }

    render_table(table_id, list_id, page_num, max_rows_ref)
    page_num_ref = page_num;
}


function max_row_handler(element) {

    let $table = document.getElementById(table_id);
    let max_rows = parseInt(element.target.value);
    let total_rows = $table.rows.length;

    // console.log(element.target)
    console.log(`max-rows= ${max_rows}, total-rows=${total_rows}`);

    let nm_rows = 0;
    for (let i=(page_num_ref-1)*max_rows_ref+1; i<Math.min(page_num_ref*max_rows_ref+1, total_rows); i++) {
        nm_rows++;
        console.log("hide", i, nm_rows);
        $table.rows[i].style.display = "none";
    }

    // create pagination
    create_pagination(list_id, total_rows, max_rows);

    // render table as per created pagination
    let page_num = 1;
    render_table(table_id, list_id, page_num, max_rows)
    page_num_ref = 1;
}

var table_id = "ufo-table";
var list_id = "page-list";
var maxrow_id ="maxrows-form-input";

let $dateInput = document.getElementById("date-form-input");
let $shapeInput = document.getElementById("shape-form-input");
let $cityInput = document.getElementById("city-form-input");
let $stateInput = document.getElementById("state-form-input");
let $countryInput = document.getElementById("country-form-input");
let $searchButton = document.getElementById("search-button");
let $maxrowInput = document.getElementById(maxrow_id);
let $pageList = document.getElementById(list_id);

// create option lists for filter input forms
let unique_cities = get_uniques(ufo_data, "city");
let unique_states = get_uniques(ufo_data, "state");
let unique_countries = get_uniques(ufo_data, "country");
let unique_shapes = get_uniques(ufo_data, "shape");

// create option lists for filter input forms
create_select_options("shape-form-input", unique_shapes.sort());
create_select_options("city-form-input", unique_cities.sort());
create_select_options("state-form-input", unique_states.sort());
create_select_options("country-form-input", unique_countries.sort());

// create table headers
let table_caption = "<b>List of UFO Sightings</b>";
let headers = ["Date", "City", "State", "Country", "Shape", "Duration", "Comment"];
create_table(table_id, headers, table_caption);


// fill table with all data records
let keys = ["datetime", "city", "state", "country", "shape", "durationMinutes", "comments"];
fill_table(ufo_data, keys);



// even listener of search button
$searchButton.addEventListener("click", search_handler);
// event lister for page number
$maxrowInput.addEventListener("change", max_row_handler);
// event listener for pagination
$pageList.addEventListener("click", page_handler);





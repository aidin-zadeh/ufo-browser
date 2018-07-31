String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


String.prototype.titleize = function() {
    let string_array = this.split(" ");
    string_array = string_array.map(function(str) {
       return str.capitalize();
    });

    let text = string_array.join(" ");

    string_array = text.split("(");
    string_array = string_array.map(function(str) {
        return str.capitalize();
    });
    text = string_array.join("(");

    string_array = text.split(",");
    string_array = string_array.map(function(str) {
        return str.capitalize();
    });
    text = string_array.join(",");

    return text;
};


let nm_data = ufo_data.length;

for (let i=0; i<nm_data; i++) {

    let record = ufo_data[i];
    // perform character conversion
    // capitalize shape
    record.shape = record.shape.capitalize().trim();

    // titleize city
    record.city = record.city.titleize().trim();

    // upper case state
    record.state = record.state.toUpperCase().trim();

    // upper case country
    record.country = record.country.toUpperCase().trim();

    // get state fullname
    if (record.country === "AU") {
        record.state = get_au_state(record.state);
    } else if (record.country ==="CA") {
        record.state = get_ca_state(record.state);
    } else if (record.country === "US") {
        record.state = get_us_state(record.state);
    } else {
        continue;
    }

    // get country fullname
    record.country = get_country_name(record.country);

    // console.log(record.shape);i
    // console.log(record.city);
    // console.log(record.state);
    // console.log(record.country);
}



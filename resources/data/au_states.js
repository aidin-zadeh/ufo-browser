let au_states = {
    "ACT": "Australian Capital Territory",
    "NSW": "New South Wales",
    "NT": "Northern Territory",
    "QLD": "Queensland",
    "SA": "South Australia",
    "TAS": "Tasmania",
    "VIC": "Victoria",
    "WA": "Western Australia"
};


function get_au_state(code) {
    return (au_states.hasOwnProperty(code)) ? au_states[code] : code;
}

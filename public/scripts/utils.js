const gUserNameCharLimit = 25;

export function rgb2hex(rgb) {
    if (rgb.search("rgb") == -1) {
        return rgb;
    } else if (rgb == 'rgba(0, 0, 0, 0)') {
        return 'transparent';
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2).toUpperCase(); // Convert to uppercase
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}

export function getRandomColor() {
    var letters = '456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}

// validate user name
export function isUserNameValid(username) {
    // NOTE: username must not be empty and not have a '#'
    // and username length should be less than limit
    return (username.trim() !== "") &&
        (username.indexOf('#') == -1) &&
        (username.length <= gUserNameCharLimit)
}

// prevent new line in textarea
export function preventMoving(event) {
    let key = event.keyCode;
    if (event.keyCode == 13) {
        event.preventDefault();
    }
}
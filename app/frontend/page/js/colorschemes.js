let colorscheme_default = {
    background: "#1a1b26",
    light_background: "#292e42",
    text: "#7aa2f7",
};

let colorscheme_orange = {
    background: "#5c3602",
    light_background: "#8d4f02",
    text: "#ff8d00",
};

function set_color_scheme(colorscheme)
{
    document.documentElement.style.setProperty('--bg-color', colorscheme.background);
    document.documentElement.style.setProperty('--bg-lighter', colorscheme.light_background);
    document.documentElement.style.setProperty('--txt-color', colorscheme.text);
}

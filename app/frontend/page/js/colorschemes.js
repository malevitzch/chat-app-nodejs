let colorscheme_default = {
    background: "#1a1b26",
    light_background: "#292e42",
    text: "#7aa2f7",
};

let colorscheme_orange = {
    background: "#693f00",
    light_background: "#8c5501",
    text: "#fcba03",
};

function set_color_scheme(colorscheme)
{
    console.log("TEST");
    document.documentElement.style.setProperty('--bg-color', colorscheme.background);
    document.documentElement.style.setProperty('--bg-lighter', colorscheme.light_background);
    document.documentElement.style.setProperty('--txt-color', colorscheme.text);
}

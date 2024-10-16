//the blue colorscheme
export const colorscheme_default = {
    background: "#1a1b26",
    light_background: "#292e42",
    text: "#7aa2f7",
};

//the orange colorscheme
export const colorscheme_orange = {
    background: "#5c3602",
    light_background: "#8d4f02",
    text: "#ff8d00",
};

//a function that takes a colorscheme and changes the css variables that dictate colorscheme
//TODO:: maybe add more colors to a scheme? Becuase 3 does not seem to be enough
export function set_colorscheme(colorscheme)
{
    document.documentElement.style.setProperty('--bg-color', colorscheme.background);
    document.documentElement.style.setProperty('--bg-lighter', colorscheme.light_background);
    document.documentElement.style.setProperty('--txt-color', colorscheme.text);
}

export default {
    colorscheme_default,
    colorscheme_orange,
    set_colorscheme,
};

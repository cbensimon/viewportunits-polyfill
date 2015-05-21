# viewportunits-polyfill
Fix viewport unit bugs and enables using them inside `calc` function

Enables only on :
* iOS < 8
* Safari < 8

## How it works
### Initialization
For each stylesheet with `vunit-fix` attribute, it retrives text content of the CSS file, proceeds a simple regex to replace numbers in `vh`, `vw`, `vmin` or `vmax` unit with numbers in `px` according to client viewport dimensions and finally injects that new CSS string into a `style` tag positionned just like the stylesheet.
It does the same for `style` tags in `head`.

### Resize monitoring
Corrects values by triggering events and with a `setInterval`

## Improvements

* Target devices / navigators
* Regex recognition of the viewport units
* A lot of things I may have done wrong

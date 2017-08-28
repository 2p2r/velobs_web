~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Set the color with python changeOpenlayersColor.py color or ./changeOpenlayersColor.py color depending on your OS and
your dir permissions.
Output generated png images and svg will be in output-svg and output-png directories by default.

You can also use python changeOpenlayersColor.py --output-png colordir color or ./changeOpenlayersColor.py --output-png colordir color depending on your OS and your dir permissions.
In this case, it will create a new dir and put the png image into it.

Another improvement is the options --generate-all. As long as you set it, it ignores all other options and args and takes all possible color of our list (126)


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Accepted color can be html standards color (names are not case-sensitive) like aliceblue,antiquewhite,aqua,aquamarine, azure, beige, bisque, black, blanchedalmond, blue, blueviolet, brown, burlywood, cadetblue, chartreuse, chocolate, coral, cornflowerblue, cornsilk, crimson, cyan, darkblue, darkcyan, darkgoldenrod, darkgray, darkgreen, darkgrey, darkkhaki, darkmagenta, darkolivegreen, darkorange, darkorchid, darkred, darksalmon, darkseagreen, darkslateblue, darkslategray, darkslategrey, darkturquoise, darkviolet, deeppink, deepskyblue, dimgray, dimgrey, dodgerblue, firebrick, floralwhite, forestgreen, fuchsia, gainsboro, ghostwhite, gold, goldenrod, gray, green, greenyellow, grey, honeydew, hotpink, indianred, indigo, ivory, khaki, lavender, lavenderblush, lawngreen, lemonchiffon, lightblue, lightcoral, lightcyan, lightgoldenrodyellow, lightgray, lightgreen, lightgrey, lightpink, lightsalmon, lightseagreen, lightskyblue, lightslategray, lightslategrey, lightsteelblue, lightyellow, lime, limegreen, linen, magenta, maroon, mediumaquamarine, mediumblue, mediumorchid, mediumpurple, mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise, mediumvioletred, midnightblue, mintcream, mistyrose, moccasin, navajowhite, navy, oldlace, olive, olivedrab, orange, orangered, orchid, palegoldenrod, palegreen, paleturquoise, palevioletred, papayawhip, peachpuff, peru, pink, plum, powderblue, purple, red, rosybrown, royalblue, saddlebrown, salmon, sandybrown, seagreen, seashell, sienna, silver, skyblue, slateblue, slategray, slategrey, snow, springgreen, steelblue, tan, teal, thistle, tomato, turquoise, violet, wheat, whitesmoke, yellow, yellowgreen
or
be directly hexadecimal color like FF0000. (code without sharp)

Further informations about color can be found at http://www.w3.org/TR/css3-color/#svg-color


According to original instructions on http://mapbox.com/documentation/adding-tiles-your-site/openlayers-themes

Copy the generated image from output-png in a web accessible directory.

To make your map use these images, just add the line to your OpenLayers map initialization:
OpenLayers.ImgPath = "you_url/your_dir/";

This package includes all of the images needed to restyle a map with common navigational elements. It's known to cover the OpenLayers controls:

    * OpenLayers.Control.LayerSwitcher
    * OpenLayers.Control.Pan
    * OpenLayers.Control.PanZoom
    * OpenLayers.Control.PanZoomBar
    * OpenLayers.Control.ZoomIn
    * OpenLayers.Control.ZoomOut
    * OpenLayers.Control.ZoomToMaxExtent
    * OpenLayers.Control.ZoomPanel

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO

Refactor code to use only one list of color. Duplicated list so not DRY :(
....
....

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ALREADY DONE
# Choose the dir output name based on color keywords or hex color

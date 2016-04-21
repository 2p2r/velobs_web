#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This script generates icons to be used within OpenLayers-applications. Requires python and inkscape.

Version:0.1
Date: 2010-02-23
Author: Thomas Gratier
License: BSD License (see ./license.txt)
"""

__author__ = 'Thomas Gratier'
__version__= '0.1'
__date__= '2010-02-23'
__license__= 'BSD License (see ./license.txt)'

def htmlHexValue(value, error = "Do you really use html hex notation like #FFF000"):
    """Test Hex values"""
    import re
    value = "#" + value
    value = value.lower()
    re_color = re.compile('#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})')
    if re_color.match(value):
        return value.lower()
    else:
        return error

def htmlColorTextToHexCode(colorValue, error = "Invalid color code"):
    """For replacing color with html hex code.
       Non sensitive case and all result to lower
    """
    colorValue = colorValue.lower()
    colorList = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellow","yellowgreen"
]
    if colorValue in colorList:
        colorCode = ["#f0f8ff","#faebd7","#00ffff","#7fffd4","#f0ffff","#f5f5dc","#ffe4c4","#000000","#ffebcd","#0000ff","#8a2be2","#a52a2a","#deb887","#5f9ea0","#7fff00","#d2691e","#ff7f50","#6495ed","#fff8dc","#dc143c","#00ffff","#00008b","#008b8b","#b8860b","#a9a9a9","#006400","#a9a9a9","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc","#8b0000","#e9967a","#8fbc8f","#483d8b","#2f4f4f","#2f4f4f","#00ced1","#9400d3","#ff1493","#00bfff","#696969","#696969","#1e90ff","#b22222","#fffaf0","#228b22","#ff00ff","#dcdcdc","#f8f8ff","#ffd700","#daa520","#808080","#008000","#adff2f","#808080","#f0fff0","#ff69b4","#cd5c5c","#4b0082","#fffff0","#f0e68c","#e6e6fa","#fff0f5","#7cfc00","#fffacd","#add8e6","#f08080","#e0ffff","#fafad2","#d3d3d3","#90ee90","#d3d3d3","#ffb6c1","#ffa07a","#20b2aa","#87cefa","#778899","#778899","#b0c4de","#ffffe0","#00ff00","#32cd32","#faf0e6","#ff00ff","#800000","#66cdaa","#0000cd","#ba55d3","#9370db","#3cb371","#7b68ee","#00fa9a","#48d1cc","#c71585","#191970","#f5fffa","#ffe4e1","#ffe4b5","#ffdead","#000080","#fdf5e6","#808000","#6b8e23","#ffa500","#ff4500","#da70d6","#eee8aa","#98fb98","#afeeee","#db7093","#ffefd5","#ffdab9","#cd853f","#ffc0cb","#dda0dd","#b0e0e6","#800080","#ff0000","#bc8f8f","#4169e1","#8b4513","#fa8072","#f4a460","#2e8b57","#fff5ee","#a0522d","#c0c0c0","#87ceeb","#6a5acd","#708090","#708090","#fffafa","#00ff7f","#4682b4","#d2b48c","#008080","#d8bfd8","#ff6347","#40e0d0","#ee82ee","#f5deb3","#f5f5f5","#ffff00","#9acd32"
]
        colorValue = colorCode[colorList.index(colorValue)].lower() #Retrieve index from the first list and use it to get the value in the second one. After lower result
        return colorValue
        #htmlColorTable = dict(zip(colorList, colorCode)) #Dict for memory
    else:
        return error

def multiple_replace(dict, text):
    """ Replace in 'text' all occurences of any key in the given
    dictionary by its corresponding value.  Returns the new string.
    From http://code.activestate.com/recipes/81330-single-pass-multiple-replace/""" 
    import re
    # Create a regular expression  from the dictionary keys
    regex = re.compile("(%s)" % "|".join(map(re.escape, dict.keys())))
    # For each match, look-up corresponding value in dictionary
    return regex.sub(lambda mo: dict[mo.string[mo.start():mo.end()]], text)

def dictionnaryPathReplace(listnoextension, outputdir):
    import os
    arrayListNoExtension = listnoextension.split(", ")
    arrayListIdPath=[]
    listnoextensionCopy=[]
    for i in arrayListNoExtension:
        k = i + ".png"
        i = os.path.join(outputdir, i) + ".png"
        listnoextensionCopy.append(k)
        arrayListIdPath.append(i)
    idToPathImg = dict(zip(listnoextensionCopy, arrayListIdPath))
    return idToPathImg

def generateFileFromInkscape(inputsvgfile, outputsvgfile, outputdirpng, transformColor, listId):
    import os, subprocess
    originalColor = '#000000'
    #Build dictionnary to replace name in file
    dictionnary = dictionnaryPathReplace(listId, os.path.join("..", outputdirpng))

    #Read and memorize all lines of input file
    f=open(inputsvgfile, 'r')
    lines=f.readlines()
    f.close()

    #Create/replace file with write perms
    f=open(outputsvgfile, 'w')
    #Play with color for output in svg
    for line in lines:
        #Change color
        newline=line.replace(originalColor, transformColor);
        #Change path using dictionnary
        newline = multiple_replace(dictionnary, newline)
        f.write(newline)
    f.close()

    #Use python to call system command for inscape
    for i in listId.split(", "):
        retcode = subprocess.call(["inkscape", outputsvgfile, "--export-id", i, "--export-use-hints"])

def generateColorizedImage(destColor, outputdir):
    import shutil, os
    
    #Constants
    inputsvgfile = './input-svg/ol_labeled.svg'
    outputsvgdir = 'output-svg'
    outputsvgfilename = 'ol_labeled_recolor.svg'
    outputdirpng = outputdir

    #Check and create dir if necessary
    try:
        os.makedirs(outputdirpng)
    except OSError:
        pass
    
    # Id list use both for command line id process and path change (basename id and namefile are the same)
    listIdInkscape = "east-mini, layer-switcher-maximize, layer-switcher-minimize, north-mini, slider, south-mini, west-mini, zoombar, zoom-minus-mini, zoom-plus-mini, zoom-world-mini"

    generateFileFromInkscape(inputsvgfile, os.path.join(outputsvgdir, "ol_labeled_recolor.svg"), outputdirpng, destColor, listIdInkscape)
    #Copy blank.gif
    shutil.copyfile("blank.gif", os.path.join(outputdirpng, "blank.gif"))

    #Can't use quickly the same map because of transparency problem so use a second svg
    generateFileFromInkscape('./input-svg/overview.svg', os.path.join(outputsvgdir, "overview_recolor.svg"), outputdirpng, destColor, "overview")


from optparse import OptionParser

def main():
    usageText = "Set the color with python changeOpenlayersColor.py or ./changeOpenlayersColor.py depending on your OS.\
\n\n\
Accepted color can be html standards color aliceblue,antiquewhite,aqua,aquamarine,azure,beige,bisque,black,\
blanchedalmond,blue,blueviolet,brown,burlywood,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk,\
crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkgrey,darkkhaki,darkmagenta,darkolivegreen,\
darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray,darkslategrey,darkturquoise,\
darkviolet,deeppink,deepskyblue,dimgray,dimgrey,dodgerblue,firebrick,floralwhite,forestgreen,fuchsia,gainsboro,\
ghostwhite,gold,goldenrod,gray,green,greenyellow,grey,honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,\
lavenderblush,lawngreen,lemonchiffon,lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgray,lightgreen,\
lightgrey,lightpink,lightsalmon,lightseagreen,lightskyblue,lightslategray,lightslategrey,lightsteelblue,\
lightyellow,lime,limegreen,linen,magenta,maroon,mediumaquamarine,mediumblue,mediumorchid,mediumpurple,\
mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue,mintcream,\
mistyrose,moccasin,navajowhite,navy,oldlace,olive,olivedrab,orange,orangered,orchid,palegoldenrod,palegreen,\
paleturquoise,palevioletred,papayawhip,peachpuff,peru,pink,plum,powderblue,purple,red,rosybrown,royalblue,\
saddlebrown,salmon,sandybrown,seagreen,seashell,sienna,silver,skyblue,slateblue,slategray,slategrey,snow,\
springgreen,steelblue,tan,teal,thistle,tomato,turquoise,violet,wheat,white,whitesmoke,yellow,yellowgreen \
(the color names are case-insensitive) or be directly hexadecimal color like 000000. (code without sharp)\
\n\n\
Further informations about color can be found at http://www.w3.org/TR/css3-color/#svg-color"

    parser = OptionParser(usage="usage: %prog [options] color" + usageText,
                          version="%prog 1.0")

    parser.add_option("-o", "--output-png",
                      action="store", # optional because action defaults to "store"
                      dest="outputfile",
                      default="output-png",
                      help="png output directory,",)

    parser.add_option("-g", "--generate-all",
                      action="store_true",
                      dest="generateall",
                      default=False,
                      help="Generate all dir for all default color")

    (options, args) = parser.parse_args()

    #If --generate-all ou -g, generate all png
    if options.generateall == True:
        colorListAgain =  ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellow","yellowgreen"]
        for i in colorListAgain:
            generateColorizedImage(i, i)
    # Retrieve other options for dir and args e.g output color
    else: 
        if len(args) != 1:
            parser.error("Wrong number of arguments")
        inputColor = args[0]
        inputColor = htmlColorTextToHexCode(inputColor, htmlHexValue(inputColor, "Do you really use html hex notation like #FFF000"))
        generateColorizedImage(inputColor, options.outputfile)
    

if __name__ == '__main__':
    main()




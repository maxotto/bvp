# Bird view presentations

## Overview

This browser JS application shows presentations, slide by slide, with an effect of flying over a plane or inside a 3D panorama.

* Inspired by Prezi (https://prezi.com/)
* Vue.js application
* Uses THREE JS lib (https://threejs.org/) under the hood.
* Configuration: stored in XML file yet.
* PWA: enabled for production mode.
* Written on Typescript 
* Webpack 4 for build

## Install

`
git clone https://github.com/maxotto/bvp.git
`

`
cd bvp
`

`
yarn
`

## Run for development

`
npm run start
`

## Build for production

`
npm run build
`

Other available commands you can find in _package.json_ file, in the _scripts_ section.

## Projects && URL params
Projects are stored in _./assets_ folder. Now there are two demo projects:
* DemoFlat
* DemoPano 

By default App runs DemoFlat project. To select another project use URL `p` parameter by example:

`https://example.com/index.html?p=DemoPano`

## Objects supported
* Pictures as a background of a slide. it is obligatory element yet but it could be transparent PNG image.
* Text objects. Based on this ThreeJs example https://threejs.org/examples/#webgl_geometry_text. Text lives inside paragraph, each paragraph has width and could be aligned center, left, right, width.
* Video in MP4 format. Pay attention, now my big file 1.mp4 does not exist in this repo yet. You should use your file to run this examples or exclude appropriate slide from _scenario.xml_.  

## Slide controls
We have two thing to keep in mind. 

* **Slides**. There could be many of them on screen, but not each of them will be shown during a slideshow. Some slides just exist on screen as decorations.
* **Steps**. They form the order by which slides will be shown. Any slide can be shown on different steps, once, twice or more times according to desired scenario. So, we can return to some slide as many times as we want.
  

Steps are defined in **<**show**>** section of a scenarion XML:
```
<show>
    <step slide="0"/>
    <step slide="1"/>
    <step slide="2"/>
    <step slide="3"/>
    <step slide="0"/>
    <step slide="4"/>
    <step slide="2"/>
    <step slide="5"/>
    <step slide="6"/>
    <step slide="0"/>
</show>
```
 

#### You can use next keyboard shortcuts to navigate:

* **W** - step forward
* **S** - step back
* **Alt-H** - go to the first step
* **ALT-M** - switch to Editor Mode and back

In Editor Mode you can use:

* **Mouse click** to select slides and objects and transform them (see https://threejs.org/docs/#examples/en/controls/TransformControls). While object selected you can press Alt-S to change mode of transform tool. To unselect object press Esc.
* **Mouse and arrow keyboard buttons** to use ThreeJs Orbit Control (see https://threejs.org/docs/#examples/en/controls/OrbitControls)
* **Alt-R** to restore view on current slide  

There are left and bottom navigation bars. 

The Bottom Navigation Bar allows you navigate simply to the first, previous, next and last steps of the slideshow.

The Left Navigation Bar is a list of steps with preview pictures. By clicking on preview we can navigate directly to this step of the slideshow.

## Todo
* Define more app's parameters in XML instead of hard coded
* Compose whole XML scenario file after slides editing
* Add SVG support
* Add D3.js engine and scenarios to use it
* AJAX requests to fetch data for D3 visualisation 
* Add visual links on slides to navigate to other slides


## Additional info
https://threejsfundamentals.org/

https://stemkoski.github.io/Three.js/

https://buefy.org/documentation/start

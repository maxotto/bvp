import { World, HotSpot, SVG } from "../types";
import * as xmlConverter from "xml-js";

export function getWorldFromXml(xmlText) {
    function parseNode(node) {
        if (node.nodeType !== 1) return;
        switch (node.nodeName) {
            case "world":
                for (var prop in node.attributes) {
                    if (node.attributes.hasOwnProperty(prop)) {
                        var propName = node.attributes[prop].name;
                        var propValue = node.attributes[prop].value;
                        world[propName] = propValue;
                    }
                }
                break;
            case "step":
                if (node.parentNode.nodeName == 'show') {
                    if (!world.hasOwnProperty("steps")) {
                        world["steps"] = [];
                    }
                    let newStep = {};
                    for (var prop in node.attributes) {
                        if (node.attributes.hasOwnProperty(prop)) {
                            var propName = node.attributes[prop].name;
                            var propValue = node.attributes[prop].value;
                            newStep[propName] = propValue;
                        }
                    }
                    world['steps'].push(newStep);
                }
                break;
            case "svg":

                let newSvg = {
                    type: 'svg'
                };
                //               console.log(node.parentNode.nodeName)
                for (var prop in node.attributes) {
                    if (node.attributes.hasOwnProperty(prop)) {
                        var propName = node.attributes[prop].name;
                        var propValue = node.attributes[prop].value;
                        newSvg[propName] = propValue;
                    }
                }
                if (node.parentNode.nodeName == 'world') {
                    if (!world.hasOwnProperty("objects")) {
                        world["objects"] = [];
                    }
                    world['objects'].push(newSvg);
                } else if (node.parentNode.nodeName == 'slide') {
                    const lastSlideIndex = world["slides"].length - 1;
                    if (!world["slides"][lastSlideIndex].hasOwnProperty("objects")) {
                        world["slides"][lastSlideIndex]['objects'] = [];
                    }
                    world["slides"][lastSlideIndex]['objects'].push(newSvg);
                }
                break;
            case "slide":
                if (!world.hasOwnProperty("slides")) {
                    world["slides"] = [];
                }
                let newSlide = {};
                for (var prop in node.attributes) {
                    if (node.attributes.hasOwnProperty(prop)) {
                        var propName = node.attributes[prop].name;
                        var propValue = node.attributes[prop].value;
                        newSlide[propName] = propValue;
                    }
                }
                world['slides'].push(newSlide);
                break;
            case 'hotspot':
                world['slides'][world['slides'].length - 1]['hotspot'] = {};
                for (var prop in node.attributes) {
                    if (node.attributes.hasOwnProperty(prop)) {
                        var propName = node.attributes[prop].name;
                        var propValue = node.attributes[prop].value;
                        world['slides'][world['slides'].length - 1]['hotspot'][propName] = propValue;
                    }
                }
                break;
            case 'animation':
                world['slides'][world['slides'].length - 1]['animation'] = {};
                for (var prop in node.attributes) {
                    if (node.attributes.hasOwnProperty(prop)) {
                        var propName = node.attributes[prop].name;
                        var propValue = node.attributes[prop].value;
                        world['slides'][world['slides'].length - 1]['animation'][propName] = propValue;
                    }
                }
                break;
        }

        var nodes = node.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            parseNode(nodes[i]);
        }
    }
    var xml = new DOMParser().parseFromString(xmlText, "text/xml"); // application/xml

    let world: any = {};

    parseNode(xml.documentElement);

    const xmlObj = xmlConverter.xml2js(xmlText);

    return world;
}

export function putWorldToXml(world: World) {

    //TODO save SVGs
    let xmlText;
    const obj = {
        declaration: {
            attributes: {
                version: "1.0"
            }
        },
        elements: [
            {
                type: "element",
                name: "world",
                attributes: {
                    cameraFov: world.cameraFov,
                    height: world.height,
                    mainBackgroundColor: world.mainBackgroundColor,
                    mainBackgroundPic: world.slides[0].picture,
                    panoramaPic: world.panoramaPic,
                    mainDuration: world.mainSlideDuration,
                    showControlPanel: "true",
                    width: world.width,
                },
                elements: [
                    {
                        type: "element",
                        name: "slides",
                        elements: []
                    },
                    {
                        type: "element",
                        name: "show",
                        elements: []
                    },
                    {
                        type: "element",
                        name: "objects",
                        elements: []
                    },
                ]
            }
        ]
    };
    const showIndex = obj.elements[0].elements.findIndex(x => x.name == 'show');
    world.steps.forEach((step) => {
        obj.elements[0].elements[showIndex].elements.push({
            type: "element",
            name: "step",
            attributes: {
                slide: step['slide']
            }
        });
    });

    const slidesIndex = obj.elements[0].elements.findIndex(x => x.name == 'slides');
    world.slides.forEach((slide, index) => {
        if (index > 0) {
            const svgList = [];
            if (slide.objects) {
                slide.objects.forEach((object) => {
                    if (object.type == 'svg') {
                        svgList.push(
                            {
                                type: "element",
                                name: object.type,
                                attributes: <SVG>{
                                    scale: object.scale,
                                    url: object.url,
                                    x: object.x,
                                    y: object.y,
                                    z: object.z,
                                },
                            }
                        )
                    }
                });
            }
            obj.elements[0].elements[slidesIndex].elements.push({
                attributes: {
                    height: slide.height * slide.scale,
                    picture: slide.picture,
                    width: slide.width * slide.scale
                },
                type: "element",
                name: "slide",
                elements: [
                    {
                        type: "element",
                        name: "hotspot",
                        attributes: <HotSpot>{
                            x: slide.hotspot.x,
                            y: slide.hotspot.y,
                            z: slide.hotspot.z,
                            size: slide.hotspot.size,
                        },
                    },
                    {
                        type: "element",
                        name: "animation",
                        attributes: {
                            duration: slide.transitionDuration,
                        },
                    }, ...svgList
                ]
            });
        }

    });


    xmlText = xmlConverter.js2xml(obj);
    return xmlText;
}
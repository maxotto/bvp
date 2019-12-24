import * as THREE from 'three'
import { Slide, WorldCoordinatesType, WorldMode } from './types'
// import { DragControls } from './tools/MyDragControls';
import { DragControls } from './core/DragControls'
import { calcCameraPosition, getCameraState, recalcToSpherical } from './tools/helpers'
import { EditableGroup } from './core/EditableGroup'
import { Spherical, Vector2, Vector3 } from 'three'

export class SlideEditor {
  private dragControls
  constructor(private parent) {
    this.parent.onSwitchToEditorMode.subscribe(a => {
      this.dragControls.activate()
    })
    this.parent.onSwitchToShowMode.subscribe(a => {
      this.dragControls.deactivate()
      console.log(WorldMode.show)
    })
    this.dragControls = new DragControls(this.parent.world)
    this.dragControls.addEventListener('dragstart', () => {
      this.parent.world.orbitControl.enabled = false
    })
    this.dragControls.addEventListener('editableselected', () => {
      this.parent.world.orbitControl.enabled = false
    })
    this.dragControls.addEventListener('editabledeselected', () => {
      this.parent.world.orbitControl.enabled = true
    })
    this.dragControls.addEventListener('dragend', event => {
      this.parent.world.orbitControl.enabled = true
      if (event.object) {
        if (this.parent.world.type == WorldCoordinatesType.vector) {
          if (event.object.name.indexOf('slideGroup_') == 0) {
            const userData = event.object.userData
            const slideIndex = userData.parentSlide
            const slide = <Slide>this.parent.world.slides[slideIndex]
            const center = new THREE.Vector3(
              event.object.position.x,
              event.object.position.y,
              event.object.position.z
            )
            slide.hotspot.size = userData.size.x * event.object.scale.x
            const sizeX = (slide.hotspot.size / slide.height) * slide.width
            slide.hotspot.x = this.parent.world.width / 2 + center.x - sizeX / 2
            slide.hotspot.y =
              this.parent.world.height / 2 - center.y - slide.hotspot.size / 2
            slide.hotspot.z = center.z
            const cameraState = getCameraState(
              center,
              userData.size.y * event.object.scale.y,
              event.object.position.z,
              this.parent.world.cameraFov
            )
            slide.cameraPosition = cameraState.cameraPosition
            slide.cameraLookAt = cameraState.cameraLookAt
            this.parent.world.orbitControl.update()
          }
        } else {
          if (event.object.name.indexOf('slideGroup_') == 0) {
            const slideGroup = <EditableGroup>event.object
            // correct slide for panorama mode
            const userData = event.object.userData
            const slideIndex = userData.parentSlide
            const slide = <Slide>this.parent.world.slides[slideIndex]
            const center = new THREE.Vector3(
              event.object.position.x,
              event.object.position.y,
              event.object.position.z
            )
            slide.hotspot.size = userData.size.x * event.object.scale.x
            const sizeX = (slide.hotspot.size / slide.height) * slide.width
            slide.hotspot.x = this.parent.world.width / 2 + center.x - sizeX / 2
            slide.hotspot.y =
              this.parent.world.height / 2 - center.y - slide.hotspot.size / 2
            slide.hotspot.z = center.z
            // calculate cameraState to look at moved object
            if (slideGroup.position.z < this.parent.world.panoCenter.z) {
              //  make slide look at center of pano
              slideGroup.lookAt(this.parent.world.panoCenter)
              const newCameraPos = calcCameraPosition(
                this.parent.world,
                slide,
                slideGroup
              )
              slide.cameraPosition.copy(newCameraPos)
              slide.cameraLookAt.copy(slideGroup.position)
            } else {
              const cameraState = getCameraState(
                center,
                userData.size.y * event.object.scale.y,
                event.object.position.z,
                this.parent.world.cameraFov
              )
              slide.cameraPosition = cameraState.cameraPosition
              slide.cameraLookAt = cameraState.cameraLookAt
            }
            const { radius, phi, theta } = recalcToSpherical(slide, this.parent.world.panoCenter)
            slide.hotspot.radius = radius
            slide.hotspot.phi = phi
            slide.hotspot.theta = 0 - theta
            this.parent.world.orbitControl.update()
          }
        }
      }
    })
  }

  onMouseEvent(event) {
    const type = event.type
    const func = 'on' + type
    this[func](event)
  }

  onTouchEvent(event) {
    const type = event.type
    const func = 'on' + type
    this[func](event)
  }

  ontouchstart(event) {
    //console.log(event.type);
  }

  ontouchmove(event) {
    //console.log(event.type);
  }

  ontouchend(event) {
    //console.log(event.type);
  }

  ontouchenter(event) {
    //console.log(event.type);
  }

  ontouchleave(event) {
    //console.log(event.type);
  }

  ontouchcancel(event) {
    //console.log(event.type);
  }

  onmousemove(event) {
    //console.log(event.type);
  }

  onmousedown(event) {
    //console.log(event.type);
  }

  onmouseup(event) {
    //console.log(event.type);
  }

  onclick(event) {
    //console.log(event.type);
  }

  ondblclick(event) {
    //console.log(event.type);
  }

  onmouseover(event) {
    //console.log(event.type);
  }

  onmousewheel(event) {
    //console.log(event.type);
  }

  onmouseout(event) {
    //console.log(event.type);
  }

  oncontextmenu(event) {
    // console.log(event.type);
  }

  onKeyboardEvent(event) {
    // console.log(event.code);
  }
}

export function showSphere(scene, position, size, color, texture?) {
  var g = new THREE.SphereGeometry(size, 32, 32)
  var maretialConf = { color: color }
  if (texture) {
    maretialConf['map'] = texture
    maretialConf['side'] = THREE.DoubleSide
  }
  var material = new THREE.MeshPhongMaterial(maretialConf)
  var sphere = new THREE.Mesh(g, material)
  sphere.position.x = position.x
  sphere.position.y = position.y
  sphere.position.z = position.z
  scene.add(sphere)
}

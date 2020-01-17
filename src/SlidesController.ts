import TWEEN from '@tweenjs/tween.js'
import { SignalList, ISignal } from 'strongly-typed-events'
import { calculateJump } from './tools/helpers'
import { getPointsByCurve } from './tools/three_helpers'
import { WorldMode, World, UserAction, Slide } from './types'
import { SlideEditor } from './SlideEditor'
import { Vector3, LineBasicMaterial } from 'three'

export class SlidesController {
  private _signals = new SignalList()
  private busy = false
  private step = 0
  private slideEditor
  constructor(private world) {
    this.onSwitchToShowMode.subscribe(() => (this.world.mode = WorldMode.show))
    this.onSwitchToEditorMode.subscribe(
      () => (this.world.mode = WorldMode.editor)
    )
    this.slideEditor = new SlideEditor(this)
    //this.world.slides[0].cameraPosition = this.world.slides[1].cameraPosition;
    //this.world.slides[0].cameraLookAt = this.world.slides[1].cameraLookAt;
    this.world.camera.position.copy(this.world.slides[0].cameraPosition)
    this.world.camera.lookAt(this.world.slides[0].cameraLookAt)
    this.world.orbitControl.target = this.world.slides[0].cameraLookAt
  }

  public get onSwitchToShowMode(): ISignal {
    return this._signals.get('show').asEvent()
  }

  public get onSwitchToEditorMode(): ISignal {
    return this._signals.get('editor').asEvent()
  }

  getBusy() {
    return this.busy
  }

  onMouseEvent(event) {
    this.slideEditor.onMouseEvent(event)
  }

  onTouchEvent(event) {
    this.slideEditor.onTouchEvent(event)
  }

  onKeyboardEvent(event) {
    this.slideEditor.onKeyboardEvent(event)
    var action: UserAction, start, finish
    if (!this.busy && event.type === 'keydown') {
      var alt = event.altKey ? 'Alt-' : ''
      var ctrl = event.ctrlKey ? 'Ctrl-' : ''
      var buttonPressed = alt + ctrl + event.code
      switch (buttonPressed) {
        case 'KeyW': //W - step forward
          action = UserAction.navigate
          start = this.step
          finish = this.step + 1
          break
        case 'KeyS': //S - step back
          action = UserAction.navigate
          start = this.step
          finish = this.step - 1
          break
        case 'Alt-KeyH': // Alt-H - go home
          action = UserAction.navigate
          start = this.step
          finish = 0
          break
        case 'Alt-KeyR': //Alt-R - Restore slide view
          this.restoreCurrentSlideView()
          break
        case 'Alt-KeyM': //Alt-M - toggle mode(show/editor)
          this.restoreCurrentSlideView()
          action = UserAction.mode
          break
      }
      if (action === UserAction.navigate) {
        if (finish >= 0 && finish <= this.world.steps.length - 1) {
          this.step = finish
          this.showNextSlideByStep(start, finish)
        }
      } else if (action === UserAction.mode) {
        if (this.world.mode === WorldMode.show) {
          this.world.mode = WorldMode.editor
          this._signals.get('editor').dispatch()
        } else {
          this.world.mode = WorldMode.show
          this._signals.get('show').dispatch()
        }
        this.statsEnable(this.world.mode === WorldMode.editor)
      }
    }
  }

  statsEnable(state: boolean) {
    const statsElem = document.getElementById('stats')
    if (state) {
      statsElem.style.display = 'block'
    } else {
      statsElem.style.display = 'none'
    }
  }

  restoreCurrentSlideView() {
    let slideIndex = +this.world.steps[this.step]['slide']
    this.world.camera.position.set(
      this.world.slides[slideIndex].cameraPosition.x,
      this.world.slides[slideIndex].cameraPosition.y,
      this.world.slides[slideIndex].cameraPosition.z
    )
    this.world.orbitControl.target = new Vector3(
      this.world.slides[slideIndex].cameraLookAt.x,
      this.world.slides[slideIndex].cameraLookAt.y,
      this.world.slides[slideIndex].cameraLookAt.z
    )
  }

  showNextSlide(startSlideIndex, finishSlideIndex) {
    if (<HTMLVideoElement>this.world.slides[startSlideIndex].videoHtmlElement) {
      // const video = <HTMLVideoElement>this.world.slides[startSlideIndex].videoHtmlElement
      // video.pause()
      // video.currentTime = 0;
      // video.load();
    }
    if (this.world.slides[finishSlideIndex].videoHtmlElement) {
      const video = <HTMLVideoElement>this.world.slides[finishSlideIndex].videoHtmlElement
      video.currentTime = 0;
      video.load();
      video.play()
    }
    if (startSlideIndex != finishSlideIndex) {
      this.busy = true
      const duration = this.world.slides[finishSlideIndex].transitionDuration
      const startPoint = new Vector3(
        this.world.slides[startSlideIndex].cameraPosition.x,
        this.world.slides[startSlideIndex].cameraPosition.y,
        this.world.slides[startSlideIndex].cameraPosition.z
      )
      const finishPoint = new Vector3(
        this.world.slides[finishSlideIndex].cameraPosition.x,
        this.world.slides[finishSlideIndex].cameraPosition.y,
        this.world.slides[finishSlideIndex].cameraPosition.z
      )

      const startLookAt = new Vector3(
        this.world.slides[startSlideIndex].cameraLookAt.x,
        this.world.slides[startSlideIndex].cameraLookAt.y,
        this.world.slides[startSlideIndex].cameraLookAt.z
      )
      const finishLookAt = new Vector3(
        this.world.slides[finishSlideIndex].cameraLookAt.x,
        this.world.slides[finishSlideIndex].cameraLookAt.y,
        this.world.slides[finishSlideIndex].cameraLookAt.z
      )
      let jump = 0
      if (startPoint.distanceTo(finishPoint) > 0.1) {
        jump = calculateJump(
          this.world.slides[startSlideIndex],
          this.world.slides[finishSlideIndex]
        )
      }
      const middlePoint = new Vector3(
        startPoint.x - (startPoint.x - finishPoint.x) / 2,
        startPoint.y - (startPoint.y - finishPoint.y) / 2,
        startPoint.z - (startPoint.z - finishPoint.z) / 2 + jump
      )

      const lookAtMiddlePoint = new Vector3(
        startLookAt.x - (startLookAt.x - finishLookAt.x) / 2,
        startLookAt.y - (startLookAt.y - finishLookAt.y) / 2,
        startLookAt.z - (startLookAt.z - finishLookAt.z) / 2
      )

      const pNums = 1000
      const points = getPointsByCurve(
        'QuadraticBezierCurve3',
        startPoint,
        middlePoint,
        finishPoint,
        pNums
      )

      const lookAtPointsNum = pNums
      const lookAtPoints = getPointsByCurve(
        'QuadraticBezierCurve3',
        startLookAt,
        lookAtMiddlePoint,
        finishLookAt,
        lookAtPointsNum
      )
      const from = { index: 0 }
      const to = { index: pNums }
      this.world.orbitControl.target = startLookAt
      new TWEEN.Tween(from)
        .to(to, duration)
        .easing(TWEEN.Easing.Quadratic.InOut) // change here
        .onUpdate(() => {
          const pointNum = Math.ceil(from.index)
          this.world.camera.position.set(
            points[pointNum].x,
            points[pointNum].y,
            points[pointNum].z
          )
          let lookAtZ = lookAtPoints[pointNum].z
          if (lookAtZ > points[pointNum].z) {
            lookAtZ = points[pointNum].z + 10
          }
          this.world.orbitControl.target = new Vector3(
            lookAtPoints[pointNum].x,
            lookAtPoints[pointNum].y,
            lookAtZ
          )
        })
        .onComplete(() => {
          this.world.camera.position.set(
            finishPoint.x,
            finishPoint.y,
            finishPoint.z
          )
          this.world.orbitControl.target = new Vector3(
            this.world.slides[finishSlideIndex].cameraLookAt.x,
            this.world.slides[finishSlideIndex].cameraLookAt.y,
            this.world.slides[finishSlideIndex].cameraLookAt.z
          )
          this.busy = false

        })
        .start()
    }
  }

  showNextSlideByStep(startStep, finishStep) {
    let startSlideIndex = +this.world.steps[startStep]['slide']
    let finishSlideIndex = +this.world.steps[finishStep]['slide']
    this.showNextSlide(startSlideIndex, finishSlideIndex)
  }
}

function lerp(a, b, f) {
  return f * (b - a) + a
}

function easeBounce(x) {
  const f = x => Math.sin((x - 0.25) * Math.PI * 2) * 0.5 + 0.5
  const g = x => Math.sin(((x - 0.5) * Math.PI * 2) / 1.265) * 0.8 + 0.5
  const h = x => Math.sin(x * Math.PI - Math.PI / 2) * 0.5 + 0.5
  const i = x => f(x) * g(x) + (1 - f(x)) * h(x)
  return i(x)
}

function easeIn(x) {
  return -Math.sqrt(1 - x * x) + 1
}

function easeLinear(x) {
  return x
}

function easeOut(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2))
}

function easeSigmoid(x) {
  return 1 / (1 + Math.exp(-16 * x + 8))
}

function easeSine(x) {
  return Math.sin(x * Math.PI - Math.PI / 2) * 0.5 + 0.5
}

class CustomScroller {
  static EASE_BOUNCE = easeBounce
  static EASE_IN = easeIn
  static EASE_LINEAR = easeLinear
  static EASE_OUT = easeOut
  static EASE_SIGMOID = easeSigmoid
  static EASE_SINE = easeSine

  constructor(options) {
    options = options || {}
    this.easingFunction = options.fn || CustomScroller.EASE_SINE
    this.element = options.el || document.scrollingElement
    this.hasStoppedScrolling = true
    this.shouldKeepScrolling = false
  }

  scrollTo() {
    const args = Array.from(arguments)

    const el = args.find(
      arg => arg instanceof HTMLElement || typeof arg === "string",
    )

    if (el) {
      const ms = args.find(arg => typeof arg === "number") || 500
      return this.scrollToElement(el, ms)
    } else {
      const x = args[0]
      const y = args[1]
      const ms = args[2] || 500
      return this.scrollToPosition(x, y, ms)
    }
  }

  scrollToElement(el, ms) {
    el = typeof el === "string" ? document.querySelector(el) : el
    const { x, y } = el.getBoundingClientRect()
    return this.scrollToPosition(x, y, ms)
  }

  scrollToPosition(x, y, ms) {
    const xProperty = this.element === window ? "scrollX" : "scrollLeft"
    const yProperty = this.element === window ? "scrollY" : "scrollTop"
    const originalX = this.element[xProperty]
    const originalY = this.element[yProperty]

    return new Promise((resolve, reject) => {
      try {
        this.stop().then(() => {
          this.shouldKeepScrolling = true
          this.hasStoppedScrolling = false

          let elapsedTime = 0
          let lastTimestamp = new Date()

          const loop = () => {
            if (this.shouldKeepScrolling) {
              window.requestAnimationFrame(loop)
            } else {
              this.hasStoppedScrolling = true
              return resolve()
            }

            this.element.scrollTo(
              lerp(originalX, x, this.easingFunction(elapsedTime / ms)),
              lerp(originalY, y, this.easingFunction(elapsedTime / ms)),
            )

            const currentTimestamp = new Date()
            elapsedTime += currentTimestamp - lastTimestamp
            lastTimestamp = currentTimestamp

            if (elapsedTime >= ms) {
              this.shouldKeepScrolling = false
              this.element.scrollTo(x, y)
            }
          }

          loop()
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  stop() {
    return new Promise((resolve, reject) => {
      try {
        this.shouldKeepScrolling = false

        let interval = setInterval(() => {
          if (!this.hasStoppedScrolling) return
          clearInterval(interval)
          resolve()
        }, 5)
      } catch (e) {
        reject(e)
      }
    })
  }
}

if (typeof module !== "undefined") {
  module.exports = CustomScroller
}

if (typeof window !== "undefined") {
  window.customScrollElementTo = CustomScroller
}

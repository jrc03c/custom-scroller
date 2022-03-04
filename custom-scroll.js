function lerp(a, b, f) {
  return f * (b - a) + a
}

class CustomScroller {
  constructor(element, easingFunction) {
    const self = this
    self.element = element
    self.shouldKeepScrolling = false
    self.hasStoppedScrolling = true

    self.easingFunction =
      easingFunction ||
      function (x) {
        return Math.sin(x * Math.PI - Math.PI / 2) * 0.5 + 0.5
      }
  }

  scrollTo(x, y, ms) {
    const self = this
    const xProperty = self.element === window ? "scrollX" : "scrollLeft"
    const yProperty = self.element === window ? "scrollY" : "scrollTop"
    const originalX = self.element[xProperty]
    const originalY = self.element[yProperty]

    return new Promise(async (resolve, reject) => {
      try {
        await self.stop()

        self.shouldKeepScrolling = true
        self.hasStoppedScrolling = false

        let elapsedTime = 0
        let lastTimestamp = new Date()

        function loop() {
          if (self.shouldKeepScrolling) {
            window.requestAnimationFrame(loop)
          } else {
            self.hasStoppedScrolling = true
            return resolve()
          }

          self.element.scrollTo(
            lerp(originalX, x, self.easingFunction(elapsedTime / ms)),
            lerp(originalY, y, self.easingFunction(elapsedTime / ms))
          )

          const currentTimestamp = new Date()
          elapsedTime += currentTimestamp - lastTimestamp
          lastTimestamp = currentTimestamp

          if (elapsedTime >= ms) {
            self.shouldKeepScrolling = false
          }
        }

        loop()
      } catch (e) {
        reject(e)
      }
    })
  }

  stop() {
    const self = this

    return new Promise((resolve, reject) => {
      try {
        self.shouldKeepScrolling = false

        let interval = setInterval(() => {
          if (!self.hasStoppedScrolling) return
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

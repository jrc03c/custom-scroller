function lerp(a, b, f) {
  return f * (b - a) + a
}

function curve(x) {
  return Math.sin(x * Math.PI - Math.PI / 2) * 0.5 + 0.5
}

function pause(ms) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, ms)
    } catch (e) {
      reject(e)
    }
  })
}

class CustomScroller {
  constructor(element) {
    const self = this
    self.element = element
    self.shouldKeepScrolling = false
    self.hasStoppedScrolling = true
  }

  scrollTo(x, y, ms) {
    const self = this
    const xProperty = self.element === window ? "scrollX" : "scrollLeft"
    const yProperty = self.element === window ? "scrollY" : "scrollTop"

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
            lerp(self.element[xProperty], x, curve(elapsedTime / ms)),
            lerp(self.element[yProperty], y, curve(elapsedTime / ms))
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

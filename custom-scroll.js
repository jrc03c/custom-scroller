function lerp(a, b, f) {
  return f * (b - a) + a
}

function curve(x) {
  return Math.sin(x * Math.PI - Math.PI / 2) * 0.5 + 0.5
}

function customScrollElementTo(element, x, y, ms) {
  const xProperty = element === window ? "scrollX" : "scrollLeft"
  const yProperty = element === window ? "scrollY" : "scrollTop"

  return new Promise((resolve, reject) => {
    try {
      let isStillScrolling = true
      let elapsedTime = 0
      let lastTimestamp = new Date()

      function loop() {
        if (isStillScrolling) {
          window.requestAnimationFrame(loop)
        } else {
          return resolve()
        }

        element.scrollTo(
          lerp(element[xProperty], x, curve(elapsedTime / ms)),
          lerp(element[yProperty], y, curve(elapsedTime / ms))
        )

        const currentTimestamp = new Date()
        elapsedTime += currentTimestamp - lastTimestamp
        lastTimestamp = currentTimestamp

        if (elapsedTime >= ms) {
          isStillScrolling = false
        }
      }

      loop()
    } catch (e) {
      reject(e)
    }
  })
}

if (typeof module !== "undefined") {
  module.exports = customScrollElementTo
}

if (typeof window !== "undefined") {
  window.customScrollElementTo = customScrollElementTo
}

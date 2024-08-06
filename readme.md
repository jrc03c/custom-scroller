> ⚠️ **NOTE:** ⚠️ This project is being merged into a monorepo [here](https://github.com/jrc03c/monorepo/tree/main/packages/custom-scroller). This repo will soon be archived.

---

# Install

```bash
npm install --save https://github.com/jrc03c/custom-scroller
```

# Use

```html
<script src="path/to/custom-scroller.js"></script>
<script>
  const myScrollingElement = document.querySelector("#my-scrolling-element")
  const linearEasing = x => x // optional; defaults to sine easing

  const scroller = new CustomScroller({
    el: myScrollingElement,
    fn: linearEasing,
  })

  // scroll to a position:
  const x = 50
  const y = 250
  const ms = 1500

  scroller.scrollTo(x, y, ms).then(() => {
    // do something cool
  })

  // scroll to an element:
  const el = document.querySelector(".my-cool-element")

  scroller.scrollTo(el, ms).then(() => {
    // do something cool
  })
</script>
```

If you need to stop the scrolling suddenly, use `scroller.stop()` (which returns a `Promise` that resolves when the scroller has come to a standstill). Also, calling the `scrollTo` method before a previous scroll has finished will stop the previous scroll and start the new one.

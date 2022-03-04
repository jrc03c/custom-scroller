# Install

```bash
npm install --save https://github.com/jrc03c/custom-scroller
```

# Use

```html
<script src="path/to/custom-scroller.js"></script>
<script>
  const myScrollingElement = document.querySelector("#my-scrolling-element")
  const x = 50
  const y = 250
  const ms = 1500
  const linearEasing = x => x // optional; defaults to sine easing
  const scroller = new CustomScroller(myScrollingElement, linearEasing)

  scroller.scrollTo(x, y, ms).then(() => {
    // do something cool
  })
</script>
```

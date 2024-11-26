const container = document.querySelector('.container')

function setState(e) {
  const state = e.state

  if (state.length <= 0) {
    return
  }

  state.forEach(element => {
    const img = document.createElement('img')
    img.src = element.tileURL
    container.append(img)
  });
}

LPTE.onready(async () => {
  const res = await LPTE.request({
    meta: {
      namespace: 'module-league-fearless',
      type: 'request',
      version: 1
    }
  })

  setState(res)
})

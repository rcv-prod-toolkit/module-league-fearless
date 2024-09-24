const container = document.querySelector('.container')

function setState(e) {
  const state = e.state

  if (state.length <= 0) {
    return
  }

  if (state.length == 20) {
    container.style.setProperty(
      '--in',
      '10%'
    )
    container.style.setProperty(
      '--out',
      '10%'
    )
  }

  if (state.length == 30) {
    container.style.setProperty(
      '--in',
      '0%'
    )
    container.style.setProperty(
      '--out',
      '-25%'
    )
  }

  if (state.length == 40) {
    container.style.setProperty(
      '--in',
      '0%'
    )
    container.style.setProperty(
      '--out',
      '-68%'
    )
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

  console.log(res)

  setState(res)
})

function reset() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-fearless',
      type: 'reset',
      version: 1
    }
  })
}

let server = ''

LPTE.onready(async () => {
  server = await window.constants.getWebServerPort()
  const location = `http://${server}/pages/op-module-league-fearless/gfx`

  const apiKey = await window.constants.getApiKey()

  document.querySelector(
    '#embed'
  ).value = `${location}/gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#gfx').src = `${location}/gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`

  document.querySelector(
    '#embed-fs'
  ).value = `${location}/fs.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#fs').src = `${location}/fs.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
})

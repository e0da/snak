'use strict'

document.querySelector('#clearHighScore').addEventListener('click', (event)=> {
  event.preventDefault()
  if (confirm('Really clear the high score?')) {
    localStorage.removeItem('highScore')
    window.location.reload()
  }
})

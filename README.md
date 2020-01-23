<p align="center">
  <img src="https://www.ocf.berkeley.edu/~branchan/images/gifs/bogtris.gif" alt="Bogtris"/>
  <br/>
  <b>Bogtris - 2012</b>
</p>

**This is not affiliated with Tetris in any way, and should be viewed as purely educational.**

This is a HTML5 clone of Tetris. Includes SRS spins, back-to-back bonuses, comboes, and battle modes. Bots implemented with genetic algorithms.

## Setup

Express is used to host the app server (at `index.js`), although any web server can work (just point to `public/index.html`).

PIXI.js and Howler.js includes are already included.

Gamepads are supported. The controls assume that the controller connected is an XInput controller.

## Balancing
Multiplayer with Guideline Tetris is unfortunately plagued by 4-wide, a very strong and relatively easy setup that abuses the combo mechanic to send absurd amounts of messy garbage. Side 4-wide is easier to setup and virtually unbeatable in games with garbage blocking, while center 4-wide makes the user very hard to kill (unless fought with another 4-wide). Bogtris nerfs the combo mechanic such that combos level off at 4 line bonuses after a 10-combo. Note, however, that the lack of line clear delay makes combos arguably even more broken in Bogtris.

## Images

<img src="https://www.ocf.berkeley.edu/~branchan/images/bogtris-1.png" alt="Showcasing DT cannon via SRS spins" width="250"/>
<img src="https://www.ocf.berkeley.edu/~branchan/images/bogtris-2.png" alt="Genetic algorithm at work" width="250"/>

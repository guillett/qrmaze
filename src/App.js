import React, { useRef, useState, useEffect } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
}

function processPBM(data) {
  const lines = data.split('\n')
  const dims_items = lines[1].split(' ')

  return {
    w: parseInt(dims_items[0]),
    h: parseInt(dims_items[1]),
    data: lines.slice(2)
  }
}

let mazeData
let mazeColor = 0
let player
let pointer
const margin = 0
const size = 12
const max_speed = size * 3
const game = {
  type: Phaser.AUTO,
  physics: {
      default: 'arcade',
  },
  width: "99%",
  height: "99%",
  scene: {
    init: function() {

      this.cameras.main.setBackgroundColor('#FFFFFF')
    },
    create: function() {
      const offset_x = 10
      const offset_y = 30
      let walls = this.physics.add.staticGroup();
      pointer = this.add.graphics();

      if (!mazeData) {
        return
      }

      mazeData.data.forEach((line, i) => {
        const r = line.split("")
        r.forEach((v, j) => {
          if (v === "1") {
            const x = offset_x + j * size - margin
            const y = offset_y + i * size - margin
            const w = this.add.rectangle(x, y, size + 2 * margin, size + 2 * margin, mazeColor)
            walls.add(w)
          }
        })
      })

      this.player_shape = this.add.circle(offset_x + mazeData.w * size/2, offset_y - size * 2, size/4, 0x00ff0000)
      player = this.physics.add.group([this.player_shape], {
        collideWorldBounds: true,
        bounceX: size*0.05,
        bounceY: size*0.05
      })

      this.physics.add.collider(player, walls)
      this.pointer = {
        origin: null
      }
    },
    update: function() {
      let cursors = this.input.keyboard.createCursorKeys()
      let velocityUpdated
      const speed = max_speed
      if (cursors.left.isDown)
      {
          player.setVelocityX(-speed);
          velocityUpdated = true
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(speed);
          velocityUpdated = true
      }
      else
      {
          player.setVelocityX(0);
      }

      if (cursors.up.isDown)
      {
          player.setVelocityY(-speed);
          velocityUpdated = true
      }
      else if (cursors.down.isDown)
      {
          player.setVelocityY(speed);
          velocityUpdated = true
      }
      else
      {
          player.setVelocityY(0);
      }

      if (this.input.pointer1.isDown)
      {
          pointer.clear();
          if (!this.pointer.origin) {
              this.pointer.origin = {x: this.input.pointer1.x, y: this.input.pointer1.y }
          }
      } else {
          this.pointer.origin = null
          if (!velocityUpdated) {
              player.setVelocityX(0)
              player.setVelocityY(0)
          }
      }
      if (this.pointer.origin) {
          pointer.fillStyle(0x0000ff00, 1);
          pointer.fillRect(this.pointer.origin.x, this.pointer.origin.y, 10, 10);

          pointer.fillStyle(0x000000ff, 1);
          pointer.fillRect(this.input.pointer1.x, this.input.pointer1.y, 10, 10);

          player.setVelocityX(Math.min(max_speed, (this.input.pointer1.x - this.pointer.origin.x)/ 10)) 
          player.setVelocityY(Math.min(max_speed, (this.input.pointer1.y - this.pointer.origin.y)/ 10))
      }

      if (this.player_shape.body.touching.up || this.player_shape.body.touching.up) {
        player.setVelocityY(0)
      }

      if (this.player_shape.body.touching.left || this.player_shape.body.touching.right) {
        player.setVelocityX(0)
      }
    }
  }
}

export default function App () {
  const gameRef = useRef(null)
  // Call `setInitialize` when you want to initialize your game! :)
  const [initialize, setInitialize] = useState(false)
/*  const destroy = () => {
    if (gameRef.current) {
      gameRef.current.destroy()
    }
    setInitialize(false)
  }*/
  useEffect(() => {
    const item_code = document.location.hash.slice(1)
    if (!item_code) {
      return
    }
    hash(item_code).then(e => {
      const url_prefix = `data/${e.slice(0,4)}/${e.slice(4)}`
      fetch(`${url_prefix}.pbm`).then(response => {
        response.text().then(data => {
          mazeData = processPBM(data)
          fetch(`${url_prefix}.color`).then(response => {
            return response.text().then(data => {
              mazeColor = parseInt(`0x${data}`)
            })
          }).catch(e => {
            console.log('e', e)
          }).finally(() => {
            setInitialize(true)
          })

        })
      })
    })
  }, [])
  return (
    <>
      <div id="box">
      <IonPhaser ref={gameRef} game={game} initialize={initialize} />
{/*      <button onClick={() => setInitialize(true)}>Initialize</button>
      <button onClick={destroy}>Destroy</button>*/}
      </div>
    </>
  )
}

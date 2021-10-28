import React, { useRef, useState, useEffect } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

const data = {
    "data": [
        [0,1,2,3,4,5,6,8,13,15,16,17,19,21,23,25,27,28,29,30,34,35,36,37,38,39,40],
        [0,6,8,9,11,12,17,19,21,25,29,32,34,40],
        [0,2,3,4,6,9,10,11,12,13,14,15,17,18,19,21,22,23,24,25,27,28,29,30,31,34,36,37,38,40],
        [0,2,3,4,6,9,10,11,13,23,31,34,36,37,38,40],
        [0,2,3,4,6,8,9,10,11,13,15,16,17,18,19,20,21,23,25,26,27,29,31,32,34,36,37,38,40],
        [0,6,8,13,21,25,34,40],
        [0,1,2,3,4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,35,36,37,38,39,40],
        [8,10,11,13,17,23,30],
        [0,1,2,5,6,8,9,10,13,14,15,17,19,20,21,22,23,24,25,27,28,31,32,33,34,35,36,39,40],
        [0,1,7,9,10,13,15,19,25,27,30,31,32,34,35,37],
        [0,2,3,4,5,6,8,9,10,12,13,15,17,19,20,21,23,25,27,29,30,31,33,36,37,38],
        [0,3,5,8,10,12,17,23,25,27,31,32,37],
        [5,6,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,32,33,34,35,36],
        [0,1,5,8,17,19,21,29,31,35,39,40],
        [5,6,8,11,12,13,14,15,16,17,19,21,23,24,25,27,28,30,31,35,36,37,40],
        [0,1,3,4,9,10,13,17,21,23,27],
        [0,6,7,8,10,11,13,14,15,17,18,19,21,22,23,24,25,27,31,32,34,35,37,40],
        [0,2,3,5,7,8,9,11,13,19,23,31,33,34,35],
        [0,1,3,4,5,6,8,10,11,13,15,17,18,19,20,21,23,24,25,26,27,28,29,31,33,35,36,37,38],
        [1,2,3,5,10,13,15,19,25,32,33,37],
        [2,4,6,7,8,9,10,11,13,15,16,17,19,20,21,23,24,25,26,27,29,31,33,34,35],
        [0,4,10,11,17,21,33,39,40],
        [0,5,6,8,10,11,13,14,15,16,17,18,19,21,23,24,25,26,27,28,29,31,32,33,35,36,37,40],
        [4,5,7,8,11,19,23,25,30,31,33,37],
        [0,1,4,6,7,9,10,11,13,15,16,17,18,19,21,22,23,25,27,28,30,31,34,37,39],
        [0,2,3,5,8,9,11,13,15,19,27,31,32,34,35],
        [0,1,2,6,7,8,11,12,13,14,15,17,18,19,21,22,23,24,25,26,27,29,30,31,33,34],
        [4,5,7,10,21,27,29,32,35,36],
        [4,6,7,9,10,11,12,13,15,17,18,19,20,21,23,24,25,26,27,29,31,32,33,34,35],
        [1,3,4,5,7,9,13,15,17,21,25,27,33,35,37,40],
        [0,1,3,6,7,8,10,11,13,14,15,17,19,21,23,25,27,30,31,33,34,35,37,40],
        [3,8,10,11,13,19,21,23,27,30,31,33,40],
        [0,1,2,3,4,6,8,11,13,14,15,17,19,21,22,23,24,25,27,29,30,31,32,33,34,35,36,37,40],
        [8,9,10,11,17,19,29,30,32,36,38],
        [0,1,2,3,4,5,6,11,13,14,15,16,17,18,19,21,22,23,24,25,27,29,32,34,36,37],
        [0,6,8,9,15,23,27,29,31,32,36],
        [0,2,3,4,6,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37],
        [0,2,3,4,6,10,11,15,25,32,36,37,39],
        [0,2,3,4,6,8,11,13,14,15,17,19,21,22,23,24,25,27,28,29,33,35,36,37,39,40],
        [0,6,8,10,13,15,17,19,23,33,35,36],
        [0,1,2,3,4,5,6,8,10,11,13,15,17,18,19,20,21,23,25,27,28,30,31,33,37,40
        ]
    ],
    "size": 41
}
let player
let pointer
const size = 6
const max_speed = size * 3
const game = {
  width: "90%",
  height: "90%",
  type: Phaser.AUTO,
  physics: {
      default: 'arcade',
  },
  scene: {
    init: function() {
      this.cameras.main.setBackgroundColor('#FFFFFF')
    },
    create: function() {
      const offset_x = 30
      const offset_y = 80
      let i = 0

      let walls = this.physics.add.staticGroup();
      pointer = this.add.graphics();

      data.data.forEach(r => {
        r.forEach(p => {
          let w = this.add.rectangle(offset_x + p * size, offset_y + i * size, size, size, 0)
          walls.add(w)
        })

        i = i + 1
      })

      this.player_shape = this.add.circle(offset_x + data.size * size/2, offset_y - size * 2, size/4, 0x00ff0000)
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

      console.log(this.player_shape.body.touching.up, this.player_shape.body.touching.down, this.player_shape.body.touching.left, this.player_shape.body.touching.right)
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
    setTimeout(() => {
      setInitialize(true)
    }, 1000)
  }, [])
  return (
    <>
      <IonPhaser ref={gameRef} game={game} initialize={initialize} />
{/*      <button onClick={() => setInitialize(true)}>Initialize</button>
      <button onClick={destroy}>Destroy</button>*/}
    </>
  )
}

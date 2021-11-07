<template>
  <div>
    <canvas
      id="game"
      ref="game"
      width="640"
      height="480"
      style="border: 1px solid black;"
      @keydown.esc="move('up')"
      >
    </canvas>
    <div id="assets">
      <div v-for="asset in assets" :key="asset.id">
        <img ref="bg" src="@/assets/bg.jpg" alt="bg">
        <img ref="hoody" src="@/assets/hoody1.png" alt="hoody">
        <!-- <img :ref="asset.id" :id="asset.id" :src="asset.src" /> -->
      </div>
    </div>
  </div>
</template>

<script>
// document.getElementById('log');

// document.addEventListener('keydown', logKey);

// function logKey(e) {
//   console.log(e)
// }
import io from "socket.io-client"

export default {
  name: 'Game',
  
  data() {
    return {
      socket: {},
      context: {},
      position: {
        x: 20,
        y: 20
      },
      assets:[
        {id: 101, src: "@/assets/logo.png"}
      ],
      keys: {
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
      }
    }
  },
  created() {
    this.socket = io("http://localhost:3000")
  },
  mounted() {
    window.addEventListener("keypress", e => {
      const key = e.key
      const direction = this.keys[key]
      this.move(direction)
    });
    const canvas = document.getElementById('game')
    const game = canvas.getContext('2d')
    game.fillStyle = "red"
    game.font = "15px Arial"

    const bg = this.$refs["bg"]
    const hoody = this.$refs["hoody"]

    this.socket.on("position", data => {
      this.position = data
      game.clearRect(0, 0, canvas.width, canvas.height)
      game.drawImage(bg, 0, 0, canvas.width, canvas.height)
      game.drawImage(hoody, this.position.x, this.position.y, 33, 33)
      let coords = "x: "+data.x+" y: "+data.y
      game.fillText(coords, 10, 18)
    })
  },
  methods: {
    move(direction) {
      this.socket.emit("move", direction)
    }
  },
}
</script>

<style scoped>
#assets{
  display: none;
}
</style>

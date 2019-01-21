class Timer {
  constructor(minTime, maxTime) {
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.rate = 20;
    this.state = 0;
    this.startTime = null;
    this.time = null;
    this.timerId = null;
    this.pauseStart = null;
    this.pauseButton = document.getElementById('pause');
  }

  start() {
    this.startTime = Date.now();
    this.timerId = setInterval(() => this.tick(), 1000 / this.rate);
    this.tick();
    this.pauseButton.onclick = () => this.paused = !this.paused;
    this.updatePauseIcon();
  }

  onPause() {}

  set paused(paused) {
    if (paused == this.paused) return;
    if (paused) {
      this.pauseStart = Date.now();
    } else {
      this.startTime += Date.now() - this.pauseStart;
      this.pauseStart = null;
    }
    this.updatePauseIcon();
  }

  get paused() {
    return this.pauseStart != null;
  }

  updatePauseIcon() {
    this.pauseButton.innerText =
        this.paused ? 'play_circle_outline' : 'pause_circle_outline';
  }

  tick() {
    if (this.paused) return;

    this.time = (Date.now() - this.startTime) / 1000;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const pi = Math.PI;

    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const scale = Math.min(canvas.width, canvas.height) / 220;
    ctx.scale(scale, scale);

    if (this.time < this.maxTime) {
      this.drawClock(ctx);
    } else {
      if (this.state == 0) {
        clearInterval(this.timerId);
        document.getElementById('buttons').classList.add('hidden');
        this.timerId = setInterval(() => this.tick(), 500);
        this.state = 1;
      }
      if (this.state == 1) {
        this.drawStopSign(ctx);
        this.state = 2;
      } else {
        this.state = 1;
      }
    }

    const intTime = Math.floor(this.time);
    const timeDiv = document.getElementById('time');
    timeDiv.innerText =
        `${Math.floor(intTime / 60)}′${String(intTime % 60).padStart(2, '0')}″`;
  }

  drawClock(ctx) {
    const pi = Math.PI;

    ctx.beginPath()
    ctx.arc(0, 0, 100, 0, 2 * pi);
    ctx.fillStyle = 'white';
    ctx.fill();

    const longEnough = this.time >= this.minTime;
    const handAngle = 2 * pi * this.time / this.maxTime;
    const cutoffAngle = 2 * pi * this.minTime / this.maxTime

    ctx.rotate(-pi / 2);

    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 100, cutoffAngle, 2 * pi);
    ctx.fillStyle = this.time <= this.minTime ? '#0f0' : '#ff0';
    ctx.fill();

    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 100, 0, handAngle);
    ctx.fillStyle = 'black'
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, 2 * pi);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }

  drawStopSign(ctx) {
    const pi = Math.PI;

    ctx.rotate(pi / 8);
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 8; i++) {
        if (i == 0) {
          ctx.beginPath();
        }
        ctx.rotate(pi / 4);
        ctx.lineTo(0, 100 - j * 10);
      }
      ctx.fillStyle = j % 2 ? '#fff' : '#900';
      ctx.fill();
    }
  }
}

const params = new URL(window.location.href).searchParams;
new Timer(
    Number((params.get('min') || 5) * 60),
    Number((params.get('max') || 7) * 60))
    .start();

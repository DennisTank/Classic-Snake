const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

let score = 0,
  hScore = 0;
let framesTime = 0;
let dxGoZ = (dyGoZ = false);
let dx = 1,
  dy = 0;

window.addEventListener(
  "keydown",
  (key) => {
    switch (key.key) {
      case "ArrowUp":
        if (dy == 0) {
          dy = -1;
          // dx = 0;
          dxGoZ = true;
        }
        break;
      case "ArrowDown":
        if (dy == 0) {
          dy = 1;
          // dx = 0;
          dxGoZ = true;
        }
        break;
      case "ArrowLeft":
        if (dx == 0) {
          dx = -1;
          // dy = 0;
          dyGoZ = true;
        }
        break;
      case "ArrowRight":
        if (dx == 0) {
          dx = 1;
          // dy = 0;
          dyGoZ = true;
        }
        break;
    }
  },
  false
);

function Collide(me, other) {
  if (
    me.minX() < other.maxX() &&
    me.maxX() > other.minX() &&
    me.minY() < other.maxY() &&
    me.maxY() > other.minY()
  ) {
    if (other.id == "food") {
      foodInit();
      taleInit();
      score += 10;
    }
    if (other.id == "tail") {
      Restart();
      if (score > hScore) {
        hScore = score;
      }
      score = 0;
    }
  }
}

function RectObject(x, y, w, h, color, id) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.id = id;
  this.color = color;
  this.minX = () => {
    return this.x;
  };
  this.maxX = () => {
    return this.x + this.w;
  };
  this.minY = () => {
    return this.y;
  };
  this.maxY = () => {
    return this.y + this.h;
  };

  this.draw = () => {
    c.beginPath();
    c.rect(this.x, this.y, this.w, this.h);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  this.move = () => {
    this.x += dx * this.w;
    this.y += dy * this.h;
  };
}

function border(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.h = h;
  this.w = w;
  this.minX = () => {
    return this.x;
  };
  this.maxX = () => {
    return this.x + this.w;
  };
  this.minY = () => {
    return this.y;
  };
  this.maxY = () => {
    return this.y + this.h;
  };
  this.draw = () => {
    c.beginPath();
    c.lineWidth = 20;
    c.moveTo(this.x, this.y);
    c.lineTo(this.x + this.w, this.y);
    c.lineTo(this.x + this.w, this.y + this.h);
    c.lineTo(this.x, this.y + this.h);
    c.lineTo(this.x, this.y);
    c.fillStyle = "black";
    c.fill();
    c.stroke();
    c.closePath();
  };
}

function boderCheck(me, bod) {
  if (me.maxX() > bod.maxX()) {
    me.x = bod.minX();
  }
  if (me.minX() < bod.minX()) {
    me.x = bod.maxX();
  }
  if (me.maxY() > bod.maxY()) {
    me.y = bod.minY();
  }
  if (me.minY() < bod.minY()) {
    me.y = bod.maxY();
  }
}

function foodInit() {
  food.x =
    Math.floor(Math.random() * (bod.maxX() - bod.minX() + 1)) + bod.minX();
  food.y =
    Math.floor(Math.random() * (bod.maxY() - bod.minY() + 1)) + bod.minY();
}

function taleInit() {
  tail.push(
    new RectObject(
      tail[tail.length - 1].x,
      tail[tail.length - 1].y,
      10,
      10,
      "white",
      "tail"
    )
  );
}

function Restart() {
  head = null;
  tail = null;
  food = null;
  tail = [];
  Start();
}
let bod;
let head;
let tail = [];
let food;

function Start() {
  bod = new border(canvas.width / 2 - 250, canvas.height / 2 - 250, 500, 500);
  head = new RectObject(bod.x + 50, bod.y + 50, 10, 10, "cyan", "head");
  for (let i = 1; i <= 3; i++) {
    tail.push(
      new RectObject(head.x - head.w * i, head.y, 10, 10, "white", "Ptail")
    );
  }
  food = new RectObject(0, 0, 10, 10, "red", "food");
  foodInit();
}

function Loop() {
  requestAnimationFrame(Loop);
  c.fillStyle = "rgba(28,28,28,100%)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.font = "20px Comic Sans MS";
  c.fillStyle = "cyan";
  c.textAlign = "center";
  c.fillText(
    "Score : " + score.toString(),
    canvas.width / 2,
    canvas.height / 2 - 300
  );
  c.fillText(
    "High Score :" + hScore.toString(),
    canvas.width / 2,
    canvas.height / 2 - 275
  );
  bod.draw();

  tail.forEach((item, index) => {
    if (food.x == item.x && food.y == item.y) {
      foodInit();
    }
  });

  if (framesTime % 10 == 0) {
    if (dxGoZ) {
      dx = 0;
      dxGoZ = false;
    } else if (dyGoZ) {
      dy = 0;
      dyGoZ = false;
    }

    for (let i = tail.length - 1; i >= 0; i--) {
      if (i == 0) {
        tail[i].x = head.x;
        tail[i].y = head.y;
      } else {
        tail[i].x = tail[i - 1].x;
        tail[i].y = tail[i - 1].y;
      }
    }

    head.move();

    boderCheck(head, bod);
  }

  head.draw();
  for (let i = 0; i < tail.length; i++) {
    tail[i].draw();
  }
  food.draw();

  Collide(head, food);
  for (let i = 0; i < tail.length; i++) {
    Collide(head, tail[i]);
  }

  framesTime++;
}

Start();
Loop();

alert("Use the Arrow keys to play the game.");

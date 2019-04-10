class Shot{
  static canvas = document.getElementById("canvas");
  static all = [];
  constructor(x, y, dx, dy, radius, color, shooter){
    this.x = shooter.x + (shooter.width / 2);
    this.y = (canvas.height - shooter.height);
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.shooter = shooter;
    Shot.all.push(this);
  }

  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  checkXBoundry(){
    if((this.x + this.dx) > (canvas.width - this.radius) || (this.x + this.dx) < this.radius) {
      this.dx = -this.dx;
      return true;
    }
    else{
      return false;
    }
  }

  checkYBoundry(){
    if(this.y + this.dy < this.radius) {
      Shot.all.splice(Shot.all.indexOf(this), 1);
    }
    else{
      return true;
    }
  }

  destroy(){
    Shot.all.splice(Shot.all.indexOf(this), 1);
  }
}

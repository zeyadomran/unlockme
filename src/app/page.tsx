'use client';
import React from "react";
import p5Types from "p5";
import dynamic from 'next/dynamic';

const BALL_RADIUS: number = 10;
let CANVAS_HEIGHT: number;
let CANVAS_WIDTH: number;
let ball: Ball;
let walls: Wall[];

class Ball {
  x: number;
  y: number;
  r: number;
  xVel: number;
  yVel: number;
  p5: p5Types;

  constructor(x: number, y: number, r: number, p5: p5Types) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.xVel = 0;
    this.yVel = 1;
    this.p5 = p5
  }
  
  draw() {
    this.p5.color(0);
    this.p5.fill(0);
    this.p5.circle(this.x, this.y, this.r*2);
  }
  
  update() {
    this.y += this.yVel
  }
}

class Wall {}
export default function Home() {
  const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
  })

 // See annotations in JS for more information
 const setup = (p5: p5Types, canvasParentRef: Element) => {
  CANVAS_HEIGHT = p5.windowHeight;
  CANVAS_WIDTH = p5.windowWidth;
  ball = new Ball(CANVAS_WIDTH/2,20, BALL_RADIUS, p5);
  walls = [];
  p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);;
};

const draw = (p5: p5Types) => {
  p5.background(255);
  ball.draw();
  ball.update();
};

  return (
    <Sketch setup={setup} draw={draw} />
  )
}

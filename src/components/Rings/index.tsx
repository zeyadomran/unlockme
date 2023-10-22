'use client';
import React, { FC, useEffect, useState } from 'react';
import p5Types from 'p5';
import dynamic from 'next/dynamic';
import Ball from './Ball';
import Line from './Line';
import Hoop from './Hoop';
import { shuffle } from 'lodash/fp';

const Rings: FC = () => {
	const BALL_RADIUS: number = 10;
	let ball: Ball;
	let start = 0;
	let images: { [key: string]: any } = {};
	const [CANVAS_WIDTH, setCANVAS_WIDTH] = useState(0);
	const [CANVAS_HEIGHT, setCANVAS_HEIGHT] = useState(0);
	const [touches, setTouches] = useState<Line[]>([]);
	const [hoops, setHoops] = useState<Hoop[]>([]);

	const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
		ssr: false,
	});
	useEffect(() => {
		let hoopsTemp = [];
		const hoopIncrement = (CANVAS_WIDTH - Hoop.width) / 6;
		for (let i = 0; i < 6; i++) {
			const colors = shuffle([...Hoop.colors]);
			for (let ii = 0; ii < colors.length; ii++) {
				hoopsTemp.push(
					new Hoop(
						ii * hoopIncrement + 25,
						i * ((CANVAS_HEIGHT - 200) / 6) + 200,
						colors[ii]
					)
				);
			}
		}
		setHoops(hoopsTemp);
	}, [CANVAS_WIDTH, CANVAS_HEIGHT]);

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		setCANVAS_HEIGHT(p5.windowHeight);
		setCANVAS_WIDTH(p5.windowWidth);
		ball = new Ball(p5.windowWidth / 2, 20, BALL_RADIUS, p5);
		p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
		start = p5.millis();
		for (let color of Hoop.colors) {
			images[color] = p5.loadImage(color + '.png');
		}
		images['ball'] = p5.loadImage('ball.svg');
	};

	const draw = (p5: p5Types) => {
		p5.background(0);

		for (let touch of touches) {
			touch.draw();
		}

		ball.draw(images['ball']);
		for (let hoop of hoops) {
			hoop.draw(p5, images[hoop.color]);
		}
		if (p5.millis() >= start + 5000) {
			ball.update(touches, hoops, CANVAS_WIDTH, CANVAS_HEIGHT);
		}
	};

	const touchStarted = (p5: p5Types) => {
		const touch = p5.touches[0] as any;
		setTouches((touches) => {
			touches.push(new Line(touch.x, touch.y, p5));
			return touches;
		});
	};

	const touchMoved = (p5: p5Types) => {
		const touch = p5.touches[0] as any;
		if (touch) {
			setTouches((touches) => {
				touches[touches.length - 1].x2 = touch.x;
				touches[touches.length - 1].y2 = touch.y;
				return touches;
			});
		}
	};

	return (
		<Sketch
			setup={setup}
			draw={draw}
			touchStarted={touchStarted}
			touchMoved={touchMoved}
		/>
	);
};

export default Rings;

'use client';
import React, { FC, useEffect, useState } from 'react';
import p5Types from 'p5';
import dynamic from 'next/dynamic';
import Ball from './Ball';
import Line from './Line';
import Hoop from './Hoop';
import { shuffle } from 'lodash/fp';
import Link from 'next/link';

const Rings: FC = () => {
	let ball: Ball;
	let start = 0;
	let images: { [key: string]: any } = {};
	const [canvasWidth, setcanvasWidth] = useState(0);
	const [canvasHeight, setCanvasHeight] = useState(0);
	const [header, setHeader] = useState<HTMLElement | null>(null);
	const [password, setPassword] = useState<string[]>([]);
	const [hoopsCrossed, setHoopsCrossed] = useState<string[] | undefined>([]);
	const [lines, setLines] = useState<Line[]>([]);
	const [hoops, setHoops] = useState<Hoop[]>([]);
	const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
		ssr: false,
	});

	useEffect(() => {
		setHeader(document.getElementById('header'));
		setPassword(
			JSON.parse(localStorage.getItem('data') ?? '{}').touch ||
				shuffle(new Hoop().colors).slice(0, 4)
		);
	}, []);
	useEffect(() => {
		let hoopsTemp = [];
		const hoop = new Hoop();
		const hoopIncrement = (canvasWidth - hoop.width) / 6;
		for (let i = 0; i < hoop.rows; i++) {
			const colors = shuffle([...hoop.colors]);
			for (let ii = 0; ii < colors.length; ii++) {
				hoopsTemp.push(
					new Hoop(
						(ii + 1) * hoopIncrement - 30,
						(i + 1) * ((canvasHeight - hoop.height) / hoop.rows) - 50,
						colors[ii]
					)
				);
			}
		}
		setHoops(hoopsTemp);
	}, [canvasWidth, canvasHeight]);

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		setCanvasHeight(p5.windowHeight - (header?.offsetHeight ?? 0));
		setcanvasWidth(p5.windowWidth);
		p5.createCanvas(
			p5.windowWidth,
			p5.windowHeight - (header?.offsetHeight ?? 0)
		).parent(canvasParentRef);
		start = p5.millis();
		for (let color of new Hoop().colors) {
			images[color] = p5.loadImage('../' + color + '.png');
		}
		ball = new Ball(
			p5.windowWidth / 2,
			20,
			p5,
			p5.loadImage('../ball.svg'),
			(colors?: string[]) => setHoopsCrossed(colors)
		);
	};

	const draw = (p5: p5Types) => {
		p5.background(0);

		for (let line of lines) {
			line.draw();
		}

		ball.draw();

		for (let hoop of hoops) {
			hoop.draw(p5, images[hoop.color]);
		}
		if (p5.millis() >= start + 5000) {
			ball.update(lines, hoops, canvasWidth, canvasHeight, password);
		}
	};

	const touchStarted = (p5: p5Types) => {
		const touch = p5.touches[0] as any;
		if (touch && touch.y >= 0) {
			setLines((touches) => {
				touches.push(new Line(touch.x, touch.y, p5));
				return touches;
			});
		}
	};

	const touchMoved = (p5: p5Types) => {
		const touch = p5.touches[0] as any;
		if (touch && touch.y >= 0) {
			setLines((touches) => {
				touches[touches.length - 1].x2 = touch.x;
				touches[touches.length - 1].y2 = touch.y;
				return touches;
			});
		}
	};

	return (
		<>
			{hoopsCrossed?.length === 4 ? (
				<div className="flex flex-col gap-4 mb-auto pt-12">
					<div className="text-white">Correct hoops!</div>
					<Link
						href="/touch"
						className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-fit p-2"
					>
						Lock phone
					</Link>
				</div>
			) : hoopsCrossed?.length === 0 ? (
				<Sketch
					setup={setup}
					draw={draw}
					touchStarted={touchStarted}
					touchMoved={touchMoved}
				/>
			) : (
				<div className="flex flex-col gap-4 mb-auto pt-12">
					<div className="text-white">Incorrect hoops!</div>
					<button
						className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-fit p-2"
						onClick={() => setHoopsCrossed([])}
					>
						Try again
					</button>
				</div>
			)}
		</>
	);
};

export default Rings;

import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import Line from '@/components/Rings/Line';

function useMediaPipeHands() {
	const videoElement = useRef<any>(null);
	const hands = useRef<any>(null);
	const camera = useRef<any>(null);
	const canvasEl = useRef<HTMLCanvasElement>(null);
	const [slope, setSlope] = useState(0);

	useEffect(() => {
		const initCamera = async () => {
			camera.current = new Camera(videoElement.current, {
				onFrame: async () => {
					await hands.current.send({ image: videoElement.current });
				},
				width: canvasEl?.current?.width ?? 0,
				height: canvasEl?.current?.height ?? 0,
			});
			camera.current.start();
		};

		const initMediaPipeHands = async () => {
			hands.current = new Hands({
				locateFile: (file) => {
					return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
				},
			});
			hands.current.setOptions({
				maxNumHands: 1,
				modelComplexity: 1,
				minDetectionConfidence: 0.5,
				minTrackingConfidence: 0.5,
			});
			hands.current.onResults(async (results: any) => {
				if (canvasEl.current) {
					if (results.multiHandLandmarks.length) {
					}
					const context = canvasEl.current.getContext('2d');
					if (context) {
						context.save();
						context.clearRect(
							0,
							0,
							canvasEl.current.width,
							canvasEl.current.height
						);
						context.drawImage(
							results.image,
							0,
							0,
							canvasEl.current.width,
							canvasEl.current.height
						);
						let thumbPos, pinkyPos;
						if (results.multiHandLandmarks) {
							if (
								results.multiHandLandmarks?.length > 0 &&
								results.multiHandLandmarks[0] &&
								results.multiHandLandmarks[0][4] &&
								results.multiHandLandmarks[0][20]
							) {
								thumbPos = results.multiHandLandmarks[0][4];

								pinkyPos = results.multiHandLandmarks[0][20];

								context.beginPath();
								context.moveTo(
									thumbPos.x * canvasEl.current.offsetWidth,
									thumbPos.y * canvasEl.current.offsetHeight
								);
								context.lineTo(
									pinkyPos.x * canvasEl.current.offsetWidth,
									pinkyPos.y * canvasEl.current.offsetHeight
								);
								context.lineWidth = 5;
								context.strokeStyle = '#ff0000';
								context.stroke();

								setSlope(
									Math.round(
										Line.getGradient({
											x1: thumbPos.x * canvasEl.current.offsetWidth,
											y1: thumbPos.y * canvasEl.current.offsetHeight,
											x2: pinkyPos.x * canvasEl.current.offsetWidth,
											y2: pinkyPos.y * canvasEl.current.offsetHeight,
										} as Line) * 100
									) / 100
								);
							}
						}
						context.restore();
					}
				}
			});
		};

		initCamera();
		initMediaPipeHands();
	}, []);

	return { canvasEl, videoElement, slope };
}

export default useMediaPipeHands;

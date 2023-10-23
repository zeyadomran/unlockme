'use client';
import useMediaPipeHands from '@/shared/useMediaPipeHands';
import { useEffect, useState } from 'react';

export default function Home() {
	const { videoElement, canvasEl, slope } = useMediaPipeHands();
	const [header, setHeader] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setHeader(document.getElementById('header'));
	}, []);

	return (
		<div className="mb-auto flex justify-center items-center flex-col">
			<div className="flex items-center gap-2 w-full px-12 justify-between">
				<p className="text-white">Slope: {slope}</p>
				<button
					className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-fit p-2"
					onClick={() =>
						localStorage.setItem(
							'data',
							JSON.stringify({
								sensor: slope,
								touch: JSON.parse(localStorage.getItem('data') ?? '{}').touch,
							})
						)
					}
				>
					Save Password
				</button>
			</div>
			<video className="hidden flip" playsInline ref={videoElement} />
			<canvas
				ref={canvasEl}
				className="flip"
				height={((header?.offsetWidth ?? 1) / 16) * 9}
				width={header?.offsetWidth ?? 0}
			/>
		</div>
	);
}

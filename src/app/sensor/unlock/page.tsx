'use client';
import useMediaPipeHands from '@/shared/useMediaPipeHands';
import { useEffect, useState } from 'react';

export default function Home() {
	const { videoElement, canvasEl, slope } = useMediaPipeHands();
	const [header, setHeader] = useState<HTMLElement | null>(null);
	const [password, setPassword] = useState(1);
	useEffect(() => {
		setHeader(document.getElementById('header'));
		setPassword(JSON.parse(localStorage.getItem('data') ?? '{}').sensor || 1);
	}, []);
	return (
		<div className="mb-auto flex justify-center items-center flex-col">
			<div className="flex items-center gap-2 w-full px-12 justify-between">
				<p className="text-white">Slope:{slope}</p>
				{slope === password && <p className="text-white">Unlocked!</p>}
			</div>
			{slope !== password && (
				<video className="hidden flip" playsInline ref={videoElement} />
			)}
			{slope !== password && (
				<canvas
					ref={canvasEl}
					className="flip"
					height={((header?.offsetWidth ?? 1) / 16) * 9}
					width={header?.offsetWidth ?? 0}
				/>
			)}
		</div>
	);
}

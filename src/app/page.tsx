import Link from 'next/link';
import React from 'react';

export default function Home() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-8">
			<Link
				href="/touch"
				className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-full p-4"
			>
				Touch based
			</Link>
			<button className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-full p-4">
				Sensor based
			</button>
		</div>
	);
}

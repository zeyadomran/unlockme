import React from 'react';
import Link from 'next/link';

export default function Home() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-8">
			<Link
				href="/touch/unlock"
				className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-full p-4 text-center"
			>
				Unlock
			</Link>
			<Link
				href="/touch/configure"
				className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-full p-4 text-center"
			>
				Configure
			</Link>
		</div>
	);
}

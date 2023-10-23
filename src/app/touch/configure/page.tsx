'use client';
import Hoop from '@/components/Rings/Hoop';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Home() {
	const [password, setPassword] = useState<string[]>([]);

	const clickBasket = (color: string) => {
		if (password.length < 4) {
			setPassword((p) => [...p, color]);
		}
	};

	const resetPassword = () => {
		setPassword([]);
	};

	const savePassword = () => {
		localStorage.setItem(
			'data',
			JSON.stringify({
				touch: password,
				sensor: JSON.parse(localStorage.getItem('data') ?? '{}').sensor,
			})
		);
	};

	useEffect(() => {
		const p = JSON.parse(localStorage.getItem('data') ?? '{}').touch;
		if (p) {
			setPassword(p);
		}
	}, []);
	return (
		<div className="flex flex-col items-center justify-between mb-auto pt-8 gap-4">
			{password.length > 0 && (
				<div className="text-white flex flex-col items-center justify-between mb-auto pt-8 gap-4">
					<p>Current Password</p>
					<div className="flex items-start justify-between mb-auto gap-4 mx-8 w-full">
						<div className="flex flex-col gap-1">
							{password.map((color, index) => (
								<p key={index}>
									{index + 1}) {color}
								</p>
							))}
						</div>
						<div className="flex flex-col gap-4">
							<button
								className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-fit p-2"
								onClick={resetPassword}
							>
								Reset Password
							</button>
							{password.length === 4 && (
								<button
									className="text-white bg-blue-600 hover:bg-blue-800 cursor-pointer w-full p-2"
									onClick={savePassword}
								>
									Save Password
								</button>
							)}
						</div>
					</div>
				</div>
			)}
			{password.length === 0 && (
				<p className="text-white px-12">Press basket to configure password!</p>
			)}
			<div className="flex items-center justify-between">
				{Hoop.colors.map((color) => {
					return (
						<button
							key={color}
							className="border-2 border-black hover:border-blue-600"
							onClick={() => clickBasket(color)}
						>
							<Image
								src={'/' + color + '.png'}
								alt={color}
								width={Hoop.width}
								height={Hoop.height}
							/>
						</button>
					);
				})}
			</div>
			<p className="text-white text-xs font-light italic px-12">
				Select the hoops to build your password! (You can choose the same color
				multiple times)
			</p>
		</div>
	);
}

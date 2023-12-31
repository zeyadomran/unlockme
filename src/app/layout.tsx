'use client';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdKeyboardBackspace } from 'react-icons/md';
import {
	PiBatteryFullBold,
	PiCellSignalFullBold,
	PiWifiHighBold,
} from 'react-icons/pi';
import './globals.css';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [date, setDate] = useState<string>('');

	const [time, setTime] = useState<string>('');

	useEffect(() => {
		setDate(
			new Date().toLocaleDateString('en', {
				dateStyle: 'medium',
			})
		);
		setTime(
			new Date()
				.toLocaleTimeString('en', {
					timeStyle: 'short',
					hour12: true,
				})
				.replace(/(PM)|(AM)/, '')
				.trim()
		);
	}, []);
	const pathName = usePathname();
	return (
		<html lang="en">
			<Head>
				<title>Unlock Me</title>
			</Head>
			<body className={inter.className} id="body">
				<div className="flex flex-col justify-between items-center bg-black w-full h-full">
					<div
						className="text-white w-full py-1 px-12 flex flex-col gap-4"
						id="header"
					>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center justify-between gap-2">
								<p className="font-bold">Bell</p>
								<p className="text-sm">{date}</p>
							</div>
							<div className="flex items-center justify-between gap-2">
								<PiCellSignalFullBold />
								<PiWifiHighBold />
								<PiBatteryFullBold />
							</div>
						</div>
						<div className="flex w-full items-center justify-center relative">
							{pathName !== '/' && (
								<Link
									href={
										pathName === '/touch' || pathName === '/sensor'
											? '../'
											: pathName.includes('/touch')
											? '/touch'
											: '/sensor'
									}
									className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 cursor-pointer"
								>
									<MdKeyboardBackspace />
								</Link>
							)}
							<p className="text-4xl font-bold italic">{time}</p>
						</div>
					</div>
					{children}
				</div>
			</body>
		</html>
	);
}

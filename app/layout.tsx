import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/global/Header'


export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html>
			<body>
				<Header />
				<main style={{margin: '50px'}}>
					{children}
				</main>
			</body>
		</html>
	)
}
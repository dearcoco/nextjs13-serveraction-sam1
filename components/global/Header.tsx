'use server'
import Link from 'next/link';

export default async function Header() {
    const version = "v0.73";
	return (
		<header style={{display: 'flex', gap: 30, backgroundColor: '#ccc'}}>
            <div><span>{version}</span></div>
            <Link href="/">Home</Link>
            <Link href="/post">post</Link>
        </header>
	)
}


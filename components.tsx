import Link from 'next/link';

export function Page({ heading }: { heading: string }) {
    return (
        <main>
            <h1 id="page">{heading}</h1>
            <ul>
                <li><Link href="/" id="to-home">/</Link></li>
                <li><Link href="/index" id="to-index">/index</Link></li>
                <li><Link href="/about" id="to-about">/about</Link></li>
            </ul>
        </main>
    );
}

import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

const Footer: NextPage = () => {
    return (
        <footer className="">
            <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by{' '}
                <span className="">
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                </span>
            </a>
        </footer>
    )
}

export default Footer
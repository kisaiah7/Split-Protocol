import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import icon from '../public/icon.svg'

const Navbar: NextPage = () => {
    return (
        <header>
            <div className="container mx-auto">
                <ul>
                    <li className="">
                        <Link href="/">
                            <Image src={icon} width={40} height={40} />
                        </Link>
                    </li>

                    <li className="">
                        <Link href="/dashboard">
                            <a>Dashboard</a>
                        </Link>
                    </li>

                    <li className="">
                        <Link href="/create">
                            <a>Create Expense</a>
                        </Link>
                    </li>

                    <li className="">
                        <Link href="/connect">
                            <a>
                                <Image src="/chain.svg" width={24} height={24} />
                                Connect wallet
                            </a>
                        </Link>
                    </li>
                </ul>


            </div>
        </header>
    )
}

export default Navbar
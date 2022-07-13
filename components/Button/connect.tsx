import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

const Connect: NextPage = () => {
    return (
        <Link href="/connect">
            <button className='rounded-md bg-btn-gradient font-bold py-2 px-4 flex flex-row items-center'>
                <Image src="/chain.svg" width={20} height={20} />
                <span className='ml-2 text-primary text-sm'>Connect Wallet</span>
            </button>
        </Link>
    )
}

export default Connect
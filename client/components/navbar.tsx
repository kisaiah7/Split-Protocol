import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import icon from '../public/favicon.ico';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: NextPage = () => {
  return (
    <header className="bg-navbar-gradient backdrop-blur">
      <div className="container mx-auto flex flex-row justify-between py-2 ">
        <Link href="/">
          <a className="h-[40px]">
            <Image src={icon} width={40} height={40} />
          </a>
        </Link>

        <div className="flex flex-row justify-between items-center">
          <Link href="/">
            <a className="text-muted font-bold text-sm">Dashboard</a>
          </Link>

          <Link href="/expenses/create">
            <a className="ml-6 text-muted font-bold text-sm">Create Expense</a>
          </Link>

          <div className="ml-10">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

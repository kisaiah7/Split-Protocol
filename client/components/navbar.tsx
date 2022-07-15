import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import icon from '../public/icon.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: NextPage = () => {
  return (
    <header className="bg-navbar-gradient backdrop-blur">
      <div className="container mx-auto flex flex-row justify-between py-2 ">
        <Link href="/">
          <Image src={icon} width={40} height={40} />
        </Link>

        <div className="flex flex-row justify-between items-center">
          <Link href="/dashboard">
            <a className="text-muted font-bold text-sm">Dashboard</a>
          </Link>

          <Link href="/expense/create">
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

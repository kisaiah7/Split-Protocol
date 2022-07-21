import type { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Home: NextPage = () => {
  return (
    <div className="bg-body-gradient h-screen flex flex-col justify-center items-center">
      <div className="text-primary text-center flex flex-col justify-center items-center">
        <h1 className="text-4xl font-sans font-bold">Connect your wallet</h1>
        <p className="text-sm text-secondary font-sans font-normal mt-3 mb-6">
          In order to use the dApp's full functionality you have
          <br />
          to connect it with your wallet.
        </p>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Home;

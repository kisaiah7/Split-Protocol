import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import AuthProvider from '../components/auth-provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { Blockie } from '../components/profile-image';

export const LOCALHOST_CHAIN_ID = 31337;

const { chains, provider } = configureChains(
  [
    {
      id: LOCALHOST_CHAIN_ID,
      name: chain.localhost.name,
      network: chain.localhost.network,
      rpcUrls: chain.localhost.rpcUrls,
      nativeCurrency: chain.polygon.nativeCurrency,
    },
  ],
  [
    alchemyProvider({
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Split Protocol',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ToastContainer />
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor:
            'linear-gradient(90deg, #4700FF 0%, #9166FF 100%, #9166FF 100%)',
          borderRadius: 'small',
        })}
        avatar={({ address }) => <Blockie address={address} />}
      >
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';
import {
  metaMaskWallet,
  trustWallet,
  binanceWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
  braveWallet,
  coin98Wallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const config = getDefaultConfig({
  appName: 'Gululand',
  projectId: '79a9f90c238da1f445b4f668fbab96cc', 
  chains: [bsc],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        trustWallet,
        binanceWallet,
        coinbaseWallet,
        braveWallet,
        coin98Wallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        walletConnectWallet,
        injectedWallet,
        safeWallet,
      ],
    },
  ],
  ssr: true, 
});
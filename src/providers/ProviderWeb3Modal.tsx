import { useColorModeValue } from '@chakra-ui/react';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';

require('dotenv').config();

const chains = [bsc];
// const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
const projectId = "45d704544c109267d7939641749cca7d";

if (!projectId) {
  throw new Error('WalletConnect project id is not defined');
}

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const ProviderWeb3Modal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        defaultChain={bsc}
        themeMode={useColorModeValue('light', 'dark')}
      />
    </>
  );
};

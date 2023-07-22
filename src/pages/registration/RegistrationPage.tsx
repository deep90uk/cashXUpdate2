import {
  Divider,
  HStack,
  Heading,
  Icon,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FcBrokenLink, FcGoodDecision } from 'react-icons/fc';
import { useParams } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import UpgradeUI from '../../components/UpgradeUi/UpgradeUi';
import {
  useGetUserBusiness,
  useGetUserLevelToUpgrade,
  useNativePrice,
  useNeedNativeToRegister,
  useUpgradePlans,
} from '../../hooks/ReferralHooks';
import SocialMediaIcons from '../../components/SocialMediaIcons';
import { supportedNetworkInfo } from '../../constants/SupportedNetworkInfo';

const ErrorPage = ({ errorReason }: { errorReason: string }) => {
  return (
    <VStack justify="center" spacing={5}>
      <Icon as={FcBrokenLink} boxSize={40}></Icon>
      <VStack>
        <Heading color="red" textAlign="center">
          {errorReason}
        </Heading>
        <Text>
          You may get a valid referral address from our social links below
        </Text>
      </VStack>
      <SocialMediaIcons
        style={{
          boxSize: 14,
          'aria-label': 'Icon Buttons',
          variant: 'outline',
        }}
      ></SocialMediaIcons>
    </VStack>
  );
};

export default function RegistrationPage() {
  const { chain } = useNetwork();
  const currentNetwork = supportedNetworkInfo[chain?.id!];
  const { address } = useAccount();
  const { referrerAddress } = useParams<{ referrerAddress: `0x${string}` }>();
  const userBusiness = useGetUserBusiness(address);
  const referrerBusiness = useGetUserBusiness(referrerAddress);
  const userLevelToUpgrade = useGetUserLevelToUpgrade(address);
  const nativePrice = useNativePrice(currentNetwork?.priceOracleAddress!);
  const upgradePlans = useUpgradePlans();
  const valueToRegister = useNeedNativeToRegister(
    currentNetwork.priceOracleAddress!
  );

  return (
    <VStack spacing={10} py={100} minH={'100vh'}>
      <VStack>
        <HStack>
          <Icon as={FcGoodDecision} boxSize={10}></Icon>
          <Heading color="orange.500">
            {userBusiness.selfBusiness === 0 ? 'Register' : 'Upgrade'}
          </Heading>
        </HStack>
        <Divider />
      </VStack>
      {userBusiness.selfBusiness === 0 ? (
        !referrerAddress ? (
          <ErrorPage errorReason="You need referral link to register."></ErrorPage>
        ) : referrerBusiness?.selfBusiness === 0 ? (
          <ErrorPage errorReason="Referrer is not active."></ErrorPage>
        ) : (
          <RegistrationUI
            referrerAddress={referrerAddress}
            valueInDecimals={Number(valueToRegister ?? 0) / 10 ** 18}
            currentNetwork={currentNetwork}
          ></RegistrationUI>
        )
      ) : (
        <UpgradeUI
          upgradePlan={upgradePlans?.upgradePlans[userLevelToUpgrade]}
          valueInDecimals={
            Number(
              upgradePlans?.upgradePlans[userLevelToUpgrade]
                .valueToUpgradeInUSD ?? 0
            ) / Number(nativePrice)
          }
          currentNetwork={currentNetwork}
        ></UpgradeUI>
      )}
      ;
    </VStack>
  );
}

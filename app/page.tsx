'use client';

import { useDigitsTrading } from '../hooks/use-digits-trading';
import { useAuth } from '@/hooks/use-auth';
import { DigitsView } from '../components/digits-view';

export default function DigitsPage() {
  const {
    authState,
    accounts,
    activeAccount,
    wsUrl,
    login,
    signUp,
    logout,
    switchAccount,
  } = useAuth();

  const trading = useDigitsTrading(wsUrl, logout);

  return (
    <DigitsView
      authState={authState}
      accounts={accounts}
      activeAccount={activeAccount}
      onLogin={login}
      onSignUp={signUp}
      onLogout={logout}
      onSwitchAccount={switchAccount}
      logoSrc="/logo.png"
      isConnected={trading.isConnected}
      isLoading={trading.isLoading}
      error={trading.error}
      symbols={trading.symbols}
      activeSymbol={trading.activeSymbol}
      selectSymbol={trading.selectSymbol}
      currentTick={trading.currentTick}
      lastDigit={trading.lastDigit}
      digitStats={trading.digitStats}
      pipSize={trading.pipSize}
      tradeType={trading.tradeType}
      setTradeType={trading.setTradeType}
      contractMode={trading.contractMode}
      setContractMode={trading.setContractMode}
      selectedDigit={trading.selectedDigit}
      setSelectedDigit={trading.setSelectedDigit}
      stake={trading.stake}
      setStake={trading.setStake}
      duration={trading.duration}
      setDuration={trading.setDuration}
      durationLimits={trading.durationLimits}
      proposal={trading.proposal}
      isProposalLoading={trading.isProposalLoading}
      buyContract={trading.buyContract}
      isBuying={trading.isBuying}
      buyResult={trading.buyResult}
      buyError={trading.buyError}
      clearBuyResult={trading.clearBuyResult}
      openPositions={trading.openPositions}
      closedPositions={trading.closedPositions}
      sellContract={trading.sellContract}
      sellingId={trading.sellingId}
      sellError={trading.sellError}
      clearSellError={trading.clearSellError}
    />
  );
}

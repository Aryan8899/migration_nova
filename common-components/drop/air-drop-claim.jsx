import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  Users, 
  Coins, 
  Shield, 
  TrendingUp, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus,
  Minus,
  RefreshCw,
  DollarSign,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

const NowaSystem = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Mock data - in real implementation, this would come from blockchain/database
  const [userData, setUserData] = useState({
    walletAddress: '0x742d35Cc6635Cb0532c25aBfc5a7cd2eBbDbbB6B',
    taralCoins: 1250.5,
    rvlngCoins: 890.25,
    nowaCoins: 2140.75, // Calculated based on Taral & RVLNG
    totalNowaCoins: 2140.75,
    stakedAmount: 1500,
    pendingRewards: 45.2
  });

  const [systemStats, setSystemStats] = useState({
    totalAirdropped: 1000000,
    totalClaimed: 350000,
    totalStaked: 250000,
    uniqueAddresses: 1247,
    apy: 12.5,
    claimFee: 0.05 // 5%
  });

  const [whitelistData, setWhitelistData] = useState({
    totalAddresses: 400,
    processedAddresses: 400,
    lastUpdate: new Date().toISOString()
  });

  // Mock whitelist check
  useEffect(() => {
    if (isConnected) {
      // Simulate whitelist check
      setIsWhitelisted(Math.random() > 0.3); // 70% chance of being whitelisted
    }
  }, [isConnected]);

  // Calculate percentages
  const claimedPercentage = (systemStats.totalClaimed / systemStats.totalAirdropped) * 100;
  const stakedPercentage = (systemStats.totalStaked / systemStats.totalClaimed) * 100;

  // Handlers
  const connectWallet = () => {
    setIsConnected(true);
    setWalletAddress(userData.walletAddress);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  const handleClaimAndStake = async () => {
    if (!isWhitelisted) {
      alert('Your wallet is not whitelisted. Please wait for the next whitelist update.');
      return;
    }

    try {
      // Simulate claim & stake transaction
      const claimAmount = userData.nowaCoins;
      const fee = claimAmount * systemStats.claimFee;
      const netAmount = claimAmount - fee;
      
      // Update user data
      setUserData(prev => ({
        ...prev,
        stakedAmount: prev.stakedAmount + netAmount,
        nowaCoins: 0
      }));

      // Update system stats
      setSystemStats(prev => ({
        ...prev,
        totalClaimed: prev.totalClaimed + claimAmount,
        totalStaked: prev.totalStaked + netAmount
      }));

      alert(`Successfully claimed and staked ${netAmount.toFixed(2)} NOWA tokens! Fee: ${fee.toFixed(2)} NOWA`);
    } catch (error) {
      alert('Transaction failed. Please try again.');
    }
  };

  const runWhitelistFunction = () => {
    if (!isAdmin) return;
    
    // Simulate whitelist update
    setWhitelistData(prev => ({
      ...prev,
      lastUpdate: new Date().toISOString()
    }));
    
    alert('Whitelist function executed! 400 new addresses have been added.');
  };

  const updateClaimFee = (newFee) => {
    if (!isAdmin) return;
    
    setSystemStats(prev => ({
      ...prev,
      claimFee: newFee
    }));
  };

  // Tab Components
  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Airdropped</p>
              <p className="text-2xl font-bold">{systemStats.totalAirdropped.toLocaleString()}</p>
            </div>
            <Coins className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Claimed</p>
              <p className="text-2xl font-bold">{systemStats.totalClaimed.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Staked</p>
              <p className="text-2xl font-bold">{systemStats.totalStaked.toLocaleString()}</p>
            </div>
            <Lock className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Unique Addresses</p>
              <p className="text-2xl font-bold">{systemStats.uniqueAddresses.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Claim Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Claimed</span>
            <span className="text-sm font-medium">{claimedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${claimedPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Staking Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Staked</span>
            <span className="text-sm font-medium">{stakedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stakedPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ClaimStakeTab = () => (
    <div className="space-y-6">
      {!isConnected ? (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-6">Connect your wallet to check eligibility and claim NOWA tokens</p>
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Status */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Wallet Status</h3>
              <div className={`flex items-center px-3 py-1 rounded-full ${
                isWhitelisted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isWhitelisted ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                {isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Connected Address:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{walletAddress}</p>
          </div>

          {/* Token Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-4 rounded-xl">
              <p className="text-yellow-100 text-sm">TARAL Coins</p>
              <p className="text-xl font-bold">{userData.taralCoins.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-500 text-white p-4 rounded-xl">
              <p className="text-red-100 text-sm">RVLNG Coins</p>
              <p className="text-xl font-bold">{userData.rvlngCoins.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white p-4 rounded-xl">
              <p className="text-blue-100 text-sm">NOWA Coins (Available)</p>
              <p className="text-xl font-bold">{userData.nowaCoins.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-purple-500 text-white p-4 rounded-xl">
              <p className="text-purple-100 text-sm">Staked NOWA</p>
              <p className="text-xl font-bold">{userData.stakedAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Claim & Stake Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Claim & Stake NOWA Tokens</h3>
            
            {isWhitelisted ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Eligible to Claim & Stake</span>
                  </div>
                  <p className="text-sm text-green-700">
                    You can claim and stake {userData.nowaCoins.toLocaleString()} NOWA tokens in one transaction.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Claimable Amount:</span>
                    <span className="font-semibold">{userData.nowaCoins.toLocaleString()} NOWA</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Claim Fee ({(systemStats.claimFee * 100).toFixed(1)}%):</span>
                    <span className="font-semibold text-red-600">-{(userData.nowaCoins * systemStats.claimFee).toFixed(2)} NOWA</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Net Staking Amount:</span>
                    <span className="font-bold text-green-600">{(userData.nowaCoins * (1 - systemStats.claimFee)).toFixed(2)} NOWA</span>
                  </div>
                </div>

                <button
                  onClick={handleClaimAndStake}
                  disabled={userData.nowaCoins === 0}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    userData.nowaCoins === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Claim & Stake NOWA Tokens
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Not Whitelisted</span>
                </div>
                <p className="text-sm text-red-700">
                  Your wallet address is not currently whitelisted. Please wait for the next whitelist update to become eligible for claiming and staking.
                </p>
              </div>
            )}
          </div>

          {/* Staking Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Your Staking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Staked</p>
                <p className="text-xl font-bold text-blue-600">{userData.stakedAmount.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">APY</p>
                <p className="text-xl font-bold text-green-600">{systemStats.apy}%</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Pending Rewards</p>
                <p className="text-xl font-bold text-orange-600">{userData.pendingRewards.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const AdminTab = () => (
    <div className="space-y-6">
      {!isAdmin ? (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
          <p className="text-gray-600 mb-6">You need admin privileges to access this section</p>
          <button
            onClick={() => setIsAdmin(true)}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-200"
          >
            Login as Admin
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Whitelist Management */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Whitelist Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Addresses</p>
                <p className="text-xl font-bold text-green-600">{whitelistData.totalAddresses}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-xl font-bold text-blue-600">{whitelistData.processedAddresses}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <RefreshCw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-bold text-purple-600">
                  {new Date(whitelistData.lastUpdate).toLocaleString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={runWhitelistFunction}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Run Whitelist Function (400 Addresses)
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Fee Management */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Claim Fee Management</h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Current Claim Fee:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={systemStats.claimFee}
                  onChange={(e) => updateClaimFee(parseFloat(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600">({(systemStats.claimFee * 100).toFixed(1)}%)</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Fee is automatically transferred to Treasury Contract during claim & stake operations
            </p>
          </div>

          {/* System Monitoring */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">System Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Recent Transactions</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Claim & Stake</span>
                    <span className="text-green-600">+1,250 NOWA</span>
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Fee to Treasury</span>
                    <span className="text-red-600">-62.5 NOWA</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Smart Contracts: Online</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Database: Connected</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Treasury: Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Coins className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">NOWA Coin Management System</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connected</span>
                  <button
                    onClick={disconnectWallet}
                    className="text-red-600 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className={`p-2 rounded-lg ${showAdminPanel ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
              >
                {showAdminPanel ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'claim-stake', label: 'Claim & Stake', icon: Lock },
              ...(showAdminPanel ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'claim-stake' && <ClaimStakeTab />}
        {activeTab === 'admin' && <AdminTab />}
      </main>
    </div>
  );
};

export default NowaSystem;
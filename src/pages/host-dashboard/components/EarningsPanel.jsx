import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const EarningsPanel = () => {
  const earningsData = [
    { month: 'Leden', earnings: 12500, orders: 45 },
    { month: 'Únor', earnings: 15800, orders: 52 },
    { month: 'Březen', earnings: 18200, orders: 61 },
    { month: 'Duben', earnings: 16900, orders: 58 },
    { month: 'Květen', earnings: 21300, orders: 67 },
    { month: 'Červen', earnings: 19800, orders: 63 }
  ];

  const totalEarnings = 45800;
  const pendingPayout = 8900;
  const referralBonus = 2400;
  const commission = 0.15; // 15%

  return (
    <div className="bg-card rounded-lg border border-border p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Výdělky a platby</h2>
        <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-micro">
          <Icon name="Download" size={16} />
          <span>Export</span>
        </button>
      </div>
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Celkové výdělky</span>
            <Icon name="TrendingUp" size={16} className="text-success" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalEarnings?.toLocaleString()} Kč</div>
          <div className="text-xs text-success">+12% oproti minulému měsíci</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Čekající výplata</span>
            <Icon name="Clock" size={16} className="text-warning" />
          </div>
          <div className="text-2xl font-bold text-foreground">{pendingPayout?.toLocaleString()} Kč</div>
          <div className="text-xs text-muted-foreground">Výplata 15. prosince</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Referral bonus</span>
            <Icon name="Users" size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-bold text-foreground">{referralBonus?.toLocaleString()} Kč</div>
          <div className="text-xs text-accent">3 nové registrace</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Provize</span>
            <Icon name="Percent" size={16} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{(commission * 100)}%</div>
          <div className="text-xs text-muted-foreground">Standardní sazba</div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Měsíční výdělky</h3>
          <div className="w-full h-64" aria-label="Monthly Earnings Bar Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`${value?.toLocaleString()} Kč`, 'Výdělky']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="earnings" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Trend Chart */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Trend objednávek</h3>
          <div className="w-full h-64" aria-label="Orders Trend Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Objednávky']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--color-success)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Recent Payouts */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Nedávné výplaty</h3>
        <div className="space-y-3">
          {[
            { date: '15. listopadu 2024', amount: 7800, status: 'completed' },
            { date: '15. října 2024', amount: 6200, status: 'completed' },
            { date: '15. září 2024', amount: 5900, status: 'completed' }
          ]?.map((payout, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{payout?.amount?.toLocaleString()} Kč</div>
                  <div className="text-xs text-muted-foreground">{payout?.date}</div>
                </div>
              </div>
              <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                Dokončeno
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsPanel;
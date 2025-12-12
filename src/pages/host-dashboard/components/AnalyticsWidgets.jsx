import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AnalyticsWidgets = () => {
  const performanceData = [
    { day: 'Po', orders: 12, rating: 4.8, utilization: 85 },
    { day: 'Út', orders: 15, rating: 4.9, utilization: 92 },
    { day: 'St', orders: 18, rating: 4.7, utilization: 88 },
    { day: 'Čt', orders: 14, rating: 4.8, utilization: 90 },
    { day: 'Pá', orders: 20, rating: 4.9, utilization: 95 },
    { day: 'So', orders: 16, rating: 4.8, utilization: 87 },
    { day: 'Ne', orders: 10, rating: 4.9, utilization: 75 }
  ];

  const materialData = [
    { name: 'PLA', value: 45, color: 'var(--color-primary)' },
    { name: 'PETG', value: 25, color: 'var(--color-success)' },
    { name: 'ABS', value: 20, color: 'var(--color-warning)' },
    { name: 'TPU', value: 7, color: 'var(--color-accent)' },
    { name: 'Ostatní', value: 3, color: 'var(--color-muted-foreground)' }
  ];

  const customerSatisfactionData = [
    { month: 'Čer', satisfaction: 4.6, orders: 45 },
    { month: 'Čvc', satisfaction: 4.7, orders: 52 },
    { month: 'Srp', satisfaction: 4.8, orders: 61 },
    { month: 'Zář', satisfaction: 4.9, orders: 58 },
    { month: 'Říj', satisfaction: 4.8, orders: 67 },
    { month: 'Lis', satisfaction: 4.9, orders: 63 }
  ];

  const currentMetrics = {
    totalOrders: 1247,
    averageRating: 4.8,
    repeatCustomers: 68,
    averageOrderValue: 485,
    printSuccessRate: 96.5,
    averageDeliveryTime: 2.3
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 elevation-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} className="text-primary" />
            </div>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">+15%</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentMetrics?.totalOrders?.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Celkem objednávek</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 elevation-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <Icon name="Star" size={20} className="text-warning" />
            </div>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">+0.2</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentMetrics?.averageRating}</div>
          <div className="text-sm text-muted-foreground">Průměrné hodnocení</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 elevation-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-success" />
            </div>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">+8%</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentMetrics?.repeatCustomers}%</div>
          <div className="text-sm text-muted-foreground">Opakující zákazníci</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 elevation-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} className="text-accent" />
            </div>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentMetrics?.averageOrderValue} Kč</div>
          <div className="text-sm text-muted-foreground">Průměrná hodnota objednávky</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 elevation-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">+1.2%</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentMetrics?.printSuccessRate}%</div>
          <div className="text-sm text-muted-foreground">Úspěšnost tisku</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 elevation-2">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-primary" />
            </div>
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">-0.3d</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{currentMetrics?.averageDeliveryTime} dny</div>
          <div className="text-sm text-muted-foreground">Průměrná doba dodání</div>
        </div>
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-2">
          <h3 className="text-lg font-medium text-foreground mb-4">Týdenní výkonnost</h3>
          <div className="w-full h-64" aria-label="Weekly Performance Chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'orders' ? `${value} objednávek` : 
                    name === 'utilization' ? `${value}% využití` : `${value} hodnocení`,
                    name === 'orders' ? 'Objednávky' : 
                    name === 'utilization' ? 'Využití' : 'Hodnocení'
                  ]}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--color-primary)" 
                  fill="var(--color-primary)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Usage */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-2">
          <h3 className="text-lg font-medium text-foreground mb-4">Využití materiálů</h3>
          <div className="w-full h-64" aria-label="Material Usage Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {materialData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Podíl']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {materialData?.map((material, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: material?.color }}
                ></div>
                <span className="text-sm text-muted-foreground">{material?.name}</span>
                <span className="text-sm font-medium text-foreground ml-auto">{material?.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Satisfaction Trend */}
        <div className="bg-card rounded-lg border border-border p-6 elevation-2 lg:col-span-2">
          <h3 className="text-lg font-medium text-foreground mb-4">Trend spokojenosti zákazníků</h3>
          <div className="w-full h-64" aria-label="Customer Satisfaction Trend Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerSatisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  domain={[4.0, 5.0]}
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'satisfaction' ? `${value} hvězdiček` : `${value} objednávek`,
                    name === 'satisfaction' ? 'Spokojenost' : 'Objednávky'
                  ]}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="var(--color-success)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Performance Insights */}
      <div className="bg-card rounded-lg border border-border p-6 elevation-2">
        <h3 className="text-lg font-medium text-foreground mb-4">Přehledy výkonnosti</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Pozitivní trend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Vaše hodnocení se zlepšilo o 0.2 bodu za poslední měsíc
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Cíl splněn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Dosáhli jste 96.5% úspěšnosti tisku - nad průměrem!
            </p>
          </div>
          
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Doporučení</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Zvažte rozšíření nabídky o TPU materiál pro více objednávek
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidgets;
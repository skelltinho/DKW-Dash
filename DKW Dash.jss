import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, Users, CreditCard, Calendar, 
  Download, Search, Bell, MoreHorizontal, CheckCircle2, Clock, TrendingUp
} from 'lucide-react';

// Utilitários de Formatação
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateInput) => {
  return new Date(dateInput).toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  });
};

// Gerador de Nomes de Empresas Fake
const companyPrefixes = ['Nexus', 'Alpha', 'Global', 'Tech', 'Inova', 'Grupo', 'Delta', 'Smart', 'Future', 'Blue', 'Iron', 'Silver'];
const companyMids = ['Solutions', 'Sistemas', 'Logística', 'Consultoria', 'Varejo', 'Digital', 'Finanças', 'Marketing', 'Engenharia'];
const companySuffixes = ['Ltda', 'S.A.', 'Brasil', 'Tech', 'Corporation', 'Group', 'e Associados'];

const generateCompanyName = () => {
  const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
  const mid = companyMids[Math.floor(Math.random() * companyMids.length)];
  const suffix = Math.random() > 0.5 ? companySuffixes[Math.floor(Math.random() * companySuffixes.length)] : '';
  return `${prefix} ${mid} ${suffix}`.trim();
};

// Gerador de Dados
const generateData = () => {
  const transactions = [];
  const chartData = [];
  const today = new Date();
  
  let totalRevenue = 0;
  let totalSalesCount = 0;

  // Loop pelos últimos 30 dias (incluindo hoje)
  for (let i = 29; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);
    const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Determinar quantidade de vendas do dia (Média de 6, variando entre 2 e 10)
    const baseSales = Math.floor(Math.random() * 9) + 2; 
    
    let dailyRevenue = 0;

    // Gerar transações para o dia
    for (let j = 0; j < baseSales; j++) {
      // Ticket médio entre 6997 e 12697
      const amount = Math.floor(Math.random() * (12697 - 6997 + 1)) + 6997;
      
      // Gerar hora aleatória, evitando sobreposição óbvia
      let hour = Math.floor(Math.random() * 24);
      if (Math.random() > 0.3) { 
        hour = Math.floor(Math.random() * (18 - 8 + 1)) + 8;
      }
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      
      const timeDate = new Date(currentDate);
      timeDate.setHours(hour, minute, second);

      transactions.push({
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        company: generateCompanyName(),
        amount: amount,
        date: timeDate,
        status: Math.random() > 0.1 ? 'Aprovado' : 'Processando', 
        method: Math.random() > 0.4 ? 'Cartão de Crédito' : (Math.random() > 0.5 ? 'PIX' : 'Boleto'),
      });

      dailyRevenue += amount;
    }

    totalRevenue += dailyRevenue;
    totalSalesCount += baseSales;

    chartData.push({
      name: formatDate(dateStr),
      fullDate: dateStr,
      vendas: dailyRevenue,
      qtd: baseSales
    });
  }

  transactions.sort((a, b) => b.date - a.date);

  return { transactions, chartData, totalRevenue, totalSalesCount };
};

export default function DashboardFake() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(generateData());
  }, []);

  if (!data) return <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">Carregando Dashboard...</div>;

  const { transactions, chartData, totalRevenue, totalSalesCount } = data;
  const avgTicket = totalRevenue / totalSalesCount;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="bg-[#10B981] p-1.5 rounded-full flex items-center justify-center"> {/* Green from your logo */}
                <img src="https://i.imgur.com/uR1u72q.png" alt="DKW SYSTEM Logo" className="h-7 w-7 rounded-full" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-50">DKW Dash</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center bg-gray-700 rounded-full px-4 py-1.5 border border-gray-600">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input type="text" placeholder="Buscar transação..." className="bg-transparent border-none focus:ring-0 text-sm text-gray-200 placeholder-gray-400 w-48" />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-800"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-[#10B981] font-medium text-sm">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-50">Visão Geral</h1>
            <p className="mt-1 text-sm text-gray-400">Acompanhamento de receita e conversão dos últimos 30 dias.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] focus:ring-offset-gray-900">
              <Calendar className="w-4 h-4 mr-2 text-gray-300" />
              Últimos 30 Dias
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#10B981] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Card 1: Receita Total */}
          <div className="bg-gray-800 overflow-hidden shadow-md rounded-xl border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-800 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-emerald-300" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Receita Total</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-50">{formatCurrency(totalRevenue)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  12.5%
                </span>
                <span className="text-gray-400 ml-2">vs. período anterior</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total de Vendas */}
          <div className="bg-gray-800 overflow-hidden shadow-md rounded-xl border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-800 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-blue-300" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Vendas Confirmadas</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-50">{totalSalesCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  4.2%
                </span>
                <span className="text-gray-400 ml-2">vs. período anterior</span>
              </div>
            </div>
          </div>

          {/* Card 3: Ticket Médio */}
          <div className="bg-gray-800 overflow-hidden shadow-md rounded-xl border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-violet-800 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-violet-300" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Ticket Médio</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-50">{formatCurrency(avgTicket)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  8.1%
                </span>
                <span className="text-gray-400 ml-2">vs. período anterior</span>
              </div>
            </div>
          </div>

           {/* Card 4: Conversão */}
           <div className="bg-gray-800 overflow-hidden shadow-md rounded-xl border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-amber-800 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-amber-300" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Taxa de Aprovação</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-50">94.2%</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-red-400 font-medium flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  1.2%
                </span>
                <span className="text-gray-400 ml-2">vs. período anterior</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-50">Evolução de Receita</h3>
              <div className="flex space-x-2">
                 <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-900 bg-opacity-30 px-2 py-1 rounded">
                   <div className="w-2 h-2 bg-[#10B981] rounded-full mr-1.5"></div>
                   Receita Diária
                 </span>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b5563" /> {/* Darker grid lines */}
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                    tickFormatter={(value) => value.substring(0,5)} // Display only DD/MM for brevity in chart
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2d3748', borderRadius: '8px', border: '1px solid #4a5568', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#e2e8f0' }}
                    formatter={(value) => [formatCurrency(value), 'Receita']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVendas)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart / Info */}
          <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
             <h3 className="text-lg font-semibold text-gray-50 mb-6">Volume de Vendas</h3>
             <div className="h-48 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b5563" />
                    <XAxis dataKey="name" hide />
                    <Tooltip 
                      cursor={{fill: '#374151'}}
                      contentStyle={{ backgroundColor: '#2d3748', borderRadius: '8px', border: '1px solid #4a5568', color: '#e2e8f0' }}
                      formatter={(value) => [value, 'Vendas']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Bar dataKey="qtd" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-300 font-medium">Maior Pico</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {Math.max(...chartData.map(d => d.qtd))} vendas
                  </span>
               </div>
               <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-300 font-medium">Média Diária</span>
                  <span className="text-sm font-bold text-gray-50">
                    {(totalSalesCount / 30).toFixed(1)} vendas
                  </span>
               </div>
             </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-800 shadow-md rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-50">Transações Recentes</h3>
            <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Ver todas</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Empresa</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Método</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded bg-emerald-900 bg-opacity-30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                          {transaction.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-50">{transaction.company}</div>
                          <div className="text-xs text-gray-400">ID: #{transaction.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-50">{formatDate(transaction.date)}</div>
                      <div className="text-xs text-gray-400 flex items-center">
                         <Clock className="w-3 h-3 mr-1" />
                         {transaction.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {transaction.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'Aprovado' 
                          ? 'bg-emerald-700 bg-opacity-30 text-emerald-300' 
                          : 'bg-amber-700 bg-opacity-30 text-amber-300'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-50">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-200">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-700 px-6 py-3 border-t border-gray-700 text-xs text-gray-400 text-center">
             Mostrando as 10 transações mais recentes de um total de {totalSalesCount}.
          </div>
        </div>
      </main>
    </div>
  );
}
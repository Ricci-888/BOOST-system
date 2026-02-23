import React from 'react';
import { Users, CreditCard, CarFront, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: '今日接待客户', value: '128', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: '活跃卡片配置', value: '24', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: '意向车型总数', value: '86', icon: CarFront, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: '系统运行状态', value: '正常', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">近期卡片触发记录</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">意向评估卡片触发</p>
                    <p className="text-xs text-slate-500">客户ID: CUST-2023091{item}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">10分钟前</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">热门意向车型</h3>
          <div className="space-y-4">
            {[
              { name: 'Model Y', brand: 'Tesla', count: 45 },
              { name: 'SU7', brand: 'Xiaomi', count: 38 },
              { name: 'L9', brand: 'Li Auto', count: 32 },
              { name: 'ES6', brand: 'NIO', count: 28 },
              { name: 'Han', brand: 'BYD', count: 25 },
            ].map((car, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-slate-300 w-6">{i + 1}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{car.name}</p>
                    <p className="text-xs text-slate-500">{car.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{car.count}</span>
                  <span className="text-xs text-slate-500">次咨询</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

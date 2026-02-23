import React from 'react';
import { LayoutDashboard, CreditCard, CarFront, Settings, LogOut, Package } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '首页概览', icon: LayoutDashboard },
    { id: 'card-config', label: '卡片配置', icon: CreditCard },
    { id: 'car-library', label: '新车意向车型库', icon: CarFront },
    { id: 'material-library', label: '物料管理', icon: Package },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
            B
          </div>
          BOOST 接待管理
        </div>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1 px-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
          业务模块
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm">
          <LogOut size={18} className="text-slate-400" />
          退出登录
        </button>
      </div>
    </div>
  );
}

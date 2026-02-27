/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CardConfig from './pages/CardConfig';
import CarModelLibrary from './pages/CarModelLibrary';
import MaterialLibrary from './pages/MaterialLibrary';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'card-config':
        return <CardConfig />;
      case 'car-library':
        return <CarModelLibrary />;
      case 'material-library':
        return <MaterialLibrary />;
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">系统设置</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-slate-500">
              系统设置功能开发中...
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return '首页概览';
      case 'card-config': return '卡片配置';
      case 'car-library': return '新车意向车型库';
      case 'material-library': return '物料意向推荐';
      case 'settings': return '系统设置';
      default: return 'BOOST 接待管理';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

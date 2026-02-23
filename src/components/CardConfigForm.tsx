import React, { useState } from 'react';
import { X, Plus, GripVertical, Trash2, Bell, AlertCircle, MessageSquare, Info, Star, Heart, CheckCircle, Zap, Shield, Settings, User, CreditCard } from 'lucide-react';
import { CardConfig, QuestionConfig } from '../types';

const ICONS = {
  Bell,
  AlertCircle,
  MessageSquare,
  Info,
  Star,
  Heart,
  CheckCircle,
  Zap,
  Shield,
  Settings,
  User,
  CreditCard
};

interface CardConfigFormProps {
  initialData?: CardConfig | null;
  onSave: (data: Partial<CardConfig>) => void;
  onCancel: () => void;
}

export default function CardConfigForm({ initialData, onSave, onCancel }: CardConfigFormProps) {
  const [formData, setFormData] = useState<Partial<CardConfig>>(
    initialData || {
      name: '',
      description: '',
      icon: 'Bell',
      displayType: '消息提醒',
      triggerPages: [],
      status: 'active',
      triggerLogic: {
        enableCarSeries: false,
        enablePowerTypes: false,
        enableCarAge: false,
        enableMileage: false,
        enableRejectStrategy: false,
        regions: [],
        carSeries: [],
        powerTypes: [],
        carAge: 0,
        mileage: 0,
        targetCars: [],
        rejectPeriod: '7天',
        rejectCount: 3
      },
      questionChain: []
    }
  );

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handlePageToggle = (page: string) => {
    const pages = formData.triggerPages || [];
    if (pages.includes(page)) {
      setFormData({ ...formData, triggerPages: pages.filter(p => p !== page) });
    } else {
      setFormData({ ...formData, triggerPages: [...pages, page] });
    }
  };

  const handlePowerTypeToggle = (type: string) => {
    const types = formData.triggerLogic?.powerTypes || [];
    const newTypes = types.includes(type) ? types.filter(t => t !== type) : [...types, type];
    setFormData({
      ...formData,
      triggerLogic: { ...formData.triggerLogic!, powerTypes: newTypes }
    });
  };

  const handleCarSeriesToggle = (series: string) => {
    const currentSeries = formData.triggerLogic?.carSeries || [];
    const newSeries = currentSeries.includes(series) 
      ? currentSeries.filter(s => s !== series) 
      : [...currentSeries, series];
    setFormData({
      ...formData,
      triggerLogic: { ...formData.triggerLogic!, carSeries: newSeries }
    });
  };

  const addQuestion = () => {
    const newQ: QuestionConfig = {
      id: `Q${Date.now()}`,
      text: '',
      script: '',
      enableCarAssociation: false,
      associatedCars: []
    };
    const newChain = [...(formData.questionChain || []), newQ];
    setFormData({ ...formData, questionChain: newChain });
    setActiveQuestionId(newQ.id);
  };

  const updateActiveQuestion = (updates: Partial<QuestionConfig>) => {
    if (!activeQuestionId) return;
    const newChain = (formData.questionChain || []).map(q => 
      q.id === activeQuestionId ? { ...q, ...updates } : q
    );
    setFormData({ ...formData, questionChain: newChain });
  };

  const removeQuestion = (id: string) => {
    const newChain = (formData.questionChain || []).filter(q => q.id !== id);
    setFormData({ ...formData, questionChain: newChain });
    if (activeQuestionId === id) setActiveQuestionId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('卡片名称为必填项');
      return;
    }
    onSave(formData);
  };

  const activeQuestion = formData.questionChain?.find(q => q.id === activeQuestionId);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? '编辑卡片配置' : '新增卡片配置'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <form id="card-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 基础信息配置区 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
                基础信息配置
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <span className="text-red-500 mr-1">*</span>卡片名称
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">卡片显示类型</label>
                  <select 
                    value={formData.displayType}
                    onChange={e => setFormData({...formData, displayType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="消息提醒">消息提醒</option>
                    <option value="新车意向评估">新车意向评估</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">卡片图标</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(ICONS).map(([name, IconComponent]) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormData({...formData, icon: name})}
                        className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                          formData.icon === name 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                            : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                        title={name}
                      >
                        <IconComponent size={24} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">描述信息</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">触发页面</label>
                  <div className="flex flex-wrap gap-3">
                    {['01-车辆信息', '02-问诊信息', '03-活动信息', '04-工序确认', '05-工单预览'].map(page => (
                      <label key={page} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.triggerPages?.includes(page)}
                          onChange={() => handlePageToggle(page)}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">{page}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 触发逻辑配置区 */}
            {formData.displayType === '新车意向评估' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
                  触发逻辑配置
                </h4>
                <div className="space-y-4">
                  {/* 车型车系 */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">车型车系</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.triggerLogic?.enableCarSeries}
                          onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, enableCarSeries: e.target.checked}})}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {formData.triggerLogic?.enableCarSeries && (
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                        {['秦 PLUS DM-i/EV', '秦 L', '汉 DM-i', '汉 EV', '唐 DM-i', '唐 L EV', '宋 PLUS DM-i/EV', '宋 L', '宋 Pro', '非比亚迪车系'].map(series => (
                          <label key={series} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-slate-200 hover:border-indigo-300 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={formData.triggerLogic?.carSeries?.includes(series) || false}
                              onChange={() => handleCarSeriesToggle(series)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">{series}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 动力类型 */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">动力类型</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.triggerLogic?.enablePowerTypes}
                          onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, enablePowerTypes: e.target.checked}})}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {formData.triggerLogic?.enablePowerTypes && (
                      <div className="flex gap-4 pt-4 border-t border-slate-200">
                        {['纯电', '燃油', '混动'].map(type => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.triggerLogic?.powerTypes?.includes(type) || false}
                              onChange={() => handlePowerTypeToggle(type)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 车龄 */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-700">车龄 (年)</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.triggerLogic?.enableCarAge}
                            onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, enableCarAge: e.target.checked}})}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      {formData.triggerLogic?.enableCarAge && (
                        <div className="pt-4 border-t border-slate-200">
                          <input 
                            type="number" 
                            min="0" max="50" step="0.1"
                            value={formData.triggerLogic?.carAge}
                            onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, carAge: Number(e.target.value)}})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* 行驶总里程 */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-700">行驶总里程 (KM)</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.triggerLogic?.enableMileage}
                            onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, enableMileage: e.target.checked}})}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      {formData.triggerLogic?.enableMileage && (
                        <div className="pt-4 border-t border-slate-200">
                          <input 
                            type="number" 
                            min="0" max="100000"
                            value={formData.triggerLogic?.mileage}
                            onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, mileage: Number(e.target.value)}})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 防打扰策略 */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">防打扰策略 (拒绝次数)</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.triggerLogic?.enableRejectStrategy}
                          onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, enableRejectStrategy: e.target.checked}})}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {formData.triggerLogic?.enableRejectStrategy && (
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <span className="text-sm text-slate-600">在</span>
                        <select 
                          value={formData.triggerLogic?.rejectPeriod}
                          onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, rejectPeriod: e.target.value}})}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                          <option value="1天">1天</option>
                          <option value="7天">7天</option>
                          <option value="30天">30天</option>
                        </select>
                        <span className="text-sm text-slate-600">内拒绝超过</span>
                        <input 
                          type="number" 
                          min="1"
                          value={formData.triggerLogic?.rejectCount}
                          onChange={e => setFormData({...formData, triggerLogic: {...formData.triggerLogic!, rejectCount: Number(e.target.value)}})}
                          className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <span className="text-sm text-slate-600">次不再展示</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 提问链配置区 */}
            {formData.displayType === '新车意向评估' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">3</span>
                    提问链配置
                  </h4>
                  <div className="text-sm text-slate-500">
                    当前已配置的问题总数量: <span className="font-bold text-indigo-600">{formData.questionChain?.length || 0}</span>
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* 左侧列表 */}
                  <div className="w-1/3 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="p-3 bg-slate-50 border-b border-slate-200">
                      <button 
                        type="button"
                        onClick={addQuestion}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Plus size={16} /> 添加问题
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                      {formData.questionChain?.map((q, index) => (
                        <div 
                          key={q.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedIndex(index);
                            // Set drag image to empty to let the browser handle it, or just let default happen
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedIndex === null || draggedIndex === index) return;
                            const newChain = [...(formData.questionChain || [])];
                            const draggedItem = newChain[draggedIndex];
                            newChain.splice(draggedIndex, 1);
                            newChain.splice(index, 0, draggedItem);
                            setFormData({ ...formData, questionChain: newChain });
                            setDraggedIndex(index);
                          }}
                          onDragEnd={() => setDraggedIndex(null)}
                          onClick={() => setActiveQuestionId(q.id)}
                          className={`flex items-center gap-3 p-3 border-b border-slate-100 cursor-pointer transition-colors ${activeQuestionId === q.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'} ${draggedIndex === index ? 'opacity-50' : ''}`}
                        >
                          <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-slate-200 rounded text-slate-400">
                            <GripVertical size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-800 truncate">
                              {index + 1}. {q.text || '未填写问题'}
                            </div>
                            {q.enableCarAssociation && (
                              <div className="text-xs text-indigo-600 mt-1">
                                已关联 {q.associatedCars.length} 款车型
                              </div>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {(!formData.questionChain || formData.questionChain.length === 0) && (
                        <div className="p-8 text-center text-sm text-slate-400">
                          暂无问题，请点击上方按钮添加
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 右侧编辑面板 */}
                  <div className="w-2/3 border border-slate-200 rounded-lg p-5 bg-slate-50/50">
                    {activeQuestion ? (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                          <h5 className="font-bold text-slate-800">
                            编辑问题 {(formData.questionChain?.findIndex(q => q.id === activeQuestionId) || 0) + 1}
                          </h5>
                          <button 
                            type="button"
                            onClick={() => setActiveQuestionId(null)}
                            className="text-sm text-slate-500 hover:text-slate-700"
                          >
                            关闭面板
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">问题文本</label>
                          <input 
                            type="text" 
                            value={activeQuestion.text}
                            onChange={e => updateActiveQuestion({ text: e.target.value })}
                            placeholder="例如：客户是否对新车感兴趣？"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">话术推荐</label>
                          <textarea 
                            value={activeQuestion.script}
                            onChange={e => updateActiveQuestion({ script: e.target.value })}
                            placeholder="输入推荐话术，帮助服务顾问更好地与客户沟通"
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-slate-700">关联车型库</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={activeQuestion.enableCarAssociation}
                                onChange={e => updateActiveQuestion({ enableCarAssociation: e.target.checked })}
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                          
                          {activeQuestion.enableCarAssociation && (
                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                              <p className="text-xs text-slate-500 mb-3">当客户正面回答时，将展示以下车型：</p>
                              {/* 这里简化为输入框，实际应为车型选择器 */}
                              <input 
                                type="text" 
                                value={activeQuestion.associatedCars.join(', ')}
                                onChange={e => updateActiveQuestion({ associatedCars: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="输入车型ID，用逗号分隔 (如: M001, M002)"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <p>请在左侧选择或添加一个问题</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit" 
            form="card-form"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}

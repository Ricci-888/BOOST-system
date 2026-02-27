import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Filter, Info } from 'lucide-react';
import { CardConfig as CardConfigType } from '../types';
import CardConfigForm from '../components/CardConfigForm';
import ConfirmModal from '../components/ConfirmModal';

const MOCK_CARDS: CardConfigType[] = [
  { 
    id: 'C001', 
    name: '进店欢迎卡片', 
    description: '客户首次进店时展示的欢迎语',
    icon: 'Bell',
    displayType: '消息提醒', 
    triggerPages: ['01-车辆信息'],
    status: 'active', 
    creator: 'admin',
    createdAt: '2023-10-24 10:00:00',
    messageNodes: [
      {
        id: 'N1',
        type: 'message',
        content: '欢迎光临！请问有什么可以帮您？'
      },
      {
        id: 'N2',
        type: 'question',
        content: '您是来看车还是做保养？',
        options: [
          { id: 'O1', text: '看车', targetId: 'N3' },
          { id: 'O2', text: '做保养', targetId: 'end' }
        ]
      },
      {
        id: 'N3',
        type: 'message',
        content: '好的，马上为您安排销售顾问。'
      }
    ]
  },
  { 
    id: 'C002', 
    name: '意向车型评估', 
    description: '针对老旧车型客户推送的新车置换意向评估',
    icon: 'CarFront',
    displayType: '新车意向评估', 
    triggerPages: ['02-问诊信息', '04-工序确认'],
    status: 'active', 
    creator: 'system',
    createdAt: '2023-10-24 11:30:00',
    triggerLogic: {
      regions: ['华南区'],
      carSeries: ['秦', '宋'],
      powerTypes: ['燃油'],
      carAge: 3,
      mileage: 50000,
      targetCars: ['M001', 'M002'],
      rejectPeriod: '30天',
      rejectCount: 3
    },
    questionChain: [
      { id: 'Q1', text: '您的爱车已经开了3年，是否有考虑过置换新车？', script: '先生/女士您好，您的车已经开了3年了，现在我们店里有非常好的置换补贴政策，您有兴趣了解一下吗？' },
      { id: 'Q2', text: '您对新能源车型感兴趣吗？', script: '现在新能源车使用成本很低，而且智能化体验非常好，您可以试驾体验一下。' }
    ],
    enableCarAssociation: true,
    associatedCars: ['M001', 'M002']
  },
  { 
    id: 'C003', 
    name: '服务消息', 
    description: '询问客户对新车的价位区间意向',
    icon: 'MessageSquare',
    displayType: '消息提醒', 
    triggerPages: ['05-工单预览'],
    status: 'active', 
    creator: 'admin',
    createdAt: '2023-10-25 10:00:00',
    messageNodes: [
      {
        id: 'N1_C003',
        type: 'question',
        content: '你能接受新车的价位区间？',
        options: [
          { id: 'O1_N1_C003', text: '10w以内', targetId: 'N2_C003' },
          { id: 'O2_N1_C003', text: '10-20w以内', targetId: 'N3_C003' }
        ]
      },
      {
        id: 'N2_C003',
        type: 'question',
        content: '10w以内的新车是否XXXXX？',
        options: [
          { id: 'O1_N2_C003', text: '有意向', targetId: 'end' },
          { id: 'O2_N2_C003', text: '暂无意向', targetId: 'end' }
        ]
      },
      {
        id: 'N3_C003',
        type: 'question',
        content: '10-20w以内的新车是否XXXXX？',
        options: [
          { id: 'O1_N3_C003', text: '有意向', targetId: 'end' },
          { id: 'O2_N3_C003', text: '暂无意向', targetId: 'end' }
        ]
      }
    ]
  }
];

const TYPE_MAP = {
  '消息提醒': { label: '消息提醒', color: 'bg-blue-100 text-blue-700' },
  '新车意向评估': { label: '意向评估', color: 'bg-indigo-100 text-indigo-700' },
};

export default function CardConfig() {
  const [cards, setCards] = useState<CardConfigType[]>(MOCK_CARDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardConfigType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredCards = cards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };

  const handleEdit = (card: CardConfigType) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setCards(cards.filter(c => c.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    setCards(cards.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const handleSave = (data: Partial<CardConfigType>) => {
    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id ? { ...c, ...data } as CardConfigType : c));
    } else {
      const newCard: CardConfigType = {
        ...data,
        id: `C${String(cards.length + 1).padStart(3, '0')}`,
        status: 'active',
        creator: 'admin',
        createdAt: new Date().toLocaleString(),
      } as CardConfigType;
      setCards([newCard, ...cards]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">卡片配置</h2>
          <p className="text-sm text-slate-500 mt-1">管理前端接待流程中向客户展示的各类提醒及意向评估卡片</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          新增配置
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索卡片名称或描述..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            筛选
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">卡片名称</th>
                <th className="px-6 py-4 font-semibold">卡片类型</th>
                <th className="px-6 py-4 font-semibold">触发页面</th>
                <th className="px-6 py-4 font-semibold">状态</th>
                <th className="px-6 py-4 font-semibold">创建人/时间</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      {card.name}
                      {card.description && (
                        <div className="relative group/tooltip">
                          <Info size={14} className="text-slate-400 cursor-help" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                            {card.description}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">ID: {card.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_MAP[card.displayType]?.color || 'bg-slate-100 text-slate-700'}`}>
                      {card.displayType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {card.triggerPages.map(page => (
                        <span key={page} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                          {page.split('-')[1] || page}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={card.status === 'active'}
                        onChange={() => handleToggleStatus(card.id)}
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{card.creator}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{card.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(card)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" 
                        title="编辑"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(card.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCards.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              未找到匹配的卡片配置
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <div>共 {filteredCards.length} 条记录</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded-md bg-white text-slate-400 cursor-not-allowed">上一页</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md bg-white hover:bg-slate-50 text-slate-700">下一页</button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <CardConfigForm 
          initialData={editingCard}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="确认删除"
        message="您确定要删除该卡片配置吗？此操作不可恢复。"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}

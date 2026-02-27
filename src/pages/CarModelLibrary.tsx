import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Filter, CarFront, Info, MoreVertical } from 'lucide-react';
import { CarModel } from '../types';
import CarModelForm from '../components/CarModelForm';
import ConfirmModal from '../components/ConfirmModal';

const MOCK_MODELS: CarModel[] = [
  { id: 'M001', brand: '王朝', name: '比亚迪 Tang DM-p', imageUrl: 'https://picsum.photos/seed/tang/400/250', coreSellingPoints: ['1030km超长续航', '4.3秒破百动力', '超安全刀片电池', 'DiPilot智能驾驶辅助系统'], competitors: ['理想L7', '蔚来ES6', '小鹏G9'], status: 'active', updatedAt: '2023-10-24 10:00' },
  { id: 'M002', brand: '王朝', name: '比亚迪 Han EV', imageUrl: 'https://picsum.photos/seed/han/400/250', coreSellingPoints: ['纯电续航610km', '3.9秒破百', 'DiPilot智能驾驶', 'C级豪华旗舰轿车'], competitors: ['特斯拉Model 3', '小鹏P7', '蔚来ET5'], status: 'active', updatedAt: '2023-10-24 11:30' },
  { id: 'M003', brand: '王朝', name: '比亚迪 SONG EV', imageUrl: 'https://picsum.photos/seed/song/400/250', coreSellingPoints: ['纯电续航610km', '3.9秒破百', 'DiPilot智能驾驶', 'C级豪华旗舰轿车'], competitors: ['特斯拉Model 3', '小鹏P7', '蔚来ET5'], status: 'active', updatedAt: '2023-10-23 15:20' },
];

export default function CarModelLibrary() {
  const [models, setModels] = useState<CarModel[]>(MOCK_MODELS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CarModel | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingModel(null);
    setIsFormOpen(true);
  };

  const handleEdit = (model: CarModel) => {
    setEditingModel(model);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setModels(models.filter(m => m.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleSave = (data: Partial<CarModel>) => {
    if (editingModel) {
      setModels(models.map(m => m.id === editingModel.id ? { ...m, ...data, updatedAt: new Date().toLocaleString() } as CarModel : m));
    } else {
      const newModel: CarModel = {
        ...data,
        id: `M${String(models.length + 1).padStart(3, '0')}`,
        status: 'active',
        updatedAt: new Date().toLocaleString(),
      } as CarModel;
      setModels([newModel, ...models]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">新车意向车型库</h2>
          <p className="text-sm text-slate-500 mt-1">维护新车的基础信息、核心卖点及竞品对标数据，为前台推荐提供支撑</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          新增车型
        </button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索品牌或车型名称..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} />
          筛选
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {model.imageUrl ? (
                <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <CarFront size={48} />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={() => handleEdit(model)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-indigo-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(model.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{model.name}</h3>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                    {model.brand}
                  </span>
                </div>
                {model.status === 'active' ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={14} /> 上架
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    <XCircle size={14} /> 下架
                  </span>
                )}
              </div>

              <div className="mb-4 flex-1">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">核心卖点</h4>
                <ul className="space-y-1.5">
                  {model.coreSellingPoints.filter(Boolean).map((point, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span className="leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">对标车型</h4>
                <div className="flex flex-wrap gap-1.5">
                  {model.competitors.filter(Boolean).map((comp, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
          <CarFront size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">未找到匹配的车型</h3>
          <p className="text-sm text-slate-500">尝试调整搜索词或新增车型</p>
        </div>
      )}

      {isFormOpen && (
        <CarModelForm 
          initialData={editingModel} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="确认删除"
        message="您确定要删除该车型吗？此操作不可恢复。"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}

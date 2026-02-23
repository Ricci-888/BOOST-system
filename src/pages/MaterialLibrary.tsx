import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Material } from '../types';
import MaterialForm from '../components/MaterialForm';

// Mock Data
const MOCK_MATERIALS: Material[] = [
  {
    id: '1',
    materialNo: 'MAT-001',
    name: '高级真皮座椅',
    sellingPoints: ['Nappa真皮材质', '12向电动调节', '座椅通风加热'],
    status: 'active',
    updatedAt: '2023-10-27 10:00:00'
  },
  {
    id: '2',
    materialNo: 'MAT-002',
    name: '智能驾驶辅助系统',
    sellingPoints: ['L2+级自动驾驶', '全速自适应巡航', '车道保持辅助'],
    status: 'active',
    updatedAt: '2023-10-26 14:30:00'
  }
];

export default function MaterialLibrary() {
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.materialNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingMaterial(null);
    setIsFormOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该物料吗？')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toLocaleString() } as Material : m
    ));
  };

  const handleSave = (data: Partial<Material>) => {
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.id === editingMaterial.id ? { ...m, ...data, updatedAt: new Date().toLocaleString() } as Material : m
      ));
    } else {
      const newMaterial: Material = {
        ...data,
        id: Date.now().toString(),
        updatedAt: new Date().toLocaleString(),
      } as Material;
      setMaterials([newMaterial, ...materials]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">物料库管理</h2>
          <p className="text-slate-500 mt-1">管理系统中的所有物料信息及核心卖点</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          新增物料
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="搜索物料号或名称..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="text-sm text-slate-500">
            共 <span className="font-bold text-slate-800">{filteredMaterials.length}</span> 个物料
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-medium">物料号</th>
                <th className="p-4 font-medium">物料名称</th>
                <th className="p-4 font-medium">主要卖点</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">更新时间</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className={`hover:bg-slate-50 transition-colors group ${material.status === 'inactive' ? 'opacity-60' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${material.status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Package size={20} />
                      </div>
                      <span className="font-medium text-slate-800">{material.materialNo}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">
                    {material.name}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {material.sellingPoints.map((point, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {point}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={material.status === 'active'}
                        onChange={() => handleToggleStatus(material.id)}
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {material.updatedAt}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(material)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(material.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Package size={48} className="text-slate-300" />
                      <p>未找到匹配的物料信息</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <MaterialForm 
          initialData={editingMaterial}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

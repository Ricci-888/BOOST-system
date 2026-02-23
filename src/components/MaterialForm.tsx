import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { Material } from '../types';

interface MaterialFormProps {
  initialData?: Material | null;
  onSave: (data: Partial<Material>) => void;
  onCancel: () => void;
}

export default function MaterialForm({ initialData, onSave, onCancel }: MaterialFormProps) {
  const [formData, setFormData] = useState<Partial<Material>>(
    initialData || {
      materialNo: '',
      name: '',
      sellingPoints: [''],
      status: 'active',
    }
  );

  const handleAddPoint = () => {
    setFormData({
      ...formData,
      sellingPoints: [...(formData.sellingPoints || []), '']
    });
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = [...(formData.sellingPoints || [])];
    newPoints.splice(index, 1);
    setFormData({ ...formData, sellingPoints: newPoints });
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...(formData.sellingPoints || [])];
    newPoints[index] = value;
    setFormData({ ...formData, sellingPoints: newPoints });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialNo || !formData.name) {
      alert('物料号和物料名称为必填项');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? '编辑物料' : '新增物料'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="material-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>物料号
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.materialNo}
                  onChange={e => setFormData({...formData, materialNo: e.target.value})}
                  placeholder="例如：MAT-001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>物料名称
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="例如：高级真皮座椅"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">主要卖点</label>
              <div className="space-y-2">
                {formData.sellingPoints?.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={point}
                      onChange={e => handlePointChange(index, e.target.value)}
                      placeholder="输入主要卖点..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={handleAddPoint}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors"
                      title="新增一行"
                    >
                      <Plus size={18} />
                    </button>
                    {formData.sellingPoints!.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemovePoint(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="删除当前行"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit" 
            form="material-form"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

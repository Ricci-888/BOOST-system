import React, { useState } from 'react';
import { Plus, Minus, X, Image as ImageIcon } from 'lucide-react';
import { CarModel } from '../types';

interface CarModelFormProps {
  initialData?: CarModel | null;
  onSave: (data: Partial<CarModel>) => void;
  onCancel: () => void;
}

export default function CarModelForm({ initialData, onSave, onCancel }: CarModelFormProps) {
  const [formData, setFormData] = useState<Partial<CarModel>>(
    initialData || {
      brand: '',
      name: '',
      imageUrl: '',
      coreSellingPoints: [''],
      competitors: [''],
      status: 'active',
    }
  );

  const handleAddPoint = () => {
    setFormData({
      ...formData,
      coreSellingPoints: [...(formData.coreSellingPoints || []), '']
    });
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = [...(formData.coreSellingPoints || [])];
    newPoints.splice(index, 1);
    setFormData({ ...formData, coreSellingPoints: newPoints });
  };

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...(formData.coreSellingPoints || [])];
    newPoints[index] = value;
    setFormData({ ...formData, coreSellingPoints: newPoints });
  };

  const handleAddComp = () => {
    setFormData({
      ...formData,
      competitors: [...(formData.competitors || []), '']
    });
  };

  const handleRemoveComp = (index: number) => {
    const newComps = [...(formData.competitors || [])];
    newComps.splice(index, 1);
    setFormData({ ...formData, competitors: newComps });
  };

  const handleCompChange = (index: number, value: string) => {
    const newComps = [...(formData.competitors || [])];
    newComps[index] = value;
    setFormData({ ...formData, competitors: newComps });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('车型名称为必填项');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? '编辑车型' : '新增车型'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="car-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">车型品牌</label>
                <select 
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">请选择品牌</option>
                  <option value="王朝">王朝</option>
                  <option value="海洋">海洋</option>
                  <option value="腾势">腾势</option>
                  <option value="仰望">仰望</option>
                  <option value="方程豹">方程豹</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>车型名称
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="例如：比亚迪 Tang DM-p"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">图片 URL</label>
              <input 
                type="url" 
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-3"
              />
              {formData.imageUrl ? (
                <div className="w-full h-48 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img src={formData.imageUrl} alt="预览" className="max-w-full max-h-full object-contain" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }} />
                  <div className="hidden text-slate-400 flex-col items-center gap-2">
                    <ImageIcon size={32} />
                    <span className="text-sm">图片加载失败</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 rounded-lg border border-slate-200 border-dashed bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-sm">输入链接预览图片</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">核心卖点</label>
              <div className="space-y-2">
                {formData.coreSellingPoints?.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={point}
                      onChange={e => handlePointChange(index, e.target.value)}
                      placeholder="输入核心卖点..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={handleAddPoint}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                    {formData.coreSellingPoints!.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemovePoint(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">对标车型</label>
              <div className="space-y-2">
                {formData.competitors?.map((comp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={comp}
                      onChange={e => handleCompChange(index, e.target.value)}
                      placeholder="输入竞品车型..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={handleAddComp}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                    {formData.competitors!.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveComp(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
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
            form="car-form"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

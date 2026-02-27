import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import { MessageNodeConfig } from '../types';

interface MessagePreviewModalProps {
  isOpen: boolean;
  nodes: MessageNodeConfig[];
  onClose: () => void;
}

export default function MessagePreviewModal({ isOpen, nodes, onClose }: MessagePreviewModalProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && nodes.length > 0) {
      setCurrentNodeId(nodes[0].id);
    } else {
      setCurrentNodeId(null);
    }
  }, [isOpen, nodes]);

  if (!isOpen) return null;

  const currentNode = nodes.find(n => n.id === currentNodeId);
  const currentIndex = nodes.findIndex(n => n.id === currentNodeId);
  const isLastNode = currentIndex === nodes.length - 1;

  const handleNext = () => {
    if (isLastNode) {
      setCurrentNodeId('end');
    } else {
      setCurrentNodeId(nodes[currentIndex + 1].id);
    }
  };

  const handleOptionClick = (targetId: string) => {
    setCurrentNodeId(targetId);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">效果预览</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex flex-col">
          {nodes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              暂无节点配置
            </div>
          ) : currentNodeId === 'end' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={24} />
              </div>
              <p className="font-medium text-slate-700">流程结束</p>
              <button 
                onClick={() => setCurrentNodeId(nodes[0].id)}
                className="px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors mt-2"
              >
                重新预览
              </button>
            </div>
          ) : currentNode ? (
            <div className="flex flex-col gap-4 mt-auto">
              <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 max-w-[90%] self-start">
                <p className="text-slate-800 text-[15px] leading-relaxed">{currentNode.content || '未填写内容'}</p>
              </div>

              {currentNode.type === 'question' && currentNode.options && (
                <div className="flex flex-col gap-2 mt-2">
                  {currentNode.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.targetId)}
                      className="bg-white border border-indigo-100 text-indigo-600 p-3 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors text-center shadow-sm"
                    >
                      {opt.text || '未填写选项'}
                    </button>
                  ))}
                </div>
              )}

              {currentNode.type === 'message' && (
                <div className="mt-2">
                  <button
                    onClick={handleNext}
                    className="w-full bg-indigo-600 text-white p-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    {isLastNode ? '完成' : '下一步'}
                    {!isLastNode && <ChevronRight size={16} />}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

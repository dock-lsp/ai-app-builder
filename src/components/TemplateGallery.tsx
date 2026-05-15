import { useState } from 'react';
import { templates, type Template } from '@/templates';
import { useEditorStore } from '@/store/editorStore';
import { X, Eye, Check, Layout, User, ShoppingCart, Settings, List, FileText, BarChart3, Image, Sparkles } from 'lucide-react';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<Template['category'], React.ReactNode> = {
  auth: <Layout size={16} />,
  profile: <User size={16} />,
  commerce: <ShoppingCart size={16} />,
  content: <FileText size={16} />,
  dashboard: <BarChart3 size={16} />,
  settings: <Settings size={16} />,
  list: <List size={16} />,
  form: <FileText size={16} />,
  gallery: <Image size={16} />,
  onboarding: <Sparkles size={16} />,
};

const categoryLabels: Record<Template['category'], string> = {
  auth: '认证',
  profile: '个人',
  commerce: '电商',
  content: '内容',
  dashboard: '数据',
  settings: '设置',
  list: '列表',
  form: '表单',
  gallery: '相册',
  onboarding: '引导',
};

export function TemplateGallery({ isOpen, onClose }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<Template['category'] | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { loadProject } = useEditorStore();

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    loadProject(template.components);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>模板库</h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>选择一个模板快速开始</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f3f4f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar - Categories */}
          <div style={{
            width: '180px',
            borderRight: '1px solid #e5e7eb',
            padding: '16px',
            overflowY: 'auto',
          }}>
            <div
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '4px',
                backgroundColor: selectedCategory === 'all' ? '#eff6ff' : 'transparent',
                color: selectedCategory === 'all' ? '#3b82f6' : '#374151',
                fontWeight: selectedCategory === 'all' ? '600' : '400',
              }}
            >
              全部模板
            </div>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div
                key={key}
                onClick={() => setSelectedCategory(key as Template['category'])}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: selectedCategory === key ? '#eff6ff' : 'transparent',
                  color: selectedCategory === key ? '#3b82f6' : '#374151',
                  fontWeight: selectedCategory === key ? '600' : '400',
                }}
              >
                {categoryIcons[key as Template['category']]}
                {label}
              </div>
            ))}
          </div>

          {/* Templates Grid */}
          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}>
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    height: '120px',
                    backgroundColor: '#f9fafb',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Hover Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="预览"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(template);
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="使用模板"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '12px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      {template.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                    }}>
                      {template.description}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap',
                    }}>
                      {template.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            borderRadius: '4px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}
        onClick={() => setPreviewTemplate(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: '600' }}>{previewTemplate.name}</span>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '20px',
              backgroundColor: '#f9fafb',
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                minHeight: '400px',
              }}>
                {/* 这里可以渲染组件预览 */}
                <img
                  src={previewTemplate.thumbnail}
                  alt={previewTemplate.name}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                />
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {previewTemplate.description}
                </p>
              </div>
            </div>
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                使用此模板
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

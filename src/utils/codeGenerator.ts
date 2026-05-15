import type { ComponentSchema } from '@/types';

interface GenerateOptions {
  appName: string;
  packageName: string;
  version: string;
}

// 生成 React Native 代码
export function generateRNCode(components: ComponentSchema[], _options: GenerateOptions): string {
  const imports = generateImports(components);
  const componentCode = generateComponentTree(components, 0);
  
  return `import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  FlatList,
} from 'react-native';
${imports}

export default function App() {
  return (
    <ScrollView style={styles.container}>
${componentCode}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
${generateStyles(components)}
});
`;
}

// 生成导入语句
function generateImports(components: ComponentSchema[]): string {
  const usedComponents = new Set<string>();
  
  const collectTypes = (comps: ComponentSchema[]) => {
    comps.forEach(comp => {
      usedComponents.add(comp.type);
      if (comp.children.length > 0) {
        collectTypes(comp.children);
      }
    });
  };
  
  collectTypes(components);
  
  // 基础组件都在 react-native 中导入
  return '';
}

// 生成组件树
function generateComponentTree(components: ComponentSchema[], indent: number): string {
  const indentStr = '  '.repeat(indent + 2);
  
  return components.map(comp => {
    const code = generateComponentCode(comp, indent + 1);
    return code.split('\n').map(line => indentStr + line).join('\n');
  }).join('\n');
}

// 生成单个组件代码
function generateComponentCode(component: ComponentSchema, indent: number): string {
  const { type, props, style, children } = component;
  const styleName = `style_${component.id}`;
  
  switch (type) {
    case 'text':
      return `<Text style={styles.${styleName}}>${escapeText(props.content || '')}</Text>`;
    
    case 'header':
      const size = props.level === 1 ? 24 : props.level === 2 ? 20 : props.level === 3 ? 18 : 16;
      return `<Text style={[styles.${styleName}, { fontSize: ${size}, fontWeight: 'bold' }]}>${escapeText(props.text || '')}</Text>`;
    
    case 'button':
      return `<TouchableOpacity style={styles.${styleName}} onPress={() => {}}>
  <Text style={{ color: '${style.color || '#ffffff'}', fontSize: ${parseInt(style.fontSize as string) || 14} }}>${escapeText(props.text || '按钮')}</Text>
</TouchableOpacity>`;
    
    case 'image':
      return `<Image source={{ uri: '${props.src || 'https://via.placeholder.com/300'}' }} style={styles.${styleName}} />`;
    
    case 'input':
      return `<View>
  ${props.label ? `<Text style={{ marginBottom: 4, fontSize: 14 }}>${escapeText(props.label)}</Text>` : ''}
  <TextInput 
    style={styles.${styleName}} 
    placeholder="${escapeText(props.placeholder || '')}"
    placeholderTextColor="#9ca3af"
  />
</View>`;
    
    case 'container':
      return `<View style={styles.${styleName}}>
${children.length > 0 ? generateComponentTree(children, indent) : ''}
</View>`;
    
    case 'card':
      return `<View style={styles.${styleName}}>
  ${props.title ? `<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>${escapeText(props.title)}</Text>` : ''}
${children.length > 0 ? generateComponentTree(children, indent) : ''}
</View>`;
    
    case 'row':
      return `<View style={styles.${styleName}}>
${children.length > 0 ? generateComponentTree(children, indent) : ''}
</View>`;
    
    case 'column':
      return `<View style={styles.${styleName}}>
${children.length > 0 ? generateComponentTree(children, indent) : ''}
</View>`;
    
    case 'grid':
      return `<View style={styles.${styleName}}>
${children.length > 0 ? generateComponentTree(children, indent) : ''}
</View>`;
    
    case 'list':
      const items = Array.isArray(props.items) ? props.items : ['项目1', '项目2', '项目3'];
      return `<FlatList
  data={${JSON.stringify(items)}}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <Text style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>{item}</Text>
  )}
/>`;
    
    case 'avatar':
      return `<Image source={{ uri: '${props.src || 'https://via.placeholder.com/40'}' }} style={styles.${styleName}} />`;
    
    case 'badge':
      return `<View style={[styles.${styleName}, { backgroundColor: '${props.color || '#ef4444'}' }]}>
  <Text style={{ color: '#ffffff', fontSize: 12 }}>${escapeText(props.text || '')}</Text>
</View>`;
    
    case 'switch':
      return `<Switch value={${props.checked || false}} onValueChange={() => {}} />`;
    
    case 'divider':
      return `<View style={styles.${styleName}} />`;
    
    default:
      return `<View style={styles.${styleName}} />`;
  }
}

// 生成样式
function generateStyles(components: ComponentSchema[]): string {
  const styles: string[] = [];
  
  const collectStyles = (comps: ComponentSchema[]) => {
    comps.forEach(comp => {
      const styleCode = generateStyleForComponent(comp);
      if (styleCode) {
        styles.push(styleCode);
      }
      if (comp.children.length > 0) {
        collectStyles(comp.children);
      }
    });
  };
  
  collectStyles(components);
  
  return styles.join('\n');
}

// 为单个组件生成样式
function generateStyleForComponent(component: ComponentSchema): string {
  const { type, style, id } = component;
  const styleName = `style_${id}`;
  
  const rnStyles: Record<string, any> = {};
  
  // 转换 web 样式为 RN 样式
  if (style.width) rnStyles.width = style.width;
  if (style.height) rnStyles.height = style.height;
  if (style.minHeight) rnStyles.minHeight = style.minHeight;
  if (style.maxWidth) rnStyles.maxWidth = style.maxWidth;
  if (style.padding) rnStyles.padding = parseInt(style.padding as string) || 0;
  if ((style as any).paddingHorizontal) rnStyles.paddingHorizontal = parseInt((style as any).paddingHorizontal as string) || 0;
  if ((style as any).paddingVertical) rnStyles.paddingVertical = parseInt((style as any).paddingVertical as string) || 0;
  if (style.margin) rnStyles.margin = parseInt(style.margin as string) || 0;
  if (style.marginBottom) rnStyles.marginBottom = parseInt(style.marginBottom as string) || 0;
  if (style.marginTop) rnStyles.marginTop = parseInt(style.marginTop as string) || 0;
  if (style.marginLeft) rnStyles.marginLeft = parseInt(style.marginLeft as string) || 0;
  if (style.marginRight) rnStyles.marginRight = parseInt(style.marginRight as string) || 0;
  if (style.backgroundColor) rnStyles.backgroundColor = style.backgroundColor;
  if (style.borderRadius) rnStyles.borderRadius = parseInt(style.borderRadius as string) || 0;
  if (style.borderWidth) rnStyles.borderWidth = parseInt(style.borderWidth as string) || 0;
  if (style.borderColor) rnStyles.borderColor = style.borderColor;
  if (style.fontSize) rnStyles.fontSize = parseInt(style.fontSize as string) || 14;
  if (style.fontWeight) rnStyles.fontWeight = style.fontWeight;
  if (style.color) rnStyles.color = style.color;
  if (style.lineHeight) rnStyles.lineHeight = parseInt(style.lineHeight as string) || 1.5;
  if (style.textAlign) rnStyles.textAlign = style.textAlign;
  if (style.flex) rnStyles.flex = style.flex;
  if (style.display === 'flex') {
    rnStyles.flexDirection = style.flexDirection || 'row';
    if (style.gap) rnStyles.gap = parseInt(style.gap as string) || 0;
    if (style.justifyContent) rnStyles.justifyContent = style.justifyContent;
    if (style.alignItems) rnStyles.alignItems = style.alignItems;
  }
  
  // 特殊处理
  switch (type) {
    case 'button':
      rnStyles.justifyContent = 'center';
      rnStyles.alignItems = 'center';
      break;
    case 'avatar':
      const size = component.props.size || 40;
      rnStyles.width = size;
      rnStyles.height = size;
      rnStyles.borderRadius = size / 2;
      break;
    case 'badge':
      rnStyles.paddingHorizontal = 8;
      rnStyles.paddingVertical = 2;
      rnStyles.borderRadius = 12;
      rnStyles.alignSelf = 'flex-start';
      break;
    case 'divider':
      rnStyles.height = 1;
      rnStyles.backgroundColor = style.backgroundColor || '#e2e8f0';
      break;
    case 'grid':
      rnStyles.display = 'flex';
      rnStyles.flexDirection = 'row';
      rnStyles.flexWrap = 'wrap';
      break;
  }
  
  if (Object.keys(rnStyles).length === 0) {
    return '';
  }
  
  return `  ${styleName}: ${JSON.stringify(rnStyles, null, 2).replace(/"/g, "'").replace(/\n/g, '\n  ')},`;
}

// 转义文本
function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 生成 package.json
export function generatePackageJson(options: GenerateOptions): string {
  return JSON.stringify({
    name: options.appName.toLowerCase().replace(/\s+/g, '-'),
    version: options.version,
    main: 'node_modules/expo/AppEntry.js',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web',
    },
    dependencies: {
      'expo': '~49.0.0',
      'expo-status-bar': '~1.6.0',
      'react': '18.2.0',
      'react-native': '0.72.6',
    },
    devDependencies: {
      '@babel/core': '^7.20.0',
    },
    private: true,
  }, null, 2);
}

// 生成 app.json
export function generateAppJson(options: GenerateOptions): string {
  return JSON.stringify({
    expo: {
      name: options.appName,
      slug: options.appName.toLowerCase().replace(/\s+/g, '-'),
      version: options.version,
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: options.packageName,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        package: options.packageName,
      },
      web: {
        favicon: './assets/favicon.png',
      },
    },
  }, null, 2);
}

// 生成完整项目 ZIP 内容（返回文件列表）
export function generateProjectFiles(components: ComponentSchema[], options: GenerateOptions): { name: string; content: string }[] {
  return [
    { name: 'App.js', content: generateRNCode(components, options) },
    { name: 'package.json', content: generatePackageJson(options) },
    { name: 'app.json', content: generateAppJson(options) },
    { name: 'babel.config.js', content: `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};` },
  ];
}

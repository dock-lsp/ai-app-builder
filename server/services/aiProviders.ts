// AI 模型提供商统一配置
// 支持所有主流 AI 模型接入 + 自定义添加

export interface AIModelProvider {
  id: string;
  name: string;
  nameEn: string;
  category: 'openai_compatible' | 'anthropic' | 'google' | 'custom';
  apiBase: string;
  description: string;
  icon: string; // emoji or icon identifier
  color: string;
  models: AIModel[];
  configFields: ConfigField[];
  enabled: boolean;
  isBuiltIn: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  inputPrice?: number;   // per 1M tokens
  outputPrice?: number;  // per 1M tokens
  capabilities: string[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

export interface UserProviderConfig {
  providerId: string;
  apiKey: string;
  apiBase?: string;
  customModel?: string;
  enabled: boolean;
  isDefault: boolean;
}

// ========== 内置提供商列表 ==========
export const BUILT_IN_PROVIDERS: AIModelProvider[] = [
  // --- OpenAI 系列 ---
  {
    id: 'openai',
    name: 'OpenAI',
    nameEn: 'OpenAI',
    category: 'openai_compatible',
    apiBase: 'https://api.openai.com/v1',
    description: 'GPT-4o、GPT-4、GPT-3.5 等模型',
    icon: '🤖',
    color: '#10a37f',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000, inputPrice: 2.5, outputPrice: 10, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128000, inputPrice: 0.15, outputPrice: 0.6, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000, inputPrice: 10, outputPrice: 30, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385, inputPrice: 0.5, outputPrice: 1.5, capabilities: ['chat', 'function_calling'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: 'openai-responses',
    name: 'OpenAI (Responses)',
    nameEn: 'OpenAI Responses API',
    category: 'openai_compatible',
    apiBase: 'https://api.openai.com/v1',
    description: 'OpenAI Responses API 端点',
    icon: '🤖',
    color: '#10a37f',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Responses)', maxTokens: 128000, inputPrice: 2.5, outputPrice: 10, capabilities: ['chat', 'vision'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Anthropic ---
  {
    id: 'claude',
    name: 'Claude',
    nameEn: 'Anthropic Claude',
    category: 'anthropic',
    apiBase: 'https://api.anthropic.com/v1',
    description: 'Claude 3.5 Sonnet、Claude 3 Opus 等模型',
    icon: '🟠',
    color: '#d4a574',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', maxTokens: 200000, inputPrice: 3, outputPrice: 15, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', maxTokens: 200000, inputPrice: 3, outputPrice: 15, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', maxTokens: 200000, inputPrice: 0.8, outputPrice: 4, capabilities: ['chat', 'vision'] },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', maxTokens: 200000, inputPrice: 15, outputPrice: 75, capabilities: ['chat', 'vision'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-ant-...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Google Gemini ---
  {
    id: 'gemini',
    name: 'Gemini',
    nameEn: 'Google Gemini',
    category: 'google',
    apiBase: 'https://generativelanguage.googleapis.com/v1beta',
    description: 'Gemini Pro、Gemini Ultra 等模型',
    icon: '💎',
    color: '#4285f4',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', maxTokens: 1000000, inputPrice: 1.25, outputPrice: 10, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', maxTokens: 1000000, inputPrice: 0.15, outputPrice: 0.6, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', maxTokens: 1000000, inputPrice: 0.1, outputPrice: 0.4, capabilities: ['chat', 'vision'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'AIza...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- DeepSeek ---
  {
    id: 'deepseek',
    name: 'DeepSeek',
    nameEn: 'DeepSeek',
    category: 'openai_compatible',
    apiBase: 'https://api.deepseek.com/v1',
    description: 'DeepSeek V3、DeepSeek Coder 等模型',
    icon: '🔵',
    color: '#4d6bfe',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3', maxTokens: 64000, inputPrice: 0.27, outputPrice: 1.1, capabilities: ['chat', 'function_calling'] },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', maxTokens: 64000, inputPrice: 0.55, outputPrice: 2.19, capabilities: ['chat', 'reasoning'] },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', maxTokens: 64000, inputPrice: 0.27, outputPrice: 1.1, capabilities: ['chat', 'code'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Qwen (通义千问) ---
  {
    id: 'qwen',
    name: 'Qwen',
    nameEn: 'Alibaba Qwen',
    category: 'openai_compatible',
    apiBase: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    description: '通义千问大模型系列',
    icon: '🟣',
    color: '#6236ff',
    models: [
      { id: 'qwen-max', name: 'Qwen Max', maxTokens: 32000, inputPrice: 1.6, outputPrice: 4.8, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'qwen-plus', name: 'Qwen Plus', maxTokens: 128000, inputPrice: 0.8, outputPrice: 2, capabilities: ['chat', 'vision'] },
      { id: 'qwen-turbo', name: 'Qwen Turbo', maxTokens: 128000, inputPrice: 0.3, outputPrice: 0.6, capabilities: ['chat'] },
      { id: 'qwen-coder-plus', name: 'Qwen Coder Plus', maxTokens: 128000, inputPrice: 1, outputPrice: 3, capabilities: ['chat', 'code'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: 'qwen-portal',
    name: 'Qwen Portal',
    nameEn: 'Qwen Portal',
    category: 'openai_compatible',
    apiBase: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    description: '通义千问 Portal 版',
    icon: '🟣',
    color: '#6236ff',
    models: [
      { id: 'qwen-max', name: 'Qwen Max (Portal)', maxTokens: 32000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- SiliconFlow (硅基流动) ---
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    nameEn: 'SiliconFlow',
    category: 'openai_compatible',
    apiBase: 'https://api.siliconflow.cn/v1',
    description: '硅基流动 - 国产模型聚合平台',
    icon: '🟪',
    color: '#7c3aed',
    models: [
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', maxTokens: 64000, capabilities: ['chat'] },
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B', maxTokens: 32000, capabilities: ['chat'] },
      { id: 'THUDM/glm-4-9b-chat', name: 'GLM-4 9B', maxTokens: 128000, capabilities: ['chat'] },
      { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct', name: 'Llama 3.1 405B', maxTokens: 128000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- OpenRouter ---
  {
    id: 'openrouter',
    name: 'OpenRouter',
    nameEn: 'OpenRouter',
    category: 'openai_compatible',
    apiBase: 'https://openrouter.ai/api/v1',
    description: '统一 API 网关，支持数百个模型',
    icon: '🌐',
    color: '#1a1a2e',
    models: [
      { id: 'openai/gpt-4o', name: 'GPT-4o', maxTokens: 128000, capabilities: ['chat', 'vision'] },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200000, capabilities: ['chat', 'vision'] },
      { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', maxTokens: 1000000, capabilities: ['chat', 'vision'] },
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', maxTokens: 128000, capabilities: ['chat'] },
      { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', maxTokens: 32000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Azure OpenAI ---
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    nameEn: 'Azure OpenAI Service',
    category: 'openai_compatible',
    apiBase: 'https://{resource}.openai.azure.com/openai/deployments/{deployment}',
    description: '微软 Azure 托管的 OpenAI 服务',
    icon: '☁️',
    color: '#0078d4',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Azure)', maxTokens: 128000, capabilities: ['chat', 'vision'] },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (Azure)', maxTokens: 128000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'apiBase', label: 'API Endpoint', type: 'text', placeholder: 'https://xxx.openai.azure.com/...', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Groq ---
  {
    id: 'groq',
    name: 'Groq',
    nameEn: 'Groq',
    category: 'openai_compatible',
    apiBase: 'https://api.groq.com/openai/v1',
    description: '超高速 LLM 推理服务',
    icon: '⚡',
    color: '#f55036',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', maxTokens: 128000, inputPrice: 0.59, outputPrice: 0.79, capabilities: ['chat', 'function_calling'] },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', maxTokens: 128000, inputPrice: 0.05, outputPrice: 0.08, capabilities: ['chat'] },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', maxTokens: 32768, inputPrice: 0.24, outputPrice: 0.24, capabilities: ['chat'] },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', maxTokens: 8192, inputPrice: 0.05, outputPrice: 0.08, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- xAI (Grok) ---
  {
    id: 'xai',
    name: 'xAI',
    nameEn: 'xAI (Grok)',
    category: 'openai_compatible',
    apiBase: 'https://api.x.ai/v1',
    description: 'Elon Musk 的 xAI，Grok 模型',
    icon: '✖️',
    color: '#000000',
    models: [
      { id: 'grok-3', name: 'Grok 3', maxTokens: 131072, inputPrice: 3, outputPrice: 15, capabilities: ['chat', 'function_calling'] },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', maxTokens: 131072, inputPrice: 0.3, outputPrice: 0.5, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Mistral AI ---
  {
    id: 'mistral',
    name: 'Mistral AI',
    nameEn: 'Mistral AI',
    category: 'openai_compatible',
    apiBase: 'https://api.mistral.ai/v1',
    description: '法国 Mistral AI 开源模型',
    icon: '🔥',
    color: '#ff7000',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', maxTokens: 128000, inputPrice: 2, outputPrice: 6, capabilities: ['chat', 'function_calling'] },
      { id: 'mistral-medium-latest', name: 'Mistral Medium', maxTokens: 32000, inputPrice: 0.7, outputPrice: 2.1, capabilities: ['chat'] },
      { id: 'codestral-latest', name: 'Codestral', maxTokens: 32000, inputPrice: 0.3, outputPrice: 0.9, capabilities: ['code'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Perplexity ---
  {
    id: 'perplexity',
    name: 'Perplexity',
    nameEn: 'Perplexity AI',
    category: 'openai_compatible',
    apiBase: 'https://api.perplexity.ai',
    description: 'AI 搜索引擎',
    icon: '🔮',
    color: '#1a1a2e',
    models: [
      { id: 'sonar-pro', name: 'Sonar Pro', maxTokens: 200000, capabilities: ['chat', 'search'] },
      { id: 'sonar', name: 'Sonar', maxTokens: 127000, capabilities: ['chat', 'search'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- VolcEngine (火山引擎/豆包) ---
  {
    id: 'volcengine',
    name: 'VolcEngine',
    nameEn: 'VolcEngine (豆包)',
    category: 'openai_compatible',
    apiBase: 'https://ark.cn-beijing.volces.com/api/v3',
    description: '字节跳动火山引擎 - 豆包大模型',
    icon: '🌋',
    color: '#3370ff',
    models: [
      { id: 'doubao-pro-32k', name: '豆包 Pro 32K', maxTokens: 32000, capabilities: ['chat'] },
      { id: 'doubao-pro-128k', name: '豆包 Pro 128K', maxTokens: 128000, capabilities: ['chat'] },
      { id: 'doubao-lite-32k', name: '豆包 Lite 32K', maxTokens: 32000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- ChatGLM ---
  {
    id: 'chatglm',
    name: 'ChatGLM',
    nameEn: 'THUDM ChatGLM',
    category: 'openai_compatible',
    apiBase: 'https://open.bigmodel.cn/api/paas/v4',
    description: '清华 ChatGLM 大模型',
    icon: '💬',
    color: '#3b82f6',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus', maxTokens: 128000, capabilities: ['chat', 'vision', 'function_calling'] },
      { id: 'glm-4-air', name: 'GLM-4 Air', maxTokens: 128000, capabilities: ['chat'] },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', maxTokens: 128000, capabilities: ['chat'] },
      { id: 'glm-4v-plus', name: 'GLM-4V Plus', maxTokens: 8000, capabilities: ['chat', 'vision'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- MiniMax ---
  {
    id: 'minimax-global',
    name: 'MiniMax Global',
    nameEn: 'MiniMax Global',
    category: 'openai_compatible',
    apiBase: 'https://api.minimax.chat/v1',
    description: 'MiniMax 国际版',
    icon: '🎵',
    color: '#e91e63',
    models: [
      { id: 'MiniMax-Text-01', name: 'MiniMax-Text-01', maxTokens: 1000000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: 'minimax-cn',
    name: 'MiniMax CN',
    nameEn: 'MiniMax 中国版',
    category: 'openai_compatible',
    apiBase: 'https://api.minimax.chat/v1',
    description: 'MiniMax 国内版 (海螺AI)',
    icon: '🎵',
    color: '#e91e63',
    models: [
      { id: 'abab6.5s-chat', name: 'abab 6.5s', maxTokens: 245000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Moonshot AI (月之暗面/Kimi) ---
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    nameEn: 'Moonshot AI (Kimi)',
    category: 'openai_compatible',
    apiBase: 'https://api.moonshot.cn/v1',
    description: '月之暗面 Kimi 大模型',
    icon: '🌙',
    color: '#1a1a2e',
    models: [
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K', maxTokens: 128000, inputPrice: 1.2, outputPrice: 3, capabilities: ['chat'] },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32K', maxTokens: 32000, inputPrice: 0.6, outputPrice: 1.5, capabilities: ['chat'] },
      { id: 'kimi-latest', name: 'Kimi Latest', maxTokens: 128000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: 'moonshot-cn',
    name: 'Moonshot CN',
    nameEn: 'Moonshot CN',
    category: 'openai_compatible',
    apiBase: 'https://api.moonshot.cn/v1',
    description: '月之暗面国内版',
    icon: '🌙',
    color: '#1a1a2e',
    models: [
      { id: 'moonshot-v1-128k', name: 'Kimi 128K (CN)', maxTokens: 128000, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- GitHub Copilot ---
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    nameEn: 'GitHub Copilot',
    category: 'openai_compatible',
    apiBase: 'https://api.githubcopilot.com',
    description: 'GitHub AI 编程助手',
    icon: '🐙',
    color: '#1a1a2e',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Copilot)', maxTokens: 128000, capabilities: ['chat', 'code'] },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 (Copilot)', maxTokens: 200000, capabilities: ['chat', 'code'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'Copilot Token', type: 'password', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- AWS Bedrock ---
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    nameEn: 'Amazon Bedrock',
    category: 'openai_compatible',
    apiBase: 'https://bedrock-runtime.{region}.amazonaws.com',
    description: 'Amazon 托管基础模型服务',
    icon: '🔶',
    color: '#ff9900',
    models: [
      { id: 'anthropic.claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200000, capabilities: ['chat'] },
      { id: 'anthropic.claude-3-haiku', name: 'Claude 3 Haiku', maxTokens: 200000, capabilities: ['chat'] },
      { id: 'meta.llama3-70b', name: 'Llama 3 70B', maxTokens: 8192, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiKey', label: 'AWS Access Key', type: 'password', required: true },
      { key: 'apiBase', label: 'Region Endpoint', type: 'text', placeholder: 'us-east-1', required: true },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- Ollama (本地部署) ---
  {
    id: 'ollama',
    name: 'Ollama',
    nameEn: 'Ollama (Local)',
    category: 'openai_compatible',
    apiBase: 'http://localhost:11434/v1',
    description: '本地 LLM 部署工具',
    icon: '🦙',
    color: '#6b7280',
    models: [
      { id: 'llama3', name: 'Llama 3', maxTokens: 8192, capabilities: ['chat'] },
      { id: 'qwen2', name: 'Qwen 2', maxTokens: 32768, capabilities: ['chat'] },
      { id: 'codellama', name: 'Code Llama', maxTokens: 16384, capabilities: ['code'] },
      { id: 'mistral', name: 'Mistral', maxTokens: 32768, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiBase', label: 'Ollama 地址', type: 'text', placeholder: 'http://localhost:11434/v1', required: false },
    ],
    enabled: true,
    isBuiltIn: true,
  },

  // --- LM Studio (本地部署) ---
  {
    id: 'lm-studio',
    name: 'LM Studio',
    nameEn: 'LM Studio (Local)',
    category: 'openai_compatible',
    apiBase: 'http://localhost:1234/v1',
    description: '本地 LLM 桌面应用',
    icon: '💻',
    color: '#3b82f6',
    models: [
      { id: 'local-model', name: '本地模型', maxTokens: 4096, capabilities: ['chat'] },
    ],
    configFields: [
      { key: 'apiBase', label: 'LM Studio 地址', type: 'text', placeholder: 'http://localhost:1234/v1', required: false },
    ],
    enabled: true,
    isBuiltIn: true,
  },
];

// 获取所有内置提供商
export function getAllProviders(): AIModelProvider[] {
  return BUILT_IN_PROVIDERS;
}

// 根据 ID 获取提供商
export function getProviderById(id: string): AIModelProvider | undefined {
  return BUILT_IN_PROVIDERS.find(p => p.id === id);
}

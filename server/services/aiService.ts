import { AIModelProvider, UserProviderConfig } from './aiProviders.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIRequestOptions {
  provider: AIModelProvider;
  config: UserProviderConfig;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// 统一 AI 调用服务
export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  const { provider, config, model, messages, temperature = 0.7, maxTokens } = options;
  const apiBase = config.apiBase || provider.apiBase;

  switch (provider.category) {
    case 'openai_compatible':
      return callOpenAICompatible(apiBase, config.apiKey, model, messages, temperature, maxTokens);
    case 'anthropic':
      return callAnthropic(apiBase, config.apiKey, model, messages, temperature, maxTokens);
    case 'google':
      return callGoogle(apiBase, config.apiKey, model, messages, temperature, maxTokens);
    default:
      return callOpenAICompatible(apiBase, config.apiKey, model, messages, temperature, maxTokens);
  }
}

// OpenAI 兼容格式（覆盖大部分提供商）
async function callOpenAICompatible(
  apiBase: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens?: number,
): Promise<AIResponse> {
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    model: data.model || model,
    provider: 'openai_compatible',
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined,
  };
}

// Anthropic Claude 格式
async function callAnthropic(
  apiBase: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens?: number,
): Promise<AIResponse> {
  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role,
    content: m.content,
  }));

  const response = await fetch(`${apiBase}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens || 4096,
      temperature,
      ...(systemMsg ? { system: systemMsg.content } : {}),
      messages: chatMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API Error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return {
    content: data.content?.[0]?.text || '',
    model: data.model || model,
    provider: 'anthropic',
    usage: data.usage ? {
      promptTokens: data.usage.input_tokens,
      completionTokens: data.usage.output_tokens,
      totalTokens: data.usage.input_tokens + data.usage.output_tokens,
    } : undefined,
  };
}

// Google Gemini 格式
async function callGoogle(
  apiBase: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens?: number,
): Promise<AIResponse> {
  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  const contents = chatMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `${apiBase}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(systemMsg ? { systemInstruction: { parts: [{ text: systemMsg.content }] } } : {}),
        generationConfig: {
          temperature,
          ...(maxTokens ? { maxOutputTokens: maxTokens } : {}),
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google API Error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    model: data.modelVersion || model,
    provider: 'google',
    usage: data.usageMetadata ? {
      promptTokens: data.usageMetadata.promptTokenCount,
      completionTokens: data.usageMetadata.candidatesTokenCount,
      totalTokens: data.usageMetadata.totalTokenCount,
    } : undefined,
  };
}

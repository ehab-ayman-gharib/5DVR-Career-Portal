import OpenAI from 'openai';

const hasCustomBaseUrl = !!process.env.LLM_BASE_URL;

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-dev-key',
  baseURL: process.env.LLM_BASE_URL || undefined,
});

export const getTargetModel = (): string => {
  if (process.env.LLM_MODEL_ID) {
    return process.env.LLM_MODEL_ID;
  }
  if (hasCustomBaseUrl) {
    return 'Qwen/Qwen3.6-27B-FP8';
  }
  return 'gpt-4o-mini';
};

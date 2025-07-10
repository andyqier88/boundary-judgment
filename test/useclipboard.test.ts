import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import useClipboard from '../lib/clipboard/useclipboard';
import * as clipboardUtils from '../lib/clipboard/clipboardWriteText';

// 创建模拟函数
vi.mock('../../src/utils/clipboard', () => ({
  clipboardWriteText: vi.fn(),
  clipboardReadText: vi.fn(),
  ClipboardError: class ClipboardError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ClipboardError';
    }
  }
}));

describe('useClipboard 钩子测试', () => {
  // 测试前的准备工作
  beforeEach(() => {
    // 重置所有模拟函数
    vi.resetAllMocks();
  });
  
  // 测试后的清理工作
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  // 测试 useClipboard 初始状态
  test('useClipboard 应该有正确的初始状态', () => {
    const { text, success, error } = useClipboard();
    
    expect(text.value).toBe('');
    expect(success.value).toBe(false);
    expect(error.value).toBeNull();
  });
  
  // 测试 copyText 成功情况
  test('copyText 成功时应该更新状态并返回 true', async () => {
    // 设置模拟函数返回值
    (clipboardUtils.clipboardWriteText as any).mockResolvedValueOnce(undefined);
    
    const { copyText, text, success, error } = useClipboard();
    
    // 调用被测试函数
    const result = await copyText('测试文本');
    
    // 验证状态和返回值
    expect(clipboardUtils.clipboardWriteText).toHaveBeenCalledWith('测试文本');
    expect(result).toBe(true);
    expect(text.value).toBe('测试文本');
    expect(success.value).toBe(true);
    expect(error.value).toBeNull();
  });
  
  // 测试 copyText 失败情况
  test('copyText 失败时应该更新状态并返回 false', async () => {
    // 设置模拟函数抛出错误
    (clipboardUtils.clipboardWriteText as any).mockRejectedValueOnce(
      new clipboardUtils.ClipboardError('模拟复制失败')
    );
    
    const { copyText, text, success, error } = useClipboard();
    
    // 调用被测试函数
    const result = await copyText('测试文本');
    
    // 验证状态和返回值
    expect(clipboardUtils.clipboardWriteText).toHaveBeenCalledWith('测试文本');
    expect(result).toBe(false);
    expect(text.value).toBe(''); // 文本不应该更新
    expect(success.value).toBe(false);
    expect(error.value).toBe('模拟复制失败');
  });
  
  // 测试 copyText 空参数情况
  test('copyText 参数为空时应该返回 false 并设置错误信息', async () => {
    const { copyText, success, error } = useClipboard();
    
    // 调用被测试函数
    const result = await copyText('');
    
    // 验证状态和返回值
    expect(clipboardUtils.clipboardWriteText).not.toHaveBeenCalled();
    expect(result).toBe(false);
    expect(success.value).toBe(false);
    expect(error.value).toBe('复制内容不能为空');
  });
  
  // 测试 readText 成功情况
  test('readText 成功时应该更新状态并返回剪贴板内容', async () => {
    // 设置模拟函数返回值
    (clipboardUtils.clipboardReadText as any).mockResolvedValueOnce('从剪贴板读取的文本');
    
    const { readText, text, success, error } = useClipboard();
    
    // 调用被测试函数
    const result = await readText();
    
    // 验证状态和返回值
    expect(clipboardUtils.clipboardReadText).toHaveBeenCalledTimes(1);
    expect(result).toBe('从剪贴板读取的文本');
    expect(text.value).toBe('从剪贴板读取的文本');
    expect(success.value).toBe(true);
    expect(error.value).toBeNull();
  });
  
  // 测试 readText 失败情况
  test('readText 失败时应该更新状态并抛出错误', async () => {
    // 设置模拟函数抛出错误
    const mockError = new clipboardUtils.ClipboardError('模拟读取失败');
    (clipboardUtils.clipboardReadText as any).mockRejectedValueOnce(mockError);
    
    const { readText, text, success, error } = useClipboard();
    
    // 调用被测试函数并验证抛出错误
    await expect(readText()).rejects.toThrow(mockError);
    
    // 验证状态
    expect(clipboardUtils.clipboardReadText).toHaveBeenCalledTimes(1);
    expect(text.value).toBe(''); // 文本不应该更新
    expect(success.value).toBe(false);
    expect(error.value).toBe('模拟读取失败');
  });
});
import { Ref, ref } from 'vue';
import { clipboardWriteText, clipboardReadText, ClipboardError } from './clipboard';

/**
 * useClipboard钩子返回类型
 */
export type UseClipboardResult = {
  /** 复制文本到剪贴板 */
  copyText: (text: string) => Promise<boolean>;
  /** 从剪贴板读取文本 */
  readText: () => Promise<string>;
  /** 最近一次复制的文本 */
  text: Ref<string>;
  /** 操作状态：成功或失败 */
  success: Ref<boolean>;
  /** 错误信息 */
  error: Ref<string | null>;
};

/**
 * 剪贴板操作钩子
 * 
 * 提供复制文本到剪贴板和从剪贴板读取文本的功能
 * 使用现代的 Clipboard API，并在不支持时提供回退方案
 * 
 * @returns 剪贴板操作方法和状态
 */
const useClipboard = (): UseClipboardResult => {
  const text = ref('');
  const success = ref(false);
  const error = ref<string | null>(null);

  /**
   * 复制文本到剪贴板
   * 
   * @param copy - 要复制的文本
   * @returns Promise<boolean> - 操作是否成功
   */
  const copyText = async (copy?: string): Promise<boolean> => {
    if (!copy) {
      error.value = '复制内容不能为空';
      success.value = false;
      return false;
    }

    try {
      await clipboardWriteText(copy);
      text.value = copy;
      success.value = true;
      error.value = null;
      return true;
    } catch (err) {
      success.value = false;
      error.value = err instanceof ClipboardError ? err.message : '复制失败';
      console.error('复制失败:', err);
      return false;
    }
  };

  /**
   * 从剪贴板读取文本
   * 
   * @returns Promise<string> - 剪贴板中的文本
   */
  const readText = async (): Promise<string> => {
    try {
      const clipboardText = await clipboardReadText();
      text.value = clipboardText;
      success.value = true;
      error.value = null;
      return clipboardText;
    } catch (err) {
      success.value = false;
      error.value = err instanceof ClipboardError ? err.message : '读取剪贴板失败';
      console.error('读取剪贴板失败:', err);
      throw err;
    }
  };

  return { copyText, readText, text, success, error };
};

export default useClipboard;

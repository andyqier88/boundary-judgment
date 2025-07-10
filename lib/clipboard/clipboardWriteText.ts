/**
 * 剪贴板操作错误类型
 */
export class ClipboardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClipboardError';
  }
}

/**
 * 将文本写入剪贴板
 * 
 * 该函数优先使用现代的 navigator.clipboard API，
 * 如果不可用则回退到传统的 document.execCommand 方法
 * 
 * @param copyText - 要复制到剪贴板的文本
 * @returns 返回一个 Promise，成功时 resolve，失败时 reject 并返回 ClipboardError
 */
export const clipboardWriteText = (copyText: string): Promise<void> => {
  // 参数验证
  if (copyText === undefined || copyText === null) {
    return Promise.reject(new ClipboardError('复制内容不能为空'));
  }

  // 判断是否存在clipboard并且是安全的协议
  if (navigator.clipboard && window.isSecureContext) {
    return new Promise<void>((resolve, reject) => {
      navigator.clipboard
        .writeText(copyText)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error('使用 navigator.clipboard API 复制失败:', error);
          reject(new ClipboardError('复制失败: ' + (error?.message || '未知错误')));
        });
    });
  }

  // 回退方案：使用 execCommand (已废弃但兼容性更好)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = copyText;
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    return new Promise<void>((resolve, reject) => {
      // 执行复制命令并移除文本框
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        resolve();
      } else {
        reject(new ClipboardError('复制失败: execCommand 方法执行失败'));
      }
    });
  } catch (error) {
    console.error('使用 execCommand 复制失败:', error);
    return Promise.reject(new ClipboardError('复制失败: ' + (error instanceof Error ? error.message : '未知错误')));
  }
};

/**
 * 尝试从剪贴板读取文本
 * 
 * 注意：由于安全限制，此功能仅在安全上下文(HTTPS)中可用
 * 且可能需要用户授权
 * 
 * @returns 返回一个 Promise，成功时 resolve 并返回剪贴板文本，失败时 reject 并返回 ClipboardError
 */
export const clipboardReadText = async (): Promise<string> => {
  try {
    // 只能在安全上下文中使用 navigator.clipboard.readText()
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    } else {
      throw new ClipboardError('读取剪贴板内容需要安全上下文(HTTPS)环境');
    }
  } catch (error) {
    console.error('读取剪贴板内容失败:', error);
    throw new ClipboardError('读取剪贴板内容失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
};

// 默认导出写入函数以保持向后兼容性
export default clipboardWriteText;

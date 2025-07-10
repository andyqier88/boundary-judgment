# 剪贴板功能使用文档

本文档详细介绍了 ChatBI-UI 项目中剪贴板功能的使用方法，包括直接使用工具函数和使用 Vue Composition API 钩子两种方式。

## 目录

- [工具函数使用方法](#工具函数使用方法)
  - [复制文本到剪贴板](#复制文本到剪贴板)
  - [从剪贴板读取文本](#从剪贴板读取文本)
  - [错误处理](#错误处理)
- [Vue Composition API 钩子使用方法](#vue-composition-api-钩子使用方法)
  - [基本用法](#基本用法)
  - [复制文本](#复制文本)
  - [读取剪贴板内容](#读取剪贴板内容)
  - [处理操作状态和错误](#处理操作状态和错误)
- [兼容性说明](#兼容性说明)
- [安全性说明](#安全性说明)
- [最佳实践](#最佳实践)

## 工具函数使用方法

### 复制文本到剪贴板

```typescript
import { clipboardWriteText } from '@/utils/clipboard';

// 基本用法
clipboardWriteText('要复制的文本')
  .then(() => {
    console.log('复制成功');
    // 可以在这里显示成功提示
  })
  .catch((error) => {
    console.error('复制失败:', error.message);
    // 可以在这里显示错误提示
  });

// 使用 async/await
async function copyToClipboard() {
  try {
    await clipboardWriteText('要复制的文本');
    console.log('复制成功');
  } catch (error) {
    console.error('复制失败:', error.message);
  }
}
```

### 从剪贴板读取文本

```typescript
import { clipboardReadText } from '@/utils/clipboard';

// 基本用法
clipboardReadText()
  .then((text) => {
    console.log('从剪贴板读取的文本:', text);
    // 可以在这里处理读取到的文本
  })
  .catch((error) => {
    console.error('读取失败:', error.message);
    // 可以在这里显示错误提示
  });

// 使用 async/await
async function readFromClipboard() {
  try {
    const text = await clipboardReadText();
    console.log('从剪贴板读取的文本:', text);
    return text;
  } catch (error) {
    console.error('读取失败:', error.message);
    throw error;
  }
}
```

### 错误处理

```typescript
import { clipboardWriteText, ClipboardError } from '@/utils/clipboard';

try {
  await clipboardWriteText('要复制的文本');
  // 成功处理
} catch (error) {
  if (error instanceof ClipboardError) {
    // 处理剪贴板特定错误
    console.error('剪贴板操作错误:', error.message);
  } else {
    // 处理其他错误
    console.error('未知错误:', error);
  }
}
```

## Vue Composition API 钩子使用方法

### 基本用法

```typescript
import { defineComponent } from 'vue';
import useClipboard from '@/hooks/useClipboard';

export default defineComponent({
  setup() {
    // 初始化剪贴板钩子
    const { copyText, readText, text, success, error } = useClipboard();
    
    return {
      copyText,
      readText,
      clipboardText: text,
      isSuccess: success,
      errorMessage: error
    };
  }
});
```

### 复制文本

```typescript
<template>
  <div>
    <input v-model="inputText" placeholder="输入要复制的文本" />
    <button @click="handleCopy">复制</button>
    <p v-if="isSuccess">复制成功!</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useClipboard from '@/hooks/useClipboard';

export default defineComponent({
  setup() {
    const { copyText, success, error } = useClipboard();
    const inputText = ref('');
    
    const handleCopy = async () => {
      await copyText(inputText.value);
      // 不需要手动处理成功/失败状态，钩子内部已经更新了 success 和 error
    };
    
    return {
      inputText,
      handleCopy,
      isSuccess: success,
      errorMessage: error
    };
  }
});
</script>
```

### 读取剪贴板内容

```typescript
<template>
  <div>
    <button @click="handlePaste">从剪贴板粘贴</button>
    <p>剪贴板内容: {{ clipboardText }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useClipboard from '@/hooks/useClipboard';

export default defineComponent({
  setup() {
    const { readText, text, error } = useClipboard();
    
    const handlePaste = async () => {
      try {
        await readText();
        // text.value 已经被更新为剪贴板内容
      } catch (err) {
        // error.value 已经被更新为错误信息
        console.error('粘贴失败');
      }
    };
    
    return {
      handlePaste,
      clipboardText: text,
      errorMessage: error
    };
  }
});
</script>
```

### 处理操作状态和错误

```typescript
<template>
  <div>
    <input v-model="inputText" placeholder="输入要复制的文本" />
    <button @click="handleCopy" :disabled="isLoading">{{ isLoading ? '复制中...' : '复制' }}</button>
    
    <div v-if="isSuccess" class="success-message">
      复制成功!
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useClipboard from '@/hooks/useClipboard';

export default defineComponent({
  setup() {
    const { copyText, success, error } = useClipboard();
    const inputText = ref('');
    const isLoading = ref(false);
    
    const handleCopy = async () => {
      if (!inputText.value) {
        return;
      }
      
      isLoading.value = true;
      try {
        await copyText(inputText.value);
        // 可以在这里添加额外的成功处理逻辑
      } catch (err) {
        // 可以在这里添加额外的错误处理逻辑
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      inputText,
      handleCopy,
      isLoading,
      isSuccess: success,
      errorMessage: error
    };
  }
});
</script>
```

## 兼容性说明

剪贴板功能使用了两种实现方式，以确保最大的兼容性：

1. **现代浏览器 (推荐)**: 使用 `navigator.clipboard` API，这是现代浏览器推荐的方式。
   - 需要在安全上下文中运行 (HTTPS 或 localhost)
   - 支持大多数现代浏览器

2. **兼容模式**: 当 `navigator.clipboard` 不可用时，会回退到使用 `document.execCommand('copy')` 方法。
   - 这是一个已废弃但仍被广泛支持的 API
   - 可以在非安全上下文中工作
   - 只支持写入操作，不支持读取操作

**注意**: 从剪贴板读取文本 (`clipboardReadText` 和 `readText`) 只能在支持 `navigator.clipboard` API 的环境中工作，且可能需要用户授权。

## 安全性说明

1. **权限**: 现代浏览器中，剪贴板操作可能需要用户授权，特别是读取操作。

2. **安全上下文**: `navigator.clipboard` API 只能在安全上下文 (HTTPS 或 localhost) 中使用。

3. **用户交互**: 最佳实践是在用户交互事件（如点击）的处理程序中调用剪贴板操作，这样更容易获得权限。

## 最佳实践

1. **优先使用钩子**: 在 Vue 组件中，优先使用 `useClipboard` 钩子，它提供了更好的状态管理和错误处理。

2. **错误处理**: 始终处理剪贴板操作可能出现的错误，并向用户提供适当的反馈。

3. **用户体验**: 
   - 在复制操作后提供视觉反馈
   - 在操作过程中禁用相关按钮
   - 显示清晰的错误消息

4. **安全考虑**: 不要自动复制敏感信息，总是让用户明确触发复制操作。

5. **测试**: 在不同的浏览器和环境中测试剪贴板功能，确保兼容性。
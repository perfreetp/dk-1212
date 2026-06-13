<template>
  <view class="chat-container">
    <view v-if="personality" class="chat-content">
      <view class="chat-header">
        <view class="back-btn" @tap="goBack">
          <text>←</text>
        </view>
        <view class="header-info">
          <image :src="personality.avatar" class="avatar-md" mode="aspectFill" />
          <view class="header-detail">
            <text class="personality-name">{{ personality.name }}</text>
            <text class="online-status">在线</text>
          </view>
        </view>
        <view class="more-btn">
          <text>⋯</text>
        </view>
      </view>

      <view v-if="isTrial" class="trial-banner">
        <text>🎭 体验模式 - 体验结束后需购买方可继续使用</text>
      </view>

      <scroll-view 
        class="message-list" 
        scroll-y 
        :scroll-into-view="scrollToId"
        scroll-with-animation
      >
        <view class="welcome-message">
          <view class="welcome-bubble">
            <text class="welcome-text">{{ personality.greeting }}</text>
          </view>
        </view>

        <view 
          v-for="(message, index) in messages" 
          :key="message.id"
          :id="'msg-' + message.id"
          :class="['message-item', message.type]"
        >
          <image v-if="message.type === 'user'" :src="userAvatar" class="avatar-sm" mode="aspectFill" />
          <image v-else :src="personality.avatar" class="avatar-sm" mode="aspectFill" />
          <view :class="['message-bubble', message.type]">
            <text class="message-text">{{ message.content }}</text>
            <text class="message-time">{{ message.time }}</text>
          </view>
        </view>

        <view v-if="isTyping" class="typing-indicator">
          <view class="typing-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </scroll-view>

      <view class="input-section safe-area-bottom">
        <view class="input-wrap">
          <input 
            v-model="inputText" 
            class="message-input" 
            placeholder="输入消息..."
            confirm-type="send"
            @confirm="sendMessage"
          />
        </view>
        <view class="send-btn" :class="{ active: inputText.trim() }" @tap="sendMessage">
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { usePersonalityStore } from '@/stores/personality'
import type { Personality } from '@/types'

const personalityStore = usePersonalityStore()

const personality = ref<Personality | null>(null)
const messages = ref<Array<{ id: string; type: 'user' | 'ai'; content: string; time: string }>>([])
const inputText = ref('')
const isTyping = ref(false)
const scrollToId = ref('')
const userAvatar = 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=friendly%20user%20avatar%20neutral&image_size=square'
const isTrial = ref(false)

onLoad((options) => {
  const id = options?.id
  if (id) {
    personality.value = personalityStore.getPersonalityById(id) || null
  }
  isTrial.value = options?.trial === '1'
})

function goBack() {
  uni.navigateBack()
}

function sendMessage() {
  if (!inputText.value.trim() || !personality.value) return

  const userMessage = {
    id: Date.now().toString(),
    type: 'user' as const,
    content: inputText.value,
    time: getCurrentTime()
  }
  messages.value.push(userMessage)
  inputText.value = ''
  
  scrollToBottom()
  
  isTyping.value = true
  scrollToBottom()

  setTimeout(() => {
    isTyping.value = false
    
    const aiResponses = [
      '这是一个很好的问题！让我来为您解答。',
      '我理解您的需求，这是我的建议：',
      '非常有趣！让我从几个方面来分析一下。',
      '好的，我来帮您处理这个问题。',
      '感谢您的提问，以下是我的看法：',
      '根据您的描述，我认为可以这样处理：'
    ]
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai' as const,
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)] + '\n\n' + 
              '基于我的分析，' + personality.value?.name + '可以为您提供专业的帮助。',
      time: getCurrentTime()
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  }, 1500 + Math.random() * 1000)
}

function scrollToBottom() {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollToId.value = 'msg-' + messages.value[messages.value.length - 1].id
    }
  })
}

function getCurrentTime(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style lang="scss" scoped>
.chat-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.trial-banner {
  background: linear-gradient(135deg, rgba($warning-color, 0.1), rgba($warning-color, 0.2));
  padding: $spacing-sm $spacing-md;
  text-align: center;
  
  text {
    font-size: $font-size-xs;
    color: $warning-color;
  }
}

.chat-header {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background-color: $bg-primary;
  box-shadow: $shadow-sm;
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $bg-secondary;
    border-radius: 50%;
    
    text {
      font-size: $font-size-xl;
      color: $text-primary;
    }
  }
  
  .header-info {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: $spacing-md;
    
    .avatar-md {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    
    .header-detail {
      margin-left: $spacing-sm;
      
      .personality-name {
        font-size: $font-size-md;
        font-weight: 600;
        color: $text-primary;
        display: block;
      }
      
      .online-status {
        font-size: $font-size-xs;
        color: $success-color;
      }
    }
  }
  
  .more-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    text {
      font-size: $font-size-xl;
      color: $text-secondary;
    }
  }
}

.message-list {
  flex: 1;
  padding: $spacing-md;
  padding-bottom: 140rpx;
}

.welcome-message {
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-lg;
  
  .welcome-bubble {
    background: linear-gradient(135deg, $primary-color, $primary-light);
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    max-width: 80%;
    
    .welcome-text {
      font-size: $font-size-sm;
      color: #fff;
      line-height: 1.5;
    }
  }
}

.message-item {
  display: flex;
  margin-bottom: $spacing-md;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-bubble {
      background-color: $primary-color;
      
      .message-text {
        color: #fff;
      }
      
      .message-time {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  &.ai {
    .message-bubble {
      background-color: $bg-primary;
      
      .message-text {
        color: $text-primary;
      }
    }
  }
  
  .avatar-sm {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .message-bubble {
    max-width: 70%;
    border-radius: $border-radius-lg;
    padding: $spacing-sm $spacing-md;
    margin: 0 $spacing-sm;
    box-shadow: $shadow-sm;
    
    .message-text {
      font-size: $font-size-sm;
      line-height: 1.5;
      display: block;
    }
    
    .message-time {
      font-size: $font-size-xs;
      color: $text-muted;
      text-align: right;
      margin-top: 4rpx;
      display: block;
    }
  }
}

.typing-indicator {
  display: flex;
  
  .typing-dots {
    display: flex;
    align-items: center;
    background-color: $bg-primary;
    border-radius: $border-radius-lg;
    padding: $spacing-sm $spacing-md;
    
    .dot {
      width: 12rpx;
      height: 12rpx;
      background-color: $text-muted;
      border-radius: 50%;
      margin: 0 4rpx;
      
      &:nth-child(1) { animation: typing 1.4s infinite 0s; }
      &:nth-child(2) { animation: typing 1.4s infinite 0.2s; }
      &:nth-child(3) { animation: typing 1.4s infinite 0.4s; }
    }
  }
}

@keyframes typing {
  0%, 60%, 100% { transform: scale(0.6); opacity: 0.5; }
  30% { transform: scale(1); opacity: 1; }
}

.input-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg-primary;
  padding: $spacing-sm $spacing-md;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .input-wrap {
    flex: 1;
    
    .message-input {
      width: 100%;
      padding: $spacing-sm $spacing-md;
      background-color: $bg-secondary;
      border-radius: 40rpx;
      font-size: $font-size-base;
      border: none;
      outline: none;
    }
  }
  
  .send-btn {
    padding: $spacing-sm $spacing-lg;
    background-color: $bg-tertiary;
    border-radius: 40rpx;
    
    text {
      font-size: $font-size-sm;
      color: $text-muted;
    }
    
    &.active {
      background-color: $primary-color;
      
      text {
        color: #fff;
      }
    }
  }
}
</style>
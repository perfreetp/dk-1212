<template>
  <view class="create-container">
    <view class="form-section">
      <view class="section-header">
        <text class="section-title">基本信息</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">头像</text>
        <view class="avatar-upload">
          <image 
            v-if="form.avatar" 
            :src="form.avatar" 
            class="avatar-lg" 
            mode="aspectFill" 
          />
          <view v-else class="avatar-placeholder" @tap="uploadAvatar">
            <text class="upload-icon">📷</text>
            <text class="upload-text">上传头像</text>
          </view>
          <text v-if="form.avatar" class="change-text" @tap="uploadAvatar">更换</text>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">人格名称</text>
        <input 
          v-model="form.name" 
          class="form-input" 
          placeholder="请输入人格名称"
        />
      </view>

      <view class="form-item">
        <text class="form-label">人设说明</text>
        <textarea 
          v-model="form.description" 
          class="form-textarea" 
          placeholder="请描述这个人格的特点、性格、能力等"
          :maxlength="500"
        />
        <text class="char-count">{{ form.description.length }}/500</text>
      </view>

      <view class="form-item">
        <text class="form-label">开场白</text>
        <textarea 
          v-model="form.greeting" 
          class="form-textarea" 
          placeholder="人格首次见面时的开场白"
          :maxlength="200"
        />
        <text class="char-count">{{ form.greeting.length }}/200</text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">分类设置</text>
      </view>

      <view class="form-item">
        <text class="form-label">用途</text>
        <view class="option-list">
          <view 
            v-for="option in purposeOptions.slice(1)" 
            :key="option"
            :class="['option-item', { active: form.purpose === option }]"
            @tap="form.purpose = option"
          >
            {{ option }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">语气</text>
        <view class="option-list">
          <view 
            v-for="option in toneOptions.slice(1)" 
            :key="option"
            :class="['option-item', { active: form.tone === option }]"
            @tap="form.tone = option"
          >
            {{ option }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">领域</text>
        <view class="option-list">
          <view 
            v-for="option in domainOptions.slice(1)" 
            :key="option"
            :class="['option-item', { active: form.domain === option }]"
            @tap="form.domain = option"
          >
            {{ option }}
          </view>
        </view>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">禁用话题</text>
        <text class="add-btn" @tap="addDisabledTopic">+ 添加</text>
      </view>

      <view v-if="form.disabledTopics.length > 0" class="topic-list">
        <view 
          v-for="(topic, index) in form.disabledTopics" 
          :key="index"
          class="topic-item"
        >
          <text class="topic-text">{{ topic }}</text>
          <text class="remove-btn" @tap="removeDisabledTopic(index)">×</text>
        </view>
      </view>
      <view v-else class="empty-topics">
        <text class="empty-text">暂无禁用话题</text>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">可见范围</text>
      </view>

      <view class="visibility-options">
        <view 
          v-for="option in visibilityOptions" 
          :key="option.value"
          :class="['visibility-item', { active: form.visibility === option.value }]"
          @tap="form.visibility = option.value"
        >
          <text class="visibility-icon">{{ option.icon }}</text>
          <text class="visibility-label">{{ option.label }}</text>
        </view>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">定价设置</text>
      </view>

      <view class="form-item">
        <text class="form-label">价格</text>
        <view class="price-input-wrap">
          <text class="price-symbol">¥</text>
          <input 
            v-model="form.price" 
            type="digit"
            class="price-input" 
            placeholder="0.00"
          />
          <view class="unit-select">
            <view 
              v-for="unit in unitOptions" 
              :key="unit.value"
              :class="['unit-item', { active: form.unit === unit.value }]"
              @tap="form.unit = unit.value"
            >
              {{ unit.label }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="form-section">
      <view class="section-header">
        <text class="section-title">示例对话（可选）</text>
      </view>

      <view v-for="(dialog, index) in form.sampleDialogs" :key="index" class="dialog-form">
        <view class="dialog-header">
          <text class="dialog-title">对话 {{ index + 1 }}</text>
          <text v-if="form.sampleDialogs.length > 1" class="remove-btn" @tap="removeDialog(index)">删除</text>
        </view>
        <view class="dialog-item">
          <text class="dialog-label">用户提问</text>
          <input 
            v-model="dialog.userMessage" 
            class="dialog-input" 
            placeholder="用户可能会问什么"
          />
        </view>
        <view class="dialog-item">
          <text class="dialog-label">AI回复</text>
          <textarea 
            v-model="dialog.aiMessage" 
            class="dialog-textarea" 
            placeholder="人格会如何回答"
          />
        </view>
      </view>

      <view class="add-dialog-btn" @tap="addDialog">
        <text class="add-icon">+</text>
        <text class="add-text">添加示例对话</text>
      </view>
    </view>

    <view class="submit-section">
      <view class="btn btn-secondary" @tap="saveDraft">保存草稿</view>
      <view class="btn btn-primary" @tap="submitPersonality">发布人格</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { usePersonalityStore } from '@/stores/personality'
import { useUserStore } from '@/stores/user'
import { purposeOptions, toneOptions, domainOptions } from '@/data/mockData'

const personalityStore = usePersonalityStore()
const userStore = useUserStore()

const form = reactive({
  avatar: '',
  name: '',
  description: '',
  greeting: '',
  purpose: '',
  tone: '',
  domain: '',
  disabledTopics: [] as string[],
  visibility: 'public' as 'public' | 'private' | 'limited',
  price: '',
  unit: 'hour' as 'hour' | 'day' | 'month' | 'year',
  sampleDialogs: [
    { userMessage: '', aiMessage: '' }
  ]
})

const visibilityOptions = [
  { value: 'public', label: '公开', icon: '🌐' },
  { value: 'private', label: '私有', icon: '🔒' },
  { value: 'limited', label: '受限', icon: '🚪' }
]

const unitOptions = [
  { value: 'hour', label: '小时' },
  { value: 'day', label: '天' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' }
]

function uploadAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.avatar = res.tempFilePaths[0]
    }
  })
}

function addDisabledTopic() {
  uni.showModal({
    title: '添加禁用话题',
    editable: true,
    placeholderText: '请输入禁用的话题',
    success: (res) => {
      if (res.confirm && res.content) {
        form.disabledTopics.push(res.content)
      }
    }
  })
}

function removeDisabledTopic(index: number) {
  form.disabledTopics.splice(index, 1)
}

function addDialog() {
  form.sampleDialogs.push({ userMessage: '', aiMessage: '' })
}

function removeDialog(index: number) {
  form.sampleDialogs.splice(index, 1)
}

function validateForm(): boolean {
  if (!form.name.trim()) {
    uni.showToast({ title: '请输入人格名称', icon: 'none' })
    return false
  }
  if (!form.description.trim()) {
    uni.showToast({ title: '请输入人设说明', icon: 'none' })
    return false
  }
  if (!form.purpose) {
    uni.showToast({ title: '请选择用途', icon: 'none' })
    return false
  }
  if (!form.tone) {
    uni.showToast({ title: '请选择语气', icon: 'none' })
    return false
  }
  if (!form.domain) {
    uni.showToast({ title: '请选择领域', icon: 'none' })
    return false
  }
  if (!form.price || parseFloat(form.price) <= 0) {
    uni.showToast({ title: '请输入有效价格', icon: 'none' })
    return false
  }
  return true
}

function saveDraft() {
  uni.setStorageSync('personality_draft', JSON.stringify(form))
  uni.showToast({ title: '草稿已保存', icon: 'success' })
}

function submitPersonality() {
  if (!validateForm()) return

  const user = userStore.user
  
  personalityStore.createPersonality({
    name: form.name,
    avatar: form.avatar || 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=default%20avatar%20neutral&image_size=square',
    description: form.description,
    purpose: form.purpose,
    tone: form.tone,
    domain: form.domain,
    price: parseFloat(form.price),
    unit: form.unit,
    creatorId: user.id,
    creatorName: user.name,
    creatorAvatar: user.avatar,
    disabledTopics: form.disabledTopics,
    greeting: form.greeting || '您好！很高兴认识您！',
    visibility: form.visibility,
    status: 'online',
    sampleDialogs: form.sampleDialogs.filter(d => d.userMessage && d.aiMessage)
  })

  uni.showToast({ title: '发布成功', icon: 'success' })
  
  setTimeout(() => {
    uni.switchTab({ url: '/pages/plaza/index' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.create-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding: $spacing-md;
  padding-bottom: 160rpx;
}

.form-section {
  background-color: $bg-primary;
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1rpx solid $border-color;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
    }
    
    .add-btn {
      font-size: $font-size-sm;
      color: $primary-color;
    }
  }
}

.form-item {
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .form-label {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
    display: block;
  }
  
  .form-input {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-radius: $border-radius;
    font-size: $font-size-base;
    border: none;
    outline: none;
  }
  
  .form-textarea {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-radius: $border-radius;
    font-size: $font-size-base;
    border: none;
    outline: none;
    min-height: 120rpx;
  }
  
  .char-count {
    font-size: $font-size-xs;
    color: $text-muted;
    text-align: right;
    display: block;
    margin-top: 4rpx;
  }
}

.avatar-upload {
  display: flex;
  align-items: center;
  
  .avatar-lg {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
  }
  
  .avatar-placeholder {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: $bg-secondary;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .upload-icon {
      font-size: $font-size-2xl;
      margin-bottom: $spacing-xs;
    }
    
    .upload-text {
      font-size: $font-size-xs;
      color: $text-muted;
    }
  }
  
  .change-text {
    font-size: $font-size-sm;
    color: $primary-color;
    margin-left: $spacing-md;
  }
}

.option-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .option-item {
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-radius: 40rpx;
    font-size: $font-size-sm;
    color: $text-secondary;
    
    &.active {
      background-color: $primary-color;
      color: #fff;
    }
  }
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .topic-item {
    display: flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    background-color: rgba($error-color, 0.1);
    border-radius: 20rpx;
    
    .topic-text {
      font-size: $font-size-sm;
      color: $error-color;
    }
    
    .remove-btn {
      font-size: $font-size-lg;
      color: $error-color;
      margin-left: $spacing-xs;
    }
  }
}

.empty-topics {
  padding: $spacing-lg;
  text-align: center;
  
  .empty-text {
    font-size: $font-size-sm;
    color: $text-muted;
  }
}

.visibility-options {
  display: flex;
  gap: $spacing-md;
  
  .visibility-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-md;
    background-color: $bg-secondary;
    border-radius: $border-radius;
    
    &.active {
      background-color: $primary-color;
      
      .visibility-label {
        color: #fff;
      }
    }
    
    .visibility-icon {
      font-size: $font-size-2xl;
      margin-bottom: $spacing-xs;
    }
    
    .visibility-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

.price-input-wrap {
  display: flex;
  align-items: center;
  
  .price-symbol {
    font-size: $font-size-lg;
    color: $text-primary;
    margin-right: $spacing-xs;
  }
  
  .price-input {
    width: 150rpx;
    padding: $spacing-sm $spacing-md;
    background-color: $bg-secondary;
    border-radius: $border-radius;
    font-size: $font-size-lg;
    font-weight: 600;
    text-align: center;
    border: none;
    outline: none;
  }
  
  .unit-select {
    display: flex;
    margin-left: $spacing-md;
    
    .unit-item {
      padding: $spacing-xs $spacing-sm;
      background-color: $bg-secondary;
      border-radius: $border-radius;
      font-size: $font-size-xs;
      color: $text-secondary;
      margin-right: $spacing-xs;
      
      &.active {
        background-color: $primary-color;
        color: #fff;
      }
    }
  }
}

.dialog-form {
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1rpx solid $border-color;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    
    .dialog-title {
      font-size: $font-size-sm;
      font-weight: 500;
      color: $text-primary;
    }
    
    .remove-btn {
      font-size: $font-size-sm;
      color: $error-color;
    }
  }
  
  .dialog-item {
    margin-bottom: $spacing-sm;
    
    .dialog-label {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-bottom: 4rpx;
      display: block;
    }
    
    .dialog-input {
      width: 100%;
      padding: $spacing-xs $spacing-sm;
      background-color: $bg-secondary;
      border-radius: $border-radius;
      font-size: $font-size-sm;
      border: none;
      outline: none;
    }
    
    .dialog-textarea {
      width: 100%;
      padding: $spacing-xs $spacing-sm;
      background-color: $bg-secondary;
      border-radius: $border-radius;
      font-size: $font-size-sm;
      border: none;
      outline: none;
      min-height: 80rpx;
    }
  }
}

.add-dialog-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md;
  border: 2rpx dashed $border-color;
  border-radius: $border-radius;
  
  .add-icon {
    font-size: $font-size-lg;
    color: $text-muted;
    margin-right: $spacing-xs;
  }
  
  .add-text {
    font-size: $font-size-sm;
    color: $text-muted;
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg-primary;
  padding: $spacing-md;
  display: flex;
  gap: $spacing-md;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .btn {
    flex: 1;
    padding: $spacing-md;
  }
}
</style>
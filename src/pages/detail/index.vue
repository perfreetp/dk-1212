<template>
  <view class="detail-container">
    <view v-if="personality" class="detail-content">
      <view class="header-section">
        <image :src="personality.avatar" class="avatar-xl" mode="aspectFill" />
        <view class="header-info">
          <view class="personality-name">{{ personality.name }}</view>
          <view class="header-tags">
            <text class="tag tag-primary">{{ personality.purpose }}</text>
            <text class="tag tag-info">{{ personality.tone }}</text>
            <text class="tag tag-warning">{{ personality.domain }}</text>
          </view>
          <view class="header-stats">
            <text class="stat-item">⭐ {{ personality.rating }}</text>
            <text class="stat-item">💬 {{ personality.reviews.length }}条评价</text>
            <text class="stat-item">❤️ {{ personality.favorites }}</text>
            <text class="stat-item">📦 {{ personality.sales }}次购买</text>
          </view>
        </view>
        <view class="status-badge" :class="personality.status">
          {{ getStatusText(personality.status) }}
        </view>
      </view>

      <view class="creator-section card">
        <view class="creator-info">
          <image :src="personality.creatorAvatar" class="avatar-md" mode="aspectFill" />
          <view class="creator-detail">
            <text class="creator-name">{{ personality.creatorName }}</text>
            <text class="creator-label">创作者</text>
          </view>
        </view>
        <view class="create-time">
          <text>创建于 {{ personality.createdAt }}</text>
          <text>更新于 {{ personality.updatedAt }}</text>
        </view>
      </view>

      <view class="description-section card">
        <view class="section-title">
          <text class="title-icon">📋</text>
          <text class="title-text">人格介绍</text>
        </view>
        <text class="description-text">{{ personality.description }}</text>
      </view>

      <view class="sample-dialog-section card">
        <view class="section-title">
          <text class="title-icon">💬</text>
          <text class="title-text">示例对话</text>
        </view>
        <view class="dialog-list">
          <view v-for="dialog in personality.sampleDialogs" :key="dialog.id" class="dialog-item">
            <view class="user-message">
              <text class="message-label">用户</text>
              <text class="message-content">{{ dialog.userMessage }}</text>
            </view>
            <view class="ai-message">
              <text class="message-label">{{ personality.name }}</text>
              <text class="message-content">{{ dialog.aiMessage }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="settings-section card">
        <view class="section-title">
          <text class="title-icon">⚙️</text>
          <text class="title-text">设置信息</text>
        </view>
        <view class="setting-item">
          <text class="setting-label">开场白</text>
          <text class="setting-value">{{ personality.greeting }}</text>
        </view>
        <view class="setting-item">
          <text class="setting-label">禁用话题</text>
          <view class="disabled-topics">
            <text v-for="topic in personality.disabledTopics" :key="topic" class="topic-tag">{{ topic }}</text>
          </view>
        </view>
        <view class="setting-item">
          <text class="setting-label">可见范围</text>
          <text class="setting-value">{{ getVisibilityText(personality.visibility) }}</text>
        </view>
      </view>

      <view class="reviews-section card">
        <view class="section-title">
          <text class="title-icon">⭐</text>
          <text class="title-text">用户评价</text>
          <text class="review-count">({{ personality.reviews.length }})</text>
        </view>
        
        <view class="review-list">
          <view v-for="review in personality.reviews" :key="review.id" class="review-item">
            <image :src="review.userAvatar" class="avatar-sm" mode="aspectFill" />
            <view class="review-content">
              <view class="review-header">
                <text class="reviewer-name">{{ review.userName }}</text>
                <view class="review-rating">
                  <text v-for="i in 5" :key="i" class="star">{{ i <= review.rating ? '★' : '☆' }}</text>
                </view>
                <text class="review-time">{{ review.createdAt }}</text>
              </view>
              <text class="review-text">{{ review.content }}</text>
              <view v-if="review.reply" class="review-reply">
                <text class="reply-label">创作者回复:</text>
                <text class="reply-content">{{ review.reply.content }}</text>
                <text class="reply-time">{{ review.reply.createdAt }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar safe-area-bottom">
      <view class="bottom-left">
        <view 
          :class="['action-btn', { active: isFavorited }]" 
          @tap="toggleFavorite"
        >
          <text>{{ isFavorited ? '❤️' : '🤍' }}</text>
          <text class="action-text">收藏</text>
        </view>
        <view class="action-btn" @tap="sharePersonality">
          <text>📤</text>
          <text class="action-text">分享</text>
        </view>
      </view>
      <view class="bottom-right">
        <view v-if="personality?.status !== 'online'" class="btn btn-disabled">
          {{ personality?.status === 'draft' ? '草稿状态' : '已下架' }}
        </view>
        <view v-else-if="isPurchased" class="btn btn-secondary" @tap="goToChat(false)">开始聊天</view>
        <view v-else class="trial-section">
          <view class="btn btn-outline trial-btn" @tap="goToChat(true)">免费试用</view>
          <view class="buy-section">
            <view class="price-info">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ personality?.price }}</text>
              <text class="price-unit">/{{ getUnitText(personality?.unit) }}</text>
            </view>
            <view class="btn btn-primary" @tap="buyPersonality">购买</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { usePersonalityStore } from '@/stores/personality'
import { useUserStore } from '@/stores/user'
import type { Personality } from '@/types'

const personalityStore = usePersonalityStore()
const userStore = useUserStore()

const personality = ref<Personality | null>(null)
const isFavorited = ref(false)
const isPurchased = ref(false)
let currentId = ''

onLoad((options) => {
  const id = options?.id
  if (id) {
    currentId = id
    loadPersonality(id)
  }
})

onShow(() => {
  if (currentId) {
    loadPersonality(currentId)
  }
})

function loadPersonality(id: string) {
  personality.value = personalityStore.getPersonalityById(id) || null
  isFavorited.value = userStore.isFavorite(id)
  isPurchased.value = userStore.isPurchased(id)
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    online: '在线',
    offline: '离线',
    draft: '草稿'
  }
  return statusMap[status] || status
}

function getVisibilityText(visibility: string): string {
  const visibilityMap: Record<string, string> = {
    public: '公开',
    private: '私有',
    limited: '受限'
  }
  return visibilityMap[visibility] || visibility
}

function getUnitText(unit?: string): string {
  if (!unit) return ''
  const units: Record<string, string> = {
    hour: '小时',
    day: '天',
    month: '月',
    year: '年'
  }
  return units[unit] || unit
}

function toggleFavorite() {
  if (!personality.value) return
  isFavorited.value = userStore.toggleFavorite(
    personality.value.id,
    personality.value.name,
    personality.value.avatar
  )
}

function sharePersonality() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

function buyPersonality() {
  if (!personality.value) return
  
  if (userStore.user.balance < personality.value.price) {
    uni.showModal({
      title: '余额不足',
      content: '您的余额不足，请先充值',
      showCancel: false
    })
    return
  }

  uni.showModal({
    title: '确认购买',
    content: `确认购买「${personality.value.name}」？价格：¥${personality.value.price}/${getUnitText(personality.value.unit)}`,
    success: (res) => {
      if (res.confirm) {
        userStore.addPurchase({
          personalityId: personality.value!.id,
          personalityName: personality.value!.name,
          personalityAvatar: personality.value!.avatar,
          price: personality.value!.price,
          duration: 1,
          durationUnit: personality.value!.unit,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active'
        })
        isPurchased.value = true
        uni.showToast({ title: '购买成功', icon: 'success' })
      }
    }
  })
}

function goToChat(isTrial: boolean = false) {
  if (!personality.value) return
  const url = `/pages/chat/index?id=${personality.value.id}&trial=${isTrial ? '1' : '0'}`
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 160rpx;
}

.detail-content {
  padding: $spacing-md;
}

.header-section {
  background: linear-gradient(135deg, $primary-color, $primary-light);
  border-radius: $border-radius-xl;
  padding: $spacing-lg;
  display: flex;
  align-items: flex-start;
  margin-bottom: $spacing-md;
  
  .avatar-xl {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
  }
  
  .header-info {
    flex: 1;
    margin-left: $spacing-md;
    
    .personality-name {
      font-size: $font-size-2xl;
      font-weight: 600;
      color: #fff;
      margin-bottom: $spacing-sm;
    }
    
    .header-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xs;
      margin-bottom: $spacing-sm;
    }
    
    .tag {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      border: none;
    }
    
    .header-stats {
      display: flex;
      gap: $spacing-md;
      
      .stat-item {
        font-size: $font-size-xs;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .status-badge {
    padding: $spacing-xs $spacing-sm;
    border-radius: 20rpx;
    font-size: $font-size-xs;
    
    &.online {
      background-color: rgba($success-color, 0.2);
      color: $success-color;
    }
    
    &.offline {
      background-color: rgba($text-muted, 0.2);
      color: $text-muted;
    }
    
    &.draft {
      background-color: rgba($warning-color, 0.2);
      color: $warning-color;
    }
  }
}

.card {
  background-color: $bg-primary;
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-md;
    
    .title-icon {
      font-size: $font-size-lg;
      margin-right: $spacing-sm;
    }
    
    .title-text {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
    }
    
    .review-count {
      font-size: $font-size-sm;
      color: $text-muted;
      margin-left: $spacing-xs;
    }
  }
}

.creator-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .creator-info {
    display: flex;
    align-items: center;
    
    .avatar-md {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    
    .creator-detail {
      margin-left: $spacing-sm;
      display: flex;
      flex-direction: column;
      
      .creator-name {
        font-size: $font-size-base;
        font-weight: 500;
        color: $text-primary;
      }
      
      .creator-label {
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
  }
  
  .create-time {
    text {
      font-size: $font-size-xs;
      color: $text-muted;
      display: block;
    }
  }
}

.description-section {
  .description-text {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.sample-dialog-section {
  .dialog-list {
    .dialog-item {
      margin-bottom: $spacing-md;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .user-message, .ai-message {
      .message-label {
        font-size: $font-size-xs;
        color: $text-muted;
        margin-bottom: 4rpx;
        display: block;
      }
      
      .message-content {
        font-size: $font-size-sm;
        color: $text-primary;
        line-height: 1.5;
      }
    }
    
    .ai-message {
      margin-top: $spacing-sm;
      padding-left: $spacing-md;
      border-left: 4rpx solid $primary-color;
    }
  }
}

.settings-section {
  .setting-item {
    display: flex;
    flex-direction: column;
    margin-bottom: $spacing-md;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .setting-label {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-bottom: $spacing-xs;
    }
    
    .setting-value {
      font-size: $font-size-sm;
      color: $text-primary;
    }
    
    .disabled-topics {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xs;
      
      .topic-tag {
        padding: $spacing-xs $spacing-sm;
        background-color: rgba($error-color, 0.1);
        color: $error-color;
        border-radius: 20rpx;
        font-size: $font-size-xs;
      }
    }
  }
}

.reviews-section {
  .review-list {
    .review-item {
      display: flex;
      margin-bottom: $spacing-md;
      padding-bottom: $spacing-md;
      border-bottom: 1rpx solid $border-color;
      
      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .avatar-sm {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .review-content {
        flex: 1;
        margin-left: $spacing-sm;
        
        .review-header {
          display: flex;
          align-items: center;
          margin-bottom: $spacing-xs;
          
          .reviewer-name {
            font-size: $font-size-sm;
            font-weight: 500;
            color: $text-primary;
          }
          
          .review-rating {
            margin-left: $spacing-sm;
            
            .star {
              font-size: $font-size-sm;
              color: $warning-color;
            }
          }
          
          .review-time {
            margin-left: auto;
            font-size: $font-size-xs;
            color: $text-muted;
          }
        }
        
        .review-text {
          font-size: $font-size-sm;
          color: $text-secondary;
          line-height: 1.5;
        }
        
        .review-reply {
          margin-top: $spacing-sm;
          padding: $spacing-sm;
          background-color: $bg-secondary;
          border-radius: $border-radius;
          
          .reply-label {
            font-size: $font-size-xs;
            color: $primary-color;
            display: block;
            margin-bottom: 4rpx;
          }
          
          .reply-content {
            font-size: $font-size-sm;
            color: $text-primary;
            display: block;
          }
          
          .reply-time {
            font-size: $font-size-xs;
            color: $text-muted;
            margin-top: 4rpx;
            display: block;
          }
        }
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg-primary;
  padding: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  
  .bottom-left {
    display: flex;
    gap: $spacing-lg;
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      text {
        font-size: $font-size-xl;
      }
      
      .action-text {
        font-size: $font-size-xs;
        color: $text-secondary;
        margin-top: 4rpx;
      }
      
      &.active {
        .action-text {
          color: $primary-color;
        }
      }
    }
  }
  
  .bottom-right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .trial-section {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      .trial-btn {
        padding: $spacing-sm $spacing-md;
        font-size: $font-size-sm;
      }
    }
    
    .buy-section {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      .price-info {
        display: flex;
        align-items: baseline;
        
        .price-symbol {
          font-size: $font-size-sm;
          color: $price-color;
        }
        
        .price-value {
          font-size: $price-size;
          font-weight: 600;
          color: $price-color;
        }
        
        .price-unit {
          font-size: $font-size-xs;
          color: $text-muted;
        }
      }
    }
    
    .btn {
      padding: $spacing-sm $spacing-xl;
    }
  }
}
</style>
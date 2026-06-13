<template>
  <view class="profile-container">
    <view class="profile-header">
      <view class="user-info">
        <image :src="user.avatar" class="avatar-xl" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ user.name }}</text>
          <text class="user-id">ID: {{ user.id.slice(-8) }}</text>
        </view>
      </view>
      <view class="balance-card">
        <view class="balance-info">
          <text class="balance-label">账户余额</text>
          <text class="balance-value">¥{{ user.balance.toFixed(2) }}</text>
        </view>
        <view class="btn btn-outline btn-sm" @tap="recharge">充值</view>
      </view>
    </view>

    <view class="stats-row">
      <view class="stat-card" @tap="goToFavorites">
        <text class="stat-value">{{ favorites.length }}</text>
        <text class="stat-label">收藏</text>
      </view>
      <view class="stat-card" @tap="goToPurchases">
        <text class="stat-value">{{ purchases.length }}</text>
        <text class="stat-label">已购</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ creatorStats.personalityCount }}</text>
        <text class="stat-label">发布</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ creatorStats.totalSales }}</text>
        <text class="stat-label">销量</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-card" @tap="goToFavorites">
        <view class="menu-icon">❤️</view>
        <view class="menu-content">
          <text class="menu-title">我的收藏</text>
          <text class="menu-desc">收藏喜欢的人格</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
      
      <view class="menu-card" @tap="goToPurchases">
        <view class="menu-icon">📦</view>
        <view class="menu-content">
          <text class="menu-title">已购买</text>
          <text class="menu-desc">查看已购买的人格</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
      
      <view class="menu-card" @tap="goToCreatorCenter">
        <view class="menu-icon">👤</view>
        <view class="menu-content">
          <text class="menu-title">创作者中心</text>
          <text class="menu-desc">管理我的人格</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
      
      <view class="menu-card" @tap="goToRevenue">
        <view class="menu-icon">💰</view>
        <view class="menu-content">
          <text class="menu-title">收益明细</text>
          <text class="menu-desc">查看收益记录</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
      
      <view class="menu-card">
        <view class="menu-icon">⚙️</view>
        <view class="menu-content">
          <text class="menu-title">设置</text>
          <text class="menu-desc">账户设置</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <view class="purchases-section" v-if="activeTab === 'purchases'">
      <view class="section-header">
        <text class="section-title">已购买的人格</text>
      </view>
      <view v-if="purchases.length > 0" class="purchases-list">
        <view v-for="purchase in purchases" :key="purchase.id" class="purchase-item">
          <image :src="purchase.personalityAvatar" class="avatar-md" mode="aspectFill" />
          <view class="purchase-info">
            <text class="purchase-name">{{ purchase.personalityName }}</text>
            <text class="purchase-expire">有效期至 {{ purchase.expiresAt }}</text>
          </view>
          <view class="purchase-action">
            <view class="btn btn-primary btn-sm" @tap="goToChat(purchase.personalityId)">使用</view>
            <view class="btn btn-outline btn-sm" @tap="renewPurchase(purchase)">续费</view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无已购买的人格</text>
      </view>
    </view>

    <view class="favorites-section" v-if="activeTab === 'favorites'">
      <view class="section-header">
        <text class="section-title">我的收藏</text>
      </view>
      <view v-if="favorites.length > 0" class="favorites-list">
        <view v-for="favorite in favorites" :key="favorite.id" class="favorite-item">
          <image :src="favorite.personalityAvatar" class="avatar-md" mode="aspectFill" />
          <view class="favorite-info">
            <text class="favorite-name">{{ favorite.personalityName }}</text>
            <text class="favorite-time">收藏于 {{ favorite.favoritedAt }}</text>
          </view>
          <view class="favorite-action">
            <view class="btn btn-primary btn-sm" @tap="goToDetail(favorite.personalityId)">查看</view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">❤️</text>
        <text class="empty-text">暂无收藏</text>
      </view>
    </view>

    <view class="creator-section" v-if="activeTab === 'creator'">
      <view class="section-header">
        <text class="section-title">创作者中心</text>
      </view>
      
      <view class="stats-overview">
        <view class="stat-item">
          <text class="stat-num">¥{{ creatorStats.totalRevenue.toFixed(2) }}</text>
          <text class="stat-name">总收益</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ creatorStats.avgRating }}</text>
          <text class="stat-name">平均评分</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ creatorStats.todayViews }}</text>
          <text class="stat-name">今日浏览</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ creatorStats.todaySales }}</text>
          <text class="stat-name">今日销量</text>
        </view>
      </view>

      <view class="my-personalities">
        <view class="section-subtitle">我的人格</view>
        <view v-for="personality in myPersonalities" :key="personality.id" class="personality-item">
          <image :src="personality.avatar" class="avatar-md" mode="aspectFill" />
          <view class="personality-info">
            <text class="personality-name">{{ personality.name }}</text>
            <text class="personality-stats">销量: {{ personality.sales }} | 评分: {{ personality.rating }}</text>
          </view>
          <view :class="['status-tag', personality.status]">
            {{ getStatusText(personality.status) }}
          </view>
        </view>
      </view>
    </view>

    <view class="revenue-section" v-if="activeTab === 'revenue'">
      <view class="section-header">
        <text class="section-title">收益明细</text>
      </view>
      <view v-if="revenueRecords.length > 0" class="revenue-list">
        <view v-for="record in revenueRecords" :key="record.id" class="revenue-item">
          <view class="revenue-icon">
            <text>{{ getRecordIcon(record.type) }}</text>
          </view>
          <view class="revenue-info">
            <text class="revenue-desc">{{ record.description }}</text>
            <text class="revenue-time">{{ record.createdAt }}</text>
          </view>
          <text :class="['revenue-amount', record.type]">
            {{ record.amount > 0 ? '+' : '' }}{{ record.amount.toFixed(2) }}
          </text>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">💰</text>
        <text class="empty-text">暂无收益记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePersonalityStore } from '@/stores/personality'

const userStore = useUserStore()
const personalityStore = usePersonalityStore()

const activeTab = ref<string>('')

const user = computed(() => userStore.user)
const favorites = computed(() => userStore.favorites)
const purchases = computed(() => userStore.getActivePurchases())
const creatorStats = computed(() => userStore.creatorStats)
const revenueRecords = computed(() => userStore.revenueRecords)
const myPersonalities = computed(() => 
  personalityStore.personalities.filter(p => p.creatorId === user.value.id)
)

function recharge() {
  uni.showModal({
    title: '充值',
    editable: true,
    placeholderText: '请输入充值金额',
    success: (res) => {
      if (res.confirm && res.content) {
        const amount = parseFloat(res.content)
        if (amount > 0) {
          userStore.recharge(amount)
          uni.showToast({ title: '充值成功', icon: 'success' })
        } else {
          uni.showToast({ title: '请输入有效金额', icon: 'none' })
        }
      }
    }
  })
}

function goToFavorites() {
  activeTab.value = 'favorites'
}

function goToPurchases() {
  activeTab.value = 'purchases'
}

function goToCreatorCenter() {
  activeTab.value = 'creator'
}

function goToRevenue() {
  activeTab.value = 'revenue'
}

function goToChat(id: string) {
  uni.navigateTo({ url: `/pages/chat/index?id=${id}` })
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

function renewPurchase(purchase: typeof purchases.value[0]) {
  uni.showModal({
    title: '续费',
    content: `确认续费「${purchase.personalityName}」？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '续费成功', icon: 'success' })
      }
    }
  })
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    online: '在线',
    offline: '离线',
    draft: '草稿'
  }
  return statusMap[status] || status
}

function getRecordIcon(type: string): string {
  const iconMap: Record<string, string> = {
    sale: '📈',
    refund: '🔄',
    withdrawal: '💳'
  }
  return iconMap[type] || '💰'
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background-color: $bg-secondary;
}

.profile-header {
  background: linear-gradient(135deg, $primary-color, $primary-light);
  padding: $spacing-lg;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-lg;
    
    .avatar-xl {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.5);
    }
    
    .user-detail {
      margin-left: $spacing-md;
      
      .user-name {
        font-size: $font-size-xl;
        font-weight: 600;
        color: #fff;
        display: block;
      }
      
      .user-id {
        font-size: $font-size-xs;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .balance-card {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .balance-info {
      .balance-label {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.8);
        display: block;
      }
      
      .balance-value {
        font-size: $font-size-2xl;
        font-weight: 600;
        color: #fff;
      }
    }
    
    .btn {
      background-color: #fff;
      color: $primary-color;
      
      &:active {
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.stats-row {
  display: flex;
  padding: $spacing-md;
  margin: -$spacing-lg $spacing-md 0;
  background-color: $bg-primary;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  
  .stat-card {
    flex: 1;
    text-align: center;
    
    .stat-value {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-primary;
      display: block;
    }
    
    .stat-label {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-top: 4rpx;
    }
  }
}

.menu-section {
  padding: $spacing-md;
  margin-top: $spacing-md;
  
  .menu-card {
    display: flex;
    align-items: center;
    background-color: $bg-primary;
    padding: $spacing-md;
    border-radius: $border-radius-lg;
    margin-bottom: $spacing-sm;
    
    .menu-icon {
      font-size: $font-size-2xl;
      margin-right: $spacing-md;
    }
    
    .menu-content {
      flex: 1;
      
      .menu-title {
        font-size: $font-size-base;
        font-weight: 500;
        color: $text-primary;
        display: block;
      }
      
      .menu-desc {
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
    
    .menu-arrow {
      font-size: $font-size-lg;
      color: $text-muted;
    }
  }
}

.section-header {
  padding: $spacing-md;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-primary;
  }
}

.purchases-list, .favorites-list {
  padding: 0 $spacing-md;
  
  .purchase-item, .favorite-item {
    display: flex;
    align-items: center;
    background-color: $bg-primary;
    padding: $spacing-md;
    border-radius: $border-radius-lg;
    margin-bottom: $spacing-sm;
    
    .avatar-md {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    
    .purchase-info, .favorite-info {
      flex: 1;
      margin-left: $spacing-md;
      
      .purchase-name, .favorite-name {
        font-size: $font-size-base;
        font-weight: 500;
        color: $text-primary;
        display: block;
      }
      
      .purchase-expire, .favorite-time {
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
    
    .purchase-action, .favorite-action {
      display: flex;
      gap: $spacing-xs;
    }
  }
}

.creator-section {
  padding: 0 $spacing-md;
  
  .stats-overview {
    display: flex;
    background-color: $bg-primary;
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    margin-bottom: $spacing-md;
    
    .stat-item {
      flex: 1;
      text-align: center;
      
      .stat-num {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $primary-color;
        display: block;
      }
      
      .stat-name {
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
  }
  
  .my-personalities {
    background-color: $bg-primary;
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    
    .section-subtitle {
      font-size: $font-size-base;
      font-weight: 500;
      color: $text-primary;
      margin-bottom: $spacing-sm;
      display: block;
    }
    
    .personality-item {
      display: flex;
      align-items: center;
      padding: $spacing-sm 0;
      border-bottom: 1rpx solid $border-color;
      
      &:last-child {
        border-bottom: none;
      }
      
      .avatar-md {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
      }
      
      .personality-info {
        flex: 1;
        margin-left: $spacing-sm;
        
        .personality-name {
          font-size: $font-size-sm;
          color: $text-primary;
          display: block;
        }
        
        .personality-stats {
          font-size: $font-size-xs;
          color: $text-muted;
        }
      }
      
      .status-tag {
        font-size: $font-size-xs;
        padding: $spacing-xs $spacing-sm;
        border-radius: 20rpx;
        
        &.online {
          background-color: rgba($success-color, 0.1);
          color: $success-color;
        }
        
        &.offline {
          background-color: rgba($text-muted, 0.1);
          color: $text-muted;
        }
        
        &.draft {
          background-color: rgba($warning-color, 0.1);
          color: $warning-color;
        }
      }
    }
  }
}

.revenue-list {
  padding: 0 $spacing-md;
  
  .revenue-item {
    display: flex;
    align-items: center;
    background-color: $bg-primary;
    padding: $spacing-md;
    border-radius: $border-radius-lg;
    margin-bottom: $spacing-sm;
    
    .revenue-icon {
      font-size: $font-size-xl;
      margin-right: $spacing-md;
    }
    
    .revenue-info {
      flex: 1;
      
      .revenue-desc {
        font-size: $font-size-sm;
        color: $text-primary;
        display: block;
      }
      
      .revenue-time {
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
    
    .revenue-amount {
      font-size: $font-size-base;
      font-weight: 600;
      
      &.sale {
        color: $success-color;
      }
      
      &.refund {
        color: $error-color;
      }
      
      &.withdrawal {
        color: $text-secondary;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx $spacing-md;
  
  .empty-icon {
    font-size: 100rpx;
    margin-bottom: $spacing-md;
  }
  
  .empty-text {
    font-size: $font-size-base;
    color: $text-muted;
  }
}
</style>
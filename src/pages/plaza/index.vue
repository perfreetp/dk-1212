<template>
  <view class="plaza-container">
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input 
          v-model="searchText" 
          class="search-input" 
          placeholder="搜索人格" 
          @confirm="handleSearch"
        />
      </view>
    </view>

    <scroll-view class="filters-scroll" scroll-x>
      <view class="filters">
        <view class="filter-group">
          <view 
            v-for="option in purposeOptions" 
            :key="option"
            :class="['filter-tag', { active: filters.purpose === option }]"
            @tap="setFilter('purpose', option)"
          >
            {{ option }}
          </view>
        </view>
        <view class="filter-group">
          <view 
            v-for="option in toneOptions" 
            :key="option"
            :class="['filter-tag', { active: filters.tone === option }]"
            @tap="setFilter('tone', option)"
          >
            {{ option }}
          </view>
        </view>
        <view class="filter-group">
          <view 
            v-for="option in domainOptions" 
            :key="option"
            :class="['filter-tag', { active: filters.domain === option }]"
            @tap="setFilter('domain', option)"
          >
            {{ option }}
          </view>
        </view>
        <view class="filter-group">
          <view 
            v-for="option in priceOptions" 
            :key="option.label"
            :class="['filter-tag', { active: filters.priceLabel === option.label }]"
            @tap="setPriceFilter(option)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="personality-list">
      <view 
        v-for="personality in personalities" 
        :key="personality.id"
        class="personality-card"
        @tap="goToDetail(personality.id)"
      >
        <view class="card-header">
          <image :src="personality.avatar" class="avatar-lg" mode="aspectFill" />
          <view class="card-info">
            <view class="personality-name">{{ personality.name }}</view>
            <view class="creator-info">
              <image :src="personality.creatorAvatar" class="avatar-sm" mode="aspectFill" />
              <text class="creator-name">{{ personality.creatorName }}</text>
            </view>
          </view>
          <view 
            :class="['favorite-btn', { favorited: isFavorite(personality.id) }]"
            @tap.stop="toggleFavorite(personality)"
          >
            <text>{{ isFavorite(personality.id) ? '❤️' : '🤍' }}</text>
          </view>
        </view>
        
        <view class="card-tags">
          <text class="tag tag-primary">{{ personality.purpose }}</text>
          <text class="tag tag-info">{{ personality.tone }}</text>
          <text class="tag tag-warning">{{ personality.domain }}</text>
        </view>
        
        <view class="card-description">{{ personality.description }}</view>
        
        <view class="card-footer">
          <view class="stats">
            <text class="stat-item">⭐ {{ personality.rating }}</text>
            <text class="stat-item">💬 {{ personality.reviews.length }}</text>
            <text class="stat-item">❤️ {{ personality.favorites }}</text>
          </view>
          <view class="price-wrap">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ personality.price }}</text>
            <text class="price-unit">/{{ getUnitText(personality.unit) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="personalities.length === 0" class="empty-state">
      <text class="empty-icon">🔍</text>
      <text class="empty-text">暂无符合条件的人格</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePersonalityStore } from '@/stores/personality'
import { useUserStore } from '@/stores/user'
import { purposeOptions, toneOptions, domainOptions, priceOptions } from '@/data/mockData'
import type { Personality } from '@/types'

const personalityStore = usePersonalityStore()
const userStore = useUserStore()

const searchText = ref('')
const filters = ref({
  purpose: '全部',
  tone: '全部',
  domain: '全部',
  priceLabel: '全部',
  priceRange: { min: 0, max: Infinity }
})

const personalities = ref(personalityStore.filteredPersonalities)

onMounted(() => {
  personalities.value = personalityStore.filteredPersonalities
})

function setFilter(type: string, value: string) {
  filters.value[type as keyof typeof filters.value] = value
  personalityStore.setFilters({
    purpose: filters.value.purpose,
    tone: filters.value.tone,
    domain: filters.value.domain,
    priceRange: filters.value.priceRange
  })
  personalities.value = personalityStore.filteredPersonalities
}

function setPriceFilter(option: { label: string; min: number; max: number }) {
  filters.value.priceLabel = option.label
  filters.value.priceRange = { min: option.min, max: option.max }
  personalityStore.setFilters({
    purpose: filters.value.purpose,
    tone: filters.value.tone,
    domain: filters.value.domain,
    priceRange: filters.value.priceRange
  })
  personalities.value = personalityStore.filteredPersonalities
}

function handleSearch() {
  const search = searchText.value.toLowerCase()
  if (!search) {
    personalities.value = personalityStore.filteredPersonalities
    return
  }
  personalities.value = personalityStore.filteredPersonalities.filter(p => 
    p.name.toLowerCase().includes(search) || 
    p.description.toLowerCase().includes(search)
  )
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

function isFavorite(id: string): boolean {
  return userStore.isFavorite(id)
}

function toggleFavorite(personality: Personality) {
  userStore.toggleFavorite(personality.id, personality.name, personality.avatar)
  personalityStore.toggleFavorite(personality.id)
}

function getUnitText(unit: string): string {
  const units: Record<string, string> = {
    hour: '小时',
    day: '天',
    month: '月',
    year: '年'
  }
  return units[unit] || unit
}
</script>

<style lang="scss" scoped>
.plaza-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 120rpx;
}

.search-bar {
  padding: $spacing-md;
  background-color: $bg-primary;
  
  .search-input-wrap {
    display: flex;
    align-items: center;
    background-color: $bg-secondary;
    border-radius: $border-radius-xl;
    padding: $spacing-sm $spacing-md;
  }
  
  .search-icon {
    font-size: $font-size-lg;
    margin-right: $spacing-sm;
  }
  
  .search-input {
    flex: 1;
    font-size: $font-size-base;
    background: transparent;
    border: none;
    outline: none;
  }
}

.filters-scroll {
  white-space: nowrap;
  background-color: $bg-primary;
  padding: $spacing-sm $spacing-md;
  border-bottom: 1rpx solid $border-color;
  
  .filters {
    display: inline-flex;
    gap: $spacing-sm;
  }
  
  .filter-group {
    display: inline-flex;
    gap: $spacing-xs;
    margin-right: $spacing-md;
    
    &:last-child {
      margin-right: 0;
    }
  }
  
  .filter-tag {
    padding: $spacing-xs $spacing-md;
    background-color: $bg-secondary;
    border-radius: 40rpx;
    font-size: $font-size-sm;
    color: $text-secondary;
    white-space: nowrap;
    
    &.active {
      background-color: $primary-color;
      color: #fff;
    }
  }
}

.personality-list {
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.personality-card {
  background-color: $bg-primary;
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  
  .card-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: $spacing-md;
    
    .avatar-lg {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .card-info {
      flex: 1;
      margin-left: $spacing-md;
      
      .personality-name {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-xs;
      }
      
      .creator-info {
        display: flex;
        align-items: center;
        
        .avatar-sm {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
        }
        
        .creator-name {
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-left: $spacing-xs;
        }
      }
    }
    
    .favorite-btn {
      padding: $spacing-sm;
      
      text {
        font-size: $font-size-xl;
      }
    }
  }
  
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;
  }
  
  .card-description {
    font-size: $font-size-sm;
    color: $text-secondary;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-bottom: $spacing-md;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .stats {
      display: flex;
      gap: $spacing-md;
      
      .stat-item {
        font-size: $font-size-sm;
        color: $text-muted;
      }
    }
    
    .price-wrap {
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
        margin-left: 4rpx;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx $spacing-md;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: $spacing-md;
  }
  
  .empty-text {
    font-size: $font-size-base;
    color: $text-muted;
  }
}
</style>
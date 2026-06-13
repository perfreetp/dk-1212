import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Purchase, Favorite, CreatorStats, RevenueRecord } from '@/types'
import { mockUser, mockPurchases, mockFavorites, mockCreatorStats, mockRevenueRecords } from '@/data/mockData'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>(mockUser)
  const purchases = ref<Purchase[]>(mockPurchases)
  const favorites = ref<Favorite[]>(mockFavorites)
  const creatorStats = ref<CreatorStats>(mockCreatorStats)
  const revenueRecords = ref<RevenueRecord[]>(mockRevenueRecords)

  function addPurchase(purchase: Omit<Purchase, 'id' | 'purchasedAt'>) {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
      purchasedAt: new Date().toISOString().split('T')[0]
    }
    purchases.value.unshift(newPurchase)
    user.value.balance -= purchase.price
  }

  function renewPurchase(purchaseId: string, price: number, duration: number, unit: 'hour' | 'day' | 'month' | 'year'): boolean {
    const purchase = purchases.value.find(p => p.id === purchaseId)
    if (!purchase) return false
    
    if (user.value.balance < price) {
      return false
    }
    
    user.value.balance -= price
    
    const currentExpiry = new Date(purchase.expiresAt)
    const now = new Date()
    const startDate = currentExpiry > now ? currentExpiry : now
    
    const durationMs = getDurationMs(duration, unit)
    const newExpiry = new Date(startDate.getTime() + durationMs)
    purchase.expiresAt = newExpiry.toISOString().split('T')[0]
    
    return true
  }

  function getDurationMs(duration: number, unit: string): number {
    const units: Record<string, number> = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    }
    return (units[unit] || units.day) * duration
  }

  function toggleFavorite(personalityId: string, name: string, avatar: string): boolean {
    const index = favorites.value.findIndex(f => f.personalityId === personalityId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      personalityStore.toggleFavorite(personalityId, false)
      return false
    } else {
      favorites.value.unshift({
        id: Date.now().toString(),
        personalityId,
        personalityName: name,
        personalityAvatar: avatar,
        favoritedAt: new Date().toISOString().split('T')[0]
      })
      personalityStore.toggleFavorite(personalityId, true)
      return true
    }
  }

  function isFavorite(personalityId: string): boolean {
    return favorites.value.some(f => f.personalityId === personalityId)
  }

  function isPurchased(personalityId: string): boolean {
    return purchases.value.some(p => p.personalityId === personalityId && p.status === 'active')
  }

  function getActivePurchases(): Purchase[] {
    return purchases.value.filter(p => p.status === 'active')
  }

  function addRevenueRecord(record: Omit<RevenueRecord, 'id'>) {
    revenueRecords.value.unshift({
      ...record,
      id: Date.now().toString()
    })
  }

  function recharge(amount: number) {
    user.value.balance += amount
  }

  return {
    user,
    purchases,
    favorites,
    creatorStats,
    revenueRecords,
    addPurchase,
    renewPurchase,
    toggleFavorite,
    isFavorite,
    isPurchased,
    getActivePurchases,
    addRevenueRecord,
    recharge
  }
})
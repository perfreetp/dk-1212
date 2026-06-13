import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Personality, Review } from '@/types'
import { mockPersonalities } from '@/data/mockData'

const STORAGE_KEY = 'ai_personality_data'

export const usePersonalityStore = defineStore('personality', () => {
  const storedData = uni.getStorageSync(STORAGE_KEY)
  const personalities = ref<Personality[]>(storedData?.personalities || mockPersonalities)
  const selectedPersonality = ref<Personality | null>(null)
  
  const filteredPersonalities = ref<Personality[]>([...personalities.value])
  const filters = ref({
    purpose: '全部',
    tone: '全部',
    domain: '全部',
    priceRange: { min: 0, max: Infinity }
  })

  function saveToStorage() {
    try {
      uni.setStorageSync(STORAGE_KEY, { personalities: personalities.value })
    } catch (e) {
      console.error('Failed to save to storage:', e)
    }
  }

  function setFilters(newFilters: typeof filters.value) {
    filters.value = { ...filters.value, ...newFilters }
    applyFilters()
  }

  function applyFilters() {
    filteredPersonalities.value = personalities.value.filter(p => {
      if (p.status !== 'online') return false
      if (filters.value.purpose !== '全部' && p.purpose !== filters.value.purpose) return false
      if (filters.value.tone !== '全部' && p.tone !== filters.value.tone) return false
      if (filters.value.domain !== '全部' && p.domain !== filters.value.domain) return false
      if (p.price < filters.value.priceRange.min || p.price > filters.value.priceRange.max) return false
      return true
    })
  }

  function getPersonalityById(id: string): Personality | undefined {
    return personalities.value.find(p => p.id === id)
  }

  function selectPersonality(id: string) {
    selectedPersonality.value = getPersonalityById(id) || null
  }

  function addReview(personalityId: string, review: Omit<Review, 'id' | 'createdAt'>) {
    const personality = getPersonalityById(personalityId)
    if (personality) {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      personality.reviews.unshift(newReview)
      personality.rating = personality.reviews.reduce((sum, r) => sum + r.rating, 0) / personality.reviews.length
      saveToStorage()
    }
  }

  function toggleFavorite(personalityId: string, isAdding?: boolean) {
    const personality = getPersonalityById(personalityId)
    if (personality) {
      if (isAdding === true) {
        personality.favorites += 1
      } else if (isAdding === false) {
        personality.favorites = Math.max(0, personality.favorites - 1)
      }
      saveToStorage()
    }
  }

  function createPersonality(personality: Omit<Personality, 'id' | 'createdAt' | 'updatedAt' | 'sales' | 'rating' | 'reviews'>) {
    const newPersonality: Personality = {
      ...personality,
      id: Date.now().toString(),
      sales: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    personalities.value.unshift(newPersonality)
    filteredPersonalities.value.unshift(newPersonality)
    saveToStorage()
    return newPersonality
  }

  function updatePersonality(id: string, updates: Partial<Personality>) {
    const index = personalities.value.findIndex(p => p.id === id)
    if (index !== -1) {
      personalities.value[index] = { ...personalities.value[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] }
      const filterIndex = filteredPersonalities.value.findIndex(p => p.id === id)
      if (filterIndex !== -1) {
        filteredPersonalities.value[filterIndex] = { ...filteredPersonalities.value[filterIndex], ...updates, updatedAt: new Date().toISOString().split('T')[0] }
      }
      saveToStorage()
    }
  }

  function updatePersonalityStatus(id: string, status: 'online' | 'offline' | 'draft') {
    updatePersonality(id, { status })
  }

  function replyToReview(personalityId: string, reviewId: string, content: string) {
    const personality = getPersonalityById(personalityId)
    if (personality) {
      const review = personality.reviews.find(r => r.id === reviewId)
      if (review) {
        review.reply = {
          content,
          createdAt: new Date().toISOString().split('T')[0]
        }
        personality.updatedAt = new Date().toISOString().split('T')[0]
        saveToStorage()
      }
    }
  }

  return {
    personalities,
    filteredPersonalities,
    selectedPersonality,
    filters,
    setFilters,
    applyFilters,
    getPersonalityById,
    selectPersonality,
    addReview,
    toggleFavorite,
    createPersonality,
    updatePersonality,
    updatePersonalityStatus,
    replyToReview
  }
})
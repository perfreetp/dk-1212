import type { Personality, User, Purchase, Favorite, CreatorStats, RevenueRecord } from '@/types'

export const mockPersonalities: Personality[] = [
  {
    id: '1',
    name: '英语陪练小助手',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=friendly%20female%20english%20teacher%20avatar%20professional&image_size=square',
    description: '专业的英语学习伙伴，提供口语练习、语法讲解、词汇记忆等全方位英语学习支持。适合各年龄段学习者，让你的英语学习事半功倍！',
    purpose: '学习辅导',
    tone: '亲切友好',
    domain: '教育',
    price: 9.9,
    unit: 'hour',
    creatorId: 'u1',
    creatorName: '李老师',
    creatorAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20female%20teacher%20portrait&image_size=square',
    favorites: 1256,
    sales: 3421,
    rating: 4.9,
    reviews: [
      {
        id: 'r1',
        userId: 'u2',
        userName: '小明',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20male%20student%20avatar&image_size=square',
        rating: 5,
        content: '非常专业，口语进步很快！',
        createdAt: '2024-01-15',
        reply: { content: '感谢您的好评！', createdAt: '2024-01-15' }
      },
      {
        id: 'r2',
        userId: 'u3',
        userName: '小红',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20female%20student%20avatar&image_size=square',
        rating: 5,
        content: '语法讲解很清晰，推荐！',
        createdAt: '2024-01-14'
      }
    ],
    sampleDialogs: [
      { id: 'd1', userMessage: 'How are you today?', aiMessage: 'I am fine, thank you! How about you? It\'s a great day for learning English, isn\'t it?' },
      { id: 'd2', userMessage: 'Can you help me practice my pronunciation?', aiMessage: 'Absolutely! Please say a word or sentence, and I\'ll help you improve your pronunciation.' }
    ],
    disabledTopics: ['政治', '敏感话题'],
    greeting: 'Hello! I am your English learning assistant. How can I help you today?',
    visibility: 'public',
    status: 'online',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: '心理咨询师小雅',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=warm%20caring%20female%20psychologist%20avatar&image_size=square',
    description: '温柔倾听，专业疏导。为你提供情绪支持、压力缓解、人际关系等方面的心理咨询服务。',
    purpose: '情感陪伴',
    tone: '温柔体贴',
    domain: '心理',
    price: 19.9,
    unit: 'hour',
    creatorId: 'u4',
    creatorName: '张医生',
    creatorAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20female%20doctor%20portrait&image_size=square',
    favorites: 892,
    sales: 1567,
    rating: 4.8,
    reviews: [
      {
        id: 'r3',
        userId: 'u5',
        userName: '阿华',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20male%20professional%20avatar&image_size=square',
        rating: 5,
        content: '非常有耐心，帮助我度过了低谷期',
        createdAt: '2024-01-13'
      }
    ],
    sampleDialogs: [
      { id: 'd3', userMessage: '最近压力好大，感觉喘不过气来', aiMessage: '我很愿意倾听你的烦恼。压力大的时候，先试着深呼吸，告诉我发生了什么好吗？' },
      { id: 'd4', userMessage: '谢谢你的理解', aiMessage: '不客气，我会一直在这里陪伴你。你并不孤单。' }
    ],
    disabledTopics: ['自残', '自杀倾向'],
    greeting: '您好，我是小雅。很高兴认识你，有什么想聊的吗？',
    visibility: 'public',
    status: 'online',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    name: '健身教练阿杰',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=muscular%20male%20fitness%20coach%20avatar&image_size=square',
    description: '专业健身指导，为你定制个性化训练计划，解答健身疑惑，陪你一起塑造完美身材！',
    purpose: '运动指导',
    tone: '热情活力',
    domain: '健康',
    price: 15.0,
    unit: 'hour',
    creatorId: 'u6',
    creatorName: '王教练',
    creatorAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20male%20fitness%20trainer%20portrait&image_size=square',
    favorites: 2134,
    sales: 4521,
    rating: 4.7,
    reviews: [
      {
        id: 'r4',
        userId: 'u7',
        userName: '健将',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=athletic%20male%20avatar&image_size=square',
        rating: 5,
        content: '训练计划很科学，效果明显！',
        createdAt: '2024-01-12'
      }
    ],
    sampleDialogs: [
      { id: 'd5', userMessage: '我想增肌，有什么好的建议吗？', aiMessage: '增肌需要结合力量训练和充足的蛋白质摄入。让我为你制定一个适合的训练计划吧！' },
      { id: 'd6', userMessage: '每天应该训练多久？', aiMessage: '初学者建议每天训练45-60分钟，循序渐进，注意劳逸结合哦！' }
    ],
    disabledTopics: ['极端减肥方法'],
    greeting: '嗨！我是阿杰，你的专属健身教练。准备好开始今天的训练了吗？',
    visibility: 'public',
    status: 'online',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-13'
  },
  {
    id: '4',
    name: '写作助手小美',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=creative%20female%20writer%20avatar%20elegant&image_size=square',
    description: '专业文案创作助手，提供文章润色、内容创作、文案策划等服务，让你的文字更有感染力！',
    purpose: '内容创作',
    tone: '优雅文艺',
    domain: '创作',
    price: 12.0,
    unit: 'hour',
    creatorId: 'u8',
    creatorName: '陈作家',
    creatorAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20female%20writer%20portrait&image_size=square',
    favorites: 567,
    sales: 892,
    rating: 4.9,
    reviews: [
      {
        id: 'r5',
        userId: 'u9',
        userName: '作者君',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=creative%20male%20writer%20avatar&image_size=square',
        rating: 5,
        content: '文笔优美，效率很高！',
        createdAt: '2024-01-11'
      }
    ],
    sampleDialogs: [
      { id: 'd7', userMessage: '帮我写一篇产品文案', aiMessage: '当然可以！请告诉我产品的特点、目标受众和想要传达的核心信息，我来帮你创作。' },
      { id: 'd8', userMessage: '如何让文章更有感染力？', aiMessage: '多用具体的细节描写和情感表达，让读者能够产生共鸣。让我给你举几个例子吧！' }
    ],
    disabledTopics: ['低俗内容', '虚假宣传'],
    greeting: '您好！我是小美，一位热爱文字的创作助手。有什么我可以帮您写的吗？',
    visibility: 'public',
    status: 'online',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12'
  },
  {
    id: '5',
    name: '游戏陪玩小王',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20male%20gamer%20avatar%20casual&image_size=square',
    description: '专业游戏陪练，精通多款热门游戏，带你上分，畅享游戏乐趣！',
    purpose: '娱乐陪伴',
    tone: '活泼开朗',
    domain: '游戏',
    price: 8.0,
    unit: 'hour',
    creatorId: 'u10',
    creatorName: '电竞小王',
    creatorAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20male%20gamer%20portrait&image_size=square',
    favorites: 3421,
    sales: 8932,
    rating: 4.6,
    reviews: [
      {
        id: 'r6',
        userId: 'u11',
        userName: '游戏迷',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=young%20male%20gamer%20avatar&image_size=square',
        rating: 5,
        content: '技术很好，带我上了好多分！',
        createdAt: '2024-01-10'
      }
    ],
    sampleDialogs: [
      { id: 'd9', userMessage: '今天玩什么游戏？', aiMessage: '随你选！LOL、王者荣耀、吃鸡我都很擅长，今天想玩哪一个？' },
      { id: 'd10', userMessage: '能带我上分吗？', aiMessage: '没问题！跟着我的节奏，保证让你赢到手软！' }
    ],
    disabledTopics: ['不良游戏行为', '代练'],
    greeting: '嘿！我是小王，你的专属游戏伙伴。今天想玩点什么？',
    visibility: 'public',
    status: 'online',
    createdAt: '2023-11-15',
    updatedAt: '2024-01-11'
  },
  {
    id: '6',
    name: '营养师小林',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=friendly%20female%20nutritionist%20avatar&image_size=square',
    description: '专业营养师，为你制定科学的饮食计划，解答营养疑问，让健康饮食变得简单！',
    purpose: '健康咨询',
    tone: '专业严谨',
    domain: '健康',
    price: 14.9,
    unit: 'hour',
    creatorId: 'u12',
    creatorName: '林营养师',
    creatorAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20female%20nutritionist%20portrait&image_size=square',
    favorites: 789,
    sales: 1234,
    rating: 4.8,
    reviews: [
      {
        id: 'r7',
        userId: 'u13',
        userName: '健康达人',
        userAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=health%20conscious%20female%20avatar&image_size=square',
        rating: 5,
        content: '饮食建议很实用，身体感觉好多了',
        createdAt: '2024-01-09'
      }
    ],
    sampleDialogs: [
      { id: 'd11', userMessage: '减肥期间应该怎么吃？', aiMessage: '减肥需要控制热量摄入，但也要保证营养均衡。让我为你制定一份适合的饮食方案吧！' },
      { id: 'd12', userMessage: '早餐吃什么比较好？', aiMessage: '早餐建议包含蛋白质、复合碳水和少量健康脂肪，比如鸡蛋、全麦面包配牛奶就是很不错的选择！' }
    ],
    disabledTopics: ['极端节食', '有害饮食习惯'],
    greeting: '您好！我是小林，您的专属营养师。有什么关于饮食健康的问题想要咨询吗？',
    visibility: 'public',
    status: 'online',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-10'
  }
]

export const mockUser: User = {
  id: 'u_current',
  name: '用户',
  avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=friendly%20user%20avatar%20neutral&image_size=square',
  balance: 198.5,
  phone: '138****8888',
  email: 'user@example.com',
  role: 'user'
}

export const mockPurchases: Purchase[] = [
  {
    id: 'p1',
    personalityId: '1',
    personalityName: '英语陪练小助手',
    personalityAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=friendly%20female%20english%20teacher%20avatar%20professional&image_size=square',
    price: 29.7,
    duration: 3,
    durationUnit: 'hour',
    expiresAt: '2024-02-15',
    status: 'active',
    purchasedAt: '2024-01-15'
  },
  {
    id: 'p2',
    personalityId: '3',
    personalityName: '健身教练阿杰',
    personalityAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=muscular%20male%20fitness%20coach%20avatar&image_size=square',
    price: 30.0,
    duration: 2,
    durationUnit: 'hour',
    expiresAt: '2024-01-20',
    status: 'active',
    purchasedAt: '2024-01-10'
  }
]

export const mockFavorites: Favorite[] = [
  {
    id: 'f1',
    personalityId: '2',
    personalityName: '心理咨询师小雅',
    personalityAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=warm%20caring%20female%20psychologist%20avatar&image_size=square',
    favoritedAt: '2024-01-14'
  },
  {
    id: 'f2',
    personalityId: '4',
    personalityName: '写作助手小美',
    personalityAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=creative%20female%20writer%20avatar%20elegant&image_size=square',
    favoritedAt: '2024-01-13'
  }
]

export const mockCreatorStats: CreatorStats = {
  personalityCount: 3,
  totalSales: 1258,
  totalRevenue: 15680.50,
  avgRating: 4.85,
  todayViews: 128,
  todaySales: 15
}

export const mockRevenueRecords: RevenueRecord[] = [
  { id: 'rr1', amount: 199.00, description: '英语陪练小助手 月度订阅', createdAt: '2024-01-15 14:30', type: 'sale' },
  { id: 'rr2', amount: 49.50, description: '健身教练阿杰 3小时服务', createdAt: '2024-01-15 11:20', type: 'sale' },
  { id: 'rr3', amount: 129.00, description: '写作助手小美 10小时服务', createdAt: '2024-01-14 16:45', type: 'sale' },
  { id: 'rr4', amount: -29.70, description: '用户退款 - 英语陪练小助手', createdAt: '2024-01-13 09:15', type: 'refund' },
  { id: 'rr5', amount: 500.00, description: '提现到账', createdAt: '2024-01-12 10:00', type: 'withdrawal' }
]

export const purposeOptions = ['全部', '学习辅导', '情感陪伴', '运动指导', '内容创作', '娱乐陪伴', '健康咨询']
export const toneOptions = ['全部', '亲切友好', '温柔体贴', '热情活力', '优雅文艺', '活泼开朗', '专业严谨']
export const domainOptions = ['全部', '教育', '心理', '健康', '创作', '游戏']
export const priceOptions = [
  { label: '全部', min: 0, max: Infinity },
  { label: '免费', min: 0, max: 0 },
  { label: '0-10元', min: 0, max: 10 },
  { label: '10-20元', min: 10, max: 20 },
  { label: '20元以上', min: 20, max: Infinity }
]
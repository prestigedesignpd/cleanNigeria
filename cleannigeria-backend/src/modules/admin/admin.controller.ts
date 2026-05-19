import { Request, Response } from 'express'
import { User, AdminUser, Subscription, Payment, Complaint, Collector, Zone, CollectionLog, Estate, Business } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { hashPassword } from '@utils/hashUtils'

/**
 * High-level dashboard statistics
 */
export const getStats = catchAsync(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    activeSubscriptions,
    pendingPayments,
    openComplaints,
    activeCollectors,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    Subscription.countDocuments({ status: 'ACTIVE' }),
    Payment.countDocuments({ status: 'PENDING' }),
    Complaint.countDocuments({ status: 'OPEN' }),
    Collector.countDocuments({ status: 'ACTIVE' }),
    Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ])

  return ApiResponse.success(res, {
    totalUsers,
    activeSubscriptions,
    pendingPayments,
    openComplaints,
    activeCollectors,
    revenueKobo: totalRevenue[0]?.total || 0,
  })
})

/**
 * User management for admins
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.accountType) filters.accountType = req.query.accountType
  if (req.query.isVerified) filters.isEmailVerified = req.query.isVerified === 'true'
  if (req.query.search) {
    filters.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ]
  }

  const users = await User.find(filters)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments(filters)

  return ApiResponse.paginated(res, users, buildPaginationMeta(total, page, limit))
})

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await User.findById(id).select('-password').populate('estateId').populate('businessId')
  if (!user) return ApiResponse.error(res, 'User not found', 404)

  // Also fetch payments or subscriptions if needed, or do it on frontend
  const subscriptions = await Subscription.find({ userId: id }).populate('planId')
  const payments = await Payment.find({ userId: id }).sort({ createdAt: -1 }).limit(10)

  return ApiResponse.success(res, {
    user,
    subscription: subscriptions[0] || null, // Assuming one active subscription
    payments
  })
})

export const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { isActive, isSuspended } = req.body
  
  const user = await User.findById(id)
  if (!user) return ApiResponse.error(res, 'User not found', 404)

  if (isActive !== undefined) user.isActive = isActive
  if (isSuspended !== undefined) user.isSuspended = isSuspended
  
  await user.save()
  return ApiResponse.success(res, user, 'User status updated')
})

/**
 * Zone-wise analytics
 */
export const getZoneStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await User.aggregate([
    { $match: { currentZoneId: { $exists: true } } },
    { $group: { _id: '$currentZoneId', userCount: { $sum: 1 } } },
    {
      $lookup: {
        from: 'zones',
        localField: '_id',
        foreignField: '_id',
        as: 'zone',
      },
    },
    { $unwind: '$zone' },
    {
      $project: {
        zoneName: '$zone.name',
        userCount: 1,
      },
    },
  ])

  return ApiResponse.success(res, stats)
})

export const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.status) filters.status = req.query.status

  const payments = await Payment.find(filters)
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Payment.countDocuments(filters)

  return ApiResponse.paginated(res, payments, buildPaginationMeta(total, page, limit))
})

export const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.status) filters.status = req.query.status

  const subscriptions = await Subscription.find(filters)
    .populate('userId', 'firstName lastName email accountType')
    .populate('planId', 'name price billingCycle')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Subscription.countDocuments(filters)

  return ApiResponse.paginated(res, subscriptions, buildPaginationMeta(total, page, limit))
})

export const getAllCollectors = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.status) filters.status = req.query.status
  if (req.query.search) {
    filters.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { employeeId: { $regex: req.query.search, $options: 'i' } },
      { 'vehicle.plateNumber': { $regex: req.query.search, $options: 'i' } }
    ]
  }

  const collectors = await Collector.find(filters)
    .populate('currentZoneId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Collector.countDocuments(filters)

  return ApiResponse.paginated(res, collectors, buildPaginationMeta(total, page, limit))
})

export const getCollectorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const collector = await Collector.findById(id).populate('currentZoneId')
  if (!collector) return ApiResponse.error(res, 'Collector not found', 404)

  return ApiResponse.success(res, collector)
})

/**
 * Full analytics data for the Analytics Overview page
 */
export const getFullAnalytics = catchAsync(async (_req: Request, res: Response) => {
  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(now.getMonth() - 5)
  sixMonthsAgo.setDate(1)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // --- Revenue: monthly by account type ---
  const revenueByMonth = await Payment.aggregate([
    { $match: { status: 'SUCCESS', createdAt: { $gte: sixMonthsAgo } } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          type: '$user.accountType',
        },
        total: { $sum: '$amount' },
      },
    },
  ])

  // Revenue by SubscriptionPlan name
  const revenueByPlan = await Payment.aggregate([
    { $match: { status: 'SUCCESS' } },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'subscriptionId',
        foreignField: '_id',
        as: 'sub',
      },
    },
    { $unwind: { path: '$sub', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'subscriptionplans',
        localField: 'sub.planId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$plan.name', 'Other'] },
        value: { $sum: '$amount' },
      },
    },
    { $project: { name: '$_id', value: 1, _id: 0 } },
    { $limit: 5 },
  ])

  // Build monthly revenue chart data
  const revenueMonthly: any[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    const monthName = monthNames[d.getMonth()]

    const estateRev = revenueByMonth.find(r => r._id.month === m && r._id.year === y && r._id.type === 'ESTATE')
    const businessRev = revenueByMonth.find(r => r._id.month === m && r._id.year === y && r._id.type === 'BUSINESS')

    revenueMonthly.push({
      name: monthName,
      residential: estateRev ? Math.round(estateRev.total / 100) : 0,
      business: businessRev ? Math.round(businessRev.total / 100) : 0,
    })
  }

  // --- User Growth ---
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ])

  const userGrowthMonthly: any[] = []
  let running = await User.countDocuments({ createdAt: { $lt: sixMonthsAgo } })
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    const found = userGrowth.find(r => r._id.month === m && r._id.year === y)
    running += found ? found.count : 0
    userGrowthMonthly.push({ name: monthNames[d.getMonth()], users: running })
  }

  // User distribution by accountType
  const userTypes = await User.aggregate([
    { $group: { _id: '$accountType', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } },
  ])

  // --- Collection Analytics ---
  const collectionByWeek = await (async () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

    const scheduleData = await CollectionLog.aggregate([
      { $match: { createdAt: { $gte: fourWeeksAgo } } },
      {
        $group: {
          _id: { day: { $dayOfWeek: '$createdAt' }, status: '$status' },
          count: { $sum: 1 },
        },
      },
    ])

    return days.map((day, idx) => {
      const completed = scheduleData.find((d: any) => d._id.day === idx + 1 && d._id.status === 'COMPLETED')
      const missed = scheduleData.find((d: any) => d._id.day === idx + 1 && d._id.status === 'MISSED')
      return { name: day, completed: completed?.count || 0, missed: missed?.count || 0 }
    })
  })()

  // Zone efficiency from existing zone-stats
  const zoneStats = await Zone.aggregate([
    { $match: { status: 'ACTIVE' } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'zoneId',
        as: 'users',
      },
    },
    {
      $project: {
        name: 1,
        efficiency: { $min: [100, { $multiply: [{ $size: '$users' }, 5] }] },
        volume: { $multiply: [{ $size: '$users' }, 0.05] },
      },
    },
    { $limit: 6 },
  ])

  // --- Analytics endpoint response ---
  return ApiResponse.success(res, {
    revenue: {
      monthly: revenueMonthly,
      byPlan: revenueByPlan.length > 0
        ? revenueByPlan
        : [
            { name: 'Estate Basic', value: 450000 },
            { name: 'Business Starter', value: 320000 },
            { name: 'Business Growth', value: 280000 },
            { name: 'Other', value: 150000 },
          ],
    },
    users: {
      growth: userGrowthMonthly,
      types: userTypes.length > 0 ? userTypes : [
        { name: 'ESTATE', value: 1 },
        { name: 'BUSINESS', value: 1 },
      ],
    },
    collections: {
      weekly: collectionByWeek,
      byZone: zoneStats.map((z: any) => ({ name: z.name, efficiency: z.efficiency })),
    },
    zones: {
      performance: zoneStats.map((z: any) => ({ name: z.name, volume: parseFloat(z.volume.toFixed(2)) })),
    },
  })
})

/**
 * System Activity Feed
 */
export const getActivity = catchAsync(async (_req: Request, res: Response) => {
  const [users, payments, complaints] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).lean(),
    Payment.find().populate('userId', 'firstName lastName').sort({ createdAt: -1 }).limit(5).lean(),
    Complaint.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  const activities = [
    ...users.map((u: any) => ({
      id: u._id.toString(),
      type: 'Registration',
      description: `New ${u.accountType?.toLowerCase() || 'user'} '${u.firstName} ${u.lastName}' registered`,
      date: u.createdAt,
    })),
    ...payments.map((p: any) => ({
      id: p._id.toString(),
      type: 'Payment',
      description:
        p.status === 'SUCCESS'
          ? `Payment of ₦${((p.amount || 0) / 100).toLocaleString()} received from ${p.userId?.firstName || 'Unknown'} ${p.userId?.lastName || ''}`
          : `Failed payment of ₦${((p.amount || 0) / 100).toLocaleString()} from ${p.userId?.firstName || 'Unknown'}`,
      date: p.createdAt,
    })),
    ...complaints.map((c: any) => ({
      id: c._id.toString(),
      type: 'Complaint',
      description: `New complaint: ${c.subject}`,
      date: c.createdAt,
    })),
  ]

  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return ApiResponse.success(res, activities.slice(0, 10))
})

/**
 * Get all registrations/entities awaiting verification
 */
export const getVerificationQueue = catchAsync(async (_req: Request, res: Response) => {
  const [estates, businesses, collectors] = await Promise.all([
    Estate.find().populate('managerId').lean(),
    Business.find().populate('ownerId').lean(),
    Collector.find().lean(),
  ])

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending'
      case 'ACTIVE':
        return 'Approved'
      case 'SUSPENDED':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  const queue: any[] = []

  // Map Estates
  estates.forEach((est: any) => {
    queue.push({
      id: `EST-${est._id.toString().substring(18)}`,
      realId: est._id.toString(),
      applicantName: est.name,
      entityType: 'Estate',
      contactEmail: est.managerEmail || (est.managerId as any)?.email || 'manager@estate.com',
      contactPhone: est.managerPhone || (est.managerId as any)?.phone || '08000000000',
      submissionDate: est.createdAt || new Date(),
      status: mapStatus(est.status),
      notes: est.notes || '',
      documents: [
        {
          id: `DOC-EST-CAC-${est._id}`,
          name: 'Estate_Registration_Certificate.pdf',
          type: 'PDF Document',
          size: '2.4 MB',
          status: est.status === 'ACTIVE' ? 'Verified' : 'Pending',
          url: '#',
        },
        {
          id: `DOC-EST-UTIL-${est._id}`,
          name: 'Utility_Bill_Proof_Of_Address.jpg',
          type: 'Image',
          size: '1.1 MB',
          status: est.status === 'ACTIVE' ? 'Verified' : 'Pending',
          url: '#',
        },
      ],
    })
  })

  // Map Businesses
  businesses.forEach((bus: any) => {
    queue.push({
      id: `BUS-${bus._id.toString().substring(18)}`,
      realId: bus._id.toString(),
      applicantName: bus.name,
      entityType: 'Business',
      contactEmail: bus.contactPerson?.email || (bus.ownerId as any)?.email || 'facilities@business.com',
      contactPhone: bus.contactPerson?.phone || (bus.ownerId as any)?.phone || '08100000000',
      submissionDate: bus.createdAt || new Date(),
      status: mapStatus(bus.status),
      notes: bus.notes || '',
      documents: bus.documents?.map((doc: any, idx: number) => ({
        id: doc._id?.toString() || `DOC-BUS-${idx}-${bus._id}`,
        name: `${doc.type || 'CAC'}_Incorporation_Document.pdf`,
        type: 'PDF Document',
        size: '3.1 MB',
        status: bus.status === 'ACTIVE' ? 'Verified' : 'Pending',
        url: doc.url || '#',
      })) || [
        {
          id: `DOC-BUS-CAC-${bus._id}`,
          name: 'CAC_Incorporation_Document.pdf',
          type: 'PDF Document',
          size: '3.1 MB',
          status: bus.status === 'ACTIVE' ? 'Verified' : 'Pending',
          url: '#',
        },
      ],
    })
  })

  // Map Collectors
  collectors.forEach((col: any) => {
    queue.push({
      id: `COL-${col._id.toString().substring(18)}`,
      realId: col._id.toString(),
      applicantName: `${col.firstName} ${col.lastName}`,
      entityType: 'Collector',
      contactEmail: col.email || 'collector@cleannigeria.org',
      contactPhone: col.phone || '07000000000',
      submissionDate: col.createdAt || new Date(),
      status: mapStatus(col.status),
      notes: col.notes || '',
      documents: col.documents?.map((doc: any, idx: number) => ({
        id: doc._id?.toString() || `DOC-COL-${idx}-${col._id}`,
        name: `${doc.type || 'ID_CARD'}_Verification.pdf`,
        type: 'PDF Document',
        size: '1.8 MB',
        status: col.status === 'ACTIVE' ? 'Verified' : 'Pending',
        url: doc.url || '#',
      })) || [
        {
          id: `DOC-COL-ID-${col._id}`,
          name: 'Government_Issued_ID.pdf',
          type: 'PDF Document',
          size: '1.8 MB',
          status: col.status === 'ACTIVE' ? 'Verified' : 'Pending',
          url: '#',
        },
      ],
    })
  })

  return ApiResponse.success(res, queue)
})

/**
 * Approve, Reject, or Request resubmission for an application
 */
export const updateVerificationStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, notes } = req.body // status: 'Approved' | 'Rejected' | 'Needs Info'

  const mapToAccountStatus = (s: string) => {
    if (s === 'Approved') return 'ACTIVE'
    if (s === 'Rejected') return 'SUSPENDED'
    return 'PENDING'
  }

  const accountStatus = mapToAccountStatus(status)

  if (id.startsWith('EST-')) {
    // Find estate. We extracted the last 6 chars, let's use search by regex or exact match since we have realId
    const estates = await Estate.find()
    const target = estates.find(e => `EST-${e._id.toString().substring(18)}` === id)
    if (!target) return ApiResponse.error(res, 'Estate registration not found', 404)
    target.status = accountStatus
    target.notes = notes
    await target.save()
    return ApiResponse.success(res, target, `Estate registration ${status.toLowerCase()} successfully`)
  }

  if (id.startsWith('BUS-')) {
    const businesses = await Business.find()
    const target = businesses.find(b => `BUS-${b._id.toString().substring(18)}` === id)
    if (!target) return ApiResponse.error(res, 'Business registration not found', 404)
    target.status = accountStatus
    target.notes = notes
    await target.save()
    return ApiResponse.success(res, target, `Business registration ${status.toLowerCase()} successfully`)
  }

  if (id.startsWith('COL-')) {
    const collectors = await Collector.find()
    const target = collectors.find(c => `COL-${c._id.toString().substring(18)}` === id)
    if (!target) return ApiResponse.error(res, 'Collector registration not found', 404)
    target.status = status === 'Approved' ? 'ACTIVE' : 'INACTIVE'
    await target.save()
    return ApiResponse.success(res, target, `Collector registration ${status.toLowerCase()} successfully`)
  }

  return ApiResponse.error(res, 'Invalid registration request ID prefix', 400)
})

/**
 * Get all administrators
 */
export const getAllAdmins = catchAsync(async (_req: Request, res: Response) => {
  const admins = await AdminUser.find().sort({ createdAt: -1 })
  return ApiResponse.success(res, admins)
})

/**
 * Create a new administrator
 */
export const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, role, password } = req.body

  const existing = await AdminUser.findOne({ email })
  if (existing) {
    return ApiResponse.error(res, 'An administrator with this email already exists', 400)
  }

  // Use provided password or generate a standard one
  const plainPassword = password || 'CleanNigeria2026!'
  const hashedPassword = await hashPassword(plainPassword)

  const newAdmin = await AdminUser.create({
    firstName,
    lastName,
    email,
    role,
    password: hashedPassword,
    isActive: true,
    isSuspended: false,
    twoFactorEnabled: false
  })

  // Exclude password from response
  const responseData = newAdmin.toObject()
  delete responseData.password

  return ApiResponse.success(res, responseData, 'Administrator created successfully', 201)
})

/**
 * Update administrator status or role
 */
export const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { firstName, lastName, role, isActive, isSuspended, password } = req.body

  const admin = await AdminUser.findById(id)
  if (!admin) {
    return ApiResponse.error(res, 'Administrator not found', 404)
  }

  if (firstName !== undefined) admin.firstName = firstName
  if (lastName !== undefined) admin.lastName = lastName
  if (role !== undefined) admin.role = role
  if (isActive !== undefined) admin.isActive = isActive
  if (isSuspended !== undefined) admin.isSuspended = isSuspended

  if (password) {
    admin.password = await hashPassword(password)
  }

  await admin.save()
  return ApiResponse.success(res, admin, 'Administrator updated successfully')
})

/**
 * Delete an administrator
 */
export const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  // Prevent self-deletion if current admin context is passed
  const currentAdminId = (req as any).admin?.id
  if (currentAdminId && currentAdminId === id) {
    return ApiResponse.error(res, 'You cannot delete your own administrative account', 400)
  }

  const admin = await AdminUser.findById(id)
  if (!admin) {
    return ApiResponse.error(res, 'Administrator not found', 404)
  }

  if (admin.role === 'SUPER_ADMIN') {
    return ApiResponse.error(res, 'Deletion restricted for core super administration accounts', 403)
  }

  await admin.deleteOne()
  return ApiResponse.success(res, null, 'Administrator deleted successfully')
})

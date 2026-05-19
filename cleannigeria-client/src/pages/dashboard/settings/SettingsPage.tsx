import { Helmet } from 'react-helmet-async'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Building2, 
  Trash2, 
  Camera, 
  Mail, 
  Phone, 
  Lock, 
  Smartphone,
  CreditCard as CardIcon,
  Plus,
  AlertTriangle,
  LogOut,
  MapPin,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { useState } from 'react'
import { userService } from '@/services/user.service'
import { useSecurity } from '@/hooks/useSecurity'
import { useBilling } from '@/hooks/useBilling'

const settingsTabs = [
  { label: 'Profile', icon: User, href: ROUTES.SETTINGS_PROFILE },
  { label: 'Security', icon: Shield, href: ROUTES.SETTINGS_SECURITY },
  { label: 'Notifications', icon: Bell, href: ROUTES.SETTINGS_NOTIFICATIONS },
  { label: 'Billing', icon: CreditCard, href: ROUTES.SETTINGS_BILLING },
  { label: 'Estate / Business', icon: Building2, href: ROUTES.SETTINGS_ESTATE },
  { label: 'Delete Account', icon: Trash2, href: ROUTES.SETTINGS_DELETE },
]

// --- Sub-components ---

function ProfileSettings() {
  const { user } = useAuthStore()
  const [isUpdating, setIsUpdating] = useState(false)
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const fullName = (document.getElementById('fullName') as HTMLInputElement).value
      const phone = (document.getElementById('phone') as HTMLInputElement).value
      
      const updatedUser = await userService.updateProfile({ fullName, phone })
      useAuthStore.getState().setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await userService.updateAvatar(file)
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser, avatar: result })
      }
      toast.success('Avatar updated successfully')
    } catch (error) {
      console.error('Failed to update avatar:', error)
      toast.error('Failed to update avatar')
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your public profile and account information.</p>
      </div>
      <Separator />
      
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <img 
              src={user?.avatar?.url || 'https://via.placeholder.com/150'} 
              alt={user?.fullName || 'User'} 
              className="h-24 w-24 rounded-full border-2 border-slate-100 object-cover shadow-sm transition-opacity group-hover:opacity-75"
            />
            <button 
              onClick={() => document.getElementById('avatar-input')?.click()}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input 
              id="avatar-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs font-bold"
                onClick={() => document.getElementById('avatar-input')?.click()}
              >
                Change Avatar
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
            </div>
            <p className="text-[10px] text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="grid gap-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={user?.fullName} className="bg-slate-50/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user?.email} disabled className="bg-slate-100/50 cursor-not-allowed" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={user?.phone} className="bg-slate-50/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Input id="language" defaultValue="English (Nigeria)" className="bg-slate-50/50" />
            </div>
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={isUpdating} className="bg-brand-600 hover:bg-brand-700 text-white px-8 font-bold shadow-brand-sm">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { sessions, isLoadingSessions, revokeSession, isRevoking } = useSecurity()
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const currentPassword = (document.getElementById('current') as HTMLInputElement).value
      const newPassword = (document.getElementById('new') as HTMLInputElement).value
      const confirmPassword = (document.getElementById('confirm') as HTMLInputElement).value

      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      await authService.changePassword({ oldPassword: currentPassword, newPassword })
      toast.success('Password changed successfully')
      
      // Clear inputs
      (document.getElementById('current') as HTMLInputElement).value = '';
      (document.getElementById('new') as HTMLInputElement).value = '';
      (document.getElementById('confirm') as HTMLInputElement).value = '';
    } catch (error) {
      console.error('Failed to change password:', error)
      toast.error('Failed to change password')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Security</h2>
        <p className="text-sm text-muted-foreground">Manage your account security and active sessions.</p>
      </div>
      <Separator />

      <div className="grid gap-8 max-w-2xl">
        {/* Password Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Change Password</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" placeholder="••••••••" className="bg-slate-50/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" placeholder="••••••••" className="bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" className="bg-slate-50/50" />
              </div>
            </div>
            <Button type="submit" disabled={isUpdating} className="bg-brand-600 hover:bg-brand-700 text-white font-bold h-9">
              Update Password
            </Button>
          </form>
        </div>

        <Separator />

        {/* 2FA Section */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <Switch />
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Active Sessions</h3>
          <div className="space-y-3">
            {isLoadingSessions ? (
              <p className="text-sm text-muted-foreground">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active sessions.</p>
            ) : (
              sessions.map((session, i) => (
                <div key={session._id} className={cn("flex items-center justify-between p-3 rounded-lg border", session.isActive && i === 0 ? "border-brand-100 bg-brand-50/30" : "border-slate-100")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", session.isActive && i === 0 ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-500")}>
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{session.device}</p>
                      <p className="text-[10px] text-muted-foreground">{session.location} · {new Date(session.lastActiveAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {session.isActive && i === 0 ? (
                    <Badge variant="outline" className="text-[10px] border-brand-200 text-brand-600 bg-white">Current Session</Badge>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => revokeSession(session._id)} disabled={isRevoking} className="h-8 text-xs text-destructive hover:bg-destructive/10">Log Out</Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">Control when and how you receive alerts from CleanNigeria.</p>
      </div>
      <Separator />

      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Delivery Channels</h3>
          <div className="space-y-1">
            {[
              { title: 'Email Notifications', desc: 'Critical alerts, weekly reports, and news.', icon: Mail },
              { title: 'Push Notifications', desc: 'Real-time updates on your phone.', icon: Smartphone },
              { title: 'SMS Notifications', desc: 'Collection reminders and receipts via text.', icon: MessageSquare },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Alert Preferences</h3>
          <div className="grid gap-4">
            {[
              'Pickup scheduled/assigned',
              'Pickup completed',
              'Payment received',
              'Subscription renewals',
              'Support responses',
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between">
                <Label htmlFor={`alert-${i}`} className="text-sm font-medium">{alert}</Label>
                <Switch id={`alert-${i}`} defaultChecked />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BillingSettings() {
  const { user } = useAuthStore()
  const { cards, isLoadingCards, removeCard, isRemovingCard } = useBilling()
  return (
    <div className="space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Billing & Payments</h2>
        <p className="text-sm text-muted-foreground">Manage your payment methods and billing information.</p>
      </div>
      <Separator />

      <div className="grid gap-8 max-w-2xl">
        {/* Payment Methods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Saved Cards</h3>
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-brand-600 hover:text-brand-700">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Card
            </Button>
          </div>
          <div className="space-y-3">
            {isLoadingCards ? (
              <p className="text-sm text-muted-foreground">Loading cards...</p>
            ) : cards.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <CardIcon className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-900">No saved cards</p>
                <p className="text-xs text-muted-foreground mt-1">Add a payment method to ensure uninterrupted service.</p>
              </div>
            ) : (
              cards.map((card, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                      <CardIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{card.cardType || 'Card'} •••• {card.last4}</p>
                        {card.isDefault && <Badge variant="secondary" className="text-[10px] bg-brand-50 text-brand-700 border-none font-bold">DEFAULT</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Expires {card.expMonth}/{card.expYear}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeCard(card.last4)} disabled={isRemovingCard} className="h-8 text-xs text-slate-400 hover:text-destructive">Remove</Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Billing Address</h3>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
            <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {(user as any)?.estateId?.name || "No Estate Assigned"}, Unit {user?.unitId || "N/A"}<br />
              {user?.address?.street || "N/A"}, {user?.address?.lga || "N/A"}, {user?.address?.state || "N/A"}
            </p>
            <Button variant="link" className="p-0 h-auto text-xs text-brand-600 font-bold hover:no-underline">Edit Address</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EstateSettings() {
  const { user } = useAuthStore()
  return (
    <div className="space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Estate / Business</h2>
        <p className="text-sm text-muted-foreground">Update your service location and property details.</p>
      </div>
      <Separator />

      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estate">Estate Name</Label>
              <Input id="estate" defaultValue={(user as any)?.estateId?.name || "No Estate Assigned"} className="bg-slate-50/50" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit / House Number</Label>
              <Input id="unit" defaultValue={user?.unitId || "N/A"} className="bg-slate-50/50" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street Name</Label>
            <Input id="street" defaultValue={user?.address?.street || "N/A"} className="bg-slate-50/50" disabled />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City / LGA</Label>
              <Input id="city" defaultValue={user?.address?.lga || "N/A"} className="bg-slate-50/50" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" defaultValue={user?.address?.state || "N/A"} className="bg-slate-50/50" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapLink" className="flex items-center gap-2">
              Google Maps Link
              <span className="text-[10px] font-normal text-muted-foreground">(Optional for precision)</span>
            </Label>
            <Input 
              id="mapLink" 
              placeholder="https://maps.app.goo.gl/..." 
              className="bg-slate-50/50 font-mono text-xs" 
            />
          </div>
        </div>

        <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 flex gap-3">
          <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
          <p className="text-xs text-brand-800 leading-relaxed">
            Changing your estate or city may affect your collection schedule and plan pricing. Our team will review the change before it takes effect.
          </p>
        </div>

        <Button className="bg-brand-600 hover:bg-brand-700 text-white font-bold h-10 w-fit px-8">
          Update Location
        </Button>
      </div>
    </div>
  )
}

function DeleteAccount() {
  const [confirmText, setConfirmText] = useState('')
  
  return (
    <div className="space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-destructive">Delete Account</h2>
        <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data.</p>
      </div>
      <Separator />

      <div className="max-w-2xl space-y-6">
        <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-bold">This is a permanent action</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you delete your account, you will lose access to all your collection history, receipts, and subscription benefits. Active subscriptions will be cancelled without refund.
          </p>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="confirm" className="text-xs font-bold uppercase tracking-widest text-slate-500">Type "DELETE" to confirm</Label>
            <Input 
              id="confirm" 
              placeholder="DELETE" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-white border-destructive/20 focus-visible:ring-destructive"
            />
          </div>

          <Button 
            variant="destructive" 
            disabled={confirmText !== 'DELETE'} 
            className="w-full font-bold h-11 shadow-lg shadow-destructive/20"
          >
            Permanently Delete My Account
          </Button>
        </div>
      </div>
    </div>
  )
}

// --- Icons / Missing ---
const MessageSquare = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
)

export default function SettingsPage() {
  return (
    <>
      <Helmet><title>Settings | CleanNigeria</title></Helmet>
      
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your account and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <Card className="lg:w-64 h-fit border-slate-200 shadow-sm shrink-0">
            <CardContent className="p-2">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                {settingsTabs.map((tab) => (
                  <NavLink
                    key={tab.href}
                    to={tab.href}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap',
                      isActive 
                        ? 'bg-brand-600 text-white shadow-brand-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                      tab.href === ROUTES.SETTINGS_DELETE && !isActive && 'text-destructive hover:bg-destructive/5'
                    )}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </NavLink>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Content Area */}
          <Card className="flex-1 border-slate-200 shadow-sm min-h-[600px] overflow-hidden">
            <CardContent className="p-8">
              <Routes>
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="notifications" element={<NotificationSettings />} />
                <Route path="billing" element={<BillingSettings />} />
                <Route path="estate" element={<EstateSettings />} />
                <Route path="delete-account" element={<DeleteAccount />} />
                <Route index element={<ProfileSettings />} />
              </Routes>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}


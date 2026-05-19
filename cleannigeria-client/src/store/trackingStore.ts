import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface CollectorLocation {
  lat: number
  lng: number
  heading?: number
  updatedAt: string
}

interface TrackingState {
  isTracking: boolean
  collectorLocation: CollectorLocation | null
  status: 'idle' | 'assigned' | 'on_the_way' | 'nearby' | 'arrived' | 'completed'
  eta?: string
  stopsAway?: number
}

interface TrackingActions {
  startTracking: () => void
  stopTracking: () => void
  updateCollectorLocation: (location: CollectorLocation) => void
  setStatus: (status: TrackingState['status']) => void
  setEta: (eta: string, stopsAway: number) => void
}

export const useTrackingStore = create<TrackingState & TrackingActions>()(
  immer((set) => ({
    isTracking: false,
    collectorLocation: null,
    status: 'idle',
    eta: undefined,
    stopsAway: undefined,

    startTracking: () => set((s) => { s.isTracking = true }),
    stopTracking: () => set((s) => {
      s.isTracking = false
      s.collectorLocation = null
      s.status = 'idle'
    }),
    updateCollectorLocation: (location) => set((s) => { s.collectorLocation = location }),
    setStatus: (status) => set((s) => { s.status = status }),
    setEta: (eta, stopsAway) => set((s) => { s.eta = eta; s.stopsAway = stopsAway }),
  }))
)

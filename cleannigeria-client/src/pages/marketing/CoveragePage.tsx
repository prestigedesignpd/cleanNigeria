import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Search, 
  Globe,
  Sparkles,
  ChevronDown,
  Building,
  Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { Badge } from '@/components/ui/badge'

interface CoverageLga {
  name: string
  status: 'Active' | 'Expanding' | 'Coming Soon'
  neighborhoods: string[]
}

interface CoverageState {
  name: string
  status: 'Active' | 'Expanding' | 'Coming Soon'
  lgas: CoverageLga[]
}

const CITIES: CoverageState[] = [
  {
    name: 'Abuja (FCT)',
    status: 'Active',
    lgas: [
      {
        name: 'Abuja Municipal Area Council (AMAC)',
        status: 'Active',
        neighborhoods: [
          'Gwarimpa (1st Avenue, 3rd Avenue, 5th Avenue, Federal Housing)',
          'Wuse II (Aminu Kano Crescent, Adetokunbo Ademola, Wuse Zone 5)',
          'Maitama (Maitama Main, Gana Street, Nile Street)',
          'Garki (Area 1, Area 11, Garki Phase II)',
          'Asokoro (Asokoro Main, Julius Nyerere)'
        ]
      },
      {
        name: 'Bwari Area Council',
        status: 'Expanding',
        neighborhoods: [
          'Kubwa (Phase 4, Federal Housing Estate, Gado Nasko)',
          'Dutse Alhaji (Main Street, Dutse Sagwari)'
        ]
      }
    ]
  },
  {
    name: 'Lagos State',
    status: 'Active',
    lgas: [
      {
        name: 'Eti-Osa LGA',
        status: 'Active',
        neighborhoods: [
          'Lekki Phase 1 (Admiralty Way, Fola Osibo, Block 12)',
          'Ikoyi (Banana Island, Bourdillon Road, Alexander Avenue)',
          'Victoria Island (Adetokunbo Ademola, Ajose Adeogun)'
        ]
      },
      {
        name: 'Ikeja LGA',
        status: 'Active',
        neighborhoods: [
          'GRA Ikeja (Joel Ogunnaike, Isaac John Street)',
          'Allen Avenue (Allen Main, Olowu Street)',
          'Opebi (Opebi Link Road, Salvation)'
        ]
      },
      {
        name: 'Alimosho LGA',
        status: 'Expanding',
        neighborhoods: [
          'Egbeda (Egbeda Bus Stop, Akowonjo)',
          'Gowon Estate (Federal Housing)',
          'Ipaja (Ipaja Main, Ayobo Road)'
        ]
      }
    ]
  },
  {
    name: 'Rivers State (Port Harcourt)',
    status: 'Active',
    lgas: [
      {
        name: 'Port Harcourt City LGA',
        status: 'Active',
        neighborhoods: [
          'Old GRA (Phase 1, Phase 2)',
          'Diobu (Mile 1, Mile 2, Mile 3)',
          'Township (Harbour Road, Creek Road)'
        ]
      },
      {
        name: 'Obio-Akpor LGA',
        status: 'Active',
        neighborhoods: [
          'Rumuokoro (Rumuokoro Junction, Federal Housing)',
          'Rumuola (Rumuola Road, Stadium Link)',
          'Eliozu (Eliozu Flyover, East-West Road)'
        ]
      }
    ]
  },
  {
    name: 'Oyo State (Ibadan)',
    status: 'Active',
    lgas: [
      {
        name: 'Ibadan North LGA',
        status: 'Active',
        neighborhoods: [
          'Bodija Estate (Aare Avenue, Favours, Bodija Market)',
          'Samonda (Samonda Main, Airport Road)',
          'Agodi GRA (Agodi Main, State Secretariat)'
        ]
      }
    ]
  },
  {
    name: 'Enugu State',
    status: 'Expanding',
    lgas: [
      {
        name: 'Enugu North LGA',
        status: 'Expanding',
        neighborhoods: [
          'Independence Layout (Government House Area)',
          'New Haven (Chime Avenue, New Haven Extension)',
          'Achara Layout'
        ]
      }
    ]
  },
  {
    name: 'Benin City (Edo)',
    status: 'Coming Soon',
    lgas: [
      {
        name: 'Oredo LGA',
        status: 'Coming Soon',
        neighborhoods: [
          'GRA Benin (Boundary Road, Ihama Road)',
          'Airport Road Area'
        ]
      }
    ]
  }
]

export default function CoveragePage() {
  const [search, setSearch] = useState('')
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({})
  const [expandedLgas, setExpandedLgas] = useState<Record<string, boolean>>({})

  const isSearching = search.trim().length > 0

  // Filter States, LGAs, and Neighborhoods
  const filteredStates = CITIES.map(state => {
    const stateMatches = state.name.toLowerCase().includes(search.toLowerCase())

    const filteredLgas = state.lgas.map(lga => {
      const lgaMatches = lga.name.toLowerCase().includes(search.toLowerCase())
      
      const filteredNeighborhoods = lga.neighborhoods.filter(nh => 
        nh.toLowerCase().includes(search.toLowerCase())
      )

      if (lgaMatches || filteredNeighborhoods.length > 0 || stateMatches) {
        return {
          ...lga,
          neighborhoods: (lgaMatches || stateMatches) ? lga.neighborhoods : filteredNeighborhoods
        }
      }
      return null;
    }).filter(Boolean) as CoverageLga[]

    if (stateMatches || filteredLgas.length > 0) {
      return {
        ...state,
        lgas: filteredLgas
      }
    }
    return null;
  }).filter(Boolean) as CoverageState[]

  // Auto-expand all sections when search matches
  useEffect(() => {
    if (isSearching) {
      const statesUpdate: Record<string, boolean> = {}
      const lgasUpdate: Record<string, boolean> = {}
      filteredStates.forEach(state => {
        statesUpdate[state.name] = true
        state.lgas.forEach(lga => {
          lgasUpdate[lga.name] = true
        })
      })
      setExpandedStates(statesUpdate)
      setExpandedLgas(lgasUpdate)
    }
  }, [search])

  const toggleState = (name: string) => {
    setExpandedStates(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleLga = (name: string) => {
    setExpandedLgas(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <>
      <Helmet><title>Service Coverage | CleanNigeria</title></Helmet>
      
      <div className="min-h-screen bg-slate-50/50 py-16 md:py-24">
        <div className="max-w-[800px] mx-auto px-4 space-y-12 animate-in fade-in duration-500">
          
          {/* Minimal Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest">
              <Globe className="h-3.5 w-3.5" />
              Coverage Network
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Where We Clean
            </h1>
            <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">
              Browse coverage down to local governments and specific neighborhoods. Click any state or area to expand details.
            </p>
          </div>

          {/* Premium Search Box */}
          <div className="relative max-w-xl mx-auto shadow-xl shadow-slate-100/80 rounded-2xl bg-white border border-slate-200 p-2 flex items-center gap-2">
            <div className="pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input 
              type="text"
              placeholder="Search state, LGA, or street (e.g. AMAC, Admiralty)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 text-base font-semibold py-6 w-full"
            />
            {search && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-900 rounded-lg px-2"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Minimalist Dropdown List View */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/30 overflow-hidden">
            <div className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredStates.map((state) => {
                  const stateOpen = !!expandedStates[state.name]
                  
                  return (
                    <div key={state.name} className="overflow-hidden">
                      {/* State Header Row */}
                      <button 
                        onClick={() => toggleState(state.name)}
                        className="w-full p-5 md:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 shadow-sm shrink-0">
                            <MapPin className="h-5.5 w-5.5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight">{state.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                              {state.lgas.length} Area Councils / LGAs
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                              state.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              state.status === 'Expanding' ? "bg-blue-50 text-blue-700 border-blue-100" :
                              "bg-slate-100 text-slate-500 border-slate-200"
                            )}
                          >
                            {state.status}
                          </Badge>
                          <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-300", stateOpen && "rotate-185")} />
                        </div>
                      </button>

                      {/* State Expandable Content (LGAs Sub-List) */}
                      <AnimatePresence>
                        {stateOpen && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-slate-50/20 border-t border-slate-50"
                          >
                            <div className="p-4 md:p-6 space-y-4 pl-8 md:pl-12 border-l-2 border-brand-200">
                              {state.lgas.map((lga) => {
                                const lgaOpen = !!expandedLgas[lga.name]

                                return (
                                  <div key={lga.name} className="border border-slate-200/50 bg-white rounded-xl overflow-hidden shadow-sm">
                                    {/* LGA Header Row */}
                                    <button 
                                      onClick={() => toggleLga(lga.name)}
                                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/30 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Building className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                                        <div>
                                          <h4 className="text-sm font-bold text-slate-850 leading-tight">{lga.name}</h4>
                                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{lga.neighborhoods.length} Zones</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <Badge 
                                          variant="secondary" 
                                          className={cn(
                                            "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
                                            lga.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                                          )}
                                        >
                                          {lga.status}
                                        </Badge>
                                        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", lgaOpen && "rotate-185")} />
                                      </div>
                                    </button>

                                    {/* LGA Expandable Content (Neighborhoods/Streets) */}
                                    <AnimatePresence>
                                      {lgaOpen && (
                                        <motion.div
                                          initial={{ height: 0 }}
                                          animate={{ height: 'auto' }}
                                          exit={{ height: 0 }}
                                          className="overflow-hidden bg-slate-50/40 border-t border-slate-100"
                                        >
                                          <div className="p-4 space-y-2.5 pl-9">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Covered Areas & Streets</span>
                                            <div className="grid grid-cols-1 gap-2">
                                              {lga.neighborhoods.map((nh, i) => (
                                                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-650 font-medium">
                                                  <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                                  <span>{nh}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}

                {filteredStates.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center text-slate-400 space-y-3"
                  >
                    <Navigation className="h-10 w-10 mx-auto text-slate-300" />
                    <p className="text-base font-bold text-slate-950">No service areas found</p>
                    <p className="text-sm max-w-xs mx-auto">We couldn't find any coverage details matching "{search}". Try searching for another city.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Simple CTA footer */}
          <div className="border border-slate-200 bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="text-lg font-black text-slate-900 flex items-center justify-center md:justify-start gap-2">
                Don't see your neighborhood?
                <Sparkles className="h-4.5 w-4.5 text-brand-600" />
              </h4>
              <p className="text-sm text-slate-500 font-medium">We prioritize expansion routes based on user requests and local interest.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto shrink-0">
              <Button size="lg" asChild className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700">
                <Link to={ROUTES.CONTACT}>Request Expansion</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1 md:flex-none h-12 px-6 rounded-xl border-slate-200 font-bold">
                <Link to={ROUTES.REGISTER}>Get Started</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

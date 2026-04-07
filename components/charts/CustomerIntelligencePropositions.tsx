'use client'

import { useState } from 'react'

type Row = Record<string, string | number>

const SAMPLE_CUSTOMERS = [
  'Ford Motor Company',
  'General Motors',
  'Stellantis North America',
  'American Axle & Mfg.',
  'Dana Incorporated',
  'BorgWarner Inc.',
  'Tesla Inc.',
  'Rivian Automotive',
  'PACCAR Inc.',
  'Navistar International',
  'Magna International',
  'Linamar Corporation',
]

const BUSINESS_OVERVIEW = [
  'Automotive OEM / Vehicle Manufacturer',
  'Tier-1 Component Supplier',
  'Tier-2 Component Supplier',
  'Fleet Operator / Logistics Company',
  'Aftermarket Parts Distributor',
  'Industrial / Off-highway Equipment Manufacturer',
]

const INDUSTRY_VERTICAL = [
  'Automotive (Passenger Vehicles)',
  'Commercial Vehicles & Logistics',
  'Electric Mobility / EV Ecosystem',
  'Off-highway / Construction & Mining',
  'Defense & Government Mobility',
  'Automotive Aftermarket',
]

const CUSTOMER_SIZE = [
  'Large enterprise (global OEM)',
  'Tier-1 supplier',
  'Mid-size regional manufacturer',
  'Small specialized manufacturer',
]

const KEY_BUYING_CRITERIA = [
  'Torque handling capability & durability',
  'Compatibility with AWD/4WD/EV architectures',
  'Efficiency & fuel economy optimization',
  'Lightweight design (aluminum/composite housings)',
  'Integration with ADAS & traction control',
  'NVH performance',
  'Compliance with emission & safety standards',
]

const KEY_PAIN_POINTS = [
  'High cost of advanced differentials (LSD, e-diff)',
  'Integration complexity with EV powertrains',
  'Supply chain disruptions (steel, semiconductors)',
  'Weight vs performance trade-offs',
  'Maintenance challenges in heavy-duty applications',
  'Thermal management in high-performance vehicles',
]

const TRIGGERS = [
  'Expansion of EV and hybrid vehicle portfolios',
  'Increased SUV / pickup / AWD production',
  'Adoption of torque-vectoring & smart differentials',
  'Electrification of commercial fleets',
  'Lightweight drivetrain innovation programs',
  'Autonomous & connected vehicle development',
]

const BUDGET_OWNERSHIP = [
  'CTO / VP Engineering',
  'Head of Powertrain / Drivetrain Engineering',
  'Procurement / Strategic Sourcing',
  'CFO',
  'Fleet Operations Head',
]

const PROCUREMENT_MODEL = [
  'Direct sourcing from Tier-1 suppliers',
  'Tier-1 integrator-led supply',
  'Long-term supply contracts with OEMs',
  'Joint development agreements',
]

const ENGAGEMENT_TYPE = [
  'Long-term supply agreement',
  'Co-development partnership',
  'Pilot programs for EV drivetrains',
  'Platform-based sourcing',
  'Aftermarket distribution partnership',
]

const SOLUTION_TYPE = [
  'Open differentials',
  'Limited-slip differentials',
  'Locking differentials',
  'Electronic / torque-vectoring differentials',
  'Integrated e-axles',
]

const DEPLOYMENT_MODEL = [
  'OEM factory integration',
  'Modular drivetrain platforms',
  'Hybrid mechanical + electronic control',
  'Retrofit / aftermarket installation',
]

const PERFORMANCE_EXPECT = [
  'High durability (>150k miles)',
  'High torque efficiency, minimal energy loss',
  'Low NVH levels',
  'Real-time performance monitoring',
  'Compatibility with EV architectures',
  'Lightweight high-strength materials',
]

const TITLES = [
  'VP Engineering',
  'Head of Powertrain',
  'Director of Procurement',
  'Chief Technology Officer',
  'Sourcing Manager',
  'Drivetrain Program Lead',
]

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

function buildRows(level: 'basic' | 'advance' | 'premium'): Row[] {
  return SAMPLE_CUSTOMERS.slice(0, 10).map((name, i) => {
    const base: Row = {
      'S.No.': i + 1,
      'Customer Name/Company Name': name,
      'Business Overview': pick(BUSINESS_OVERVIEW, i),
      'Industry Vertical': pick(INDUSTRY_VERTICAL, i + 1),
      'Total Annual Revenue (US$ Million)': (5000 + i * 8750).toLocaleString(),
      'Customer Size / Scale': pick(CUSTOMER_SIZE, i),
      'Key Contact Person': `Contact ${i + 1}`,
      'Designation/Role': pick(TITLES, i),
      'Email Address': `contact${i + 1}@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      'Phone/WhatsApp Number': `+1-555-01${(10 + i).toString().padStart(2, '0')}`,
      'LinkedIn Profile': `linkedin.com/company/${name.toLowerCase().replace(/[^a-z]/g, '-')}`,
      'Website URL': `www.${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    }
    if (level === 'basic') return base
    const advance: Row = {
      ...base,
      'Key Buying Criteria': pick(KEY_BUYING_CRITERIA, i),
      'Key Pain Points': pick(KEY_PAIN_POINTS, i),
      'Upcoming Triggers and Initiatives': pick(TRIGGERS, i),
    }
    if (level === 'advance') return advance
    return {
      ...advance,
      'Budget Ownership': pick(BUDGET_OWNERSHIP, i),
      'Procurement Model': pick(PROCUREMENT_MODEL, i),
      'Preferred Engagement Type': pick(ENGAGEMENT_TYPE, i),
      'Preferred Solution Type': pick(SOLUTION_TYPE, i),
      'Preferred Deployment Model': pick(DEPLOYMENT_MODEL, i),
      'Performance Expectations': pick(PERFORMANCE_EXPECT, i),
      'Customer Benchmarking Summary': `Strong fit — Tier ${(i % 3) + 1} potential`,
      'Additional Comments/Notes By CMI team': 'Active engagement opportunity',
    }
  })
}

const PROPOSITIONS = [
  {
    id: 'proposition-1' as const,
    label: 'Proposition 1 — Basic',
    color: 'from-blue-500 to-blue-600',
    rows: buildRows('basic'),
  },
  {
    id: 'proposition-2' as const,
    label: 'Proposition 2 — Advance',
    color: 'from-emerald-500 to-emerald-600',
    rows: buildRows('advance'),
  },
  {
    id: 'proposition-3' as const,
    label: 'Proposition 3 — Premium',
    color: 'from-purple-500 to-purple-600',
    rows: buildRows('premium'),
  },
]

interface Props {
  activeProposition?: 'proposition-1' | 'proposition-2' | 'proposition-3'
  showAll?: boolean
}

export function CustomerIntelligencePropositions({ activeProposition = 'proposition-1', showAll = false }: Props) {
  const [internalActive, setInternalActive] = useState(activeProposition)
  const current = PROPOSITIONS.find(p => p.id === internalActive) || PROPOSITIONS[0]

  if (showAll) {
    return (
      <div className="space-y-10">
        {PROPOSITIONS.map(p => (
          <PropositionTable key={p.id} title={p.label} color={p.color} rows={p.rows} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {PROPOSITIONS.map(p => {
          const selected = internalActive === p.id
          return (
            <button
              key={p.id}
              onClick={() => setInternalActive(p.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selected
                  ? `bg-gradient-to-r ${p.color} text-white shadow`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
      <PropositionTable title={current.label} color={current.color} rows={current.rows} />
    </div>
  )
}

// Column → group mapping (mirrors the xlsx framework)
const COLUMN_GROUPS: { name: string; bg: string; columns: string[] }[] = [
  {
    name: '',
    bg: 'bg-white',
    columns: ['S.No.'],
  },
  {
    name: 'Customer Information',
    bg: 'bg-orange-100',
    columns: [
      'Customer Name/Company Name',
      'Business Overview',
      'Industry Vertical',
      'Total Annual Revenue (US$ Million)',
      'Customer Size / Scale',
    ],
  },
  {
    name: 'Contact Details',
    bg: 'bg-sky-100',
    columns: [
      'Key Contact Person',
      'Designation/Role',
      'Email Address',
      'Phone/WhatsApp Number',
      'LinkedIn Profile',
      'Website URL',
    ],
  },
  {
    name: 'Professional Drivers',
    bg: 'bg-blue-100',
    columns: ['Key Buying Criteria', 'Key Pain Points', 'Upcoming Triggers and Initiatives'],
  },
  {
    name: 'Purchasing Behaviour Metrics',
    bg: 'bg-emerald-100',
    columns: ['Budget Ownership', 'Procurement Model', 'Preferred Engagement Type'],
  },
  {
    name: 'Solution Requirements',
    bg: 'bg-amber-100',
    columns: ['Preferred Solution Type', 'Preferred Deployment Model', 'Performance Expectations'],
  },
  {
    name: 'CMI Insights',
    bg: 'bg-purple-100',
    columns: ['Customer Benchmarking Summary', 'Additional Comments/Notes By CMI team'],
  },
]

function buildHeaderGroups(columns: string[]) {
  const groups: { name: string; bg: string; span: number }[] = []
  for (const g of COLUMN_GROUPS) {
    const span = g.columns.filter(c => columns.includes(c)).length
    if (span > 0) groups.push({ name: g.name, bg: g.bg, span })
  }
  return groups
}

function getColBg(col: string): string {
  for (const g of COLUMN_GROUPS) {
    if (g.columns.includes(col)) return g.bg
  }
  return 'bg-gray-50'
}

function PropositionTable({ title, color, rows }: { title: string; color: string; rows: Row[] }) {
  if (rows.length === 0) return null
  const columns = Object.keys(rows[0])
  const headerGroups = buildHeaderGroups(columns)
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className={`px-4 py-3 bg-gradient-to-r ${color}`}>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <p className="text-white/80 text-xs mt-0.5">
          North America Automotive Differential Market — Customer Database
        </p>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              {headerGroups.map((g, i) => (
                <th
                  key={i}
                  colSpan={g.span}
                  className={`px-3 py-2 text-center font-bold text-gray-800 border border-gray-300 ${g.bg}`}
                >
                  {g.name}
                </th>
              ))}
            </tr>
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className={`px-3 py-2 text-center font-semibold text-gray-800 border border-gray-300 align-top ${getColBg(col)}`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <div className="whitespace-normal leading-tight">{col}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map(col => (
                  <td
                    key={col}
                    className="px-3 py-2 text-gray-800 border border-gray-200 align-top"
                    style={{ minWidth: 140, maxWidth: 280 }}
                  >
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerIntelligencePropositions

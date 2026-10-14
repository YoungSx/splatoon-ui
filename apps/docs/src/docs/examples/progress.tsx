'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Progress,
  TurfWarProgress,
  TricolorProgress,
  type ProgressProps,
  type ProgressSize,
} from 'splatoon-ui/progress'

type ProgressExampleProps = {
  component: 'all' | 'turfWar' | 'tricolor' | 'progress'
  value: number
  variant: ProgressProps['variant']
  size: ProgressSize
  skewed: boolean
}

export function ProgressExample({
  component = 'all',
  value = 65,
  variant = 'yellow',
  size = 'default',
  skewed = true,
}: ProgressExampleProps) {
  const alphaVal = value
  const bravoVal = Math.max(0, 100 - value)
  const a1Val = Math.round(value * 0.4)
  const defVal = Math.round(value * 0.35)
  const a2Val = Math.max(0, 100 - a1Val - defVal)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8 py-2">
      {/* Turf War Dual-Faction Progress */}
      {(component === 'all' || component === 'turfWar') && (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-black/10 bg-black/5 p-4 dark:bg-white/5">
          <div className="text-muted-foreground flex items-center justify-between text-xs font-black tracking-wider">
            <span>TURF WAR CONFRONTATION (OFFICIAL REPLAY / WEIGH-IN)</span>
            <span className="font-mono">
              {alphaVal}% vs {bravoVal}%
            </span>
          </div>
          <TurfWarProgress
            alphaValue={alphaVal}
            bravoValue={bravoVal}
            alphaLabel="TEAM ALPHA"
            bravoLabel="TEAM BRAVO"
            alphaVariant={variant}
            bravoVariant="purple"
            size={size}
            skewed={skewed}
            showDanger={true}
          />
        </div>
      )}

      {/* Tricolor Splatfest 3-Way Progress */}
      {(component === 'all' || component === 'tricolor') && (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-black/10 bg-black/5 p-4 dark:bg-white/5">
          <div className="text-muted-foreground flex items-center justify-between text-xs font-black tracking-wider">
            <span>TRICOLOR SPLATFEST (3-WAY BATTLE REPLAY)</span>
            <span className="font-mono">
              {a1Val}% · {defVal}% · {a2Val}%
            </span>
          </div>
          <TricolorProgress
            attacker1Value={a1Val}
            defenderValue={defVal}
            attacker2Value={a2Val}
            attacker1Label="ATTACK 1"
            defenderLabel="DEFENSE"
            attacker2Label="ATTACK 2"
            attacker1Variant={variant}
            defenderVariant="blue"
            attacker2Variant="orange"
            size={size}
            skewed={skewed}
          />
        </div>
      )}

      {/* Classic Progress */}
      {(component === 'all' || component === 'progress') && (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-black/10 bg-black/5 p-4 dark:bg-white/5">
          <div className="text-muted-foreground flex items-center justify-between text-xs font-black tracking-wider">
            <span>CLASSIC SINGLE PROGRESS (SPLATTERED & SKEWED)</span>
            <span className="font-mono">{value}%</span>
          </div>
          <Progress value={value} variant={variant} size={size} skewed={skewed} splattered={true} />
        </div>
      )}
    </div>
  )
}
// docs-source-end

export const progressExample: DocsExampleDefinitionInput<ProgressExampleProps> = {
  id: 'progress',
  title: 'Progress',
  description:
    'Splatoon 3 Progress System: Turf War confrontation, Tricolor Splatfest, and single progress meter.',
  controls: [
    {
      type: 'select',
      prop: 'component',
      label: 'Component View',
      options: ['all', 'turfWar', 'tricolor', 'progress'],
      defaultValue: 'all',
    },
    {
      type: 'number',
      prop: 'value',
      label: 'Ink / Alpha Value',
      defaultValue: 65,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      type: 'select',
      prop: 'variant',
      label: 'Ink Color',
      options: ['yellow', 'blue', 'green', 'purple', 'orange', 'red'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['sm', 'default', 'lg'],
      defaultValue: 'default',
    },
    {
      type: 'boolean',
      prop: 'skewed',
      label: 'Skewed Angle (-12°)',
      defaultValue: true,
    },
  ],
  initialProps: {
    component: 'all',
    value: 65,
    variant: 'yellow',
    size: 'default',
    skewed: true,
  },
  Component: ProgressExample,
}

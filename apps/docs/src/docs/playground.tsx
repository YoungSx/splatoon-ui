'use client'

import * as React from 'react'
import { Copy, Monitor, RotateCcw, Smartphone, Tablet } from 'lucide-react'

import { docsExamples, getDocsExample } from './examples'
import type {
  DocsApiEntry,
  DocsExampleControl,
  DocsExampleControlValue,
  DocsPlayableExample,
  DocsExampleProps,
} from './types'

type PlaygroundProps = {
  apiEntry: DocsApiEntry | null
  exampleId?: string
}

type Viewport = 'mobile' | 'tablet' | 'desktop'
type Panel = 'preview' | 'code' | 'api'

const viewportClassName: Record<Viewport, string> = {
  mobile: 'max-w-[390px]',
  tablet: 'max-w-[720px]',
  desktop: 'max-w-4xl',
}

const viewportIcon = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
} satisfies Record<Viewport, React.ComponentType<{ className?: string }>>

export function DocsPlayground({ apiEntry, exampleId }: PlaygroundProps) {
  const example = getDocsExample(exampleId)

  if (!example) return null

  return <DocsPlaygroundContent key={example.id} apiEntry={apiEntry} example={example} />
}

function DocsPlaygroundContent({
  apiEntry,
  example,
}: {
  apiEntry: DocsApiEntry | null
  example: DocsPlayableExample
}) {
  const [panel, setPanel] = React.useState<Panel>('preview')
  const [viewport, setViewport] = React.useState<Viewport>('desktop')
  const [copied, setCopied] = React.useState(false)
  const [values, setValues] = React.useState<DocsExampleProps>(() => example.initialProps)

  async function copySource() {
    await navigator.clipboard?.writeText(example.source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div
      data-slot="docs-playground"
      className="border-chaos-black bg-white shadow-[5px_5px_0_var(--color-blue)]"
    >
      <div className="border-chaos-black flex flex-wrap items-center justify-between gap-3 border-b-3 p-3">
        <div className="flex rounded border-2 border-black bg-white">
          {(['preview', 'code', 'api'] as const).map((targetPanel) => (
            <button
              key={targetPanel}
              type="button"
              className={
                panel === targetPanel
                  ? 'bg-chaos-black font-alt px-4 py-2 text-lg font-black text-white'
                  : 'font-alt px-4 py-2 text-lg font-black text-black'
              }
              onClick={() => setPanel(targetPanel)}
            >
              {targetPanel}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(['mobile', 'tablet', 'desktop'] as const).map((targetViewport) => {
            const Icon = viewportIcon[targetViewport]
            return (
              <button
                key={targetViewport}
                type="button"
                aria-label={targetViewport}
                title={targetViewport}
                className={
                  viewport === targetViewport
                    ? 'bg-yellow border-chaos-black grid size-10 place-items-center border-2'
                    : 'border-chaos-black grid size-10 place-items-center border-2 bg-white'
                }
                onClick={() => setViewport(targetViewport)}
              >
                <Icon className="size-5" />
              </button>
            )
          })}
          <button
            type="button"
            aria-label="Reset"
            title="Reset"
            className="border-chaos-black grid size-10 place-items-center border-2 bg-white"
            onClick={() => setValues(example.initialProps)}
          >
            <RotateCcw className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Copy code"
            title="Copy code"
            className="border-chaos-black grid size-10 place-items-center border-2 bg-white"
            onClick={copySource}
          >
            <Copy className="size-5" />
          </button>
        </div>
      </div>

      {panel === 'preview' ? (
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="pattern-chip-white min-h-72 overflow-x-auto bg-white p-4">
            <div
              className={`mx-auto grid min-h-60 w-full place-items-center transition-[max-width] ${viewportClassName[viewport]}`}
            >
              {example.render(values)}
            </div>
          </div>
          <div className="grid content-start gap-3">
            <p className="font-alt text-2xl font-black">{example.title}</p>
            <p className="text-sm font-medium text-black/65">{example.description}</p>
            {example.controls.map((control) => (
              <ControlField
                key={control.prop}
                control={control}
                value={values[control.prop]}
                onChange={(value) =>
                  setValues((current) => ({ ...current, [control.prop]: value }))
                }
              />
            ))}
          </div>
        </div>
      ) : null}

      {panel === 'code' ? (
        <pre className="bg-chaos-black max-h-[34rem] overflow-auto p-5 text-sm leading-relaxed text-white">
          <code>{example.source}</code>
          {copied ? <span className="sr-only">Copied</span> : null}
        </pre>
      ) : null}

      {panel === 'api' ? (
        <div className="grid gap-3 p-4">
          {(apiEntry?.exports ?? []).map((apiExport) => (
            <div key={apiExport.name} className="border-chaos-black border-2 p-3">
              <p className="font-mono text-sm font-black">{apiExport.name}</p>
              <p className="mt-1 font-mono text-xs text-black/65">{apiExport.type}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ControlField({
  control,
  onChange,
  value,
}: {
  control: DocsExampleControl
  onChange: (value: DocsExampleControlValue) => void
  value: DocsExampleControlValue | undefined
}) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      <span>{control.label}</span>
      {control.type === 'select' ? (
        <select
          className="border-chaos-black bg-white px-3 py-2 font-mono text-sm"
          value={String(value ?? control.defaultValue)}
          onChange={(event) => onChange(event.target.value)}
        >
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
      {control.type === 'boolean' ? (
        <input
          type="checkbox"
          className="size-5 accent-black"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
      ) : null}
      {control.type === 'text' ? (
        <input
          className="border-chaos-black bg-white px-3 py-2 font-mono text-sm"
          value={String(value ?? control.defaultValue)}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}
      {control.type === 'number' ? (
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={Number(value ?? control.defaultValue)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      ) : null}
    </label>
  )
}

export const docsExampleIds = Object.keys(docsExamples)

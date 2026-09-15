'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { PAIN_PROMPT, PRICE_BANDS, PRICE_PROMPT, URGENCY, rolesFor } from './questions'
import type { WaitlistState } from './types'

/**
 * Vendored from starlight/packages/demand-capture (2026-09-15). Schema, questions
 * and the two-step flow are unchanged. Local deltas, worth upstreaming: a visible
 * email label, errors announced via role="alert", focus moved to the new step so
 * keyboard and screen-reader users are not stranded, and `source` resent on step
 * two so answers do not overwrite the page the signup came from.
 *
 * Plain strings only, so a server component can pass them across the client
 * boundary. Placeholders: {count} {n} {benefit} {product}.
 */
export type WaitlistCopy = {
  emailLabel: string
  join: string
  joining: string
  quiet: string
  waiting: string
  entered: string
  enteredNoPosition: string
  seats: string
  intro: string
  roleLabel: string
  pricePrompt: string
  urgencyLabel: string
  painPrompt: string
  painPlaceholder: string
  send: string
  saving: string
  skip: string
  done: string
  doneNoPosition: string
  doneText: string
  consent: string
}

export const DEFAULT_COPY: WaitlistCopy = {
  emailLabel: 'Email',
  join: 'Join the list',
  joining: 'Joining...',
  quiet: 'One email when it opens. Nothing else.',
  waiting: '{count} people waiting.',
  entered: 'You are in, at number {n}.',
  enteredNoPosition: 'You are in.',
  seats: '{n} founding places left. {benefit}',
  intro: 'Three optional questions. They decide what gets built first, and what it costs.',
  roleLabel: 'You are',
  pricePrompt: PRICE_PROMPT,
  urgencyLabel: 'How soon',
  painPrompt: PAIN_PROMPT,
  painPlaceholder: 'One line is plenty.',
  send: 'Send',
  saving: 'Saving...',
  skip: 'Skip',
  done: 'Thank you. You are number {n}.',
  doneNoPosition: 'Thank you.',
  doneText: 'You will hear from us when {product} is ready, and not before.',
  consent: 'Email me about {product}. Your address and your answers stay with this list. Unsubscribe in any email.',
}

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))

type Props = {
  productId: string
  productName: string
  /** What they get that a later signup does not. Stated plainly or omitted, never implied. */
  foundingBenefit?: string
  initialState?: WaitlistState
  endpoint?: string
  /** Consumer surfaces should not say "company". */
  placeholder?: string
  copy?: Partial<WaitlistCopy>
}

export function WaitlistForm({
  productId,
  productName,
  foundingBenefit,
  initialState,
  endpoint = '/api/waitlist',
  placeholder = 'you@company.com',
  copy: copyOverrides,
}: Props) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides }
  const uid = useId()
  const [step, setStep] = useState<'join' | 'refine' | 'done'>('join')
  const [state, setState] = useState<WaitlistState | undefined>(initialState)
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('')
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const stepHeading = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (step !== 'join') stepHeading.current?.focus()
  }, [step])

  async function post(payload: Record<string, unknown>) {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, consent, source, ...payload }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong. Your email was not saved.')
      setState(data)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Your email was not saved.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const seats = state?.foundingSeatsLeft ?? initialState?.foundingSeatsLeft ?? null
  const shownCount = state?.publicCount ?? initialState?.publicCount ?? null

  if (step === 'join') {
    return (
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const from = typeof window === 'undefined' ? '' : window.location.pathname
          setSource(from)
          if (await post({ source: from })) setStep('refine')
        }}
      >
        <div className="space-y-2">
          <label htmlFor={uid + '-email'} className="wl-label">
            {copy.emailLabel}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={uid + '-email'}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={placeholder}
              aria-describedby={error ? uid + '-error' : undefined}
              className="wl-input flex-1"
            />
            <button type="submit" disabled={busy} className="wl-btn">
              {busy ? copy.joining : copy.join}
            </button>
          </div>
        </div>

        <label className="wl-note flex items-start gap-2.5">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="wl-check mt-1"
          />
          <span>{fill(copy.consent, { product: productName })}</span>
        </label>

        {error ? (
          <p id={uid + '-error'} role="alert" className="wl-error">
            {error}
          </p>
        ) : null}

        <p className="wl-note">
          {shownCount !== null ? fill(copy.waiting, { count: shownCount.toLocaleString() }) + ' ' : ''}
          {foundingBenefit && seats !== 0 ? foundingBenefit : copy.quiet}
        </p>
      </form>
    )
  }

  if (step === 'refine') {
    return (
      <div className="space-y-6">
        <div ref={stepHeading} tabIndex={-1} className="wl-panel" aria-live="polite">
          <p className="wl-panel-title">
            {state?.position ? fill(copy.entered, { n: state.position }) : copy.enteredNoPosition}
          </p>
          {foundingBenefit && seats !== null && seats > 0 ? (
            <p className="wl-panel-text">{fill(copy.seats, { n: seats, benefit: foundingBenefit })}</p>
          ) : null}
        </div>

        <div className="space-y-5">
          <p className="wl-note">{copy.intro}</p>

          <Choice
            label={copy.pricePrompt}
            options={PRICE_BANDS.map((band) => band.label)}
            values={PRICE_BANDS.map((band) => band.value)}
            value={answers.priceBand}
            onPick={(value) => setAnswers({ ...answers, priceBand: value })}
          />
          <Choice
            label={copy.roleLabel}
            options={rolesFor(productId)}
            value={answers.role}
            onPick={(value) => setAnswers({ ...answers, role: value })}
          />

          <div className="space-y-2">
            <label htmlFor={uid + '-pain'} className="wl-label">
              {copy.painPrompt}
            </label>
            <textarea
              id={uid + '-pain'}
              rows={3}
              maxLength={400}
              value={answers.pain ?? ''}
              onChange={(event) => setAnswers({ ...answers, pain: event.target.value })}
              className="wl-input w-full"
              placeholder={copy.painPlaceholder}
            />
          </div>

          <Choice
            label={copy.urgencyLabel}
            options={URGENCY.map((item) => item.label)}
            values={URGENCY.map((item) => item.value)}
            value={answers.urgency}
            onPick={(value) => setAnswers({ ...answers, urgency: value })}
          />
        </div>

        {error ? (
          <p role="alert" className="wl-error">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={async () => {
              if (await post(answers)) setStep('done')
            }}
            disabled={busy}
            className="wl-btn wl-btn-quiet"
          >
            {busy ? copy.saving : copy.send}
          </button>
          <button type="button" onClick={() => setStep('done')} className="wl-link">
            {copy.skip}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={stepHeading} tabIndex={-1} className="wl-panel" aria-live="polite">
      <p className="wl-panel-title">{state?.position ? fill(copy.done, { n: state.position }) : copy.doneNoPosition}</p>
      <p className="wl-panel-text">{fill(copy.doneText, { product: productName })}</p>
    </div>
  )
}

function Choice({
  label,
  options,
  values,
  value,
  onPick,
}: {
  label: string
  options: string[]
  values?: string[]
  value?: string
  onPick: (value: string) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="wl-label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const optionValue = values?.[index] ?? option
          const active = value === optionValue
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onPick(optionValue)}
              aria-pressed={active}
              className={'wl-chip' + (active ? ' wl-chip-active' : '')}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

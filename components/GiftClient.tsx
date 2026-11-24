'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getNext25th() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const target = new Date(year, month, 25)

  if (target <= now) {
    target.setMonth(month + 1)
  }

  return target
}

export default function GiftClient() {
  const [screen, setScreen] = useState<'countdown' | 'question' | 'success'>('countdown')
  const [noCount, setNoCount] = useState(0)
  const [countdown, setCountdown] = useState<Countdown | null>(null)

  useEffect(() => {
    const target = getNext25th()

    const updateCountdown = () => {
      const remaining = Math.max(0, target.getTime() - Date.now())
      const totalSeconds = Math.floor(remaining / 1000)

      setCountdown({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      })
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const countdownUnits: { label: string; value: number }[] = countdown
    ? [
        { label: 'Days', value: countdown.days },
        { label: 'Hours', value: countdown.hours },
        { label: 'Minutes', value: countdown.minutes },
        { label: 'Seconds', value: countdown.seconds },
      ]
    : [
        { label: 'Days', value: 0 },
        { label: 'Hours', value: 0 },
        { label: 'Minutes', value: 0 },
        { label: 'Seconds', value: 0 },
      ]

  return (
    <main className="gift-page">
      <div className="corners-overlay" aria-hidden="true">
        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />
      </div>

      <section className="question-content">
        {screen === 'success' ? (
          <>
            <p className="subtitle">✦ IT IS A YES! ✦</p>
            <div className="answer-image">
              <Image
                src="/images/bear-hug.gif"
                alt="A bear hug"
                fill
                unoptimized
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="answer-message">waiting for you</p>
          </>
        ) : screen === 'countdown' ? (
          <>
            <p className="subtitle countdown-heading">few hours left</p>
            <div className="countdown" aria-label="Countdown to the 25th">
              {countdownUnits.map(({ label, value }) => (
                <div className="countdown-unit" key={label}>
                  <span className="countdown-value">{String(value).padStart(2, '0')}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="answer-image">
              <Image
                src="/images/sticker.png"
                alt="Cute birthday sticker"
                fill
                unoptimized
                style={{ objectFit: 'contain' }}
              />
            </div>
            <button className="btn-primary" onClick={() => setScreen('question')}>
              Next
            </button>
          </>
        ) : (
          <>
            <h1 className="gift-title question-title">
              <span>Would you honor me with a</span>
              <span>birthday dinner tonight at 8?</span>
            </h1>
            <p className="question-message">On me "just this once"</p>
            <div className="answer-image">
              <Image
                src="/images/bear-ask.jpg"
                alt="A bear asking a question"
                fill
                unoptimized
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div className="question-actions">
              <button
                className="btn-primary"
                style={{
                  fontSize: `${1 + Math.min(noCount, 8) * 0.1}rem`,
                  padding: `${0.8 + Math.min(noCount, 8) * 0.05}rem ${2 + Math.min(noCount, 8) * 0.1}rem`,
                }}
                onClick={() => setScreen('success')}
              >
                Yes!
              </button>
              <button
                className="secret-link question-no"
                style={{ transform: `scale(${Math.max(1 - noCount * 0.1, 0.55)})` }}
                onClick={() => setNoCount((count) => count + 1)}
              >
                No
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

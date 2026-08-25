import {
  ArrowLeft,
  Check,
  Copy,
  Heart,
  Home,
  LockKeyhole,
  Printer,
  QrCode,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import QRCode from 'qrcode'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { ADMIN_PIN } from './google-config'
import { fetchBlessingsFromSheet, submitToGoogleForm } from './lib/google'
import type { Blessing, Child } from './types'

type Screen = 'home' | 'form' | 'thanks' | 'admin'
type Filter = 'all' | Child

const children = {
  itai: {
    name: 'איתי',
    role: 'בר המצווה',
    invitation: 'כמה מילים חמות לאיתי — הן ילוו אותו הרבה זמן קדימה.',
  },
  agam: {
    name: 'אגם',
    role: 'בת המצווה',
    invitation: 'כמה מילים חמות לאגם — הן ילוו אותה הרבה זמן קדימה.',
  },
} satisfies Record<Child, { name: string; role: string; invitation: string }>

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedChild, setSelectedChild] = useState<Child>('itai')
  const [guestName, setGuestName] = useState('')
  const [message, setMessage] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [pinOpen, setPinOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [adminError, setAdminError] = useState('')
  const [blessings, setBlessings] = useState<Blessing[]>([])
  const [adminStatus, setAdminStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [filter, setFilter] = useState<Filter>('all')
  const [shareUrl, setShareUrl] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const activeChild = children[selectedChild]
  const visibleBlessings = useMemo(
    () => (filter === 'all' ? blessings : blessings.filter((item) => item.child === filter)),
    [blessings, filter],
  )

  useEffect(() => {
    setShareUrl(window.location.origin + window.location.pathname)
  }, [])

  useEffect(() => {
    if (!shareUrl) return
    QRCode.toDataURL(shareUrl, {
      width: 420,
      margin: 1,
      color: { dark: '#2b2723', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [shareUrl])

  function navigate(nextScreen: Screen) {
    setScreen(nextScreen)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openForm(child: Child) {
    setSelectedChild(child)
    setGuestName('')
    setMessage('')
    setFormStatus('idle')
    navigate('form')
  }

  async function submitBlessing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!guestName.trim() || !message.trim()) {
      setFormStatus('error')
      return
    }

    setFormStatus('sending')
    try {
      await submitToGoogleForm({
        child: selectedChild,
        guestName: guestName.trim(),
        message: message.trim(),
      })
      setFormStatus('idle')
      navigate('thanks')
    } catch {
      setFormStatus('error')
    }
  }

  async function loadBlessings() {
    setAdminStatus('loading')
    setAdminError('')
    try {
      const data = await fetchBlessingsFromSheet()
      setBlessings(data)
      setAdminStatus('idle')
      return true
    } catch {
      setAdminStatus('error')
      setAdminError('לא הצלחנו לטעון את הברכות כרגע.')
      return false
    }
  }

  async function enterAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pin !== ADMIN_PIN) {
      setAdminError('קוד הכניסה אינו נכון. נסו שוב.')
      return
    }
    setAdminError('')
    const loaded = await loadBlessings()
    if (loaded) {
      setPinOpen(false)
      navigate('admin')
    }
  }

  async function copyShareUrl() {
    setAdminError('')
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setAdminError('לא הצלחנו להעתיק אוטומטית. אפשר לסמן ולהעתיק את הקישור מהשדה.')
    }
  }

  function print(mode: 'admin' | 'sign') {
    document.body.classList.add(`print-${mode}`)
    window.setTimeout(() => window.print(), 100)
    window.onafterprint = () => {
      document.body.classList.remove('print-admin', 'print-sign')
    }
  }

  return (
    <>
      <main className="site-shell">
        {screen === 'home' && (
          <section className="screen home-screen">
            <div className="ornament ornament-one" aria-hidden="true" />
            <div className="ornament ornament-two" aria-hidden="true" />
            <div className="hero-copy">
              <p className="eyebrow">חוגגים יחד</p>
              <div className="title-lockup">
                <span>איתי קריספין</span>
                <Sparkles aria-hidden="true" />
                <span>אגם קריספין</span>
              </div>
              <h1>ברכות לבר ולבת המצווה</h1>
              <p className="event-pill">6.6.2027 · אולמי אליבא, אופקים</p>
              <p className="hero-subtitle">
                כתבו כמה מילים לחתן ולכלת השמחה. הברכות שלכם נשמרות עבורם כמזכרת מהיום המיוחד.
              </p>
            </div>

            <div className="age-mark" aria-label="גילאי בר ובת המצווה">
              <span>13</span>
              <i />
              <Heart aria-hidden="true" />
              <i />
              <span>12</span>
            </div>

            <div className="gate-grid">
              <button className="gate gate-itai" type="button" onClick={() => openForm('itai')}>
                <span className="gate-number">13</span>
                <span className="gate-copy">
                  <small>ברכה לבר המצווה</small>
                  <strong>לאיתי</strong>
                  <em>כתבו לו כמה מילים מהלב</em>
                </span>
                <ArrowLeft aria-hidden="true" />
              </button>
              <button className="gate gate-agam" type="button" onClick={() => openForm('agam')}>
                <span className="gate-number">12</span>
                <span className="gate-copy">
                  <small>ברכה לבת המצווה</small>
                  <strong>לאגם</strong>
                  <em>כתבו לה כמה מילים מהלב</em>
                </span>
                <ArrowLeft aria-hidden="true" />
              </button>
            </div>

            <button className="parent-link" type="button" onClick={() => setPinOpen(true)}>
              <LockKeyhole aria-hidden="true" />
              כניסת הורים
            </button>
          </section>
        )}

        {screen === 'form' && (
          <section className={`screen form-screen theme-${selectedChild}`}>
            <button className="back-button" type="button" onClick={() => navigate('home')}>
              <ArrowLeft aria-hidden="true" /> חזרה לבחירה
            </button>
            <div className="form-layout">
              <aside className="child-portrait">
                <p>{activeChild.role}</p>
                <span>{selectedChild === 'itai' ? '13' : '12'}</span>
                <h2>{activeChild.name}</h2>
                <Sparkles aria-hidden="true" />
              </aside>
              <form className="blessing-form" onSubmit={submitBlessing}>
                <p className="eyebrow">מילים שנשארות</p>
                <h2>הברכה שלכם ל{activeChild.name}</h2>
                <p className="form-intro">{activeChild.invitation}</p>

                <label htmlFor="guest-name">השם שלכם</label>
                <input
                  id="guest-name"
                  maxLength={80}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="איך לחתום על הברכה?"
                  value={guestName}
                />

                <label htmlFor="guest-message">הברכה שלכם</label>
                <textarea
                  id="guest-message"
                  maxLength={500}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="כתבו כאן זיכרון, איחול או כמה מילים טובות..."
                  value={message}
                />
                <span className="character-count">{message.length} / 500</span>

                {formStatus === 'error' && (
                  <p className="inline-error" role="alert">
                    לא הצלחנו לשלוח. ודאו שמילאתם שם וברכה ונסו שוב.
                  </p>
                )}
                <button className="primary-button" disabled={formStatus === 'sending'} type="submit">
                  {formStatus === 'sending' ? 'שומרים את הברכה...' : 'שליחת הברכה'}
                  <Send aria-hidden="true" />
                </button>
              </form>
            </div>
          </section>
        )}

        {screen === 'thanks' && (
          <section className={`screen thanks-screen theme-${selectedChild}`}>
            <div className="thanks-card">
              <span className="thanks-icon"><Check aria-hidden="true" /></span>
              <p className="eyebrow">הברכה נשמרה</p>
              <h2>תודה מכל הלב</h2>
              <p>המילים שלכם הצטרפו למזכרת המיוחדת של {activeChild.name}.</p>
              <div className="thanks-actions">
                <button className="primary-button" type="button" onClick={() => openForm(selectedChild)}>
                  כתיבת ברכה נוספת
                </button>
                <button className="secondary-button" type="button" onClick={() => navigate('home')}>
                  <Home aria-hidden="true" /> חזרה לדף הבית
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === 'admin' && (
          <section className="screen admin-screen">
            <header className="admin-header">
              <div>
                <p className="eyebrow">אזור ההורים</p>
                <h2>כל הברכות לאיתי ולאגם</h2>
              </div>
              <div className="admin-actions no-print">
                <button type="button" onClick={() => void loadBlessings()}><RefreshCw aria-hidden="true" /> רענון</button>
                <button type="button" onClick={() => print('admin')}><Printer aria-hidden="true" /> הדפסה</button>
                <button type="button" onClick={() => navigate('home')}><Home aria-hidden="true" /> לאתר</button>
              </div>
            </header>

            <div className="admin-dashboard no-print">
              <div className="qr-card">
                <div className="qr-frame">
                  {qrDataUrl ? <img src={qrDataUrl} alt="קוד QR לקישור האתר" /> : <div className="qr-placeholder" />}
                </div>
                <div className="qr-copy">
                  <span><QrCode aria-hidden="true" /> שיתוף עם האורחים</span>
                  <h3>קוד אחד, כל הברכות</h3>
                  <p>אפשר לעדכן את הקישור, להעתיק אותו או להדפיס שלט מוכן להצבה באירוע.</p>
                  <input aria-label="קישור ציבורי לאתר" value={shareUrl} onChange={(event) => setShareUrl(event.target.value)} />
                  {adminError && <p className="inline-error" role="alert">{adminError}</p>}
                  <div className="qr-actions">
                    <button type="button" onClick={() => void copyShareUrl()}>
                      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      {copied ? 'הקישור הועתק' : 'העתקת קישור'}
                    </button>
                    <button type="button" onClick={() => print('sign')}><Printer aria-hidden="true" /> הדפסת שלט</button>
                  </div>
                </div>
              </div>

              <div className="stats-panel">
                <div><strong>{blessings.filter((item) => item.child === 'itai').length}</strong><span>ברכות לאיתי</span></div>
                <div><strong>{blessings.filter((item) => item.child === 'agam').length}</strong><span>ברכות לאגם</span></div>
                <div><strong>{blessings.length}</strong><span>ברכות בסך הכל</span></div>
              </div>
            </div>

            <div className="filter-row no-print" aria-label="סינון ברכות">
              {(['all', 'itai', 'agam'] as const).map((option) => (
                <button className={filter === option ? 'active' : ''} key={option} type="button" onClick={() => setFilter(option)}>
                  {option === 'all' ? 'הכל' : children[option].name}
                </button>
              ))}
            </div>

            {adminStatus === 'loading' && (
              <div className="blessings-grid" aria-label="טוען ברכות">
                {[1, 2, 3].map((item) => <div className="blessing-skeleton" key={item} />)}
              </div>
            )}
            {adminStatus === 'error' && <p className="empty-state">{adminError}</p>}
            {adminStatus === 'idle' && visibleBlessings.length === 0 && (
              <div className="empty-state">
                <Heart aria-hidden="true" />
                <h3>מחכים למילים הראשונות</h3>
                <p>כאן יופיעו הברכות שיישלחו דרך האתר.</p>
              </div>
            )}
            {adminStatus !== 'loading' && visibleBlessings.length > 0 && (
              <div className="blessings-grid">
                {visibleBlessings.map((blessing) => (
                  <article className={`blessing-card ${blessing.child}`} key={blessing.id}>
                    <div className="blessing-meta">
                      <span>ל{children[blessing.child].name}</span>
                      <time dateTime={blessing.createdAt}>{formatDate(blessing.createdAt)}</time>
                    </div>
                    <blockquote>{blessing.message}</blockquote>
                    <p>— {blessing.guestName}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <section className="print-sign" aria-hidden="true">
        <p>כתבו לנו ברכה</p>
        <h2>איתי ואגם קריספין</h2>
        <span>בר ובת מצווה · 6.6.2027 · אולמי אליבא, אופקים</span>
        {qrDataUrl && <img src={qrDataUrl} alt="" />}
        <strong>סרקו את הקוד ושלחו לנו כמה מילים מהלב</strong>
      </section>

      {pinOpen && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => setPinOpen(false)}>
          <div className="pin-modal" role="dialog" aria-modal="true" aria-labelledby="pin-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="סגירה" onClick={() => setPinOpen(false)}><X /></button>
            <span className="modal-icon"><LockKeyhole aria-hidden="true" /></span>
            <h2 id="pin-title">כניסת הורים</h2>
            <p>הזינו את קוד הכניסה כדי לראות את כל הברכות.</p>
            <form onSubmit={enterAdmin}>
              <input
                aria-label="קוד כניסה"
                autoFocus
                inputMode="numeric"
                maxLength={12}
                onChange={(event) => setPin(event.target.value)}
                placeholder="••••"
                type="password"
                value={pin}
              />
              {adminError && <p className="inline-error" role="alert">{adminError}</p>}
              <button className="primary-button" disabled={adminStatus === 'loading'} type="submit">
                {adminStatus === 'loading' ? 'בודקים...' : 'כניסה'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('he-IL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

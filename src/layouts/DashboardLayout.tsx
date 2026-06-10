import { type ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogRunModal from '../components/LogRunModal'

/* ============================================================
   DashboardLayout – Sidebar + Main Content Wrapper
   ============================================================ */

interface NavItem {
  id: string
  to: string
  icon: ReactNode
  label: string
}

const navItems: NavItem[] = [
  {
    id: 'nav-home',
    to: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    label: 'ภาพรวม',
  },
  {
    id: 'nav-runs',
    to: '/dashboard/runs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: 'ประวัติวิ่ง',
  },
  {
    id: 'nav-stats',
    to: '/dashboard/stats',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    label: 'สถิติ',
  },
  {
    id: 'nav-community',
    to: '/dashboard/community',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: 'ชุมชน',
  },
  {
    id: 'nav-events',
    to: '/dashboard/events',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label: 'กิจกรรม',
  },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRunSuccess = (run: { title: string }) => {
    setShowModal(false)
    setToast(`✅ บันทึก "${run.title}" สำเร็จแล้ว!`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface-900)' }}>

      {/* ══════════════════════════════
          SIDEBAR
          ══════════════════════════════ */}
      <aside
        id="sidebar"
        style={{
          width: '240px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(17, 17, 24, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                boxShadow: '0 0 12px rgba(249,115,22,0.4)',
                flexShrink: 0,
              }}
            >
              🏃
            </div>
            <div>
              <div
                className="font-display gradient-text-brand"
                style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                RunClub
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Thailand
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px', fontWeight: 600 }}>
            เมนูหลัก
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
              return (
                <Link
                  key={item.id}
                  id={item.id}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: isActive ? '#fff' : 'var(--color-text-secondary)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(239,68,68,0.15))'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }
                  }}
                >
                  <span style={{ color: isActive ? '#f97316' : 'inherit', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <div
                      style={{
                        marginLeft: 'auto',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#f97316',
                        boxShadow: '0 0 6px rgba(249,115,22,0.8)',
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Log Run Button */}
          <div style={{ marginTop: '24px', padding: '0 0' }}>
            <button
              id="log-run-btn"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                color: 'white',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
              }}
              onClick={() => setShowModal(true)}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,115,22,0.3)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              บันทึกการวิ่ง
            </button>
          </div>
        </nav>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Avatar */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(249,115,22,0.3)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name ?? 'ผู้ใช้งาน'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{user?.email ?? ''}</div>
              </div>
              <button
                id="logout-btn"
                onClick={handleLogout}
                style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', transition: 'color 0.2s', padding: '4px', flexShrink: 0 }}
                title="ออกจากระบบ"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
      </aside>

      {/* ══════════════════════════════
          MAIN CONTENT
          ══════════════════════════════ */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Mobile sidebar hidden on small screens */}
      <style>{`
        @media (max-width: 768px) {
          #sidebar { display: none !important; }
        }
      `}</style>
      {/* ── Log Run Modal ── */}
      {showModal && (
        <LogRunModal
          onClose={() => setShowModal(false)}
          onSuccess={handleRunSuccess}
        />
      )}

      {/* ── Toast Notification ── */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 2000,
            padding: '14px 20px',
            borderRadius: '14px',
            background: 'rgba(22, 163, 74, 0.15)',
            border: '1px solid rgba(34,197,94,0.35)',
            color: '#22c55e',
            fontSize: '14px',
            fontWeight: 500,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth_store'

export default function Header() {
  const navigate = useNavigate()
  const { admin, logOut } = useAuthStore()

  const handleLogout = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 flex items-center justify-between text-white" style={{ height: '52px'}}>
      <div
        className="flex items-center cursor-pointer gap-2"
        onClick={() => navigate('/')}
      >
        <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Ola</span>
        <span className="text-xs font-medium text-slate-400 border border-slate-600 rounded px-1.5 py-0.5">Admin</span>
      </div>
      <div className="flex items-center space-x-4">
        {admin && (
          <>
            <span className="text-sm text-slate-300">
              👤 { admin.name || admin.loginId}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  )
}

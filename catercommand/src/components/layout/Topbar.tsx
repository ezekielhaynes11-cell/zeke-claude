import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function Topbar() {
  const { session, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{session?.user.email}</span>
        <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          Sign out
        </Button>
      </div>
    </header>
  )
}

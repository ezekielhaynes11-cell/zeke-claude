interface PageWrapperProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function PageWrapper({ title, action, children }: PageWrapperProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
      {children}
    </div>
  )
}

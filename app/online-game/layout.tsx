export default function GameLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        <nav>Game Navigation</nav>
        {children}
      </div>
    )
  }

  
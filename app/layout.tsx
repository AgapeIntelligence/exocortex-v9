export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body style={{ fontFamily: "monospace", background: "#0b0b0f", color: "#e5e5e5" }}>
        {children}
      </body>
    </html>
  )
}

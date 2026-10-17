export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="auth">
      <aside className="auth-side">
        <span className="brand brand-light">CropWise</span>
        <div>
          <h2>Know what to sow before the season starts.</h2>
          <p>Enter your soil, water and climate details and get a ranked list of crops that suit your field.</p>
        </div>
        <div className="strata" aria-hidden="true">
          <i style={{ background: "#6B4A32", height: 54 }} />
          <i style={{ background: "#A44A32", height: 38 }} />
          <i style={{ background: "#B79B6E", height: 30 }} />
          <i style={{ background: "#2B2623", height: 22 }} />
          <i style={{ background: "#E0C48A", height: 14 }} />
        </div>
      </aside>
      <section className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
    </main>
  );
}

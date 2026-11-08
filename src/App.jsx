import { useEffect, useState } from 'react';

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem('nothan-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem('nothan-theme', theme);
    } catch {
      // A aplicação continua funcionando mesmo se o navegador bloquear o armazenamento.
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light');
  }

  const isDark = theme === 'dark';

  return (
    <main className="app-shell">
      <button
        className="theme-toggle"
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        aria-pressed={isDark}
        title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      >
        <span className="theme-toggle-icon" aria-hidden="true">
          {isDark ? '☀' : '☾'}
        </span>
        <span>{isDark ? 'Tema claro' : 'Tema escuro'}</span>
      </button>

      <section className="welcome-card" aria-labelledby="welcome-title">
        <span className="brand-mark" aria-hidden="true">N.</span>
        <p className="eyebrow">SEU ESPAÇO DE IDEIAS</p>
        <h1 id="welcome-title">Nothãn</h1>
        <p className="welcome-copy">
          Um espaço para registrar, organizar e revisitar seus pensamentos.
        </p>
        <span className="status-label">Fundação do projeto iniciada</span>
      </section>
    </main>
  );
}

export default App;

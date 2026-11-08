import { useEffect, useMemo, useState } from 'react';

const initialNotes = [
  { id: 1, title: 'Aprendizado de JavaScript', excerpt: 'Estudar manipulação do DOM, eventos, funções e operações CRUD.', category: 'Estudos', color: '#5595E8', date: 'Hoje, 09:42', favorite: true, updated: 'Há 18 minutos' },
  { id: 2, title: 'Ideias para projetos', excerpt: 'Registrar possibilidades de aplicações, ferramentas e experiências digitais.', category: 'Ideias', color: '#D87591', date: 'Hoje, 08:15', favorite: false, updated: 'Há 1 hora' },
  { id: 3, title: 'Planejamento semanal', excerpt: 'Organizar prioridades, tarefas importantes e próximos objetivos.', category: 'Pessoal', color: '#39A68B', date: 'Ontem, 20:30', favorite: true, updated: 'Ontem' },
  { id: 4, title: 'Arquitetura de software', excerpt: 'Anotações sobre organização de projetos, componentes e responsabilidades.', category: 'Estudos', color: '#5595E8', date: 'Ontem, 16:10', favorite: false, updated: 'Ontem' },
  { id: 5, title: 'Referências visuais', excerpt: 'Paletas, tipografia e referências para interfaces limpas e funcionais.', category: 'Projetos', color: '#9272D6', date: '07 nov. 2026', favorite: false, updated: 'Há 2 dias' },
  { id: 6, title: 'Metas de novembro', excerpt: 'Acompanhar objetivos pessoais e entregas que quero concluir neste mês.', category: 'Pessoal', color: '#39A68B', date: '06 nov. 2026', favorite: false, updated: 'Há 2 dias' },
];

const navItems = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'anotacoes', label: 'Anotações', icon: 'notebook' },
  { id: 'favoritos', label: 'Favoritos', icon: 'star' },
  { id: 'categorias', label: 'Categorias', icon: 'folder' },
  { id: 'lixeira', label: 'Lixeira', icon: 'trash' },
];

const iconPaths = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  notebook: <><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M8 3v18M12 8h4M12 12h4" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  list: <><path d="M9 6h12M9 12h12M9 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z" /><path d="M13 3v7h7M8 14h8M8 17h6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  cloud: <><path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9Z" /><path d="m9 13 2 2 4-4" /></>,
  bold: <><path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" /></>,
  italic: <><path d="M14 4h6M4 20h6M15 4 9 20" /></>,
  underline: <><path d="M6 4v6a6 6 0 0 0 12 0V4M4 21h16" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7" /></>,
  quote: <><path d="M4 11h6v7H4zM14 11h6v7h-6z" /><path d="M10 11a5 5 0 0 1-5-5M20 11a5 5 0 0 1-5-5" /></>,
  code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};

function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name] || iconPaths.file}
    </svg>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('nothan-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftCategory, setDraftCategory] = useState('Estudos');
  const [draftStatus, setDraftStatus] = useState('Rascunho de demonstração');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('nothan-theme', theme);
    } catch {
      // O tema continua funcional mesmo sem armazenamento local.
    }
  }, [theme]);

  const visibleNotes = useMemo(() => {
    let notes = [...initialNotes];
    if (activeSection === 'favoritos') notes = notes.filter((note) => note.favorite);
    if (activeSection === 'categorias') notes = notes.filter((note) => note.category === 'Estudos');
    if (activeSection === 'lixeira') notes = [];
    if (search.trim()) {
      const term = search.toLocaleLowerCase('pt-BR');
      notes = notes.filter((note) => `${note.title} ${note.excerpt} ${note.category}`.toLocaleLowerCase('pt-BR').includes(term));
    }
    return notes;
  }, [activeSection, search]);

  const pageTitle = navItems.find((item) => item.id === activeSection)?.label || 'Início';

  function openNewNote() {
    setSelectedNote(null);
    setDraftTitle('');
    setDraftContent('');
    setDraftCategory('Estudos');
    setDraftStatus('Rascunho de demonstração');
    setActiveSection('editor');
    setMobileMenuOpen(false);
  }

  function openNote(note) {
    setSelectedNote(note);
    setDraftTitle(note.title);
    setDraftContent(note.excerpt);
    setDraftCategory(note.category);
    setDraftStatus('Conteúdo de demonstração');
    setActiveSection('editor');
  }

  function navigate(section) {
    setActiveSection(section);
    setSelectedNote(null);
    setMobileMenuOpen(false);
    setSearch('');
  }

  const isEditor = activeSection === 'editor';

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      {mobileMenuOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)} />}

      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Navegação principal">
        <div className="sidebar-brand">
          <span className="brand-symbol">N.</span>
          {!sidebarCollapsed && <span className="brand-name">Nothãn</span>}
          <button className="icon-button sidebar-collapse" onClick={() => setSidebarCollapsed((value) => !value)} aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'} title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}>
            <Icon name="menu" size={18} />
          </button>
          <button className="icon-button sidebar-close" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
            <Icon name="close" size={19} />
          </button>
        </div>

        <button className="new-note-button" onClick={openNewNote}>
          <Icon name="plus" size={19} />
          {!sidebarCollapsed && <span>Nova anotação</span>}
        </button>

        <div className="nav-caption">{!sidebarCollapsed && 'ESPAÇO DE TRABALHO'}</div>
        <nav className="main-nav">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeSection === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)} title={sidebarCollapsed ? item.label : undefined}>
              <Icon name={item.icon} size={19} />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {item.id === 'favoritos' && !sidebarCollapsed && <span className="nav-count">2</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-categories">
            <div className="sidebar-section-heading">
              <span>CATEGORIAS</span>
              <button className="subtle-icon-button" aria-label="Adicionar categoria" title="Adicionar categoria"><Icon name="plus" size={15} /></button>
            </div>
            <button className="category-link" onClick={() => navigate('categorias')}><span className="category-dot blue" />Estudos<span className="category-total">8</span></button>
            <button className="category-link" onClick={() => navigate('categorias')}><span className="category-dot purple" />Projetos<span className="category-total">5</span></button>
            <button className="category-link" onClick={() => navigate('categorias')}><span className="category-dot green" />Pessoal<span className="category-total">6</span></button>
            <button className="category-link" onClick={() => navigate('categorias')}><span className="category-dot rose" />Ideias<span className="category-total">5</span></button>
          </div>
        )}

        <div className="sidebar-bottom">
          <button className="nav-item settings-link" onClick={() => navigate('configuracoes')} title={sidebarCollapsed ? 'Configurações' : undefined}>
            <Icon name="settings" size={19} />
            {!sidebarCollapsed && <span>Configurações</span>}
          </button>
          <div className="profile-block">
            <div className="avatar">NV</div>
            {!sidebarCollapsed && <div className="profile-copy"><strong>Minha conta</strong><span>Espaço pessoal</span></div>}
            {!sidebarCollapsed && <Icon name="more" size={18} className="profile-more" />}
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-trigger" onClick={() => setMobileMenuOpen(true)} aria-label="Abrir menu">
              <Icon name="menu" size={21} />
            </button>
            <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{isEditor ? 'Editor' : pageTitle}</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="global-search">
              <Icon name="search" size={17} />
              <input aria-label="Pesquisar anotações" placeholder="Pesquisar anotações..." value={search} onChange={(event) => setSearch(event.target.value)} />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notificações"><Icon name="bell" size={19} /><span className="notification-dot" /></button>
            <button className="icon-button theme-button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'} title={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}>
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={19} />
            </button>
          </div>
        </header>

        <main className="page-content">
          {isEditor ? (
            <section className="editor-page">
              <div className="editor-heading">
                <button className="back-link" onClick={() => navigate('anotacoes')}><Icon name="chevron" size={16} className="back-chevron" />Voltar às anotações</button>
                <div className="save-status"><Icon name="cloud" size={16} />{draftStatus}</div>
              </div>
              <div className="editor-meta">
                <select value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)} aria-label="Categoria da anotação">
                  <option>Estudos</option><option>Projetos</option><option>Pessoal</option><option>Ideias</option>
                </select>
                <span className="demo-label">Prévia da interface · sem sincronização</span>
              </div>
              <input className="editor-title-input" placeholder="Título da anotação" value={draftTitle} onChange={(event) => { setDraftTitle(event.target.value); setDraftStatus('Alterações nesta sessão'); }} />
              <div className="editor-toolbar" aria-label="Ferramentas de formatação">
                {['undo-2', 'redo-2', 'bold', 'italic', 'underline', 'quote', 'list', 'link', 'code'].map((name) => (
                  <button key={name} className="toolbar-button" type="button" title={name} aria-label={name}><Icon name={name} size={18} /></button>
                ))}
              </div>
              <textarea className="editor-body" placeholder="Comece a escrever suas ideias..." value={draftContent} onChange={(event) => { setDraftContent(event.target.value); setDraftStatus('Alterações nesta sessão'); }} />
              <div className="editor-footer"><span>{draftContent.trim() ? draftContent.trim().split(/\s+/).length : 0} palavras · {draftContent.length} caracteres</span><span>Salvamento automático será conectado posteriormente</span></div>
            </section>
          ) : (
            <>
              <section className="welcome-heading">
                <div>
                  <p className="eyebrow">DOMINGO, 08 DE NOVEMBRO</p>
                  <h1>{activeSection === 'inicio' ? 'Bom dia.' : pageTitle}</h1>
                  <p>{activeSection === 'inicio' ? 'Seu espaço para organizar ideias e manter tudo em perspectiva.' : activeSection === 'favoritos' ? 'Suas anotações marcadas para encontrar rapidamente.' : activeSection === 'categorias' ? 'Explore suas anotações por assunto.' : activeSection === 'lixeira' ? 'Anotações removidas ficarão disponíveis aqui.' : 'Encontre e organize suas anotações.'}</p>
                </div>
                <button className="primary-button heading-create" onClick={openNewNote}><Icon name="plus" size={18} />Nova anotação</button>
              </section>

              {activeSection === 'inicio' && (
                <section className="stats-grid" aria-label="Resumo das anotações">
                  <article className="stat-card"><div className="stat-top"><span className="stat-icon"><Icon name="notebook" size={19} /></span><span className="stat-trend">+3 este mês</span></div><strong>24</strong><span className="stat-label">Total de anotações</span></article>
                  <article className="stat-card"><div className="stat-top"><span className="stat-icon"><Icon name="star" size={19} /></span></div><strong>06</strong><span className="stat-label">Favoritas</span></article>
                  <article className="stat-card"><div className="stat-top"><span className="stat-icon"><Icon name="folder" size={19} /></span></div><strong>08</strong><span className="stat-label">Categorias</span></article>
                  <article className="stat-card"><div className="stat-top"><span className="stat-icon"><Icon name="clock" size={19} /></span></div><strong>03</strong><span className="stat-label">Atualizadas hoje</span></article>
                </section>
              )}

              {activeSection === 'inicio' && (
                <section className="quick-access">
                  <div className="section-heading"><div><h2>Acesso rápido</h2><p>Continue de onde você parou.</p></div></div>
                  <div className="quick-grid">
                    <button className="quick-card" onClick={() => navigate('favoritos')}><span className="quick-icon"><Icon name="star" size={18} /></span><span><strong>Favoritos</strong><small>Suas anotações importantes</small></span><Icon name="arrow" size={16} /></button>
                    <button className="quick-card" onClick={() => navigate('categorias')}><span className="quick-icon"><Icon name="folder" size={18} /></span><span><strong>Categorias</strong><small>Organizadas por assunto</small></span><Icon name="arrow" size={16} /></button>
                  </div>
                </section>
              )}

              <section className="notes-section">
                <div className="section-heading notes-heading">
                  <div><h2>{activeSection === 'inicio' ? 'Acessadas recentemente' : activeSection === 'lixeira' ? 'Itens na lixeira' : 'Suas anotações'}</h2><p>{visibleNotes.length} {visibleNotes.length === 1 ? 'anotação encontrada' : 'anotações encontradas'}</p></div>
                  <div className="view-controls" aria-label="Modo de visualização">
                    <button className={viewMode === 'grid' ? 'selected' : ''} onClick={() => setViewMode('grid')} aria-label="Visualizar em cards" title="Cards"><Icon name="grid" size={17} /></button>
                    <button className={viewMode === 'list' ? 'selected' : ''} onClick={() => setViewMode('list')} aria-label="Visualizar em lista" title="Lista"><Icon name="list" size={18} /></button>
                  </div>
                </div>

                {visibleNotes.length > 0 ? (
                  <div className={`notes-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                    {visibleNotes.map((note) => (
                      <article className="note-card" key={note.id} onClick={() => openNote(note)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') openNote(note); }}>
                        <div className="note-card-top"><span className="note-category"><i style={{ backgroundColor: note.color }} />{note.category}</span><button className={`favorite-button ${note.favorite ? 'is-favorite' : ''}`} aria-label={note.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onClick={(event) => event.stopPropagation()}><Icon name="star" size={17} /></button></div>
                        <h3>{note.title}</h3><p className="note-excerpt">{note.excerpt}</p>
                        <div className="note-card-footer"><span>{note.date}</span><button className="note-more" aria-label="Mais opções" onClick={(event) => event.stopPropagation()}><Icon name="more" size={18} /></button></div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state"><span className="empty-icon"><Icon name={activeSection === 'lixeira' ? 'trash' : 'search'} size={25} /></span><h3>{search ? 'Nenhuma anotação encontrada' : activeSection === 'lixeira' ? 'Sua lixeira está vazia' : 'Nada por aqui ainda'}</h3><p>{search ? 'Experimente pesquisar por outro termo.' : 'Quando houver conteúdo nesta seção, ele aparecerá aqui.'}</p>{!search && activeSection !== 'lixeira' && <button className="primary-button" onClick={openNewNote}><Icon name="plus" size={17} />Criar anotação</button>}</div>
                )}
              </section>
              <footer className="page-footer"><span><Icon name="cloud" size={15} /> Seus dados serão sincronizados quando a conexão com a nuvem estiver configurada.</span><span>Prévia visual do Nothãn</span></footer>
            </>
          )}
        </main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navegação rápida">
        {navItems.slice(0, 4).map((item) => (
          <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon name={item.icon} size={20} /><span>{item.label === 'Anotações' ? 'Notas' : item.label}</span></button>
        ))}
      </nav>
    </div>
  );
}

export default App;

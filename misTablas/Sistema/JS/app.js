// Sistema/JS/app.js - Controlador principal de la plataforma Mis Tablas

class AppManager {
  constructor() {
    this.user = null;
    this.currentView = 'menu';
    this.init();
  }

  init() {
    this.loadUserData();
    this.renderHeader();
    this.setupGlobalEvents();
    this.navigateTo('menu');
  }

  loadUserData() {
    try {
      const data = localStorage.getItem('misTablas_student');
      if (data) {
        this.user = JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading user data', e);
    }

    if (!this.user || !this.user.name) {
      // Si no hay usuario registrado, redirigir al login
      window.location.href = '../index.html';
      return;
    }

    // Inicializar propiedades si faltan
    if (!this.user.points) this.user.points = 0;
    if (!this.user.level) this.user.level = 1;
    if (!this.user.tablesProgress) {
      this.user.tablesProgress = { "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 };
    }
    if (!this.user.tablesStars) {
      this.user.tablesStars = { "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 };
    }
    if (!this.user.unlockedTables) this.user.unlockedTables = [2, 3];
    if (!this.user.badges) this.user.badges = ['novato'];
    if (!this.user.simceAttempts) this.user.simceAttempts = [];
  }

  saveUserData() {
    try {
      localStorage.setItem('misTablas_student', JSON.stringify(this.user));
    } catch (e) {
      console.error('Error saving user data', e);
    }
  }

  renderHeader() {
    const avatarEl = document.getElementById('navUserAvatar');
    const nameEl = document.getElementById('navUserName');
    const levelEl = document.getElementById('navUserLevel');
    const pointsEl = document.getElementById('navUserPoints');
    const starsEl = document.getElementById('navUserStars');
    const soundBtn = document.getElementById('btnToggleSound');

    if (avatarEl) avatarEl.src = this.user.avatarFile || 'IMAGEN/avatar-cosmo.svg';
    if (nameEl) nameEl.textContent = this.user.name;

    // Calcular nivel según puntos (cada 100 XP sube un nivel)
    this.user.level = Math.floor(this.user.points / 100) + 1;
    const levelTitles = ["Explorador", "Aprendiz", "Aventurero", "Maestro", "Gran Sabio", "Leyenda Matemática"];
    const levelTitle = levelTitles[Math.min(this.user.level - 1, levelTitles.length - 1)];

    if (levelEl) levelEl.textContent = `Nivel ${this.user.level} • ${levelTitle}`;
    if (pointsEl) pointsEl.textContent = `${this.user.points} XP`;

    // Total de estrellas acumuladas
    const totalStars = Object.values(this.user.tablesStars || {}).reduce((a, b) => a + b, 0);
    if (starsEl) starsEl.textContent = `${totalStars} ⭐`;

    if (soundBtn) {
      soundBtn.textContent = soundManager.isMuted() ? '🔇 Silenciado' : '🔊 Con Sonido';
    }
  }

  setupGlobalEvents() {
    // Botón de audio
    const soundBtn = document.getElementById('btnToggleSound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = soundManager.toggleMute();
        soundBtn.textContent = isMuted ? '🔇 Silenciado' : '🔊 Con Sonido';
      });
    }

    // Botón de cambiar de usuario
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        soundManager.playClick();
        if (confirm('¿Deseas cambiar de usuario o volver a la pantalla de inicio?')) {
          window.location.href = '../index.html';
        }
      });
    }

    // Navegación de barra inferior / pestañas
    const navItems = document.querySelectorAll('.nav-tab-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        soundManager.playClick();
        const targetView = item.dataset.view;
        this.navigateTo(targetView);
      });
    });
  }

  navigateTo(viewName, params = {}) {
    this.currentView = viewName;

    // Actualizar botones de navegación activa
    const navItems = document.querySelectorAll('.nav-tab-item');
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });

    const mainApp = document.getElementById('appMainView');
    if (!mainApp) return;

    // Detener juegos si estaban corriendo
    gameManager.stopCurrentGame();

    // Renderizar según vista
    switch (viewName) {
      case 'menu':
        this.renderMenuView(mainApp);
        break;
      case 'tablas':
        this.renderTablesMapView(mainApp);
        break;
      case 'tabla-detalle':
        tablesExplorer.init(mainApp);
        tablesExplorer.openTable(params.table || 2);
        break;
      case 'juegos':
        this.renderGamesHubView(mainApp);
        break;
      case 'juego-activo':
        mainApp.innerHTML = '<div id="gamePlayContainer"></div>';
        const gameContainer = document.getElementById('gamePlayContainer');
        gameManager.init(gameContainer);
        this.launchGame(params.game, params.table);
        break;
      case 'progreso':
        this.renderProgressView(mainApp);
        break;
      case 'logros':
        this.renderBadgesView(mainApp);
        break;
      case 'simce':
        simceManager.init(mainApp);
        simceManager.startExam();
        break;
      default:
        this.renderMenuView(mainApp);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // VISTA 1: MENÚ PRINCIPAL
  // ==========================================
  renderMenuView(container) {
    const masteredCount = Object.values(this.user.tablesProgress || {}).filter(p => p >= 100).length;
    const overallProgress = Math.round((masteredCount / 9) * 100);

    container.innerHTML = `
      <div class="menu-dashboard-container">
        <!-- Hero de Bienvenida -->
        <div class="menu-hero-card">
          <div class="hero-left">
            <div class="hero-greeting">¡Hola, ${this.user.name}! 🌟</div>
            <h1 class="hero-headline">¿Qué desafío matemático conquistaremos hoy?</h1>
            <p class="hero-subtext">Aprende las tablas del 2 al 10, supera minijuegos divertidos y prepárate para brillar en tu ensayo SIMCE.</p>
            
            <div class="hero-progress-box">
              <div class="progress-info-row">
                <span>Tu avance global:</span>
                <b>${masteredCount} de 9 tablas dominadas (${overallProgress}%)</b>
              </div>
              <div class="hero-progress-bar">
                <div class="hero-progress-fill" style="width: ${overallProgress}%;"></div>
              </div>
            </div>
          </div>
          <div class="hero-right">
            <img src="${this.user.avatarFile}" alt="${this.user.avatarTitle}" class="hero-avatar-big">
          </div>
        </div>

        <!-- Tarjetas de Navegación del Menú Principal -->
        <div class="menu-cards-grid">
          <!-- Tarjeta 1: Aprender Tablas -->
          <div class="menu-action-card card-learn" id="cardGoTables">
            <div class="card-icon-bubble">🗺️</div>
            <div class="card-body">
              <h3>Mundo de Tablas</h3>
              <p>Explora las tablas del 2 al 10 con grupos visuales, patrones secretos y misiones con estrellas.</p>
              <div class="card-pill">Tablas 2 al 10 • ${masteredCount} Dominadas</div>
            </div>
            <button class="card-action-btn">¡Explorar Tablas! 🚀</button>
          </div>

          <!-- Tarjeta 2: Minijuegos y Desafíos -->
          <div class="menu-action-card card-games" id="cardGoGames">
            <div class="card-icon-bubble">🎮</div>
            <div class="card-body">
              <h3>Juegos y Desafíos</h3>
              <p>7 minijuegos interactivos: Memoria, Atrapa Burbujas, Construye, Quién Dice la Verdad y más.</p>
              <div class="card-pill">7 Juegos Disponibles</div>
            </div>
            <button class="card-action-btn">¡Jugar Ahora! 🕹️</button>
          </div>

          <!-- Tarjeta 3: Ensayo SIMCE 4° Básico -->
          <div class="menu-action-card card-simce" id="cardGoSimce">
            <div class="card-icon-bubble">📝</div>
            <div class="card-body">
              <h3>Ensayo SIMCE</h3>
              <p>10 preguntas reales contextualizadas en compras, ferias, deportes y la vida escolar.</p>
              <div class="card-pill">Evaluación con Retroalimentación</div>
            </div>
            <button class="card-action-btn">¡Comenzar Ensayo! 🇨🇱</button>
          </div>

          <!-- Tarjeta 4: Progreso y Estadísticas -->
          <div class="menu-action-card card-progress" id="cardGoProgress">
            <div class="card-icon-bubble">📊</div>
            <div class="card-body">
              <h3>Mi Progreso</h3>
              <p>Revisa tus puntajes, tablas completadas y tu historial de evaluaciones.</p>
              <div class="card-pill">${this.user.points} Puntos XP</div>
            </div>
            <button class="card-action-btn">Ver Estadísticas 📈</button>
          </div>

          <!-- Tarjeta 5: Logros y Medallas -->
          <div class="menu-action-card card-badges" id="cardGoBadges">
            <div class="card-icon-bubble">🏆</div>
            <div class="card-body">
              <h3>Logros y Medallas</h3>
              <p>Colecciona las 15 insignias mágicas cumpliendo desafíos en cada tabla.</p>
              <div class="card-pill">${(this.user.badges || []).length} Desbloqueadas</div>
            </div>
            <button class="card-action-btn">Ver Trofeos 🎖️</button>
          </div>

          <!-- Tarjeta 6: Misión Especial Trío -->
          <div class="menu-action-card card-special" id="cardGoSpecial">
            <div class="card-icon-bubble">⚡</div>
            <div class="card-body">
              <h3>Misión Especial Trío</h3>
              <p>¡Desafío combinado! Pon a prueba las tablas del 2, 3 y 4 juntas contra el reloj.</p>
              <div class="card-pill">Desafío Relámpago</div>
            </div>
            <button class="card-action-btn">¡Aceptar Misión! 🔥</button>
          </div>
        </div>
      </div>
    `;

    // Eventos de botones
    document.getElementById('cardGoTables').addEventListener('click', () => {
      soundManager.playClick();
      this.navigateTo('tablas');
    });
    document.getElementById('cardGoGames').addEventListener('click', () => {
      soundManager.playClick();
      this.navigateTo('juegos');
    });
    document.getElementById('cardGoSimce').addEventListener('click', () => {
      soundManager.playClick();
      this.navigateTo('simce');
    });
    document.getElementById('cardGoProgress').addEventListener('click', () => {
      soundManager.playClick();
      this.navigateTo('progreso');
    });
    document.getElementById('cardGoBadges').addEventListener('click', () => {
      soundManager.playClick();
      this.navigateTo('logros');
    });
    document.getElementById('cardGoSpecial').addEventListener('click', () => {
      soundManager.playClick();
      this.navigateTo('juego-activo', { game: 'tiempo' });
    });
  }

  // ==========================================
  // VISTA 2: MAPA DE AVANCE DE TABLAS (2 al 10)
  // ==========================================
  renderTablesMapView(container) {
    const tableKeys = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    container.innerHTML = `
      <div class="tables-map-view">
        <div class="section-title-bar">
          <div>
            <h2>🗺️ Mundo de las Tablas (2 al 10)</h2>
            <p>Selecciona una estación numérica para aprender sus secretos visuales y ganar estrellas</p>
          </div>
          <button class="btn-sm btn-accent" id="btnUnlockAll">🔓 Desbloquear Todo (Modo Prueba)</button>
        </div>

        <div class="tables-islands-grid">
          ${tableKeys.map(num => {
            const data = TABLES_DATA[num];
            const isUnlocked = this.user.unlockedTables.includes(num);
            const progress = this.user.tablesProgress[num] || 0;
            const stars = this.user.tablesStars[num] || 0;

            return `
              <div class="table-island-card ${isUnlocked ? 'unlocked' : 'locked'}" data-table="${num}" style="border-top-color: ${data.color};">
                <div class="island-badge" style="background: ${data.color};">
                  ${data.icon}
                </div>
                
                <h3 class="island-title">Tabla del ${num}</h3>
                <div class="island-desc">${data.title.split(':')[1] || ''}</div>

                <div class="island-status-row">
                  ${isUnlocked ? `
                    <div class="island-stars">${'⭐'.repeat(stars) || '☆☆☆'}</div>
                    <div class="island-progress-pill">${progress}% dominado</div>
                  ` : `
                    <div class="island-lock-msg">🔒 Completa la tabla anterior</div>
                  `}
                </div>

                <button class="btn-island-enter ${isUnlocked ? 'btn-active-island' : 'btn-disabled-island'}" ${!isUnlocked ? 'disabled' : ''}>
                  ${isUnlocked ? '¡Aprender y Practicar! 🚀' : 'Bloqueada 🔒'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Eventos en tarjetas
    const cards = container.querySelectorAll('.table-island-card.unlocked');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        soundManager.playClick();
        const num = card.dataset.table;
        this.navigateTo('tabla-detalle', { table: num });
      });
    });

    // Botón para desbloquear todas las tablas (muy útil para profesores / revisores)
    document.getElementById('btnUnlockAll').addEventListener('click', () => {
      soundManager.playFanfare();
      this.user.unlockedTables = [2, 3, 4, 5, 6, 7, 8, 9, 10];
      this.saveUserData();
      this.renderTablesMapView(container);
    });
  }

  // ==========================================
  // VISTA 3: HUB DE JUEGOS Y DESAFÍOS
  // ==========================================
  renderGamesHubView(container) {
    const gamesList = [
      {
        id: "cajas",
        title: "Memoriza y Cajas Anónimas",
        icon: "🎁",
        color: "#F59E0B",
        desc: "¡Memoriza la multiplicación antes de que desaparezca y descubre qué caja anónima tiene el resultado!",
        tag: "Memoria y Misterio"
      },
      {
        id: "memoria",
        title: "Memoria Matemática",
        icon: "🧠",
        color: "#6366F1",
        desc: "Voltea las cartas y encuentra las parejas que unen cada multiplicación con su producto.",
        tag: "Agilidad Mental"
      },
      {
        id: "atrapa",
        title: "Atrapa el Resultado",
        icon: "🎯",
        color: "#EC4899",
        desc: "¡Burbujas flotantes! Pincha velozmente el número correcto antes de que vuele lejos.",
        tag: "Reflejos Rápidos"
      },
      {
        id: "construye",
        title: "Construye la Multiplicación",
        icon: "🧱",
        color: "#10B981",
        desc: "Agrupa canastas y manzanas para formar de manera pictórica la cantidad solicitada.",
        tag: "Comprensión Visual"
      },
      {
        id: "¿quien?",
        idKey: "quien",
        title: "¿Quién tiene la respuesta?",
        icon: "🎭",
        color: "#8B5CF6",
        desc: "Cosmo, Rexi y Chip dicen números distintos. ¿Quién está diciendo la verdad matemática?",
        tag: "Pensamiento Crítico"
      },
      {
        id: "tiempo",
        title: "Fiebre Contra el Reloj",
        icon: "⏱️",
        color: "#F59E0B",
        desc: "Tienes 45 segundos para responder tantas multiplicaciones seguidas como puedas.",
        tag: "Desafío Máximo"
      },
      {
        id: "arrastra",
        title: "Arrastra y Completa",
        icon: "🖐️",
        color: "#06B6D4",
        desc: "Arrastra o toca las fichas numéricas correspondientes para encajarlas en cada operación.",
        tag: "Interactivo Táctil"
      },
      {
        id: "detective",
        title: "Detective Matemático",
        icon: "🕵️",
        color: "#059669",
        desc: "Lee las pistas del caso, analiza múltiplos y descubre cuál es el número secreto sospechoso.",
        tag: "Lógica y Deducción"
      }
    ];

    container.innerHTML = `
      <div class="games-hub-view">
        <div class="section-title-bar">
          <div>
            <h2>🎮 Zona de Juegos y Desafíos Matemáticos</h2>
            <p>Elige un minijuego para entrenar tus habilidades de forma entretenida y ganar puntos</p>
          </div>
        </div>

        <div class="games-cards-grid">
          ${gamesList.map(g => `
            <div class="game-hub-card" data-game="${g.idKey || g.id}">
              <div class="game-hub-icon" style="background:${g.color};">${g.icon}</div>
              <div class="game-hub-badge">${g.tag}</div>
              <h3 class="game-hub-title">${g.title}</h3>
              <p class="game-hub-desc">${g.desc}</p>
              <button class="btn-play-game">¡Jugar Ahora! 🕹️</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.game-hub-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        soundManager.playClick();
        const gameId = card.dataset.game;
        this.navigateTo('juego-activo', { game: gameId });
      });
    });
  }

  launchGame(gameName, tableNum) {
    switch (gameName) {
      case 'cajas':
        tablesExplorer.activeChallenge = 'mystery_memory';
        tablesExplorer.currentTable = tableNum || (Math.floor(Math.random() * 9) + 2);
        tablesExplorer.startMysteryMemoryGame(document.getElementById('gamePlayContainer'));
        break;
      case 'memoria':
        gameManager.startMemoryGame(tableNum);
        break;
      case 'atrapa':
        gameManager.startCatchResultGame();
        break;
      case 'construye':
        gameManager.startBuildMultiplicationGame();
        break;
      case 'quien':
        gameManager.startWhoHasTheAnswerGame();
        break;
      case 'tiempo':
        gameManager.startTimeChallengeGame();
        break;
      case 'arrastra':
        gameManager.startDragAndDropGame();
        break;
      case 'detective':
        gameManager.startDetectiveGame();
        break;
      default:
        gameManager.startMemoryGame();
    }
  }

  // ==========================================
  // VISTA 4: PROGRESO Y ESTADÍSTICAS
  // ==========================================
  renderProgressView(container) {
    const tableKeys = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const simceHistory = this.user.simceAttempts || [];

    container.innerHTML = `
      <div class="progress-dashboard-view">
        <div class="section-title-bar">
          <div>
            <h2>📊 Mi Progreso y Estadísticas</h2>
            <p>Revisa el avance de cada una de tus tablas y tu historial de ensayos</p>
          </div>
          <button class="btn-sm btn-danger" id="btnResetProgress">⚠️ Reiniciar Avance</button>
        </div>

        <!-- Tabla detallada de avance -->
        <div class="progress-tables-summary">
          <h3>Avance por cada Tabla de Multiplicar:</h3>
          <div class="progress-table-rows">
            ${tableKeys.map(num => {
              const p = this.user.tablesProgress[num] || 0;
              const s = this.user.tablesStars[num] || 0;
              const isUnl = this.user.unlockedTables.includes(num);

              return `
                <div class="progress-row-item">
                  <div class="row-num-badge">Tabla del ${num}</div>
                  <div class="row-bar-container">
                    <div class="row-bar-fill" style="width:${p}%;"></div>
                  </div>
                  <div class="row-percent">${p}%</div>
                  <div class="row-stars">${'⭐'.repeat(s) || '☆☆☆'}</div>
                  <div class="row-status ${isUnl ? 'status-open' : 'status-locked'}">
                    ${isUnl ? (p >= 100 ? '✅ Dominada' : '🔓 En práctica') : '🔒 Bloqueada'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Historial SIMCE -->
        <div class="simce-history-card">
          <h3>Historial de Ensayos tipo SIMCE:</h3>
          ${simceHistory.length === 0 ? `
            <div class="empty-history-box">
              <p>Aún no has rendido tu primer ensayo SIMCE.</p>
              <button class="btn-sm btn-accent" id="btnGoFirstSimce" style="margin-top:0.6rem;">¡Rendir Ensayo Ahora! 📝</button>
            </div>
          ` : `
            <div class="history-list">
              ${simceHistory.map((att, idx) => `
                <div class="history-item">
                  <span>Ensayo #${idx + 1} (${att.date})</span>
                  <b>${att.score} / ${att.total} correctas (${att.percent}%)</b>
                  <span class="history-simce-badge">${att.simceScore} Puntos SIMCE</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    const btnGoFirst = document.getElementById('btnGoFirstSimce');
    if (btnGoFirst) {
      btnGoFirst.addEventListener('click', () => {
        soundManager.playClick();
        this.navigateTo('simce');
      });
    }

    document.getElementById('btnResetProgress').addEventListener('click', () => {
      if (confirm('¿Estás seguro de reiniciar tu progreso? Se restablecerán tus puntos y estrellas.')) {
        this.user.points = 0;
        this.user.level = 1;
        this.user.tablesProgress = { "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 };
        this.user.tablesStars = { "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 };
        this.user.unlockedTables = [2, 3];
        this.user.badges = ['novato'];
        this.user.simceAttempts = [];
        this.saveUserData();
        this.renderHeader();
        this.renderProgressView(container);
      }
    });
  }

  // ==========================================
  // VISTA 5: LOGROS Y MEDALLAS (Álbum)
  // ==========================================
  renderBadgesView(container) {
    const userBadges = this.user.badges || [];

    container.innerHTML = `
      <div class="badges-album-view">
        <div class="section-title-bar">
          <div>
            <h2>🏆 Álbum de Logros y Medallas Matemáticas</h2>
            <p>Cumple desafíos para desbloquear y encender cada una de las 15 insignias</p>
          </div>
          <div class="stat-pill">Coleccionadas: <b>${userBadges.length} / ${BADGES_CONFIG.length}</b></div>
        </div>

        <div class="badges-grid">
          ${BADGES_CONFIG.map(b => {
            const isUnlocked = userBadges.includes(b.id);
            return `
              <div class="badge-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
                <div class="badge-icon-wrap" style="${isUnlocked ? `background:${b.color};` : ''}">
                  <span class="badge-icon">${isUnlocked ? b.icon : '🔒'}</span>
                </div>
                <h4 class="badge-name">${b.name}</h4>
                <p class="badge-desc">${b.desc}</p>
                <div class="badge-state-pill">
                  ${isUnlocked ? '✅ Desbloqueado' : 'Por conseguir'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Métodos de actualización de estado
  addPoints(amount) {
    this.user.points = (this.user.points || 0) + amount;
    this.saveUserData();
    this.renderHeader();
    this.showToast(`+${amount} XP Puntos Ganados 🎉`);
  }

  unlockTable(tableNum) {
    if (!this.user.unlockedTables.includes(tableNum)) {
      this.user.unlockedTables.push(tableNum);
      this.saveUserData();
      this.showToast(`🔓 ¡Tabla del ${tableNum} Desbloqueada!`);
    }
  }

  unlockBadge(badgeId) {
    if (!this.user.badges.includes(badgeId)) {
      this.user.badges.push(badgeId);
      this.saveUserData();
      soundManager.playFanfare();
      confettiManager.launch(80);
      const bData = BADGES_CONFIG.find(b => b.id === badgeId);
      if (bData) {
        this.showToast(`🏆 ¡Nuevo Logro Desbloqueado: ${bData.name}!`);
      }
    }
  }

  updateTableProgress(tableNum, percent, stars) {
    this.user.tablesProgress[tableNum] = Math.max(this.user.tablesProgress[tableNum] || 0, percent);
    this.user.tablesStars[tableNum] = Math.max(this.user.tablesStars[tableNum] || 0, stars);
    this.saveUserData();
    this.renderHeader();
  }

  getTableProgress(tableNum) {
    return this.user.tablesProgress[tableNum] || 0;
  }

  getTableStars(tableNum) {
    return this.user.tablesStars[tableNum] || 0;
  }

  saveSimceAttempt(attempt) {
    if (!this.user.simceAttempts) this.user.simceAttempts = [];
    this.user.simceAttempts.push(attempt);
    this.saveUserData();
  }

  showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// Iniciar aplicación
let appManager;
window.addEventListener('DOMContentLoaded', () => {
  appManager = new AppManager();
});

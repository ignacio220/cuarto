// Sistema/JS/tables.js - Módulo de Aprendizaje Interactivo y Desafíos con Juegos (4° Básico)

class TablesExplorer {
  constructor() {
    this.container = null;
    this.currentTable = 2;
    this.currentMultiplier = 4;
    this.activeTab = 'learn'; // 'learn' o 'challenges'
    this.activeChallenge = 'mystery_memory'; // 'mystery_memory', 'speed_ray', 'stars_quiz'

    // Estado del juego de memorizar y cajas anónimas
    this.mysteryGame = {
      round: 1,
      totalRounds: 5,
      score: 0,
      phase: 'prepare', // 'prepare', 'memorize', 'guess', 'round_success'
      currentOp: null,
      memoryTimer: null,
      timeLeft: 4,
      shuffledOptions: [],
      revealedBoxes: {}
    };

    // Estado del quiz de estrellas
    this.quizGame = {
      index: 0,
      score: 0,
      questions: []
    };
  }

  init(containerElement) {
    this.container = containerElement;
  }

  openTable(tableNumber) {
    this.currentTable = parseInt(tableNumber, 10);
    this.currentMultiplier = 3;
    // Si la tabla no tiene desafios desbloqueados previamente, empezamos en aprendizaje
    const isUnlocked = this.isChallengesUnlocked();
    this.activeTab = isUnlocked ? 'challenges' : 'learn';
    this.renderTableView();
  }

  isChallengesUnlocked() {
    if (!appManager || !appManager.user) return false;
    const unlockedList = appManager.user.unlockedChallenges || [];
    // Si ya tiene progreso en la tabla o está en la lista de desafíos desbloqueados
    const progress = appManager.getTableProgress(this.currentTable);
    return progress > 0 || unlockedList.includes(this.currentTable);
  }

  unlockChallengesForCurrentTable() {
    if (!appManager || !appManager.user) return;
    if (!appManager.user.unlockedChallenges) {
      appManager.user.unlockedChallenges = [];
    }
    if (!appManager.user.unlockedChallenges.includes(this.currentTable)) {
      appManager.user.unlockedChallenges.push(this.currentTable);
      appManager.saveUserData();
    }
  }

  renderTableView() {
    const data = TABLES_DATA[this.currentTable];
    if (!data) return;

    const progress = appManager.getTableProgress(this.currentTable);
    const stars = appManager.getTableStars(this.currentTable);
    const challengesUnlocked = this.isChallengesUnlocked();
    const studentUser = appManager.user || { name: 'Estudiante', avatarFile: 'IMAGEN/avatar-cosmo.svg' };

    this.container.innerHTML = `
      <div class="table-view-container">
        <!-- Banner Superior de la Tabla -->
        <div class="table-hero-banner" style="background: ${data.bgGradient};">
          <button class="btn-back-map" id="btnBackToMap">⬅ Volver al Mapa de Tablas</button>
          <div class="hero-content">
            <span class="hero-icon">${data.icon}</span>
            <div>
              <h2 class="hero-title">${data.title}</h2>
              <p class="hero-subtitle">Primero aprende paso a paso y luego supera los desafíos y juegos</p>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat-item">
              <span>Progreso</span>
              <b>${progress}%</b>
            </div>
            <div class="hero-stat-item">
              <span>Estrellas</span>
              <b>${'⭐'.repeat(stars) || '☆☆☆'}</b>
            </div>
          </div>
        </div>

        <!-- Barra de Pasos / Fases Obligatorias: 1. APRENDER PRIMERO -> 2. DESAFÍOS Y JUEGOS -->
        <div class="table-steps-nav">
          <button class="step-nav-btn ${this.activeTab === 'learn' ? 'active' : ''}" id="btnTabLearn">
            <span class="step-num">1</span>
            <span class="step-label">📖 ¡Primero Aprendo!</span>
            <span class="step-badge">Paso Obligatorio</span>
          </button>
          <button class="step-nav-btn ${this.activeTab === 'challenges' ? 'active' : ''} ${!challengesUnlocked ? 'step-locked' : ''}" id="btnTabChallenges">
            <span class="step-num">${challengesUnlocked ? '2' : '🔒'}</span>
            <span class="step-label">🎮 ¡Zona de Desafíos y Juegos!</span>
            <span class="step-badge">${challengesUnlocked ? '¡Desbloqueado!' : 'Requiere Aprender'}</span>
          </button>
        </div>

        <!-- Contenedor de la Fase Activa -->
        <div id="tablePhaseContainer" class="table-phase-container">
          <!-- Se inyecta Fase 1 o Fase 2 -->
        </div>
      </div>
    `;

    // Eventos
    document.getElementById('btnBackToMap').addEventListener('click', () => {
      soundManager.playClick();
      appManager.navigateTo('tablas');
    });

    document.getElementById('btnTabLearn').addEventListener('click', () => {
      soundManager.playClick();
      this.activeTab = 'learn';
      this.renderTableView();
    });

    document.getElementById('btnTabChallenges').addEventListener('click', () => {
      if (!this.isChallengesUnlocked()) {
        soundManager.playError();
        this.showLearnFirstModal();
      } else {
        soundManager.playClick();
        this.activeTab = 'challenges';
        this.renderTableView();
      }
    });

    if (this.activeTab === 'learn') {
      this.renderLearnPhase();
    } else {
      this.renderChallengesPhase();
    }
  }

  // ==========================================================
  // FASE 1: 📖 ¡PRIMERO APRENDO! (Interactivo, visual y animado)
  // ==========================================================
  renderLearnPhase() {
    const phaseContainer = document.getElementById('tablePhaseContainer');
    if (!phaseContainer) return;

    const data = TABLES_DATA[this.currentTable];
    const user = appManager.user || { name: 'Amigo', avatarFile: 'IMAGEN/avatar-cosmo.svg' };

    phaseContainer.innerHTML = `
      <div class="learn-phase-view">
        <!-- Globo de Diálogo de la Mascota Guía -->
        <div class="mascot-guide-card">
          <img src="${user.avatarFile}" alt="Avatar" class="mascot-img-guide">
          <div class="mascot-bubble">
            <div class="mascot-bubble-title">¡Hola, ${user.name}! 🌟</div>
            <p>
              ¡Primero vamos a descubrir y entender cómo funciona la <b>Tabla del ${this.currentTable}</b>!
              Toca los números abajo para ver cómo se agrupan los objetos y se suman paso a paso.
              Cuando estés listo, presiona el botón dorado para desbloquear los desafíos.
            </p>
          </div>
        </div>

        <!-- Selector de Multiplicador Interactivo -->
        <div class="learn-visual-card">
          <div class="learn-card-header">
            <h3>Paso A: Elige la multiplicación que deseas explorar:</h3>
            <div class="multiplier-slider-row">
              <span class="mult-prefix">${this.currentTable} × </span>
              <div class="multiplier-bubbles" id="learnMultBubbles">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => `
                  <button class="m-bubble ${m === this.currentMultiplier ? 'active' : ''}" data-m="${m}">
                    ${m}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Ecuación Gigante con Animación y Suma Iterada -->
          <div class="equation-display-card">
            <div class="main-equation" id="learnMainEq">
              ${this.currentTable} × ${this.currentMultiplier} = <span class="eq-result">${this.currentTable * this.currentMultiplier}</span>
            </div>
            <div class="sum-representation" id="learnSumRep">
              <!-- Suma dinámica -->
            </div>
            <button class="btn-sound-speech" id="btnHearEquation">
              <span>🔊 Escuchar lectura en voz alta</span>
            </button>
          </div>

          <!-- Escenario Pictórico Animado de Grupos -->
          <div class="pictorial-stage" id="learnPictorialStage">
            <!-- Cajas de objetos animados -->
          </div>
        </div>

        <!-- Paso B: El Patrón Secreto y Truco del Mago -->
        <div class="secret-pattern-card">
          <div class="pattern-header">
            <span class="pattern-icon">💡</span>
            <div>
              <h3>Paso B: El Patrón Secreto de la Tabla del ${this.currentTable}</h3>
              <p>${data.pattern}</p>
            </div>
          </div>
          <div class="pattern-tip-box">
            ${data.tip}
          </div>
        </div>

        <!-- Paso C: Lista Completa de la Tabla -->
        <div class="full-table-summary-card">
          <h3 class="summary-card-title">Paso C: Todas las operaciones de la Tabla del ${this.currentTable}</h3>
          <div class="full-table-grid">
            ${Array.from({ length: 10 }).map((_, i) => {
              const num = i + 1;
              const res = this.currentTable * num;
              return `
                <div class="table-row-card">
                  <span class="row-op">${this.currentTable} × ${num}</span>
                  <span class="row-equal">=</span>
                  <span class="row-res">${res}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- BOTÓN DE GRADUACIÓN / DESBLOQUEAR DESAFÍOS -->
        <div class="unlock-challenges-cta-card">
          <div class="cta-icon">🎓</div>
          <div class="cta-content">
            <h3>¡Ya revisaste el aprendizaje!</h3>
            <p>¿Comprendiste cómo funciona la tabla del ${this.currentTable}? ¡Es hora de poner a prueba tu memoria y habilidades con los juegos interactivos!</p>
          </div>
          <button class="btn-unlock-challenges-cta" id="btnUnlockChallenges">
            <span>¡Desbloquear Zona de Desafíos y Juegos!</span>
            <span>🚀🔓</span>
          </button>
        </div>
      </div>
    `;

    // Multiplier bubbles events
    const mBubbles = phaseContainer.querySelectorAll('.m-bubble');
    mBubbles.forEach(b => {
      b.addEventListener('click', () => {
        soundManager.playPop();
        this.currentMultiplier = parseInt(b.dataset.m, 10);
        mBubbles.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        this.updateLearnVisualStage();
      });
    });

    document.getElementById('btnHearEquation').addEventListener('click', () => {
      this.speakEquation();
    });

    // Botón para desbloquear desafíos
    document.getElementById('btnUnlockChallenges').addEventListener('click', () => {
      soundManager.playFanfare();
      soundManager.playStar();
      confettiManager.launch(90);
      this.unlockChallengesForCurrentTable();

      // Animación y cambio de pestaña
      const btn = document.getElementById('btnUnlockChallenges');
      btn.innerHTML = '<span>¡Desafíos Desbloqueados!</span> <span>🎉✨</span>';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

      setTimeout(() => {
        this.activeTab = 'challenges';
        this.renderTableView();
      }, 700);
    });

    this.updateLearnVisualStage();
  }

  updateLearnVisualStage() {
    const data = TABLES_DATA[this.currentTable];
    const total = this.currentTable * this.currentMultiplier;

    // Actualizar ecuación
    const eqEl = document.getElementById('learnMainEq');
    if (eqEl) {
      eqEl.innerHTML = `${this.currentTable} × ${this.currentMultiplier} = <span class="eq-result">${total}</span>`;
    }

    // Actualizar suma iterada
    const sumEl = document.getElementById('learnSumRep');
    if (sumEl) {
      const parts = Array(this.currentTable).fill(this.currentMultiplier);
      sumEl.innerHTML = `
        <span>Significa <b>${this.currentTable} grupos</b> de <b>${this.currentMultiplier}</b>:</span>
        <div class="sum-tokens">${parts.join(' + ')} = <b>${total}</b></div>
      `;
    }

    // Dibujar grupos pictóricos con animación de rebote escalonada
    const stage = document.getElementById('learnPictorialStage');
    if (stage) {
      stage.innerHTML = `
        <div class="groups-layout">
          ${Array.from({ length: this.currentTable }).map((_, gIdx) => `
            <div class="pictorial-group-box" style="animation-delay: ${gIdx * 0.08}s;">
              <div class="group-header">Grupo ${gIdx + 1}</div>
              <div class="group-items-grid">
                ${Array.from({ length: this.currentMultiplier }).map((_, iIdx) => `
                  <span class="pictorial-item" style="animation-delay: ${(gIdx * 0.08) + (iIdx * 0.03)}s;" title="${data.itemName}">
                    ${data.itemEmoji}
                  </span>
                `).join('')}
              </div>
              <div class="group-count">${this.currentMultiplier} ${data.itemName}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  speakEquation() {
    soundManager.playStar();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${this.currentTable} por ${this.currentMultiplier} es igual a ${this.currentTable * this.currentMultiplier}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CL';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }

  showLearnFirstModal() {
    const modalEl = document.createElement('div');
    modalEl.className = 'game-victory-modal-overlay';
    modalEl.innerHTML = `
      <div class="game-victory-modal-card">
        <div class="victory-icon">🔒</div>
        <h2 class="victory-title">¡Primero debemos aprender!</h2>
        <p class="victory-message">
          Para que los desafíos sean divertidos y fáciles, primero explora la pestaña <b>"1. ¡Primero Aprendo!"</b>.
          ¡Solo toma un minuto y luego se abrirán los juegos!
        </p>
        <div class="victory-buttons">
          <button class="btn-submit" id="btnModalGoLearn">
            <span>¡Vamos a Aprender! 📖</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    document.getElementById('btnModalGoLearn').addEventListener('click', () => {
      soundManager.playClick();
      modalEl.remove();
      this.activeTab = 'learn';
      this.renderTableView();
    });
  }

  // ==========================================================
  // FASE 2: 🎮 ¡ZONA DE DESAFÍOS Y JUEGOS!
  // ==========================================================
  renderChallengesPhase() {
    const phaseContainer = document.getElementById('tablePhaseContainer');
    if (!phaseContainer) return;

    phaseContainer.innerHTML = `
      <div class="challenges-phase-view">
        <!-- Sub-navegación entre los juegos de la tabla -->
        <div class="challenges-tabs-bar">
          <button class="ch-tab-btn ${this.activeChallenge === 'mystery_memory' ? 'active' : ''}" id="btnChMystery">
            <span>🎁</span> <span>Juego: Memoriza y Descubre las Cajas Anónimas</span>
          </button>
          <button class="ch-tab-btn ${this.activeChallenge === 'speed_ray' ? 'active' : ''}" id="btnChSpeed">
            <span>⚡</span> <span>Rayo Veloz de la Tabla</span>
          </button>
          <button class="ch-tab-btn ${this.activeChallenge === 'stars_quiz' ? 'active' : ''}" id="btnChQuiz">
            <span>⭐</span> <span>Desafío de las 3 Estrellas</span>
          </button>
        </div>

        <!-- Contenedor del desafío seleccionado -->
        <div id="activeChallengeContainer" class="active-challenge-container">
          <!-- Renderizado dinámico -->
        </div>
      </div>
    `;

    document.getElementById('btnChMystery').addEventListener('click', () => {
      soundManager.playClick();
      this.activeChallenge = 'mystery_memory';
      this.renderChallengesPhase();
    });

    document.getElementById('btnChSpeed').addEventListener('click', () => {
      soundManager.playClick();
      this.activeChallenge = 'speed_ray';
      this.renderChallengesPhase();
    });

    document.getElementById('btnChQuiz').addEventListener('click', () => {
      soundManager.playClick();
      this.activeChallenge = 'stars_quiz';
      this.renderChallengesPhase();
    });

    const activeContainer = document.getElementById('activeChallengeContainer');
    if (this.activeChallenge === 'mystery_memory') {
      this.startMysteryMemoryGame(activeContainer);
    } else if (this.activeChallenge === 'speed_ray') {
      this.startSpeedRayChallenge(activeContainer);
    } else {
      this.startStarsQuiz(activeContainer);
    }
  }

  // =========================================================================
  // JUEGO ESTRELLA: "MEMORIZA Y DESCUBRE LAS CAJAS ANÓNIMAS" (Mystery Memory)
  // =========================================================================
  startMysteryMemoryGame(container) {
    if (!container) return;

    if (this.mysteryGame.memoryTimer) {
      clearInterval(this.mysteryGame.memoryTimer);
      this.mysteryGame.memoryTimer = null;
    }

    this.mysteryGame.round = 1;
    this.mysteryGame.score = 0;
    this.mysteryGame.totalRounds = 5;

    this.runMysteryRound(container);
  }

  runMysteryRound(container) {
    if (this.mysteryGame.memoryTimer) {
      clearInterval(this.mysteryGame.memoryTimer);
      this.mysteryGame.memoryTimer = null;
    }

    // Elegir un multiplicador aleatorio para esta ronda
    const mult = Math.floor(Math.random() * 10) + 1;
    const correct = this.currentTable * mult;

    // Crear 4 opciones de resultados (1 correcta + 3 falsas anónimas)
    const options = new Set([correct]);
    while (options.size < 4) {
      const offset = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = correct + offset;
      if (wrong > 0 && wrong !== correct) {
        options.add(wrong);
      }
    }
    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

    this.mysteryGame.currentOp = { mult, correct };
    this.mysteryGame.shuffledOptions = shuffled;
    this.mysteryGame.revealedBoxes = {};
    this.mysteryGame.timeLeft = 4;
    this.mysteryGame.phase = 'memorize';

    // RENDERIZAR PANTALLA DE MEMORIZACIÓN
    container.innerHTML = `
      <div class="mystery-game-wrapper">
        <div class="mystery-header-bar">
          <div class="mystery-title">
            <span class="m-icon">🎁</span>
            <div>
              <h3>Memoriza y Descubre las Cajas Anónimas</h3>
              <p>Ronda <b>${this.mysteryGame.round} de ${this.mysteryGame.totalRounds}</b> • Aciertos: <b>${this.mysteryGame.score}</b></p>
            </div>
          </div>
          <div class="mystery-status-badge">
            <span id="mysteryStageLabel">👀 Fase 1: ¡Observa y Memoriza!</span>
          </div>
        </div>

        <!-- FASE 1: TARJETA GIGANTE DE MEMORIZACIÓN CON TEMPORIZADOR -->
        <div id="memoryFlashZone" class="memory-flash-zone">
          <div class="flash-card-memory" id="flashCard">
            <div class="flash-banner">¡MEMORIZA LA OPERACIÓN Y EL RESULTADO!</div>
            
            <div class="flash-equation-big">
              ${this.currentTable} × ${mult} = <span class="flash-result-highlight">${correct}</span>
            </div>

            <div class="flash-timer-wrapper">
              <div class="flash-timer-label">Tiempo para memorizar:</div>
              <div class="flash-timer-circle" id="flashTimerCircle">
                <span id="flashTimerNum">${this.mysteryGame.timeLeft}</span>
              </div>
              <div class="flash-progress-bar">
                <div class="flash-progress-fill" id="flashProgressFill" style="width: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- FASE 2: ZONA DE CAJAS ANÓNIMAS (Inicialmente oculta hasta terminar de memorizar) -->
        <div id="mysteryBoxesZone" class="mystery-boxes-zone" style="display:none;">
          <div class="mystery-mission-card">
            <div class="mission-question">
              ¿Cuál era el resultado de: <b style="color:var(--primary); font-size:1.8rem;">${this.currentTable} × ${mult} = ?</b>
            </div>
            <p class="mission-hint">
              ¡Todas las cajas son anónimas! Abre la caja donde creas que está escondido el <b>resultado correcto</b>:
            </p>
          </div>

          <div class="anonymous-boxes-grid" id="anonymousBoxesGrid">
            ${shuffled.map((val, idx) => `
              <div class="mystery-box-card" data-val="${val}" data-idx="${idx}">
                <div class="box-lid">🎁</div>
                <div class="box-face">
                  <span class="box-question-mark">?</span>
                  <span class="box-secret-number" style="display:none;">${val}</span>
                </div>
                <div class="box-footer-label">Caja ${idx + 1}</div>
              </div>
            `).join('')}
          </div>

          <div id="mysteryFeedbackBanner" class="game-feedback-banner" style="display:none; margin-top:1.5rem;"></div>
        </div>
      </div>
    `;

    // Iniciar cuenta regresiva para memorizar
    const timerNum = document.getElementById('flashTimerNum');
    const progressFill = document.getElementById('flashProgressFill');
    const flashCard = document.getElementById('flashCard');

    this.mysteryGame.memoryTimer = setInterval(() => {
      this.mysteryGame.timeLeft--;
      soundManager.playTick();

      if (timerNum) timerNum.textContent = this.mysteryGame.timeLeft;
      if (progressFill) {
        const pct = (this.mysteryGame.timeLeft / 4) * 100;
        progressFill.style.width = `${pct}%`;
      }

      if (this.mysteryGame.timeLeft <= 0) {
        clearInterval(this.mysteryGame.memoryTimer);
        this.mysteryGame.memoryTimer = null;

        // ¡PUF MÁGICO! Animación de desaparición de la tarjeta
        if (flashCard) {
          flashCard.classList.add('flash-vanish');
        }

        setTimeout(() => {
          this.transitionToMysteryBoxes(container);
        }, 500);
      }
    }, 1000);
  }

  transitionToMysteryBoxes(container) {
    this.mysteryGame.phase = 'guess';

    const flashZone = document.getElementById('memoryFlashZone');
    const boxesZone = document.getElementById('mysteryBoxesZone');
    const stageLabel = document.getElementById('mysteryStageLabel');

    if (flashZone) flashZone.style.display = 'none';
    if (boxesZone) {
      boxesZone.style.display = 'block';
      boxesZone.classList.add('animate-pop-in');
    }
    if (stageLabel) {
      stageLabel.textContent = '🕵️‍♂️ Fase 2: ¡Descubre la Caja Correcta!';
      stageLabel.style.background = '#FEF3C7';
      stageLabel.style.color = '#B45309';
    }

    // Configurar clics en las cajas anónimas
    const boxes = container.querySelectorAll('.mystery-box-card');
    const feedback = document.getElementById('mysteryFeedbackBanner');
    let roundFinished = false;

    boxes.forEach(box => {
      box.addEventListener('click', () => {
        if (roundFinished || box.classList.contains('opened')) return;

        const val = parseInt(box.dataset.val, 10);
        const correct = this.mysteryGame.currentOp.correct;
        const op = this.mysteryGame.currentOp;

        // Animación de apertura de cofre / caja
        box.classList.add('opened');
        soundManager.playChestOpen();

        const questionMark = box.querySelector('.box-question-mark');
        const secretNumber = box.querySelector('.box-secret-number');
        if (questionMark) questionMark.style.display = 'none';
        if (secretNumber) {
          secretNumber.style.display = 'block';
          secretNumber.classList.add('number-revealed');
        }

        if (val === correct) {
          // ¡ACIERTO! Encontró la caja anónima con el resultado memorizado
          roundFinished = true;
          box.classList.add('box-correct');
          soundManager.playSuccess();
          soundManager.playStar();
          confettiManager.launch(70);

          this.mysteryGame.score++;

          feedback.className = 'game-feedback-banner feedback-success';
          feedback.innerHTML = `🎉 ¡INCREÍBLE MEMORIA! Descubriste la caja con el <b>${correct}</b> (${this.currentTable} × ${op.mult} = ${correct}).`;
          feedback.style.display = 'block';

          // Revelar todas las demás cajas con suavidad
          boxes.forEach(b => {
            b.classList.add('opened');
            const qm = b.querySelector('.box-question-mark');
            const sn = b.querySelector('.box-secret-number');
            if (qm) qm.style.display = 'none';
            if (sn) sn.style.display = 'block';
          });

          setTimeout(() => {
            if (this.mysteryGame.round < this.mysteryGame.totalRounds) {
              this.mysteryGame.round++;
              this.runMysteryRound(container);
            } else {
              this.finishMysteryGame(container);
            }
          }, 1800);
        } else {
          // Fallo suave: muestra el número de esa caja pero permite seguir buscando
          box.classList.add('box-wrong');
          soundManager.playError();

          feedback.className = 'game-feedback-banner feedback-error';
          feedback.innerHTML = `💡 En esta caja estaba el <b>${val}</b>. ¡Ese no era el resultado que memorizaste! ¡Abre otra caja anónima!`;
          feedback.style.display = 'block';
        }
      });
    });
  }

  finishMysteryGame(container) {
    soundManager.playFanfare();
    confettiManager.launch(100);

    const earnedXP = this.mysteryGame.score * 15;
    appManager.addPoints(earnedXP);
    if (this.mysteryGame.score >= 4) {
      appManager.unlockBadge('juego_memoria');
    }

    container.innerHTML = `
      <div class="mystery-victory-card">
        <div class="victory-icon">🏆</div>
        <h2>¡Misión de Cajas Anónimas Completada!</h2>
        <p>Acertaste <b>${this.mysteryGame.score} de ${this.mysteryGame.totalRounds}</b> rondas de memorización en la Tabla del ${this.currentTable}.</p>
        <p class="victory-xp-earned">+${earnedXP} Puntos XP ganados para tu perfil 🌟</p>

        <div class="result-actions">
          <button class="btn-submit" id="btnRestartMystery">
            <span>Jugar Otra Partida 🔄</span>
          </button>
          <button class="btn-secondary" id="btnGoStarsQuiz">
            <span>Ir al Desafío de Estrellas ⭐</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnRestartMystery').addEventListener('click', () => {
      soundManager.playClick();
      this.startMysteryMemoryGame(container);
    });

    document.getElementById('btnGoStarsQuiz').addEventListener('click', () => {
      soundManager.playClick();
      this.activeChallenge = 'stars_quiz';
      this.renderChallengesPhase();
    });
  }

  // =========================================================================
  // JUEGO 2: RAYO VELOZ DE LA TABLA (Contra el reloj)
  // =========================================================================
  startSpeedRayChallenge(container) {
    let timeLeft = 30;
    let score = 0;
    let timer = null;
    let isOver = false;

    const renderProblem = () => {
      if (isOver) return;
      const mult = Math.floor(Math.random() * 10) + 1;
      const correct = this.currentTable * mult;

      const opts = new Set([correct]);
      while (opts.size < 4) {
        const offset = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const wrong = correct + offset;
        if (wrong > 0 && wrong !== correct) opts.add(wrong);
      }
      const shuffled = Array.from(opts).sort(() => Math.random() - 0.5);

      container.innerHTML = `
        <div class="speed-ray-card">
          <div class="speed-ray-header">
            <h3>⚡ Rayo Veloz: Tabla del ${this.currentTable}</h3>
            <div class="speed-stats-row">
              <span class="speed-timer-pill">⏳ <b id="speedTimer">${timeLeft}s</b></span>
              <span class="speed-score-pill">Aciertos: <b id="speedScore">${score}</b></span>
            </div>
          </div>

          <div class="speed-question-box">
            <div class="speed-eq">${this.currentTable} × ${mult} = ?</div>
          </div>

          <div class="speed-options-grid">
            ${shuffled.map(o => `<button class="btn-speed-opt" data-val="${o}">${o}</button>`).join('')}
          </div>
        </div>
      `;

      const buttons = container.querySelectorAll('.btn-speed-opt');
      buttons.forEach(b => {
        b.addEventListener('click', () => {
          if (isOver) return;
          const chosen = parseInt(b.dataset.val, 10);
          if (chosen === correct) {
            soundManager.playPop();
            score++;
            b.classList.add('opt-correct');
            setTimeout(renderProblem, 150);
          } else {
            soundManager.playError();
            b.classList.add('opt-wrong');
            setTimeout(renderProblem, 350);
          }
        });
      });
    };

    renderProblem();

    timer = setInterval(() => {
      timeLeft--;
      const timerEl = document.getElementById('speedTimer');
      if (timerEl) timerEl.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        isOver = true;
        soundManager.playFanfare();
        confettiManager.launch(80);
        const earned = score * 10;
        appManager.addPoints(earned);

        container.innerHTML = `
          <div class="practice-result-card">
            <div class="result-stars">⚡</div>
            <h2>¡Tiempo Cumplido en el Rayo Veloz!</h2>
            <p>Lograste responder <b>${score} operaciones</b> de la tabla del ${this.currentTable}.</p>
            <p>+${earned} Puntos ganados 🚀</p>
            <div class="result-actions">
              <button class="btn-submit" id="btnRestartSpeed">Jugar de Nuevo ⚡</button>
            </div>
          </div>
        `;

        document.getElementById('btnRestartSpeed').addEventListener('click', () => {
          soundManager.playClick();
          this.startSpeedRayChallenge(container);
        });
      }
    }, 1000);
  }

  // =========================================================================
  // DESAFÍO 3: EL QUIZ DE LAS 3 ESTRELLAS (Superar para desbloquear mapas)
  // =========================================================================
  startStarsQuiz(container) {
    this.quizGame.index = 0;
    this.quizGame.score = 0;

    const questions = [];
    const usedMults = new Set();
    while (questions.length < 5) {
      const m = Math.floor(Math.random() * 10) + 1;
      if (!usedMults.has(m)) {
        usedMults.add(m);
        const correct = this.currentTable * m;
        const options = new Set([correct]);
        while (options.size < 4) {
          const delta = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
          const wrong = correct + delta;
          if (wrong > 0 && wrong !== correct) options.add(wrong);
        }
        questions.push({
          multiplier: m,
          correct,
          options: Array.from(options).sort(() => Math.random() - 0.5)
        });
      }
    }
    this.quizGame.questions = questions;

    const renderQ = () => {
      const q = this.quizGame.questions[this.quizGame.index];

      container.innerHTML = `
        <div class="practice-quiz-card">
          <div class="quiz-status-header">
            <span>Pregunta ${this.quizGame.index + 1} de 5</span>
            <div class="quiz-stars-preview">
              ${'⭐'.repeat(this.quizGame.score)}${'☆'.repeat(5 - this.quizGame.score)}
            </div>
          </div>

          <div class="quiz-question-box">
            <div class="quiz-prompt">¿Cuál es el resultado de la siguiente operación?</div>
            <div class="quiz-big-equation">${this.currentTable} × ${q.multiplier} = <span style="color:var(--accent);">?</span></div>
            <button class="btn-hint" id="btnQuizHint">💡 Ver pista rápida</button>
            <div class="hint-text" id="hintBox" style="display:none;">
              Recuerda: puedes sumar ${q.multiplier} un total de ${this.currentTable} veces, o usar el truco de la tabla.
            </div>
          </div>

          <div class="quiz-options-grid">
            ${q.options.map(opt => `
              <button class="quiz-opt-btn" data-val="${opt}">${opt}</button>
            `).join('')}
          </div>

          <div id="quizFeedback" class="game-feedback-banner" style="display:none; margin-top:1.25rem;"></div>
        </div>
      `;

      document.getElementById('btnQuizHint').addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('hintBox').style.display = 'block';
      });

      const buttons = container.querySelectorAll('.quiz-opt-btn');
      const feedback = document.getElementById('quizFeedback');

      buttons.forEach(b => {
        b.addEventListener('click', () => {
          const chosen = parseInt(b.dataset.val, 10);
          buttons.forEach(btn => btn.disabled = true);

          if (chosen === q.correct) {
            soundManager.playSuccess();
            b.classList.add('opt-correct');
            this.quizGame.score++;
            feedback.className = 'game-feedback-banner feedback-success';
            feedback.innerHTML = `🎉 ¡Correcto! ${this.currentTable} × ${q.multiplier} = ${q.correct}`;
            feedback.style.display = 'block';
          } else {
            soundManager.playError();
            b.classList.add('opt-wrong');
            buttons.forEach(btn => {
              if (parseInt(btn.dataset.val, 10) === q.correct) btn.classList.add('opt-correct');
            });
            feedback.className = 'game-feedback-banner feedback-error';
            feedback.innerHTML = `💡 La respuesta correcta es <b>${q.correct}</b>. ¡Sigue adelante, vas muy bien!`;
            feedback.style.display = 'block';
          }

          setTimeout(() => {
            this.quizGame.index++;
            if (this.quizGame.index < 5) {
              renderQ();
            } else {
              this.finishStarsQuiz(container);
            }
          }, 1400);
        });
      });
    };

    renderQ();
  }

  finishStarsQuiz(container) {
    const starsEarned = this.quizGame.score >= 5 ? 3 : this.quizGame.score >= 3 ? 2 : 1;
    const progressPercent = Math.min(100, Math.round((this.quizGame.score / 5) * 100));

    appManager.updateTableProgress(this.currentTable, progressPercent, starsEarned);
    appManager.addPoints(this.quizGame.score * 10);

    if (this.quizGame.score >= 3 && this.currentTable < 10) {
      appManager.unlockTable(this.currentTable + 1);
    }
    if (this.quizGame.score >= 4) {
      appManager.unlockBadge(`tabla_${this.currentTable}`);
    }

    soundManager.playFanfare();
    confettiManager.launch(85);

    container.innerHTML = `
      <div class="practice-result-card">
        <div class="result-stars">${'⭐'.repeat(starsEarned)}</div>
        <h2>¡Desafío de Estrellas Superado!</h2>
        <p>Acertaste <b>${this.quizGame.score} de 5</b> preguntas.</p>
        <p>Progreso alcanzado en esta tabla: <b>${progressPercent}%</b></p>
        <p>¡Ganaste +${this.quizGame.score * 10} Puntos de experiencia!</p>
        ${this.currentTable < 10 ? `
          <div class="unlock-alert-box">
            🔓 ¡Has desbloqueado el acceso a la <b>Tabla del ${this.currentTable + 1}</b> en el mapa general!
          </div>
        ` : `
          <div class="unlock-alert-box">
            👑 ¡Has dominado la última tabla del reino! ¡Estás listo para el Ensayo SIMCE!
          </div>
        `}

        <div class="result-actions">
          <button class="btn-submit" id="btnRepeatQuiz">
            <span>Repetir para Mejorar ⭐</span>
          </button>
          <button class="btn-secondary" id="btnQuizBackMap">
            <span>Volver al Mapa de Tablas 🗺️</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnRepeatQuiz').addEventListener('click', () => {
      soundManager.playClick();
      this.startStarsQuiz(container);
    });

    document.getElementById('btnQuizBackMap').addEventListener('click', () => {
      soundManager.playClick();
      appManager.navigateTo('tablas');
    });
  }
}

const tablesExplorer = new TablesExplorer();

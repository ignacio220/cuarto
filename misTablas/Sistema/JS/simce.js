// Sistema/JS/simce.js - Simulador de Ensayo Matemático tipo SIMCE (4° Básico)

class SimceManager {
  constructor() {
    this.container = null;
    this.currentIndex = 0;
    this.userAnswers = {}; // { questionId: selectedIndex }
    this.questions = SIMCE_QUESTIONS;
    this.isCompleted = false;
  }

  init(containerElement) {
    this.container = containerElement;
  }

  startExam() {
    this.currentIndex = 0;
    this.userAnswers = {};
    this.isCompleted = false;
    this.renderExamView();
  }

  renderExamView() {
    const q = this.questions[this.currentIndex];
    const totalQ = this.questions.length;
    const answeredCount = Object.keys(this.userAnswers).length;

    this.container.innerHTML = `
      <div class="simce-exam-layout">
        <!-- Sidebar lateral con las 10 preguntas -->
        <aside class="simce-sidebar">
          <div class="sidebar-header">
            <span class="simce-badge">🇨🇱 SIMCE 4° BÁSICO</span>
            <h3>Hoja de Respuestas</h3>
            <div class="progress-pill">
              Respondidas: <b>${answeredCount}/${totalQ}</b>
            </div>
          </div>

          <div class="question-nav-grid" id="questionNavGrid">
            ${this.questions.map((item, idx) => {
              const isAnswered = this.userAnswers[item.id] !== undefined;
              const isCurrent = idx === this.currentIndex;
              return `
                <button 
                  class="q-nav-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}" 
                  data-idx="${idx}"
                  title="Pregunta ${idx + 1}"
                >
                  <span class="nav-q-num">${idx + 1}</span>
                  <span class="nav-q-status">${isAnswered ? '✓' : '•'}</span>
                </button>
              `;
            }).join('')}
          </div>

          <div class="sidebar-legend">
            <div class="legend-item"><span class="legend-dot dot-current"></span> Actual</div>
            <div class="legend-item"><span class="legend-dot dot-answered"></span> Respondida</div>
            <div class="legend-item"><span class="legend-dot dot-pending"></span> Pendiente</div>
          </div>

          <div class="sidebar-actions">
            <button class="btn-finish-exam" id="btnFinishExam">
              <span>Finalizar Ensayo</span> <span>🏁</span>
            </button>
          </div>
        </aside>

        <!-- Área Principal de la Pregunta -->
        <main class="simce-main-content">
          <div class="simce-question-header">
            <div class="q-badge-info">
              <span class="q-icon-decor">${q.icon}</span>
              <div>
                <h2>${q.title}</h2>
                <div class="q-subtag">Eje: Números y Operaciones • Resolución de problemas</div>
              </div>
            </div>
            <div class="q-pagination-info">Pregunta ${this.currentIndex + 1} de ${totalQ}</div>
          </div>

          <!-- Tarjeta de Contexto y Problema -->
          <div class="simce-problem-card">
            <div class="problem-context-box">
              <span class="context-label">📖 Situación Contextualizada:</span>
              <p class="context-text">${q.context}</p>
            </div>

            <div class="problem-question-box">
              <span class="question-label">❓ Pregunta:</span>
              <p class="question-text">${q.problem}</p>
            </div>

            <div class="problem-scheme-badge">
              <span>Esquema de apoyo:</span>
              <b>${q.scheme}</b>
            </div>
          </div>

          <!-- Opciones A, B, C, D -->
          <div class="simce-options-list" id="simceOptionsList">
            ${q.options.map((opt, optIdx) => {
              const isSelected = this.userAnswers[q.id] === optIdx;
              return `
                <button class="simce-opt-row ${isSelected ? 'selected' : ''}" data-opt-idx="${optIdx}">
                  <span class="opt-letter">${opt.label}</span>
                  <span class="opt-text">${opt.text}</span>
                  ${isSelected ? '<span class="opt-check">✓</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Barra de navegación inferior -->
          <div class="simce-bottom-bar">
            <button class="btn-nav-prev" id="btnPrevQ" ${this.currentIndex === 0 ? 'disabled' : ''}>
              ⬅ Anterior
            </button>
            <div class="center-reminder">
              ${this.userAnswers[q.id] !== undefined 
                ? '<span style="color:var(--success); font-weight:700;">✓ Alternativa registrada</span>' 
                : '<span style="color:var(--text-muted);">Selecciona una alternativa para responder</span>'}
            </div>
            <button class="btn-nav-next" id="btnNextQ">
              ${this.currentIndex === totalQ - 1 ? 'Revisar / Finalizar 🏁' : 'Siguiente ➡'}
            </button>
          </div>
        </main>
      </div>
    `;

    // Eventos navegación lateral
    const navButtons = this.container.querySelectorAll('.q-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        this.currentIndex = parseInt(btn.dataset.idx, 10);
        this.renderExamView();
      });
    });

    // Eventos selección de alternativa
    const optionButtons = this.container.querySelectorAll('.simce-opt-row');
    optionButtons.forEach(optBtn => {
      optBtn.addEventListener('click', () => {
        soundManager.playClick();
        const selectedOptIdx = parseInt(optBtn.dataset.optIdx, 10);
        this.userAnswers[q.id] = selectedOptIdx;
        this.renderExamView();
      });
    });

    // Navegación Anterior / Siguiente
    document.getElementById('btnPrevQ').addEventListener('click', () => {
      if (this.currentIndex > 0) {
        soundManager.playClick();
        this.currentIndex--;
        this.renderExamView();
      }
    });

    document.getElementById('btnNextQ').addEventListener('click', () => {
      soundManager.playClick();
      if (this.currentIndex < totalQ - 1) {
        this.currentIndex++;
        this.renderExamView();
      } else {
        this.confirmFinishExam();
      }
    });

    // Botón Finalizar Ensayo
    document.getElementById('btnFinishExam').addEventListener('click', () => {
      soundManager.playClick();
      this.confirmFinishExam();
    });
  }

  confirmFinishExam() {
    const totalQ = this.questions.length;
    const answeredCount = Object.keys(this.userAnswers).length;
    const pendingCount = totalQ - answeredCount;

    if (pendingCount > 0) {
      const confirmFinish = confirm(`Aún tienes ${pendingCount} pregunta(s) sin responder.\n\n¿Estás seguro de que deseas entregar el ensayo ahora?`);
      if (!confirmFinish) return;
    }

    this.evaluateAndShowResults();
  }

  evaluateAndShowResults() {
    this.isCompleted = true;
    let correctCount = 0;

    const breakdown = this.questions.map(q => {
      const userSelected = this.userAnswers[q.id];
      const isCorrect = userSelected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        question: q,
        userSelected,
        isCorrect
      };
    });

    const totalQ = this.questions.length;
    const percent = Math.round((correctCount / totalQ) * 100);

    // Estimación puntaje SIMCE (Escala estándar 200 a 350 puntos)
    // Base 200 + (percent * 1.5) => 200 a 350
    const simceScore = 200 + Math.round(percent * 1.5);

    let performanceLevel = "Adecuado";
    let levelBadgeColor = "#3B82F6";
    if (percent >= 80) {
      performanceLevel = "Avanzado 🏆";
      levelBadgeColor = "#10B981";
      appManager.unlockBadge('simce_crack');
    } else if (percent < 50) {
      performanceLevel = "Elemental 🌱";
      levelBadgeColor = "#F59E0B";
    }

    // Puntos para el perfil
    const earnedPts = correctCount * 20;
    appManager.addPoints(earnedPts);

    // Guardar intento en historial
    appManager.saveSimceAttempt({
      date: new Date().toLocaleDateString('es-CL'),
      score: correctCount,
      total: totalQ,
      simceScore,
      percent
    });

    soundManager.playFanfare();
    confettiManager.launch(100);

    this.container.innerHTML = `
      <div class="simce-results-view">
        <div class="results-header-card">
          <div class="results-badge">🇨🇱 RESULTADOS OFICIALES ENSAYO SIMCE</div>
          <h2 class="results-title">¡Felicitaciones por completar el ensayo!</h2>
          <p class="results-desc">Aquí tienes el análisis pedagógico detallado de tu desempeño matemático.</p>

          <div class="results-metrics-grid">
            <div class="metric-card">
              <span class="metric-label">Respuestas Correctas</span>
              <span class="metric-val" style="color:var(--success);">${correctCount} / ${totalQ}</span>
              <span class="metric-sub">${percent}% de logro</span>
            </div>

            <div class="metric-card highlight-metric">
              <span class="metric-label">Puntaje Estimado SIMCE</span>
              <span class="metric-val" style="color:#F59E0B;">${simceScore} pts</span>
              <span class="metric-sub" style="background:${levelBadgeColor}; color:white; padding:2px 8px; border-radius:10px;">Nivel ${performanceLevel}</span>
            </div>

            <div class="metric-card">
              <span class="metric-label">Puntos Ganados</span>
              <span class="metric-val" style="color:var(--primary);">+${earnedPts} XP</span>
              <span class="metric-sub">Sumados a tu perfil</span>
            </div>
          </div>

          <div class="results-actions-top">
            <button class="btn-submit" id="btnRetakeSimce" style="max-width:280px; margin:0 auto;">
              <span>Dar Nuevo Ensayo 🔄</span>
            </button>
            <button class="btn-secondary" id="btnSimceBackMenu" style="max-width:280px; margin:0 auto;">
              <span>Volver al Menú Principal 🏠</span>
            </button>
          </div>
        </div>

        <!-- Retroalimentación Pedagógica Pregunta por Pregunta -->
        <div class="results-breakdown-section">
          <h3 class="breakdown-title">📝 Revisión Pedagógica y Solucionario Paso a Paso:</h3>
          
          <div class="breakdown-list">
            ${breakdown.map((item, idx) => {
              const q = item.question;
              const hasAnswered = item.userSelected !== undefined;
              const chosenOption = hasAnswered ? q.options[item.userSelected] : null;
              const correctOption = q.options[q.correctIndex];

              return `
                <div class="breakdown-item-card ${item.isCorrect ? 'item-correct' : 'item-wrong'}">
                  <div class="breakdown-item-header">
                    <span class="item-status-pill ${item.isCorrect ? 'pill-correct' : 'pill-wrong'}">
                      ${item.isCorrect ? '✓ Correcta' : '✕ Incorrecta'}
                    </span>
                    <h4>Pregunta ${idx + 1}: ${q.title}</h4>
                  </div>

                  <p class="item-problem-text"><b>Problema:</b> ${q.problem}</p>

                  <div class="item-answer-comparison">
                    <div class="comparison-row">
                      <span>Tu respuesta:</span>
                      <b class="${item.isCorrect ? 'text-correct' : 'text-wrong'}">
                        ${chosenOption ? `${chosenOption.label}) ${chosenOption.text}` : 'No respondida'}
                      </b>
                    </div>
                    <div class="comparison-row">
                      <span>Respuesta correcta:</span>
                      <b class="text-correct">${correctOption.label}) ${correctOption.text}</b>
                    </div>
                  </div>

                  <div class="item-explanation-box">
                    <span class="explanation-icon">💡</span>
                    <div>
                      <b>Explicación pedagógica:</b>
                      <p>${q.explanation}</p>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnRetakeSimce').addEventListener('click', () => {
      soundManager.playClick();
      this.startExam();
    });

    document.getElementById('btnSimceBackMenu').addEventListener('click', () => {
      soundManager.playClick();
      appManager.navigateTo('menu');
    });
  }
}

const simceManager = new SimceManager();

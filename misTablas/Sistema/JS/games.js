// Sistema/JS/games.js - 7 Minijuegos interactivos de multiplicación para 4° Básico

class GameManager {
  constructor() {
    this.activeGame = null;
    this.container = null;
    this.timerInterval = null;
  }

  init(containerElement) {
    this.container = containerElement;
  }

  stopCurrentGame() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  // ==========================================
  // JUEGO 1: MEMORIA MATEMÁTICA (Memory Match)
  // ==========================================
  startMemoryGame(tableNum = null) {
    this.stopCurrentGame();
    this.activeGame = 'memoria';

    // Generar 6 pares de tarjetas
    const pairs = [];
    const usedOps = new Set();
    const t = tableNum || (Math.floor(Math.random() * 9) + 2); // 2 al 10

    while (pairs.length < 6) {
      const mul = Math.floor(Math.random() * 9) + 2;
      const key = `${t}x${mul}`;
      if (!usedOps.has(key)) {
        usedOps.add(key);
        pairs.push({
          id: pairs.length,
          opText: `${t} × ${mul}`,
          ansText: `${t * mul}`,
          ansValue: t * mul
        });
      }
    }

    // Armar 12 cartas (6 operaciones y 6 resultados)
    const cards = [];
    pairs.forEach(p => {
      cards.push({ id: p.id, type: 'op', text: p.opText, matchId: p.id });
      cards.push({ id: p.id, type: 'ans', text: p.ansText, matchId: p.id });
    });

    // Barajar
    cards.sort(() => Math.random() - 0.5);

    let flippedCards = [];
    let matchedCount = 0;
    let moves = 0;
    let lockBoard = false;

    this.container.innerHTML = `
      <div class="game-wrapper">
        <div class="game-header-bar">
          <div class="game-title-badge">
            <span class="game-icon">🧠</span>
            <div>
              <h3>Memoria Matemática</h3>
              <p>Encuentra las parejas de multiplicación y su resultado</p>
            </div>
          </div>
          <div class="game-stats">
            <div class="stat-pill">Movimientos: <b id="memMoves">0</b></div>
            <div class="stat-pill">Parejas: <b id="memMatches">0/6</b></div>
            <button class="btn-sm btn-accent" id="btnRestartMemory">🔄 Reiniciar</button>
          </div>
        </div>

        <div class="memory-grid" id="memoryGrid">
          ${cards.map((c, index) => `
            <div class="memory-card" data-index="${index}" data-match="${c.matchId}" data-type="${c.type}">
              <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back ${c.type === 'op' ? 'card-op' : 'card-ans'}">${c.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnRestartMemory').addEventListener('click', () => {
      soundManager.playClick();
      this.startMemoryGame(tableNum);
    });

    const cardElements = this.container.querySelectorAll('.memory-card');
    cardElements.forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        if (lockBoard) return;
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        soundManager.playCard();
        cardEl.classList.add('flipped');
        flippedCards.push(cardEl);

        if (flippedCards.length === 2) {
          moves++;
          document.getElementById('memMoves').textContent = moves;
          lockBoard = true;

          const card1 = flippedCards[0];
          const card2 = flippedCards[1];
          const match1 = card1.dataset.match;
          const match2 = card2.dataset.match;
          const type1 = card1.dataset.type;
          const type2 = card2.dataset.type;

          if (match1 === match2 && type1 !== type2) {
            // ¡Pareja encontrada!
            setTimeout(() => {
              soundManager.playSuccess();
              card1.classList.add('matched');
              card2.classList.add('matched');
              flippedCards = [];
              lockBoard = false;
              matchedCount++;
              document.getElementById('memMatches').textContent = `${matchedCount}/6`;

              if (matchedCount === 6) {
                // Victoria en Memoria
                soundManager.playFanfare();
                confettiManager.launch(80);
                appManager.addPoints(50);
                appManager.unlockBadge('juego_memoria');
                this.showVictoryModal(
                  '¡Memoria de Elefante! 🧠✨',
                  `¡Encontraste todas las parejas en solo ${moves} movimientos! Ganaste +50 Puntos.`,
                  () => this.startMemoryGame(tableNum)
                );
              }
            }, 400);
          } else {
            // No coinciden
            setTimeout(() => {
              soundManager.playError();
              card1.classList.remove('flipped');
              card2.classList.remove('flipped');
              flippedCards = [];
              lockBoard = false;
            }, 900);
          }
        }
      });
    });
  }

  // ==========================================
  // JUEGO 2: ATRAPA EL RESULTADO (Burbujas)
  // ==========================================
  startCatchResultGame() {
    this.stopCurrentGame();
    this.activeGame = 'atrapa';

    let score = 0;
    let round = 1;
    const maxRounds = 10;
    let currentOp = null;

    const renderRound = () => {
      const t1 = Math.floor(Math.random() * 9) + 2;
      const t2 = Math.floor(Math.random() * 9) + 2;
      const correctAns = t1 * t2;
      currentOp = { t1, t2, correctAns };

      // Opciones falsas cercanas pero no iguales
      const options = new Set([correctAns]);
      while (options.size < 4) {
        const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const wrong = correctAns + offset;
        if (wrong > 0 && wrong !== correctAns) {
          options.add(wrong);
        }
      }
      const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

      this.container.innerHTML = `
        <div class="game-wrapper">
          <div class="game-header-bar">
            <div class="game-title-badge">
              <span class="game-icon">🎯</span>
              <div>
                <h3>Atrapa el Resultado</h3>
                <p>Pincha la burbuja correcta antes de que se escape</p>
              </div>
            </div>
            <div class="game-stats">
              <div class="stat-pill">Ronda: <b>${round}/${maxRounds}</b></div>
              <div class="stat-pill">Aciertos: <b id="catchScore">${score}</b></div>
            </div>
          </div>

          <div class="catch-arena">
            <div class="catch-target-card">
              <div class="catch-target-label">¿Cuánto es?</div>
              <div class="catch-target-op">${t1} × ${t2} = <span class="op-question">?</span></div>
            </div>

            <div class="bubbles-container" id="bubblesContainer">
              ${shuffledOptions.map((opt, i) => `
                <button class="bubble-btn bubble-${(i % 4) + 1}" data-val="${opt}">
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>

            <div id="catchFeedback" class="game-feedback-banner" style="display:none;"></div>
          </div>
        </div>
      `;

      const buttons = this.container.querySelectorAll('.bubble-btn');
      const feedback = document.getElementById('catchFeedback');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.dataset.val, 10);
          buttons.forEach(b => b.disabled = true);

          if (chosen === correctAns) {
            soundManager.playPopBubble();
            soundManager.playSuccess();
            score++;
            btn.classList.add('bubble-correct');
            feedback.className = 'game-feedback-banner feedback-success';
            feedback.innerHTML = `🎉 ¡Excelente! ${t1} × ${t2} = ${correctAns}`;
            feedback.style.display = 'block';
          } else {
            soundManager.playError();
            btn.classList.add('bubble-wrong');
            buttons.forEach(b => {
              if (parseInt(b.dataset.val, 10) === correctAns) {
                b.classList.add('bubble-correct');
              }
            });
            feedback.className = 'game-feedback-banner feedback-error';
            feedback.innerHTML = `💡 ¡Casi! La respuesta correcta era <b>${correctAns}</b> (${t1} × ${t2})`;
            feedback.style.display = 'block';
          }

          setTimeout(() => {
            if (round < maxRounds) {
              round++;
              renderRound();
            } else {
              // Final de las 10 rondas
              soundManager.playFanfare();
              confettiManager.launch(90);
              const earnedPts = score * 10;
              appManager.addPoints(earnedPts);
              if (score >= 8) {
                appManager.unlockBadge('juego_atrapa');
              }
              this.showVictoryModal(
                '¡Gran Cacería de Resultados! 🎈🏆',
                `¡Atrapaste ${score} de ${maxRounds} respuestas correctas! Ganaste +${earnedPts} Puntos.`,
                () => this.startCatchResultGame()
              );
            }
          }, 1200);
        });
      });
    };

    renderRound();
  }

  // ==========================================
  // JUEGO 3: CONSTRUYE LA MULTIPLICACIÓN
  // ==========================================
  startBuildMultiplicationGame() {
    this.stopCurrentGame();
    this.activeGame = 'construye';

    const groupsCount = Math.floor(Math.random() * 5) + 2; // 2 a 6
    const itemsPerGroup = Math.floor(Math.random() * 4) + 2; // 2 a 5
    const total = groupsCount * itemsPerGroup;
    let selectedGroups = 1;
    let selectedItems = 1;

    const render = () => {
      this.container.innerHTML = `
        <div class="game-wrapper">
          <div class="game-header-bar">
            <div class="game-title-badge">
              <span class="game-icon">🧱</span>
              <div>
                <h3>Construye la Multiplicación</h3>
                <p>Agrupa las cajas y manzanas para formar la cantidad solicitada</p>
              </div>
            </div>
            <div class="game-stats">
              <div class="stat-pill">Meta: <b>${total} manzanas</b> 🍎</div>
            </div>
          </div>

          <div class="build-workspace">
            <div class="build-instructions-card">
              <p>Queremos obtener un total de <b style="color:var(--primary); font-size:1.3rem;">${total}</b> manzanas.</p>
              <p>Ajusta el número de canastas y cuántas manzanas colocas en cada una:</p>
            </div>

            <div class="build-controls-row">
              <div class="control-box">
                <label>Número de canastas (grupos):</label>
                <div class="counter-picker">
                  <button class="btn-count" id="btnMinusGroups">➖</button>
                  <span class="counter-val" id="lblGroups">${selectedGroups}</span>
                  <button class="btn-count" id="btnPlusGroups">➕</button>
                </div>
              </div>

              <div class="control-box">
                <label>Manzanas por canasta:</label>
                <div class="counter-picker">
                  <button class="btn-count" id="btnMinusItems">➖</button>
                  <span class="counter-val" id="lblItems">${selectedItems}</span>
                  <button class="btn-count" id="btnPlusItems">➕</button>
                </div>
              </div>
            </div>

            <!-- Previsualización interactiva de canastas -->
            <div class="build-visual-stage" id="buildVisualStage">
              ${Array.from({ length: selectedGroups }).map((_, gIdx) => `
                <div class="build-basket">
                  <div class="basket-badge">Canasta ${gIdx + 1}</div>
                  <div class="basket-items">
                    ${Array.from({ length: selectedItems }).map(() => `<span class="basket-item">🍎</span>`).join('')}
                  </div>
                  <div class="basket-subtotal">${selectedItems}</div>
                </div>
              `).join('')}
            </div>

            <div class="build-sum-equation">
              Operación: <b>${selectedGroups}</b> × <b>${selectedItems}</b> = <span style="color: ${selectedGroups * selectedItems === total ? 'var(--success)' : 'var(--text-main)'}; font-size: 1.4rem;">${selectedGroups * selectedItems}</span>
            </div>

            <div class="build-actions">
              <button class="btn-submit" id="btnCheckBuild" style="max-width:320px; margin:0 auto;">
                <span>¡Verificar Construcción!</span> <span>✨</span>
              </button>
            </div>
            <div id="buildFeedback" class="game-feedback-banner" style="display:none; margin-top:1rem;"></div>
          </div>
        </div>
      `;

      // Eventos de controles
      document.getElementById('btnMinusGroups').addEventListener('click', () => {
        if (selectedGroups > 1) {
          soundManager.playClick();
          selectedGroups--;
          render();
        }
      });
      document.getElementById('btnPlusGroups').addEventListener('click', () => {
        if (selectedGroups < 10) {
          soundManager.playClick();
          selectedGroups++;
          render();
        }
      });
      document.getElementById('btnMinusItems').addEventListener('click', () => {
        if (selectedItems > 1) {
          soundManager.playClick();
          selectedItems--;
          render();
        }
      });
      document.getElementById('btnPlusItems').addEventListener('click', () => {
        if (selectedItems < 10) {
          soundManager.playClick();
          selectedItems++;
          render();
        }
      });

      document.getElementById('btnCheckBuild').addEventListener('click', () => {
        const feedback = document.getElementById('buildFeedback');
        const currentSum = selectedGroups * selectedItems;

        if (currentSum === total) {
          soundManager.playSuccess();
          soundManager.playStar();
          confettiManager.launch(70);
          feedback.className = 'game-feedback-banner feedback-success';
          feedback.innerHTML = `🎉 ¡Perfecto! ${selectedGroups} grupos de ${selectedItems} forman exactamente ${total} manzanas (${selectedGroups} × ${selectedItems} = ${total}). ¡Ganaste +30 Puntos!`;
          feedback.style.display = 'block';
          appManager.addPoints(30);

          setTimeout(() => {
            this.showVictoryModal(
              '¡Gran Constructor Matemático! 🍎✨',
              `¡Construiste exitosamente ${total} manzanas!`,
              () => this.startBuildMultiplicationGame()
            );
          }, 1500);
        } else if (currentSum < total) {
          soundManager.playError();
          feedback.className = 'game-feedback-banner feedback-error';
          feedback.innerHTML = `💡 Aún faltan manzanas: tienes ${currentSum} y la meta es ${total}. ¡Agrega más canastas o más manzanas por canasta!`;
          feedback.style.display = 'block';
        } else {
          soundManager.playError();
          feedback.className = 'game-feedback-banner feedback-error';
          feedback.innerHTML = `💡 Te pasaste: tienes ${currentSum} y la meta es ${total}. ¡Prueba con menos canastas o menos manzanas!`;
          feedback.style.display = 'block';
        }
      });
    };

    render();
  }

  // ==========================================
  // JUEGO 4: ¿QUIÉN TIENE LA RESPUESTA?
  // ==========================================
  startWhoHasTheAnswerGame() {
    this.stopCurrentGame();
    this.activeGame = 'quien';

    let round = 1;
    let score = 0;
    const maxRounds = 6;

    const characters = [
      { name: "Cosmo", icon: "🚀", avatarImg: "IMAGEN/avatar-cosmo.svg" },
      { name: "Rexi", icon: "🦖", avatarImg: "IMAGEN/avatar-rexi.svg" },
      { name: "Chip", icon: "🤖", avatarImg: "IMAGEN/avatar-chip.svg" }
    ];

    const renderRound = () => {
      const a = Math.floor(Math.random() * 9) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      const correct = a * b;

      // Crear 3 opciones
      const charAnswers = [correct, correct + (Math.random() > 0.5 ? 2 : -2), correct + (Math.random() > 0.5 ? 4 : -3)];
      // Asegurar que no haya duplicados
      if (charAnswers[1] === charAnswers[0]) charAnswers[1] += 1;
      if (charAnswers[2] === charAnswers[0] || charAnswers[2] === charAnswers[1]) charAnswers[2] += 5;

      // Asignar aleatoriamente a personajes
      const shuffledAnswers = charAnswers.sort(() => Math.random() - 0.5);

      this.container.innerHTML = `
        <div class="game-wrapper">
          <div class="game-header-bar">
            <div class="game-title-badge">
              <span class="game-icon">🎭</span>
              <div>
                <h3>¿Quién tiene la respuesta?</h3>
                <p>Descubre qué amigo está diciendo la respuesta correcta</p>
              </div>
            </div>
            <div class="game-stats">
              <div class="stat-pill">Ronda: <b>${round}/${maxRounds}</b></div>
              <div class="stat-pill">Aciertos: <b>${score}</b></div>
            </div>
          </div>

          <div class="who-arena">
            <div class="who-question-box">
              <span class="who-q-tag">Misión de la ronda:</span>
              <div class="who-equation">${a} × ${b} = <span class="who-mystery">?</span></div>
            </div>

            <div class="characters-row">
              ${characters.map((char, idx) => `
                <div class="char-card" data-val="${shuffledAnswers[idx]}" data-name="${char.name}">
                  <img src="${char.avatarImg}" alt="${char.name}" class="char-avatar">
                  <div class="char-name">${char.name} dice:</div>
                  <div class="char-speech-bubble">
                    <span class="char-number">${shuffledAnswers[idx]}</span>
                  </div>
                  <button class="btn-select-char">¡Yo elijo a ${char.name}!</button>
                </div>
              `).join('')}
            </div>

            <div id="whoFeedback" class="game-feedback-banner" style="display:none; margin-top:1.5rem;"></div>
          </div>
        </div>
      `;

      const cards = this.container.querySelectorAll('.char-card');
      const feedback = document.getElementById('whoFeedback');

      cards.forEach(card => {
        card.addEventListener('click', () => {
          const val = parseInt(card.dataset.val, 10);
          const name = card.dataset.name;
          cards.forEach(c => c.style.pointerEvents = 'none');

          if (val === correct) {
            soundManager.playSuccess();
            card.classList.add('char-correct');
            score++;
            feedback.className = 'game-feedback-banner feedback-success';
            feedback.innerHTML = `🎉 ¡Correcto! ¡${name} tenía la respuesta! ${a} × ${b} = ${correct}.`;
            feedback.style.display = 'block';
          } else {
            soundManager.playError();
            card.classList.add('char-wrong');
            cards.forEach(c => {
              if (parseInt(c.dataset.val, 10) === correct) {
                c.classList.add('char-correct');
              }
            });
            feedback.className = 'game-feedback-banner feedback-error';
            feedback.innerHTML = `💡 ¡Oh no! ${name} se equivocó. La respuesta correcta era <b>${correct}</b>.`;
            feedback.style.display = 'block';
          }

          setTimeout(() => {
            if (round < maxRounds) {
              round++;
              renderRound();
            } else {
              soundManager.playFanfare();
              confettiManager.launch(80);
              const pts = score * 15;
              appManager.addPoints(pts);
              this.showVictoryModal(
                '¡Gran Trabajo con tus Amigos! 🎭⭐',
                `¡Acertaste ${score} de ${maxRounds} preguntas! Ganaste +${pts} Puntos.`,
                () => this.startWhoHasTheAnswerGame()
              );
            }
          }, 1400);
        });
      });
    };

    renderRound();
  }

  // ==========================================
  // JUEGO 5: DESAFÍO CONTRA EL TIEMPO (Fiebre)
  // ==========================================
  startTimeChallengeGame() {
    this.stopCurrentGame();
    this.activeGame = 'tiempo';

    let timeLeft = 45;
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    let isGameOver = false;

    this.container.innerHTML = `
      <div class="game-wrapper">
        <div class="game-header-bar">
          <div class="game-title-badge">
            <span class="game-icon">⏱️</span>
            <div>
              <h3>Desafío Contra el Tiempo</h3>
              <p>¡Responde tantas multiplicaciones como puedas antes de que se acabe el reloj!</p>
            </div>
          </div>
          <div class="game-stats">
            <div class="stat-pill stat-timer">⏳ <b id="timerDisplay">${timeLeft}s</b></div>
            <div class="stat-pill">Aciertos: <b id="timeScore">0</b></div>
            <div class="stat-pill">Racha: <b id="timeStreak">🔥 0</b></div>
          </div>
        </div>

        <div class="time-arena">
          <div class="time-op-card">
            <div class="time-equation" id="timeEquation">7 × 8 = ?</div>
          </div>

          <div class="time-options-grid" id="timeOptionsGrid">
            <!-- 4 opciones -->
          </div>
        </div>
      </div>
    `;

    const timerDisplay = document.getElementById('timerDisplay');
    const timeScore = document.getElementById('timeScore');
    const timeStreak = document.getElementById('timeStreak');
    const timeEquation = document.getElementById('timeEquation');
    const timeOptionsGrid = document.getElementById('timeOptionsGrid');

    const nextProblem = () => {
      if (isGameOver) return;
      const n1 = Math.floor(Math.random() * 9) + 2;
      const n2 = Math.floor(Math.random() * 9) + 2;
      const correct = n1 * n2;

      timeEquation.textContent = `${n1} × ${n2} = ?`;

      const options = new Set([correct]);
      while (options.size < 4) {
        const offset = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const wrong = correct + offset;
        if (wrong > 0 && wrong !== correct) {
          options.add(wrong);
        }
      }
      const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

      timeOptionsGrid.innerHTML = shuffled.map(val => `
        <button class="btn-time-opt" data-val="${val}">${val}</button>
      `).join('');

      const buttons = timeOptionsGrid.querySelectorAll('.btn-time-opt');
      buttons.forEach(b => {
        b.addEventListener('click', () => {
          if (isGameOver) return;
          const chosen = parseInt(b.dataset.val, 10);
          if (chosen === correct) {
            soundManager.playPop();
            score++;
            streak++;
            if (streak > maxStreak) maxStreak = streak;
            timeScore.textContent = score;
            timeStreak.innerHTML = `🔥 ${streak}`;
            b.classList.add('opt-correct');
            setTimeout(nextProblem, 200);
          } else {
            soundManager.playError();
            streak = 0;
            timeStreak.innerHTML = `🔥 ${streak}`;
            b.classList.add('opt-wrong');
            setTimeout(nextProblem, 400);
          }
        });
      });
    };

    nextProblem();

    // Iniciar cronómetro
    this.timerInterval = setInterval(() => {
      timeLeft--;
      if (timerDisplay) {
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 10) {
          timerDisplay.style.color = '#EF4444';
          timerDisplay.style.animation = 'pulse 0.5s infinite';
        }
      }

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        isGameOver = true;

        soundManager.playFanfare();
        confettiManager.launch(90);
        const pts = score * 10;
        appManager.addPoints(pts);
        if (score >= 12) {
          appManager.unlockBadge('juego_tiempo');
        }

        this.showVictoryModal(
          '¡Tiempo Cumplido! ⏱️🎉',
          `¡Lograste responder ${score} multiplicaciones con una racha máxima de ${maxStreak} aciertos! Ganaste +${pts} Puntos.`,
          () => this.startTimeChallengeGame()
        );
      }
    }, 1000);
  }

  // ==========================================
  // JUEGO 6: ARRASTRA Y COMPLETA (Drag & Drop)
  // ==========================================
  startDragAndDropGame() {
    this.stopCurrentGame();
    this.activeGame = 'arrastra';

    // Generar 4 ecuaciones para completar
    const equations = [];
    const usedOps = new Set();

    while (equations.length < 4) {
      const a = Math.floor(Math.random() * 8) + 2; // 2 al 9
      const b = Math.floor(Math.random() * 8) + 2;
      const key = `${a}x${b}`;
      if (!usedOps.has(key)) {
        usedOps.add(key);
        equations.push({
          id: equations.length,
          a,
          b,
          ans: a * b,
          solved: false
        });
      }
    }

    const answerChips = equations.map(eq => ({ id: eq.id, val: eq.ans })).sort(() => Math.random() - 0.5);
    let selectedChip = null; // Para soporte táctil en smartphones

    this.container.innerHTML = `
      <div class="game-wrapper">
        <div class="game-header-bar">
          <div class="game-title-badge">
            <span class="game-icon">🖐️</span>
            <div>
              <h3>Arrastra y Completa</h3>
              <p>Arrastra (o toca) la ficha con el número correcto para completar cada operación</p>
            </div>
          </div>
          <div class="game-stats">
            <div class="stat-pill">Completadas: <b id="dragProgress">0/4</b></div>
          </div>
        </div>

        <div class="drag-arena">
          <!-- Banco de fichas -->
          <div class="drag-chips-bank" id="chipsBank">
            <div class="bank-title">Fichas disponibles:</div>
            <div class="chips-container" id="chipsContainer">
              ${answerChips.map(c => `
                <div class="draggable-chip" draggable="true" data-id="${c.id}" data-val="${c.val}">
                  ${c.val}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Zona de ecuaciones -->
          <div class="drop-equations-grid" id="equationsGrid">
            ${equations.map(eq => `
              <div class="drop-equation-card" data-id="${eq.id}" data-expected="${eq.ans}">
                <div class="equation-text">${eq.a} × ${eq.b} =</div>
                <div class="drop-target-slot" data-id="${eq.id}">
                  <span class="slot-placeholder">Arrastra aquí</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const chips = this.container.querySelectorAll('.draggable-chip');
    const slots = this.container.querySelectorAll('.drop-target-slot');
    let solvedCount = 0;

    // Soporte Drag & Drop nativo
    chips.forEach(chip => {
      chip.addEventListener('dragstart', (e) => {
        soundManager.playClick();
        e.dataTransfer.setData('text/plain', chip.dataset.val);
        e.dataTransfer.setData('chip-id', chip.dataset.id);
        chip.classList.add('dragging');
      });

      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
      });

      // Soporte táctil / click simple para celulares
      chip.addEventListener('click', () => {
        soundManager.playClick();
        chips.forEach(c => c.classList.remove('touch-selected'));
        if (selectedChip === chip) {
          selectedChip = null;
        } else {
          selectedChip = chip;
          chip.classList.add('touch-selected');
        }
      });
    });

    slots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      });

      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });

      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const val = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const chipId = e.dataTransfer.getData('chip-id');
        const sourceChip = document.querySelector(`.draggable-chip[data-id="${chipId}"]`);
        this.handleDropEvaluation(slot, val, sourceChip, equations);
      });

      // Tap en slot si hay ficha seleccionada (pantallas táctiles)
      slot.addEventListener('click', () => {
        if (selectedChip) {
          const val = parseInt(selectedChip.dataset.val, 10);
          this.handleDropEvaluation(slot, val, selectedChip, equations);
          selectedChip = null;
        }
      });
    });
  }

  handleDropEvaluation(slot, val, sourceChip, equations) {
    const parentCard = slot.closest('.drop-equation-card');
    const expected = parseInt(parentCard.dataset.expected, 10);

    if (val === expected) {
      soundManager.playSuccess();
      slot.innerHTML = `<span class="slot-filled">${val}</span>`;
      slot.classList.add('slot-correct');
      parentCard.classList.add('card-completed');
      if (sourceChip) {
        sourceChip.style.display = 'none';
      }

      const completed = document.querySelectorAll('.drop-equation-card.card-completed').length;
      document.getElementById('dragProgress').textContent = `${completed}/4`;

      if (completed === 4) {
        soundManager.playFanfare();
        confettiManager.launch(80);
        appManager.addPoints(40);
        this.showVictoryModal(
          '¡Operaciones Completadas! 🖐️✨',
          '¡Encajaste todas las fichas en su lugar perfecto! Ganaste +40 Puntos.',
          () => this.startDragAndDropGame()
        );
      }
    } else {
      soundManager.playError();
      slot.classList.add('slot-wrong');
      setTimeout(() => slot.classList.remove('slot-wrong'), 600);
    }
  }

  // ==========================================
  // JUEGO 7: DETECTIVE MATEMÁTICO
  // ==========================================
  startDetectiveGame() {
    this.stopCurrentGame();
    this.activeGame = 'detective';

    const mysteries = [
      {
        target: 24,
        clues: [
          "Soy un número par mayor que 20 y menor que 30.",
          "Si me buscas en la tabla del 4, estoy ahí (4 × 6).",
          "También pertenezco a la tabla del 3 (3 × 8) y la del 6 (6 × 4).",
          "La suma de mis dígitos es 6 (2 + 4 = 6)."
        ],
        options: [20, 24, 28, 26]
      },
      {
        target: 35,
        clues: [
          "Estoy entre el 30 y el 40.",
          "Termino en 5, así que pertenezco a la tabla del 5.",
          "Si me divides en 7 grupos iguales, cada grupo tiene 5.",
          "Soy el resultado de 5 × 7."
        ],
        options: [30, 35, 45, 25]
      },
      {
        target: 56,
        clues: [
          "Soy mayor que 50 y menor que 60.",
          "Soy muy famoso por ser uno de los desafíos de la tabla del 7 y del 8.",
          "7 × 8 da mi resultado exacto.",
          "Mis unidades son un 6 y mis decenas un 5."
        ],
        options: [54, 56, 48, 64]
      },
      {
        target: 81,
        clues: [
          "Soy un número impar mayor que 70 y menor que 90.",
          "Mis dos dígitos suman 9 (8 + 1 = 9).",
          "Se obtengo multiplicando a un número por sí mismo: 9 × 9.",
          "Termino en el número 1."
        ],
        options: [72, 81, 63, 90]
      }
    ];

    const currentMystery = mysteries[Math.floor(Math.random() * mysteries.length)];
    let revealedClues = 1;

    const render = () => {
      this.container.innerHTML = `
        <div class="game-wrapper">
          <div class="game-header-bar">
            <div class="game-title-badge">
              <span class="game-icon">🕵️</span>
              <div>
                <h3>Detective Matemático</h3>
                <p>Lee las pistas y descubre el número misterioso</p>
              </div>
            </div>
            <div class="game-stats">
              <div class="stat-pill">Pistas reveladas: <b>${revealedClues}/${currentMystery.clues.length}</b></div>
            </div>
          </div>

          <div class="detective-arena">
            <div class="detective-notebook">
              <div class="notebook-header">
                <span>📁 EXPEDIENTE SECRETO #007</span>
                <span>CASO: EL NÚMERO OCULTO</span>
              </div>
              <div class="clues-list">
                ${currentMystery.clues.slice(0, revealedClues).map((clue, idx) => `
                  <div class="clue-item">
                    <span class="clue-badge">Pista ${idx + 1}:</span>
                    <span class="clue-text">${clue}</span>
                  </div>
                `).join('')}
              </div>
              ${revealedClues < currentMystery.clues.length ? `
                <button class="btn-reveal-clue" id="btnRevealNext">🔍 Revelar siguiente pista</button>
              ` : `
                <div class="all-clues-ready">¡Todas las pistas han sido reveladas! ¿Quién es el sospechoso?</div>
              `}
            </div>

            <div class="detective-suspects">
              <div class="suspects-title">Selecciona el número que cumple TODAS las pistas:</div>
              <div class="suspects-grid">
                ${currentMystery.options.map(opt => `
                  <button class="btn-suspect" data-val="${opt}">
                    <span class="suspect-tag">¿Número?</span>
                    <span class="suspect-number">${opt}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div id="detectiveFeedback" class="game-feedback-banner" style="display:none; margin-top:1.5rem;"></div>
          </div>
        </div>
      `;

      const btnNext = document.getElementById('btnRevealNext');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          soundManager.playPop();
          revealedClues++;
          render();
        });
      }

      const suspects = this.container.querySelectorAll('.btn-suspect');
      const feedback = document.getElementById('detectiveFeedback');

      suspects.forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.dataset.val, 10);
          suspects.forEach(s => s.disabled = true);

          if (chosen === currentMystery.target) {
            soundManager.playSuccess();
            btn.classList.add('suspect-correct');
            feedback.className = 'game-feedback-banner feedback-success';
            feedback.innerHTML = `🎉 ¡Caso resuelto, Gran Detective! El número misterioso es efectivamente el <b>${currentMystery.target}</b>. Ganaste +45 Puntos.`;
            feedback.style.display = 'block';
            appManager.addPoints(45);
            appManager.unlockBadge('juego_detective');

            setTimeout(() => {
              soundManager.playFanfare();
              confettiManager.launch(80);
              this.showVictoryModal(
                '¡Misterio Resuelto! 🕵️🔍',
                `¡Descubriste el número ${currentMystery.target} como un auténtico detective!`,
                () => this.startDetectiveGame()
              );
            }, 1200);
          } else {
            soundManager.playError();
            btn.classList.add('suspect-wrong');
            feedback.className = 'game-feedback-banner feedback-error';
            feedback.innerHTML = `💡 El número ${chosen} no cumple con todas las pistas. El número era el <b>${currentMystery.target}</b>.`;
            feedback.style.display = 'block';

            setTimeout(() => {
              this.startDetectiveGame();
            }, 2500);
          }
        });
      });
    };

    render();
  }

  // Modal de celebración / fin de partida
  showVictoryModal(title, msg, onPlayAgain) {
    const modalEl = document.createElement('div');
    modalEl.className = 'game-victory-modal-overlay';
    modalEl.innerHTML = `
      <div class="game-victory-modal-card">
        <div class="victory-icon">🏆</div>
        <h2 class="victory-title">${title}</h2>
        <p class="victory-message">${msg}</p>
        <div class="victory-buttons">
          <button class="btn-submit" id="btnModalPlayAgain">
            <span>Jugar de Nuevo</span> <span>🔄</span>
          </button>
          <button class="btn-secondary" id="btnModalBackMenu">
            <span>Volver a Juegos</span> <span>🎮</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    document.getElementById('btnModalPlayAgain').addEventListener('click', () => {
      soundManager.playClick();
      modalEl.remove();
      if (onPlayAgain) onPlayAgain();
    });

    document.getElementById('btnModalBackMenu').addEventListener('click', () => {
      soundManager.playClick();
      modalEl.remove();
      appManager.navigateTo('juegos');
    });
  }
}

const gameManager = new GameManager();

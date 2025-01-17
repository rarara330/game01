const playerCar = document.getElementById("player-car");
const gameContainer = document.querySelector(".game-container");
const scoreElement = document.getElementById("score");

let playerX = 180; // Posición inicial del coche del jugador
let score = 0;
let gameSpeed = 2; // Velocidad inicial más lenta
let enemies = []; // Array para almacenar los enemigos
let playerSpeed = 40; // Velocidad del coche (aumentada de 20 a 40 píxeles)
let enemyInterval; // Intervalo para añadir enemigos

// Movimiento del jugador
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && playerX > 0) {
    playerX -= playerSpeed; // Movimiento más rápido hacia la izquierda
  } else if (event.key === "ArrowRight" && playerX < 360) {
    playerX += playerSpeed; // Movimiento más rápido hacia la derecha
  }
  playerCar.style.left = playerX + "px";
});

// Crear un nuevo enemigo
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 360) + "px"; // Posición aleatoria
  gameContainer.appendChild(enemy);
  enemies.push({ element: enemy, y: -70 }); // Añadir al array de enemigos
}

// Actualizar los enemigos
function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.y += gameSpeed; // Mover enemigo hacia abajo
    enemy.element.style.top = enemy.y + "px";

    // Si el enemigo sale de la pantalla
    if (enemy.y > 600) {
      enemy.y = -70; // Volver a la parte superior
      enemy.element.style.left = Math.floor(Math.random() * 360) + "px"; // Nueva posición aleatoria
      score++;
      scoreElement.textContent = "Puntaje: " + score;

      // Incrementar la velocidad cada 5 puntos
      if (score % 5 === 0) {
        gameSpeed++;
      }
    }

    // Detectar colisión
    const enemyRect = enemy.element.getBoundingClientRect();
    const playerRect = playerCar.getBoundingClientRect();
    if (
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top &&
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left
    ) {
      alert("¡Choque! Tu puntaje final es: " + score);
      saveHighScore(score);
      resetGame();
    }
  });
}

// Guardar la puntuación más alta en el localStorage
function saveHighScore(score) {
  const savedScores = JSON.parse(localStorage.getItem('highScores')) || [];
  if (savedScores.length < 5 || score > savedScores[savedScores.length - 1].score) {
    savedScores.push({ score });
    savedScores.sort((a, b) => b.score - a.score); // Ordenar de mayor a menor
    if (savedScores.length > 5) savedScores.pop(); // Mantener solo los 5 primeros
    localStorage.setItem('highScores', JSON.stringify(savedScores));
    displayHighScores(); // Actualizar la tabla de clasificaciones
  }
}

// Reiniciar el juego
function resetGame() {
  enemies.forEach((enemy) => {
    gameContainer.removeChild(enemy.element);
  });
  enemies = [];
  score = 0;
  gameSpeed = 2; // Reiniciar la velocidad del juego a la inicial
  scoreElement.textContent = "Puntaje: 0";
  createEnemy(); // Crear un primer enemigo

  // Reiniciar el intervalo de creación de enemigos
  clearInterval(enemyInterval);
  enemyInterval = setInterval(() => {
    createEnemy(); // Crear un nuevo enemigo
  }, 5000); // 5000 milisegundos = 5 segundos
}

// Leer las puntuaciones desde el localStorage al cargar la página
function displayHighScores() {
  const savedScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoresList = document.getElementById("high-scores-list");
  highScoresList.innerHTML = ''; // Limpiar lista antes de mostrar

  savedScores.forEach((scoreData, index) => {
    const scoreItem = document.createElement("li");
    scoreItem.textContent = `#${index + 1} - ${scoreData.score} puntos`;
    highScoresList.appendChild(scoreItem);
  });
}

// Llamar a la función displayHighScores al cargar la página
window.onload = displayHighScores;

// Bucle principal del juego
function gameLoop() {
  updateEnemies();
  requestAnimationFrame(gameLoop);
}

// Iniciar el juego
createEnemy(); // Crear el primer enemigo
gameLoop();

// Crear un enemigo cada 5 segundos
enemyInterval = setInterval(() => {
  createEnemy(); // Crear un nuevo enemigo
}, 5000); // 5000 milisegundos = 5 segundos
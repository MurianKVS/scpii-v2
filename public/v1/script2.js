// Intro - Scrapbook
document.addEventListener('DOMContentLoaded', () => {
  const introScrap = document.querySelector(".introScrap");
  const conteudoScrap = document.getElementById("scrapCont");
  const startScrapB = document.getElementById("startScrap");

  if (startScrapB) {
    startScrapB.addEventListener('click', () => {
      introScrap.style.display = "none";
      conteudoScrap.style.display = "block";
      document.body.classList.remove("intro");
    });
  }
});(".introScrap");
const conteudoScrap = document.getElementById("scrapCont");
const startScrapB = document.getElementById("startScrap");

startScrapB.addEventListener('click', () => {
    introScrap.style.display = "none";
    conteudoScrap.style.display = "block";

    document.body.classList.remove("intro");

    initializeGallery();
})

//-------------------------------------------------------------------
// Scrappage 2
const startData = new Date('2024-01-12T15:00:00');
const linhaTempo = document.getElementById('LinhaTempo');
const dia12 = document.getElementById('dia12');


dia12.addEventListener('click', () => {
  linhaTempo.classList.toggle('ativa');
});

function attContador() {
  const agora = new Date();
  let diff = agora - startData;

  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  const anos = Math.floor(dias / 365);
  const meses = Math.floor((dias % 365) / 30);
  const diasRest = (dias % 365) % 30;

  document.getElementById('anos').textContent = anos;
  document.getElementById('meses').textContent = meses;
  document.getElementById('dias').textContent = diasRest;

  const h = horas % 24;
  const m = minutos % 60;
  const s = segundos % 60;
  
  document.getElementById('horas').textContent = String(h).padStart(2, '0');
  document.getElementById('minutos').textContent = String(m).padStart(2, '0');
  document.getElementById('segundos').textContent = String(s).padStart(2, '0');
}

setInterval(attContador, 1000);

//-------------------------------------------------------------------
// Scrappage 3
const sliderCoracao = document.getElementById('sliderCoracao');
    const heartFillRect = document.getElementById('heartFillRect');

    const textosCoracao = [
        document.getElementById('txtc3'),
        document.getElementById('txtc2'),
        document.getElementById('txtc1'),
    ];


    sliderCoracao.addEventListener('input', () => {
        const percentage = sliderCoracao.value / 100;

        heartFillRect.setAttribute('y', 90 - (percentage * 90));

        
        textosCoracao.forEach((textElement, index) => {
            let opacity;

            if (index === 2) {
                opacity = Math.max(0.2, 1 - percentage);
            } else if (index === 1) {
                const start = 0.25;
                const end = 0.75;
                if (percentage < start) {
                    opacity = 0.2;
                } else if (percentage > end) {
                    opacity = 1;
                } else {
                    opacity = 0.2 + ((percentage - start) / (end - start)) * 0.8;
                }
            } else if (index === 0) {
                opacity = Math.max(0.2, percentage);
            }
            textElement.style.opacity = opacity;
        });
    });

    //-------------------------------------------------------------------
// Scrappage 4

//-------------------------------------------------------------------
// Scrappage 5

const galleryImages = [
        { src: 'images/f1.jpg', caption: 'Nossa primeira aventura!' },
        { src: 'images/f1.png', caption: 'Momentos inesquecíveis.' },
    ];

    let currentGalleryIndex = 0;

    const mainGalleryImage = document.getElementById('mainGalleryImage');
    const galleryCaption = document.getElementById('galleryCaption');
    const prevImagePreview = document.getElementById('prevImagePreview');
    const nextImagePreview = document.getElementById('nextImagePreview');
    const prevGalleryBtn = document.getElementById('prevGalleryBtn');
    const nextGalleryBtn = document.getElementById('nextGalleryBtn');
    const galleryStickers = document.querySelectorAll('.gallery-sticker');


    function updateGallery() {
        if (!mainGalleryImage || galleryImages.length === 0) return; // Sai se não houver imagens ou o elemento principal

        // Atualiza a imagem principal e legenda
        mainGalleryImage.src = galleryImages[currentGalleryIndex].src;
        galleryCaption.textContent = galleryImages[currentGalleryIndex].caption;

        // Atualiza a prévia da imagem anterior
        if (prevImagePreview) {
            const prevIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            prevImagePreview.src = galleryImages[prevIndex].src;
        }

        // Atualiza a prévia da próxima imagem
        if (nextImagePreview) {
            const nextIndex = (currentGalleryIndex + 1) % galleryImages.length;
            nextImagePreview.src = galleryImages[nextIndex].src;
        }
    }

    function goToNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateGallery();
    }

    function goToPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateGallery();
    }

    function initializeGallery() {
        if (galleryImages.length > 0 && mainGalleryImage) {
            updateGallery(); // Define a imagem inicial
        }

        if (prevGalleryBtn) {
            prevGalleryBtn.addEventListener('click', goToPrevImage);
        }
        if (nextGalleryBtn) {
            nextGalleryBtn.addEventListener('click', goToNextImage);
        }

        // Posiciona os stickers aleatoriamente (ou ajuste para posições fixas)
        galleryStickers.forEach(sticker => {
            // Exemplo de posicionamento aleatório dentro de uma área segura (evita sobrepor a galeria principal)
            const randomX = Math.random() * (window.innerWidth * 0.8); // 80% da largura
            const randomY = Math.random() * (window.innerHeight * 0.8); // 80% da altura
            
            // Você pode ajustar estes valores ou usar posições fixas no CSS ou aqui.
            // Para as imagens que você forneceu, as posições fixas no CSS talvez sejam melhores.
            // Se quiser posições aleatórias, comente as regras top/left/transform do CSS para .sticker-1 e .sticker-2
            // sticker.style.top = `${randomY}px`;
            // sticker.style.left = `${randomX}px`;
            // sticker.style.transform = `rotate(${Math.random() * 30 - 15}deg)`; // Rotação aleatória entre -15 e 15 graus
        });
    }

   // A chamada para initializeGallery() foi movida para dentro do clique de startScrap
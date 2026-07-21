// =========================
// HYDA SERVICES - script.js
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Navbar dynamique
    // =========================

    const navbar = document.querySelector(".glass-nav");

    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {

                navbar.style.background = "rgba(15, 23, 42, 0.95)";
                navbar.style.padding = "10px 0";

            } else {

                navbar.style.background = "rgba(15, 23, 42, 0.75)";
                navbar.style.padding = "16px 0";

            }

        });

    }

    // =========================
    // Apparition progressive
    // =========================

    const revealElements = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {

        revealElements.forEach((element) => {

            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - 120) {
                element.classList.add("active");
            }

        });

    };

    revealOnScroll();

    window.addEventListener("scroll", revealOnScroll);

    // =========================
    // Compteurs animés
    // =========================

    const counters = document.querySelectorAll(".counter");

    const startCounter = (counter) => {

        const target = Number(counter.dataset.target);
        const increment = target / 100;

        let current = 0;

        const updateCounter = () => {

            current += increment;

            if (current < target) {

                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target;

            }

        };

        updateCounter();

    };

    if (counters.length > 0) {

        const counterObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    startCounter(entry.target);
                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.5
        });

        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });

    }

    // =========================
    // Bouton retour en haut
    // =========================

    const backToTop = document.createElement("button");

    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.className = "back-to-top";

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // =========================
    // Configurateur devis
    // =========================

    const serviceSelect = document.getElementById("service-select");
    const optionsContainer = document.getElementById("options-container");
    const totalPrice = document.getElementById("total-price");
    const selectedService = document.getElementById("selected-service");
    const whatsappBtn = document.getElementById("whatsapp-btn");

    const tarifs = {
        "fauteuil": 40,
        "canape-2-3": 60,
        "canape-4-5": 70,
        "canape-u": 80,
        "pouf": 19,
        "chaises-4-6": 50,
        "matelas-1p": 40,
        "matelas-2p": 60,
        "coussins": 10,

        "tapis": 0,
        "vitres": 0,
        "terrasse": 0,
        "fin-chantier": 0,

        "auto-standard": 29,
        "auto-premium": 69
    };

    const nomsServices = {
    "fauteuil": "Fauteuil",
    "canape-2-3": "Canapé 2/3 places",
    "canape-4-5": "Canapé 4/5 places",
    "canape-u": "Canapé en U",
    "pouf": "Pouf",
    "chaises-4-6": "Lot de 4 à 6 chaises",
    "matelas-1p": "Matelas 1 place",
    "matelas-2p": "Matelas 2 places",
    "coussins": "Coussins",

    "tapis": "Nettoyage de tapis",
    "vitres": "Nettoyage de vitres",
    "terrasse": "Nettoyage de terrasse",
    "fin-chantier": "Nettoyage fin de chantier",

    "auto-standard": "Formule automobile Standard",
    "auto-premium": "Formule automobile Premium"
    };

    const optionsMaison = [
        { id: "desodorisation", label: "Désodorisation", prix: 10 },
        { id: "anti-acariens", label: "Traitement anti-acariens", prix: 15 },
        { id: "sechage", label: "Séchage express", prix: 20 }
    ];

    const optionsAuto = [
        { id: "habitacle", label: "Désodorisation habitacle", prix: 10 },
        { id: "vapeur", label: "Traitement vapeur renforcé", prix: 15 },
        { id: "coffre", label: "Nettoyage coffre", prix: 10 }
    ];

    function isAuto(service) {
        return service.startsWith("auto");
    }

    function renderOptions(service) {

        if (!optionsContainer) return;

        optionsContainer.innerHTML = "";

        if (!service) {

            optionsContainer.classList.remove("active");
            return;

        }

        const options = isAuto(service) ? optionsAuto : optionsMaison;

        options.forEach((option) => {

            optionsContainer.innerHTML += `
                <div class="option-card">
                    <label for="${option.id}">
                        ${option.label}
                    </label>

                    <div class="d-flex align-items-center gap-3">

                        <span class="option-price">
                            +${option.prix}€
                        </span>

                        <input
                            type="checkbox"
                            id="${option.id}"
                            class="option-checkbox"
                            data-price="${option.prix}"
                            data-label="${option.label}">
                    </div>
                </div>
            `;

        });

        optionsContainer.classList.add("active");

        document.querySelectorAll(".option-checkbox").forEach((checkbox) => {

            checkbox.addEventListener("change", updatePrice);

        });

    }

    function updatePrice() {

        if (!serviceSelect || !totalPrice) return;

        const service = serviceSelect.value;

        let total = tarifs[service] || 0;

        document.querySelectorAll(".option-checkbox:checked").forEach((checkbox) => {

            total += Number(checkbox.dataset.price);

        });

        totalPrice.textContent = `${total}€`;

        if (selectedService && service) {

            selectedService.classList.remove("d-none");
            selectedService.innerHTML = `
                <strong>Service sélectionné :</strong>
                ${nomsServices[service]} (${tarifs[service]}€)
            `;

        } else if (selectedService) {

            selectedService.classList.add("d-none");

        }

    }

    if (serviceSelect) {

        const params = new URLSearchParams(window.location.search);
        const serviceFromUrl = params.get("service");

        if (serviceFromUrl && tarifs[serviceFromUrl]) {

            serviceSelect.value = serviceFromUrl;

        }

        renderOptions(serviceSelect.value);
        updatePrice();

        serviceSelect.addEventListener("change", () => {

            renderOptions(serviceSelect.value);
            updatePrice();

        });

    }

    // =========================
    // WhatsApp
    // =========================

    if (whatsappBtn) {

        whatsappBtn.addEventListener("click", () => {

            const nom = document.getElementById("nom")?.value.trim();
            const telephone = document.getElementById("telephone")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const service = serviceSelect?.value;
            const message = document.getElementById("message")?.value.trim();

            if (!nom || !telephone || !email || !service) {

                alert("Veuillez remplir tous les champs obligatoires.");

                return;

            }

            const options = [];

            document.querySelectorAll(".option-checkbox:checked").forEach((checkbox) => {

                options.push(`- ${checkbox.dataset.label}`);

            });

            const total = totalPrice.textContent;

            const texte = `Bonjour HYDA SERVICES,

Je souhaite réserver la prestation suivante :

🧼 Service : ${nomsServices[service]}

${options.length ? `✨ Options :
${options.join("\n")}

` : ""}💰 Prix estimé : ${total}

👤 Nom : ${nom}
📞 Téléphone : ${telephone}
📧 Email : ${email}

📝 Informations complémentaires :
${message || "Aucune précision supplémentaire."}`;

            const url = `https://wa.me/33672519938?text=${encodeURIComponent(texte)}`;

            window.open(url, "_blank");

        });

    }

    // =========================
    // Comparateur Avant / Après
    // =========================

    const sliders = document.querySelectorAll(".slider");

    sliders.forEach((slider) => {

        const container = slider.closest(".before-after-container");

        if (!container) return;

        const overlayWrapper = container.querySelector(".overlay-wrapper");
        const sliderLine = container.querySelector(".slider-line");
        const sliderButton = container.querySelector(".slider-button");

        if (!overlayWrapper || !sliderLine || !sliderButton) return;

        const updateSlider = () => {

            const value = `${slider.value}%`;

            overlayWrapper.style.width = value;
            sliderLine.style.left = value;
            sliderButton.style.left = value;

        };

        updateSlider();

        slider.addEventListener("input", updateSlider);

    });

    

});
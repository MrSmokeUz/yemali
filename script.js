document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const header = document.querySelector('.header .container');
    const languageSelect = document.getElementById('language-select'); // Changed to select element
    const loadingScreen = document.getElementById('loading-screen');
    const toastContainer = document.getElementById('toast-container');

    const ADMIN_PASSWORD = 'yemali-admin-password';
    const LOCAL_STORAGE_MENU_KEY = 'yemaliMenuData';
    const LOCAL_STORAGE_LANG_KEY = 'yemaliLanguage';

    let menuData = [];
    let currentLanguage = 'en'; // Default language

    const translations = {
        appName: { ru: 'Меню ресторана Yemali', en: 'Yemali Restaurant Menu' },
        loading: { ru: 'Загрузка...', en: 'Loading...' },
        menuTitle: { ru: 'Наше меню', en: 'Our Menu' },
        emptyMenu: { ru: 'Меню пока пусто. Пожалуйста, добавьте блюда через ', en: 'The menu is currently empty. Please add dishes via the ' },
        adminPanelLink: { ru: 'админ-панель', en: 'admin panel' },
        close: { ru: 'Закрыть', en: 'Close' },
        adminLoginTitle: { ru: 'Вход в админ-панель', en: 'Admin Panel Login' },
        passwordPlaceholder: { ru: 'Введите пароль', en: 'Enter password' },
        loginButton: { ru: 'Войти', en: 'Login' },
        addDishTitle: { ru: 'Добавить новое блюдо', en: 'Add New Dish' },
        dishNameRu: { ru: 'Название (RU)', en: 'Name (RU)' },
        dishNameEn: { ru: 'Название (EN)', en: 'Name (EN)' },
        dishDescriptionRu: { ru: 'Описание (RU)', en: 'Description (RU)' },
        dishDescriptionEn: { ru: 'Описание (EN)', en: 'Description (EN)' },
        dishPrice: { ru: 'Цена', en: 'Price' },
        dishCategory: { ru: 'Категория', en: 'Category' },
        newCategory: { ru: 'Новая категория', en: 'New Category' },
        imageUrl: { ru: 'URL изображения', en: 'Image URL' },
        addDishButton: { ru: 'Добавить блюдо', en: 'Add Dish' },
        passwordRequired: { ru: 'Пожалуйста, введите пароль.', en: 'Please enter password.' },
        invalidPassword: { ru: 'Неверный пароль!', en: 'Invalid password!' },
        dishAddedSuccess: { ru: 'Блюдо успешно добавлено!', en: 'Dish added successfully!' },
        formValidation: { ru: 'Пожалуйста, заполните все обязательные поля и убедитесь, что цена положительна.', en: 'Please fill in all required fields and ensure the price is positive.' },
        categoryRequired: { ru: 'Пожалуйста, выберите или введите категорию.', en: 'Please select or enter a category.' },
        imageURLError: { ru: 'Некорректный URL изображения.', en: 'Invalid image URL.' },
        pageNotFound: { ru: 'Страница не найдена', en: 'Page not found' },
        returnHome: { ru: 'Вернуться на главную', en: 'Return to Home' },
        error: { ru: 'Ошибка', en: 'Error' },
        success: { ru: 'Успех', en: 'Success' },
        langNameRu: { ru: 'Русский', en: 'Russian' }, // Added for dropdown
        langNameEn: { ru: 'English', en: 'English' } // Added for dropdown
    };

    const initialMenuData = [
        {
            id: '1',
            name: { ru: 'Долма', en: 'Dolma' },
            description: { ru: 'Традиционное азербайджанское блюдо из мясного фарша, завернутого в виноградные листья.', en: 'Traditional Azerbaijani dish made of minced meat wrapped in grape leaves.' },
            price: 12.50,
            category: 'Основные блюда',
            imageUrl: 'https://zira.uz/wp-content/uploads/2018/04/dolma-2.jpg'
        },
        {
            id: '2',
            name: { ru: 'Плов Сабзи Говурма', en: 'Plov Sabzi Govurma' },
            description: { ru: 'Азербайджанский плов с тушеной бараниной и зеленью.', en: 'Azerbaijani pilaf with stewed lamb and herbs.' },
            price: 18.00,
            category: 'Основные блюда',
            imageUrl: 'https://ic.pics.livejournal.com/stalic/2762948/2761386/2761386_original.jpg'
        },
        {
            id: '3',
            name: { ru: 'Кутабы с мясом', en: 'Qutab with Meat' },
            description: { ru: 'Тонкие лепешки с начинкой из мясного фарша, обжаренные на садже.', en: 'Thin flatbreads filled with minced meat, cooked on a saj.' },
            price: 7.00,
            category: 'Закуски',
            imageUrl: 'https://img.iamcook.ru/old/upl/recipes/cat/u-dcbeb53f8765955968619d07d0608147.jpg'
        },
        {
            id: '4',
            name: { ru: 'Кутабы с зеленью', en: 'Qutab with Greens' },
            description: { ru: 'Тонкие лепешки с начинкой из свежей зелени, обжаренные на садже.', en: 'Thin flatbreads filled with fresh herbs, cooked on a saj.' },
            price: 6.50,
            category: 'Закуски',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8w5JUCPo4ulnv1Pi_yGoBmwfrifmRjcpEjA&s'
        },
        {
            id: '5',
            name: { ru: 'Дюшбара', en: 'Dushbara' },
            description: { ru: 'Маленькие пельмени в ароматном бульоне, подаются с уксусом и чесноком.', en: 'Small dumplings in aromatic broth, served with vinegar and garlic.' },
            price: 9.00,
            category: 'Супы',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTVG03p_yKtdTqAzjGKfGV-9SZpnPkr3wcng&s'
        },
        {
            id: '6',
            name: { ru: 'Пахлава', en: 'Pakhlava' },
            description: { ru: 'Слоеный десерт с орехами и сиропом, традиционное лакомство.', en: 'Layered dessert with nuts and syrup, a traditional treat.' },
            price: 5.00,
            category: 'Десерты',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCl3HO56TIAEmV4Ex2r4fM8g-6HxQ6O5eNQg&s'
        },
        {
            id: '7',
            name: { ru: 'Шекербура', en: 'Shekerbura' },
            description: { ru: 'Сладкая выпечка с ореховой начинкой, украшенная узорами.', en: 'Sweet pastry with nut filling, decorated with patterns.' },
            price: 4.50,
            category: 'Десерты',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqA7zKL49gcbsjyKe5-AUg6anjzi6SrMlGjA&s'
        },
        {
            id: '8',
            name: { ru: 'Шекербура', en: 'Shekerbura' },
            description: { ru: 'Сладкая выпечка с ореховой начинкой, украшенная узорами.', en: 'Sweet pastry with nut filling, decorated with patterns.' },
            price: 4.50,
            category: 'Десерты',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqA7zKL49gcbsjyKe5-AUg6anjzi6SrMlGjA&s'
        },
        
    ];

    // --- Utility Functions ---

    function saveMenuData() {
        localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(menuData));
    }

    function loadMenuData() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
        if (storedData) {
            menuData = JSON.parse(storedData);
        } else {
            menuData = initialMenuData;
            saveMenuData(); // Save initial data to localStorage
        }
    }

    function saveLanguage() {
        localStorage.setItem(LOCAL_STORAGE_LANG_KEY, currentLanguage);
    }

    function loadLanguage() {
        const storedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
        if (storedLang) {
            currentLanguage = storedLang;
        }
    }

    function translateElement(element, key) {
        if (element && translations[key]) {
            element.textContent = translations[key][currentLanguage];
        }
    }

    function applyTranslations() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            translateElement(el, key);
        });
        // Update language select value
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }
    }

    function showToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Trigger reflow to ensure animation plays
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    }

    function showLoadingScreen() {
        loadingScreen.classList.remove('hidden');
    }

    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
    }

    function navigateTo(path) {
        location.hash = '#${path}'
        renderPage();
    }

    // --- Page Rendering Functions ---

    function renderMenuPage() {
        appContent.innerHTML = ''; // Clear previous content

        const pageTitle = document.createElement('h2');
        pageTitle.classList.add('page-title');
        pageTitle.setAttribute('data-translate', 'menuTitle');
        appContent.appendChild(pageTitle);
        translateElement(pageTitle, 'menuTitle');

        if (menuData.length === 0) {
            const emptyMessageDiv = document.createElement('div');
            emptyMessageDiv.classList.add('empty-menu-message');
            const p1 = document.createElement('p');
            p1.setAttribute('data-translate', 'emptyMenu');
            p1.textContent = translations.emptyMenu[currentLanguage];
            emptyMessageDiv.appendChild(p1);

            const adminLink = document.createElement('a');
            adminLink.href = '/admin';
            adminLink.setAttribute('data-translate', 'adminPanelLink');
            adminLink.textContent = translations.adminPanelLink[currentLanguage];
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/admin');
            });
            emptyMessageDiv.appendChild(adminLink);
            appContent.appendChild(emptyMessageDiv);
            return;
        }

        const categories = [...new Set(menuData.map(item => item.category))];

        // Create category navigation
        const categoryNav = document.createElement('nav');
        categoryNav.classList.add('category-navigation');
        categories.forEach(category => {
            const navLink = document.createElement('a');
            const categorySlug = category.replace(/\s+/g, '-').toLowerCase(); // Create a URL-friendly slug
            navLink.href = `#category-${categorySlug}`;
            navLink.textContent = category;
            navLink.classList.add('category-nav-link');
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            categoryNav.appendChild(navLink);
        });
        appContent.appendChild(categoryNav);


        categories.forEach(category => {
            const categoryDiv = document.createElement('section');
            categoryDiv.classList.add('menu-category');
            const categorySlug = category.replace(/\s+/g, '-').toLowerCase();
            categoryDiv.id = `category-${categorySlug}`; // Assign ID for scrolling

            const categoryTitle = document.createElement('h3');
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            const dishGrid = document.createElement('div');
            dishGrid.classList.add('dish-grid');

            const dishesInCategory = menuData.filter(item => item.category === category);
            dishesInCategory.forEach(dish => {
                const dishCard = document.createElement('div');
                dishCard.classList.add('dish-card');
                dishCard.innerHTML = `
                    <img src="${dish.imageUrl}" alt="${dish.name[currentLanguage]}" class="dish-card-image">
                    <div class="dish-card-content">
                        <h4 class="dish-card-title">${dish.name[currentLanguage]}</h4>
                        <p class="dish-card-description">${dish.description[currentLanguage]}</p>
                        <p class="dish-card-price">${dish.price.toFixed(2)} UZS</p>
                    </div>
                `;
                dishCard.addEventListener('click', () => openDishModal(dish));
                dishGrid.appendChild(dishCard);
            });

            categoryDiv.appendChild(dishGrid);
            appContent.appendChild(categoryDiv);
        });
    }

    function openDishModal(dish) {
        let modalOverlay = document.getElementById('dish-modal-overlay');
        if (!modalOverlay) {
            modalOverlay = document.createElement('div');
            modalOverlay.id = 'dish-modal-overlay';
            modalOverlay.classList.add('modal-overlay');
            document.body.appendChild(modalOverlay);
        }

        modalOverlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close-button" data-translate="close">&times;</button>
                <img src="${dish.imageUrl}" alt="${dish.name[currentLanguage]}" class="modal-image">
                <h3 class="modal-title">${dish.name[currentLanguage]}</h3>
                <p class="modal-description">${dish.description[currentLanguage]}</p>
                <p class="modal-price">${dish.price.toFixed(2)} UZS</p>
            </div>
        `;

        const closeButton = modalOverlay.querySelector('.modal-close-button');
        closeButton.addEventListener('click', closeDishModal);
        translateElement(closeButton, 'close');

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeDishModal();
            }
        });

        modalOverlay.classList.add('open');
    }

    function closeDishModal() {
        const modalOverlay = document.getElementById('dish-modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('open');
            modalOverlay.addEventListener('transitionend', () => {
                if (!modalOverlay.classList.contains('open')) {
                    modalOverlay.remove();
                }
            }, { once: true });
        }
    }

    function renderAdminLoginPage() {
        appContent.innerHTML = `
            <div class="admin-form-container">
                <h2 data-translate="adminLoginTitle"></h2>
                <form id="admin-login-form">
                    <div class="form-group">
                        <label for="password" data-translate="passwordPlaceholder"></label>
                        <input type="password" id="password" name="password" placeholder="${translations.passwordPlaceholder[currentLanguage]}" required>
                        <div id="password-error" class="error-message"></div>
                    </div>
                    <button type="submit" data-translate="loginButton"></button>
                </form>
            </div>
        `;
        applyTranslations(); // Apply translations to newly rendered elements

        const loginForm = document.getElementById('admin-login-form');
        const passwordInput = document.getElementById('password');
        const passwordError = document.getElementById('password-error');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            passwordError.textContent = '';
            if (!passwordInput.value) {
                passwordError.textContent = translations.passwordRequired[currentLanguage];
                return;
            }
            if (passwordInput.value === ADMIN_PASSWORD) {
                renderAdminPanel();
            } else {
                passwordError.textContent = translations.invalidPassword[currentLanguage];
                showToast(translations.invalidPassword[currentLanguage], 'error');
            }
        });
    }

    function renderAdminPanel() {
        const existingCategories = [...new Set(menuData.map(item => item.category))];
        const categoryOptions = existingCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

        appContent.innerHTML = `
            <div class="admin-form-container">
                <h2 data-translate="addDishTitle"></h2>
                <form id="add-dish-form">
                    <div class="form-group">
                        <label for="dishNameRu" data-translate="dishNameRu"></label>
                        <input type="text" id="dishNameRu" name="dishNameRu" required placeholder="${translations.dishNameRu[currentLanguage]}">
                    </div>
                    <div class="form-group">
                        <label for="dishNameEn" data-translate="dishNameEn"></label>
                        <input type="text" id="dishNameEn" name="dishNameEn" required placeholder="${translations.dishNameEn[currentLanguage]}">
                    </div>
                    <div class="form-group">
                        <label for="dishDescriptionRu" data-translate="dishDescriptionRu"></label>
                        <textarea id="dishDescriptionRu" name="dishDescriptionRu" required placeholder="${translations.dishDescriptionRu[currentLanguage]}"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="dishDescriptionEn" data-translate="dishDescriptionEn"></label>
                        <textarea id="dishDescriptionEn" name="dishDescriptionEn" required placeholder="${translations.dishDescriptionEn[currentLanguage]}"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="dishPrice" data-translate="dishPrice"></label>
                        <input type="number" id="dishPrice" name="dishPrice" step="0.01" min="0.01" required placeholder="${translations.dishPrice[currentLanguage]}">
                    </div>
                    <div class="form-group">
                        <label for="dishCategory" data-translate="dishCategory"></label>
                        <select id="dishCategory" name="dishCategory">
                            <option value="">-- ${translations.dishCategory[currentLanguage]} --</option>
                            ${categoryOptions}
                            <option value="new-category" data-translate="newCategory"></option>
                        </select>
                    </div>
                    <div class="form-group" id="newCategoryInputGroup" style="display: none;">
                        <label for="newCategoryName" data-translate="newCategory"></label>
                        <input type="text" id="newCategoryName" name="newCategoryName" placeholder="${translations.newCategory[currentLanguage]}">
                    </div>
                    <div class="form-group">
                        <label for="imageUrl" data-translate="imageUrl"></label>
                        <input type="text" id="imageUrl" name="imageUrl" required placeholder="${translations.imageUrl[currentLanguage]}">
                    </div>
                    <button type="submit" data-translate="addDishButton"></button>
                </form>
            </div>
        `;
        applyTranslations(); // Apply translations to newly rendered elements

        const addDishForm = document.getElementById('add-dish-form');
        const dishCategorySelect = document.getElementById('dishCategory');
        const newCategoryInputGroup = document.getElementById('newCategoryInputGroup');
        const newCategoryNameInput = document.getElementById('newCategoryName');

        dishCategorySelect.addEventListener('change', () => {
            if (dishCategorySelect.value === 'new-category') {
                newCategoryInputGroup.style.display = 'block';
                newCategoryNameInput.setAttribute('required', 'true');
            } else {
                newCategoryInputGroup.style.display = 'none';
                newCategoryNameInput.removeAttribute('required');
            }
        });

        addDishForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameRu = document.getElementById('dishNameRu').value.trim();
            const nameEn = document.getElementById('dishNameEn').value.trim();
            const descriptionRu = document.getElementById('dishDescriptionRu').value.trim();
            const descriptionEn = document.getElementById('dishDescriptionEn').value.trim();
            const price = parseFloat(document.getElementById('dishPrice').value);
            let category = dishCategorySelect.value;
            const imageUrl = document.getElementById('imageUrl').value.trim();

            if (category === 'new-category') {
                category = newCategoryNameInput.value.trim();
            }

            // Basic validation
            if (!nameRu || !nameEn || !descriptionRu || !descriptionEn || isNaN(price) || price <= 0 || !category || !imageUrl) {
                showToast(translations.formValidation[currentLanguage], 'error');
                return;
            }

            // Validate image URL (simple check)
            try {
                new URL(imageUrl);
            } catch (_) {
                showToast(translations.imageURLError[currentLanguage], 'error');
                return;
            }

            const newDish = {
                id: Date.now().toString(), // Simple unique ID
                name: { ru: nameRu, en: nameEn },
                description: { ru: descriptionRu, en: descriptionEn },
                price: price,
                category: category,
                imageUrl: imageUrl
            };

            menuData.push(newDish);
            saveMenuData();
            showToast(translations.dishAddedSuccess[currentLanguage], 'success');
            addDishForm.reset(); // Clear form
            newCategoryInputGroup.style.display = 'none'; // Hide new category input
            newCategoryNameInput.removeAttribute('required');
            renderAdminPanel(); // Re-render admin panel to update category dropdown
        });
    }

    function renderNotFoundPage() {
        appContent.innerHTML = `
            <div class="not-found-page">
                <h2 data-translate="error">404</h2>
                <p data-translate="pageNotFound"></p>
                <a href="/" class="button" data-translate="returnHome"></a>
            </div>
        `;
        applyTranslations(); // Apply translations to newly rendered elements

        const returnHomeLink = appContent.querySelector('.not-found-page a');
        returnHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/');
        });
    }

    function renderPage() {
        const path = location.hash.replace('#','') || '/';
        if (path === '/') {
            renderMenuPage();
        } else if (path === '/#admin') {
            renderAdminLoginPage();
        } else {
            renderNotFoundPage();
        }
        applyTranslations(); // Ensure all dynamic content is translated
    }

    // --- Event Listeners ---

    header.addEventListener('click', (e) => {
        if (e.target.closest('.app-title a')) {
            e.preventDefault();
            navigateTo('/');
        }
    });

    // Changed from buttons to select
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            saveLanguage();
            applyTranslations();
            renderPage(); // Re-render current page to apply language changes
        });
    }

    window.addEventListener('popstate', renderPage); // Handle browser back/forward buttons

    // --- Initial App Load ---
    showLoadingScreen();
    loadLanguage();
    loadMenuData();
    applyTranslations(); // Apply initial translations to static elements

    // Simulate loading time
    setTimeout(() => {
        hideLoadingScreen();
        renderPage();
    }, 1500); // Show loading screen for 1.5 seconds
});

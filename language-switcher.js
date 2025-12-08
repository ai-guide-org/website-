// language-switcher.js - Simple language switcher for AI Guide
const LanguageSwitcher = {
    currentLang: 'en',
    
    init() {
        // 1. Определяне на езика
        const urlLang = window.location.pathname.includes('bg.html') ? 'bg' : 'en';
        const savedLang = localStorage.getItem('ai-guide-lang');
        this.currentLang = urlLang || savedLang || 'en';
        
        // 2. Прилагане на езика
        this.applyLanguage();
        
        // 3. Настройване на бутоните
        this.setupSwitchers();
        
        console.log(`🌐 Language set to: ${this.currentLang}`);
    },
    
    applyLanguage() {
        const isBG = this.currentLang === 'bg';
        
        // Промяна на HTML lang атрибута
        document.documentElement.lang = this.currentLang;
        
        // Промяна на менюто
        this.updateMenu(isBG);
        
        // Промяна на бутони и текст
        this.updateButtons(isBG);
        
        // Промяна на футъра
        this.updateFooter(isBG);
        
        // Запазване на избора
        localStorage.setItem('ai-guide-lang', this.currentLang);
    },
    
    updateMenu(isBG) {
        // Навигационни линкове
        const navElements = {
            // Главно меню
            '.nav-link[href="index.html"]': isBG ? '🏠 Начало' : '🏠 Home',
            
            // Dropdown за Ръководство/Guide
            '.nav-dropdown:nth-child(2) .dropdown-toggle': isBG ? '📚 Ръководство' : '📚 Guide',
            '.nav-dropdown:nth-child(2) .dropdown-item:nth-child(1)': isBG ? '🎯 Основи на комуникацията' : '🎯 Communication Basics',
            '.nav-dropdown:nth-child(2) .dropdown-item:nth-child(2)': isBG ? '📋 Шаблони и примери' : '📋 Templates & Examples',
            '.nav-dropdown:nth-child(2) .dropdown-item:nth-child(3)': isBG ? '🚀 Напреднали техники' : '🚀 Advanced Techniques',
            
            // Dropdown за За теб/For You
            '.nav-dropdown:nth-child(3) .dropdown-toggle': isBG ? '👥 За теб' : '👥 For You',
            '.nav-dropdown:nth-child(3) .dropdown-item:nth-child(1)': isBG ? '💻 За програмисти' : '💻 For Programmers',
            '.nav-dropdown:nth-child(3) .dropdown-item:nth-child(2)': isBG ? '✍️ За писатели' : '✍️ For Writers',
            '.nav-dropdown:nth-child(3) .dropdown-item:nth-child(3)': isBG ? '🎓 За студенти' : '🎓 For Students',
            '.nav-dropdown:nth-child(3) .dropdown-item:nth-child(4)': isBG ? '💼 За бизнес' : '💼 For Business',
            
            // Dropdown за Инструменти/Tools
            '.nav-dropdown:nth-child(4) .dropdown-toggle': isBG ? '🛠️ Инструменти' : '🛠️ Tools',
            '.nav-dropdown:nth-child(4) .dropdown-item:nth-child(1)': isBG ? '🔍 Анализатор на промпт' : '🔍 Prompt Analyzer',
            '.nav-dropdown:nth-child(4) .dropdown-item:nth-child(2)': isBG ? '🏗️ Създател на промпт' : '🏗️ Prompt Builder',
            '.nav-dropdown:nth-child(4) .dropdown-item:nth-child(3)': isBG ? '🧪 Практикувай' : '🧪 Practice',
            
            // Ресурси/Resources
            '.nav-link[href="resources.html"]': isBG ? '📚 Ресурси' : '📚 Resources',
            
            // Атрибут за мобилно меню
            '#menuToggle': isBG ? 'Отвори/затвори меню' : 'Open/close menu'
        };
        
        // Прилагане на промените
        for (const selector in navElements) {
            const element = document.querySelector(selector);
            if (element) {
                if (selector.includes('aria-label')) {
                    element.setAttribute('aria-label', navElements[selector]);
                } else {
                    element.innerHTML = navElements[selector];
                }
            }
        }
    },
    
    updateButtons(isBG) {
        // Анализирай бутон
        const analyzeBtn = document.querySelector('.primary-btn');
        if (analyzeBtn && analyzeBtn.textContent.includes('Analyze') || analyzeBtn.textContent.includes('Анализирай')) {
            analyzeBtn.innerHTML = isBG ? 
                '<span>📊</span><span>Анализирай моя промпт</span>' : 
                '<span>📊</span><span>Analyze My Prompt</span>';
        }
        
        // Вторични бутони
        document.querySelectorAll('.secondary-btn').forEach(btn => {
            if (btn.textContent.includes('Back to') || btn.textContent.includes('Обратно')) {
                btn.innerHTML = isBG ? 
                    '<span>🏠</span><span>Обратно към началната страница</span>' : 
                    '<span>🏠</span><span>Back to Home Page</span>';
            }
        });
        
        // PWA инсталационен бутон
        const installBtn = document.getElementById('installButton');
        if (installBtn) {
            installBtn.textContent = isBG ? '📱 Инсталирай като приложение' : '📱 Install as App';
        }
    },
    
    updateFooter(isBG) {
        const footer = document.querySelector('footer .container');
        if (footer) {
            const paragraphs = footer.querySelectorAll('p');
            if (paragraphs[0]) {
                paragraphs[0].textContent = isBG ? 
                    'AI Комуникационен Гид &copy; 2024' : 
                    'AI Communication Guide &copy; 2024';
            }
            if (paragraphs[1]) {
                paragraphs[1].textContent = isBG ? 
                    'Работи офлайн • Може да се инсталира като приложение • Безплатно завинаги' : 
                    'Works offline • Can be installed as app • Free forever';
            }
        }
    },
    
    setupSwitchers() {
        // Language switcher бутони
        document.querySelectorAll('.lang-btn, .lang-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const switchToBG = btn.textContent.includes('🇧🇬') || btn.href.includes('bg.html');
                const newLang = switchToBG ? 'bg' : 'en';
                
                if (newLang !== this.currentLang) {
                    this.currentLang = newLang;
                    this.applyLanguage();
                    
                    // Пренасочване ако е нужно
                    const currentPage = window.location.pathname;
                    if (currentPage.includes('bg.html') || currentPage.includes('en.html')) {
                        setTimeout(() => {
                            window.location.href = newLang === 'bg' ? 'bg.html' : 'en.html';
                        }, 300);
                    }
                }
            });
        });
    },
    
    switchTo(lang) {
        if (['bg', 'en'].includes(lang)) {
            this.currentLang = lang;
            this.applyLanguage();
            return true;
        }
        return false;
    }
};

// Автоматично стартиране
document.addEventListener('DOMContentLoaded', () => LanguageSwitcher.init());

// Глобално достъпен
window.LanguageSwitcher = LanguageSwitcher;

// comments.js - Система за коментари

class CommentSystem {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.commentsKey = `aiGuideComments_${this.currentPage}`;
        this.initialize();
    }
    
    initialize() {
        this.loadComments();
        this.setupEventListeners();
    }
    
    loadComments() {
        const commentsContainer = document.getElementById('commentsContainer');
        if (!commentsContainer) return;
        
        const comments = this.getComments();
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <p>📝 Все още няма коментари. Бъдете първият!</p>
                </div>
            `;
            return;
        }
        
        let html = '<h4 style="margin-bottom: 15px;">💬 Коментари (' + comments.length + '):</h4>';
        
        comments.forEach((comment, index) => {
            html += `
                <div class="comment-item" style="
                    background: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    border-left: 4px solid var(--primary-color);
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong style="color: var(--primary-color);">${comment.name || 'Анонимен'}</strong>
                        <span style="font-size: 0.85em; color: #666;">${comment.date}</span>
                    </div>
                    <div style="color: #333; line-height: 1.5;">${this.escapeHtml(comment.text)}</div>
                    ${comment.reply ? `
                        <div style="margin-top: 10px; padding: 10px; background: #f0f9ff; border-radius: 5px; border-left: 3px solid #1890ff;">
                            <strong style="color: #1890ff;">📢 Отговор:</strong> ${this.escapeHtml(comment.reply)}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        commentsContainer.innerHTML = html;
    }
    
    getComments() {
        return JSON.parse(localStorage.getItem(this.commentsKey) || '[]');
    }
    
    saveComment(name, text) {
        const comments = this.getComments();
        
        const newComment = {
            name: name.trim() || 'Анонимен',
            text: text.trim(),
            date: new Date().toLocaleString('bg-BG'),
            page: this.currentPage,
            id: Date.now() // Уникален ID
        };
        
        comments.unshift(newComment); // Добавяне в началото
        localStorage.setItem(this.commentsKey, JSON.stringify(comments));
        
        // Добавяне на автоматичен отговор (примерно)
        setTimeout(() => {
            this.addAutoReply(newComment.id);
        }, 1000);
        
        return newComment;
    }
    
    addAutoReply(commentId) {
        const comments = this.getComments();
        const commentIndex = comments.findIndex(c => c.id === commentId);
        
        if (commentIndex !== -1 && !comments[commentIndex].reply) {
            const autoReplies = [
                "Благодаря за коментара! Ако имаш конкретен въпрос за AI комуникация, пиши ни!",
                "Интересно мнение! Опитали ли сте да приложите това в практиката?",
                "Благодаря за споделянето! Продължавайте да експериментирате с различни подходи.",
                "Добър коментар! Имате ли опит с конкретен AI инструмент?",
                "Благодаря за обратната връзка! Ще го имаме предвид за бъдещи актуализации."
            ];
            
            const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
            
            comments[commentIndex].reply = randomReply;
            localStorage.setItem(this.commentsKey, JSON.stringify(comments));
            this.loadComments();
        }
    }
    
    setupEventListeners() {
        const submitBtn = document.getElementById('submitComment');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmit());
        }
        
        // Enter за изпращане
        const commentInput = document.getElementById('commentText');
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSubmit();
                }
            });
        }
    }
    handleSubmit() {
        const nameInput = document.getElementById('commentName');
        const textInput = document.getElementById('commentText');
        
        const name = nameInput ? nameInput.value : '';
        const text = textInput ? textInput.value : '';
        
        if (!text.trim()) {
            this.showMessage('Моля, напишете коментар преди да изпратите!', 'error');
            return;
        }
        
        if (text.length > 500) {
            this.showMessage('Коментарът е твърде дълъг (макс. 500 символа)', 'error');
            return;
        }
        
        this.saveComment(name, text);
        
        // Изчистване на формата
        if (textInput) textInput.value = '';
        
        // Презареждане на коментарите
        this.loadComments();
        
        // Показване на съобщение
        this.showMessage('Коментарът е изпратен успешно!', 'success');
        
        // Ако няма име, предлагаме да се запази
        if (!name.trim()) {
            setTimeout(() => {
                if (confirm('Искате ли да запазите името си за бъдещи коментари?')) {
                    localStorage.setItem('aiGuideCommentName', nameInput.value);
                }
            }, 500);
        }
    }
    
    showMessage(text, type) {
        // Създаване на съобщението
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#52c41a' : '#ff4d4f'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        messageDiv.textContent = text;
        document.body.appendChild(messageDiv);
        
        // Премахване след 3 секунди
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Инициализация при зареждане на страницата
document.addEventListener('DOMContentLoaded', () => {
    window.commentSystem = new CommentSystem();
    
    // Зареждане на запазено име, ако има такова
    const savedName = localStorage.getItem('aiGuideCommentName');
    const nameInput = document.getElementById('commentName');
    if (nameInput && savedName) {
        nameInput.value = savedName;
    }
    
    // Добавяне на CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .dark-mode .comment-item {
            background: #2d2d2d !important;
            color: #ffffff !important;
        }
        
        .dark-mode .comment-item div {
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(style);
});

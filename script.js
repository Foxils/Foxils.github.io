function toggleJudgingCat() {
    const cat = document.getElementById('judgingCat');
    const message = document.getElementById('judgingMessage');
    if (cat.style.display === 'none' || cat.style.display === '') {
        cat.style.display = 'block'; 
        message.style.display = 'block'; 
    } else {
        cat.style.display = 'none'; 
        message.style.display = 'none'; 
    }
}

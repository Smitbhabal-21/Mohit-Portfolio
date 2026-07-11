document.addEventListener('DOMContentLoaded', () => {
    const scenes = document.querySelectorAll('.scene');
    const totalScenes = scenes.length;
    const scrollContainer = document.querySelector('.scroll-container');
    const cursor = document.querySelector('.cursor');
    const progressBar = document.getElementById('progress-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sceneCounter = document.getElementById('scene-counter');

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        // Normalized mouse coordinates for 3D rotation (-1 to 1)
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    let targetProgress = 0;
    let currentProgress = 0;

    function onScroll() {
        const scrollY = window.scrollY;
        const scrollableHeight = scrollContainer.clientHeight - window.innerHeight;
        targetProgress = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
        targetProgress = Math.max(0, Math.min(1, targetProgress));
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIndex = parseInt(link.getAttribute('data-target'));
            const scrollableHeight = scrollContainer.clientHeight - window.innerHeight;
            const targetScroll = (targetIndex / totalScenes) * scrollableHeight;
            window.scrollTo({ top: targetScroll + 5, behavior: 'smooth' });
        });
    });

    function renderLoop() {
        // UI Updates
        currentProgress += (targetProgress - currentProgress) * 0.08;
        progressBar.style.width = `${currentProgress * 100}%`;

        let activeIndex = Math.floor(targetProgress * totalScenes);
        if (activeIndex >= totalScenes) activeIndex = totalScenes - 1;

        const pad = (n) => String(n).padStart(2, '0');
        if (sceneCounter) sceneCounter.textContent = `${pad(activeIndex + 1)} / ${pad(totalScenes)}`;

        navLinks.forEach(link => {
            const target = parseInt(link.getAttribute('data-target'));
            link.classList.toggle('active-nav', activeIndex === target);
        });

        // 3D Mouse Parallax interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Apply state to scenes
        scenes.forEach((scene, index) => {
            const isActive = index === activeIndex;
            scene.classList.toggle('active', isActive);

            const bgWrapper = scene.querySelector('.bg-wrapper');
            if (bgWrapper) {
                if (isActive) {
                    // Calculate how far we are through THIS specific scene (0.0 to 1.0)
                    // We use currentProgress to ensure the zoom is perfectly smooth
                    const exactProgress = currentProgress * totalScenes;
                    const sceneProgress = Math.max(0, exactProgress - index);
                    
                    // Zoom effect as you scroll through the scene
                    const scale = 1 + (sceneProgress * 0.08); 
                    
                    // 3D Tilt effect based on mouse
                    const rotateX = currentY * 8; // max 8 degrees tilt
                    const rotateY = currentX * 8; 

                    bgWrapper.style.transform = `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else {
                    // Reset inactive scenes immediately
                    bgWrapper.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
                }
            }
        });

        requestAnimationFrame(renderLoop);
    }

    onScroll();
    renderLoop();
});

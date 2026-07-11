document.addEventListener("DOMContentLoaded", () => {
    const scenes = document.querySelectorAll('.scene');
    const bgImages = document.querySelectorAll('.bg-image');
    
    // Total number of scenes
    const numScenes = scenes.length;
    
    // Create timeline array for equal divisions based on number of scenes (6 scenes = 0 to 1/6, 1/6 to 2/6, etc)
    const timeline = [];
    for(let i = 0; i < numScenes; i++) {
        timeline.push({
            start: i / numScenes,
            end: (i + 1) / numScenes,
            id: `scene-${i}`
        });
    }

    // Initialize first scene
    if (scenes.length > 0) scenes[0].classList.add('active');

    // Handle Scroll for Scenes and Parallax Zoom
    window.addEventListener('scroll', () => {
        // Calculate scroll progress from 0 to 1
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Prevent division by zero if body isn't tall enough
        if(scrollHeight <= 0) return;
        
        const scrollProgress = window.scrollY / scrollHeight;
        
        let activeSceneIndex = 0;
        
        timeline.forEach((sceneData, index) => {
            // Check which scene is currently active
            if (scrollProgress >= sceneData.start && scrollProgress < sceneData.end) {
                activeSceneIndex = index;
                
                if (!scenes[index].classList.contains('active')) {
                    scenes.forEach(s => s.classList.remove('active'));
                    scenes[index].classList.add('active');
                }
            }
        });
        
        // Edge case for hitting the exact bottom
        if (scrollProgress >= 1) {
            activeSceneIndex = numScenes - 1;
            scenes.forEach(s => s.classList.remove('active'));
            scenes[numScenes - 1].classList.add('active');
        }
        
        // Parallax zoom effect for background images
        bgImages.forEach((bg, index) => {
            if(index === activeSceneIndex) {
                const sceneData = timeline[index];
                // Calculate local progress within this scene (0 to 1)
                let localProgress = (scrollProgress - sceneData.start) / (sceneData.end - sceneData.start);
                localProgress = Math.max(0, Math.min(1, localProgress)); // Clamp
                
                // Scale from 1.15 down to 1.05 based on scroll inside the scene for a subtle push-in/pull-out cinematic feel
                const scale = 1.15 - (localProgress * 0.10);
                bg.style.transform = `scale(${scale})`;
            }
        });
    });

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    if(cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Adding a slight delay for follower via css transition on left/top
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Hover effects on interactive elements
        const hoverElements = document.querySelectorAll('.skill-tag, h1, h3, a, .job-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
                cursorFollower.style.background = 'rgba(243, 156, 18, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.width = '36px';
                cursorFollower.style.height = '36px';
                cursorFollower.style.background = 'transparent';
            });
        });
    }
});

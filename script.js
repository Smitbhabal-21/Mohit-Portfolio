document.addEventListener("DOMContentLoaded", () => {
    const scenes = document.querySelectorAll('.scene');
    
    // Total number of scenes
    const numScenes = scenes.length;
    let activeSceneIndex = 0;
    
    // Initialize first scene
    if (scenes.length > 0) scenes[0].classList.add('active');

    // Video Auto-Play Logic
    let videoInterval;
    let isPaused = false;
    const SCENE_DURATION = 6000; // 6 seconds per scene

    const advanceScene = () => {
        if(isPaused) return;

        // Remove active class from current
        scenes[activeSceneIndex].classList.remove('active');
        
        // Move to next
        activeSceneIndex = (activeSceneIndex + 1) % numScenes;
        
        // Add active class to new
        scenes[activeSceneIndex].classList.add('active');
    };

    videoInterval = setInterval(advanceScene, SCENE_DURATION);

    // Play / Pause Logic
    const playPauseBtn = document.getElementById('play-pause-btn');
    const pauseIcon = document.getElementById('pause-icon');
    const playIcon = document.getElementById('play-icon');
    const videoContainer = document.querySelector('.video-container');

    // Custom Cursor Variables
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');

    if(playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            if(isPaused) {
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
                videoContainer.classList.add('paused');
            } else {
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
                videoContainer.classList.remove('paused');
            }
        });
        
        // Hover effects for the button
        playPauseBtn.addEventListener('mouseenter', () => {
            if(cursorFollower) {
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
                cursorFollower.style.background = 'rgba(243, 156, 18, 0.2)';
            }
        });
        playPauseBtn.addEventListener('mouseleave', () => {
            if(cursorFollower) {
                cursorFollower.style.width = '36px';
                cursorFollower.style.height = '36px';
                cursorFollower.style.background = 'transparent';
            }
        });
    }
    
    // Custom Cursor Logic
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

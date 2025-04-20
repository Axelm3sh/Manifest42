<template>
  <div
    ref="backgroundRef"
    class="dot-matrix-background"
    :class="{ 'dark-theme': isDarkTheme }"
    @mousemove="handleMouseMove"
  >
    <canvas ref="canvasRef" class="dot-matrix-canvas"></canvas>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';

// Props
const props = defineProps({
  // Density of dots (higher = more dots)
  density: {
    type: Number,
    default: 80
  },
  // Radius of the glow effect around the mouse
  glowRadius: {
    type: Number,
    default: 150
  },
  // Intensity of the glow effect (0-1)
  glowIntensity: {
    type: Number,
    default: 0.8
  }
});

// Refs
const backgroundRef = ref(null);
const canvasRef = ref(null);
const mousePosition = ref({ x: 0, y: 0 });
const animationFrameId = ref(null);

// Check if dark theme is active
const isDarkTheme = computed(() => {
  return document.documentElement.getAttribute('data-theme') === 'dark';
});

// Initialize canvas and start animation
onMounted(() => {
  setupCanvas();
  window.addEventListener('resize', setupCanvas);
  window.addEventListener('mousemove', handleMouseMove);  // Listen globally
  animationFrameId.value = requestAnimationFrame(animate);
});

// Clean up
onUnmounted(() => {
  window.removeEventListener('resize', setupCanvas);
  window.removeEventListener('mousemove', handleMouseMove);
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});

// Set up canvas dimensions and context
const setupCanvas = () => {
  if (!backgroundRef.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const container = backgroundRef.value;

  // Set canvas dimensions to match container
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
};

// Handle mouse movement
const handleMouseMove = (event) => {
  if (!backgroundRef.value) return;
  const rect = backgroundRef.value.getBoundingClientRect();
  // Clamp mouse x/y within the background area bounds so dots respond even when mouse outside
  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
  mousePosition.value = { x, y };
};

// Animation loop
const animate = () => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Calculate dot spacing based on density
  const spacing = Math.min(width, height) / props.density;

  // Draw dots
  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      // Calculate distance from mouse
      const dx = x - mousePosition.value.x;
      const dy = y - mousePosition.value.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate dot size and opacity based on distance from mouse
      const maxSize = spacing * 0.4;
      const baseSize = spacing * 0.1;
      let size = baseSize;
      let opacity = 0.3;

      if (distance < props.glowRadius) {
        // Increase size and opacity for dots near the mouse
        const factor = 1 - (distance / props.glowRadius);
        size = baseSize + (maxSize - baseSize) * factor * props.glowIntensity;
        opacity = 0.3 + 0.7 * factor * props.glowIntensity;
      }

      // Set color based on theme
      const dotColor = isDarkTheme.value
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`;

      // Draw the dot
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }
  }

  // Continue animation loop
  animationFrameId.value = requestAnimationFrame(animate);
};
</script>

<style scoped>
.dot-matrix-background {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none; /* Let clicks through */
}

.dot-matrix-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
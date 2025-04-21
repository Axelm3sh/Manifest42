<template>
  <div
    ref="backgroundRef"
    class="dot-matrix-background"
    :class="{ 'dark-theme': isDarkTheme, 'focused': isFocused }"
    @mousemove="handleMouseMove"
    @click="handleClick"
    @focus="isFocused = true"
    @blur="isFocused = false"
    tabindex="-1"
    role="application"
    aria-label="Interactive dot matrix background."
  >
    <canvas ref="canvasRef" class="dot-matrix-canvas"></canvas>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';

// Props
const props = defineProps({
  // Density of dots (higher = more dots)
  density: {
    type: Number,
    default: 60
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
  },
  // Enable reduced motion mode
  reducedMotion: {
    type: Boolean,
    default: false
  },
});

// Expose methods to parent components
const fadeOut = (duration = 500) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const startOpacity = parseFloat(canvas.style.opacity || 1);
  const startTime = performance.now();

  const animate = (time) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (canvas) {
      canvas.style.opacity = startOpacity * (1 - progress);
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// Expose methods
defineExpose({ fadeOut });

// Refs
const backgroundRef = ref(null);
const canvasRef = ref(null);
const mousePosition = ref({ x: 0, y: 0 });
const animationFrameId = ref(null);
const lastFrameTime = ref(0);
const frameInterval = ref(1000 / 60); // Target 60fps by default

// Ripple effect state
const ripple = ref({
  active: false,
  x: 0,
  y: 0,
  radius: 0,
  maxRadius: 0,
  startTime: 0,
  duration: 1000 // Duration of ripple animation in ms
});

// Check if dark theme is active
const isDarkTheme = computed(() => {
  return document.documentElement.getAttribute('data-theme') === 'dark';
});

// Focus state for accessibility
const isFocused = ref(false);

// Device detection
const isMobile = ref(false);
const prefersReducedMotion = ref(false);

// Handler for reduced motion preference changes
const handleReducedMotionChange = (e) => {
  prefersReducedMotion.value = e.matches;
};

// Computed effective density based on device
const effectiveDensity = computed(() => {
  // Reduce density on mobile devices
  return isMobile.value ? Math.floor(props.density / 2) : props.density;
});

// Computed effective motion reduction
const shouldReduceMotion = computed(() => {
  return props.reducedMotion || prefersReducedMotion.value;
});

const MOBILE_WIDTH_THRESHOLD = 768;

// Updates isMobile and density live on resize or orientation change
const updateResponsiveSettings = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth <= MOBILE_WIDTH_THRESHOLD;
  setupCanvas();
};

// Updates reduced motion status explicitly, for reuse
const updateReducedMotion = () => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setupCanvas();
};

// Handle reduced motion media query change
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

onMounted(() => {
  updateResponsiveSettings();
  updateReducedMotion();

  // Listeners for responsive & accessibility features
  window.addEventListener('resize', updateResponsiveSettings);
  window.addEventListener('orientationchange', updateResponsiveSettings);
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

  // Adjust frame rate as-needed
  watch(isMobile, (nowMobile) => {
    frameInterval.value = nowMobile ? 1000 / 48 : 1000 / 72;
  }, { immediate: true });

  // Start the animation
  lastFrameTime.value = performance.now();
  animationFrameId.value = requestAnimationFrame(animate);
});

// Clean up listeners on unmount
onUnmounted(() => {
  window.removeEventListener('resize', updateResponsiveSettings);
  window.removeEventListener('orientationchange', updateResponsiveSettings);
  reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);

  if (animationFrameId.value) cancelAnimationFrame(animationFrameId.value);
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

// Handle click for ripple effect
const handleClick = (event) => {
  if (!backgroundRef.value) return;

  const rect = backgroundRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Calculate maximum radius (distance to farthest corner)
  const distToTopLeft = Math.sqrt(x * x + y * y);
  const distToTopRight = Math.sqrt((rect.width - x) * (rect.width - x) + y * y);
  const distToBottomLeft = Math.sqrt(x * x + (rect.height - y) * (rect.height - y));
  const distToBottomRight = Math.sqrt((rect.width - x) * (rect.width - x) + (rect.height - y) * (rect.height - y));
  const maxRadius = Math.max(distToTopLeft, distToTopRight, distToBottomLeft, distToBottomRight);

  // Set ripple properties
  ripple.value = {
    active: true,
    x,
    y,
    radius: 0,
    maxRadius,
    startTime: performance.now(),
    duration: 1000
  };
};

// Animation loop
const animate = (timestamp) => {
  if (!canvasRef.value) return;

  // Frame rate control
  const elapsed = timestamp - lastFrameTime.value;
  if (elapsed < frameInterval.value) {
    // Skip this frame if not enough time has passed
    animationFrameId.value = requestAnimationFrame(animate);
    return;
  }

  // Update last frame time
  lastFrameTime.value = timestamp;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Update ripple radius if active and not in reduced motion mode
  if (ripple.value.active && !shouldReduceMotion.value) {
    const now = performance.now();
    const elapsed = now - ripple.value.startTime;
    const progress = Math.min(elapsed / ripple.value.duration, 1);

    // Update radius using easeOutQuad for a natural effect
    ripple.value.radius = ripple.value.maxRadius * easeOutQuad(progress);

    // Reset ripple when animation completes
    if (progress >= 1) {
      ripple.value.active = false;
    }
  } else if (ripple.value.active && shouldReduceMotion.value) {
    // In reduced motion mode, complete ripple immediately
    ripple.value.active = false;
  }

  // Calculate dot spacing based on effective density
  const spacing = Math.min(width, height) / effectiveDensity.value;

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

      // In reduced motion mode, use simpler rendering with less animation
      if (shouldReduceMotion.value) {
        // Minimal mouse interaction in reduced motion mode
        if (distance < props.glowRadius) {
          // Subtle highlight only
          opacity = 0.4;
        }
      } else {
        // Full animation when reduced motion is off
        if (distance < props.glowRadius) {
          // Increase size and opacity for dots near the mouse
          const factor = 1 - (distance / props.glowRadius);
          size = baseSize + (maxSize - baseSize) * factor * props.glowIntensity;
          opacity = 0.3 + 0.7 * factor * props.glowIntensity;
        }

        // Apply ripple effect if active
        if (ripple.value.active) {
          const dxRipple = x - ripple.value.x;
          const dyRipple = y - ripple.value.y;
          const distanceFromRipple = Math.sqrt(dxRipple * dxRipple + dyRipple * dyRipple);

          // Calculate distance from ripple edge
          const distanceFromRippleEdge = Math.abs(distanceFromRipple - ripple.value.radius);

          // Apply effect to dots near the ripple edge (within a certain range)
          const rippleEffectRange = 50;
          if (distanceFromRippleEdge < rippleEffectRange) {
            const rippleFactor = 1 - (distanceFromRippleEdge / rippleEffectRange);

            // Enhance size and opacity based on proximity to ripple edge
            size = Math.max(size, baseSize + (maxSize - baseSize) * rippleFactor);
            opacity = Math.max(opacity, 0.3 + 0.7 * rippleFactor);
          }
        }
      }

      // Set color based on theme - using green colors similar to login-subtitle
      const dotColor = isDarkTheme.value
        ? `rgba(42, 128, 87, ${opacity})` // --color-secondary-dark in dark mode
        : `rgba(66, 184, 131, ${opacity})`; // --color-secondary in light mode

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

// Easing function for smooth animation
const easeOutQuad = (t) => t * (2 - t);
</script>

<style scoped>
.dot-matrix-background {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: auto; /* Allow clicks for ripple effect */
}

.dot-matrix-canvas {
  display: block;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

</style>
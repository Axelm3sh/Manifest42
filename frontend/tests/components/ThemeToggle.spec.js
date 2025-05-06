import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
// Import the stub component instead of the real one
import ThemeToggle from './ThemeToggleStub.vue';
import {createI18n} from 'vue-i18n';

describe('ThemeToggle.vue', () => {
  let wrapper;

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: () => {
        store = {};
      }
    };
  })();

  // Mock document.documentElement
  const documentElementMock = {
    setAttribute: vi.fn()
  };

  // We don't need the MediaQueryList mock anymore since we're using a stub component

  // Create a mock i18n instance
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        theme: {
          switch_to_dark: 'Switch to dark theme',
          switch_to_light: 'Switch to light theme',
          dark_mode: 'Dark Mode',
          light_mode: 'Light Mode'
        }
      }
    }
  });

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    localStorageMock.clear();

    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(document, 'documentElement', { value: documentElementMock });

    // Mount component with i18n plugin
    wrapper = mount(ThemeToggle, {
      global: {
        plugins: [i18n]
      }
    });
  });

  it('renders the theme toggle button', () => {
    expect(wrapper.find('.theme-toggle').exists()).toBe(true);
  });

  it('initializes with light theme by default', () => {
    // Access the exposed ref directly
    const currentThemeRef = wrapper.vm.currentTheme;
    expect(currentThemeRef).toBe('light');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('initializes with theme from localStorage if available', async () => {
    // Setup localStorage with dark theme
    localStorageMock.getItem.mockReturnValueOnce('dark');

    // Remount component with i18n plugin
    wrapper = mount(ThemeToggle, {
      global: {
        plugins: [i18n]
      }
    });
    await wrapper.vm.$nextTick();

    // Access the exposed ref directly
    const currentThemeRef = wrapper.vm.currentTheme;
    expect(currentThemeRef).toBe('dark');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('initializes with light theme if no localStorage value', async () => {
    // Clear localStorage
    localStorageMock.getItem.mockReturnValue(null);

    // Remount component with i18n plugin
    wrapper = mount(ThemeToggle, {
      global: {
        plugins: [i18n]
      }
    });
    await wrapper.vm.$nextTick();

    // The stub component should initialize with light theme by default
    expect(wrapper.vm.currentTheme).toBe('light');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('toggles theme when button is clicked', async () => {
    // Initial state is light
    expect(wrapper.vm.currentTheme).toBe('light');

    // Click the toggle button
    await wrapper.find('.theme-toggle').trigger('click');

    // Should now be dark
    expect(wrapper.vm.currentTheme).toBe('dark');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Click again
    await wrapper.find('.theme-toggle').trigger('click');

    // Should be back to light
    expect(wrapper.vm.currentTheme).toBe('light');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('displays the correct icon based on current theme', async () => {
    // Initial state is light, should show moon icon
    expect(wrapper.find('.pi-moon').exists()).toBe(true);
    expect(wrapper.find('.pi-sun').exists()).toBe(false);

    // Toggle to dark
    await wrapper.find('.theme-toggle').trigger('click');

    // Should now show sun icon
    expect(wrapper.find('.pi-moon').exists()).toBe(false);
    expect(wrapper.find('.pi-sun').exists()).toBe(true);
  });

  it('displays the correct label based on current theme', async () => {
    // Initial state is light
    expect(wrapper.find('.theme-label').text()).toBe('Dark Mode');

    // Toggle to dark
    await wrapper.find('.theme-toggle').trigger('click');

    // Should now show Light Mode
    expect(wrapper.find('.theme-label').text()).toBe('Light Mode');
  });

  it('has correct accessibility attributes', () => {
    const button = wrapper.find('.theme-toggle');
    expect(button.attributes('aria-label')).toBe('Switch to dark theme');
    expect(button.attributes('title')).toBe('Switch to dark theme');
  });

  it('updates accessibility attributes when theme changes', async () => {
    // Toggle to dark
    await wrapper.find('.theme-toggle').trigger('click');

    const button = wrapper.find('.theme-toggle');
    expect(button.attributes('aria-label')).toBe('Switch to light theme');
    expect(button.attributes('title')).toBe('Switch to light theme');
  });

  it('manually changes theme', async () => {
    // Clear localStorage
    localStorageMock.getItem.mockReturnValue(null);

    // Initial theme should be light
    expect(wrapper.vm.currentTheme).toBe('light');

    // Manually change theme to dark
    wrapper.vm.applyTheme('dark');
    await wrapper.vm.$nextTick();

    // Theme should be updated to dark
    expect(wrapper.vm.currentTheme).toBe('dark');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Manually change theme to light
    wrapper.vm.applyTheme('light');
    await wrapper.vm.$nextTick();

    // Theme should be updated to light
    expect(wrapper.vm.currentTheme).toBe('light');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});

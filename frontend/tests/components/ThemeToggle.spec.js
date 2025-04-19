import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import ThemeToggle from '../../src/components/theme-toggle.vue';

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
  
  // Mock matchMedia
  const matchMediaMock = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
  
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    localStorageMock.clear();
    
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });
    Object.defineProperty(document, 'documentElement', { value: documentElementMock });
    
    // Mount component
    wrapper = mount(ThemeToggle);
  });
  
  it('renders the theme toggle button', () => {
    expect(wrapper.find('.theme-toggle').exists()).toBe(true);
  });
  
  it('initializes with light theme by default', () => {
    expect(wrapper.vm.currentTheme).toBe('light');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });
  
  it('initializes with theme from localStorage if available', async () => {
    // Setup localStorage with dark theme
    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    // Remount component
    wrapper = mount(ThemeToggle);
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.currentTheme).toBe('dark');
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
  
  it('initializes with system preference if no localStorage value', async () => {
    // Setup matchMedia to prefer dark mode
    matchMediaMock.mockReturnValueOnce({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    
    // Remount component
    wrapper = mount(ThemeToggle);
    await wrapper.vm.$nextTick();
    
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
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
    expect(wrapper.find('.moon').exists()).toBe(true);
    expect(wrapper.find('.sun').exists()).toBe(false);
    
    // Toggle to dark
    await wrapper.find('.theme-toggle').trigger('click');
    
    // Should now show sun icon
    expect(wrapper.find('.moon').exists()).toBe(false);
    expect(wrapper.find('.sun').exists()).toBe(true);
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
});
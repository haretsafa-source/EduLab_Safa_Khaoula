// Custom On-Screen Keyboard for Mobile Devices

class CustomKeyboard {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'keyboard-wrapper',
      keyLayout: options.keyLayout || 'qwerty',
      language: options.language || 'en',
      autoOpen: options.autoOpen !== false, // Default true
      ...options
    };

    this.activeInput = null;
    this.keyboardElement = null;
    this.isOpen = false;

    this.init();
  }

  init() {
    // Create keyboard HTML structure
    this.createKeyboardElement();
    this.attachEventListeners();
    this.handleInputFocus();
  }

  createKeyboardElement() {
    // Check if keyboard already exists
    let existing = document.getElementById(this.options.containerId);
    if (existing) {
      this.keyboardElement = existing;
      return;
    }

    const keyboard = document.createElement('div');
    keyboard.id = this.options.containerId;
    keyboard.className = 'keyboard-wrapper';
    keyboard.setAttribute('dir', this.options.language === 'ar' ? 'rtl' : 'ltr');

    const header = document.createElement('div');
    header.className = 'keyboard-header';
    header.innerHTML = `
      <span>${this.options.language === 'ar' ? 'لوحة المفاتيح' : 'Keyboard'}</span>
      <button class="keyboard-close-btn">${this.options.language === 'ar' ? 'إغلاق' : 'Close'}</button>
    `;

    const keysContainer = document.createElement('div');
    keysContainer.className = 'keyboard-keys';
    keysContainer.id = 'keyboard-keys-container';

    keyboard.appendChild(header);
    keyboard.appendChild(keysContainer);

    document.body.appendChild(keyboard);

    this.keyboardElement = keyboard;
    this.renderKeys();

    // Close button event
    header.querySelector('.keyboard-close-btn').addEventListener('click', () => {
      this.close();
    });
  }

  renderKeys() {
    const keysContainer = document.getElementById('keyboard-keys-container');
    keysContainer.innerHTML = '';

    const layout = this.getKeyLayout();

    layout.forEach(row => {
      row.forEach(key => {
        const keyElement = document.createElement('button');
        keyElement.className = 'key';

        if (key.functional) {
          keyElement.classList.add('functional');
          keyElement.classList.add(key.className || '');
        }

        keyElement.textContent = key.display;
        keyElement.addEventListener('click', () => {
          this.handleKeyPress(key);
        });

        keysContainer.appendChild(keyElement);
      });
    });
  }

  getKeyLayout() {
    const layouts = {
      qwerty: [
        [
          { display: 'Q', value: 'q' },
          { display: 'W', value: 'w' },
          { display: 'E', value: 'e' },
          { display: 'R', value: 'r' },
          { display: 'T', value: 't' },
          { display: 'Y', value: 'y' },
          { display: 'U', value: 'u' },
          { display: 'I', value: 'i' },
          { display: 'O', value: 'o' },
          { display: 'P', value: 'p' },
        ],
        [
          { display: 'A', value: 'a' },
          { display: 'S', value: 's' },
          { display: 'D', value: 'd' },
          { display: 'F', value: 'f' },
          { display: 'G', value: 'g' },
          { display: 'H', value: 'h' },
          { display: 'J', value: 'j' },
          { display: 'K', value: 'k' },
          { display: 'L', value: 'l' },
          { display: 'Backspace', value: 'backspace', functional: true, className: 'backspace' },
        ],
        [
          { display: 'Z', value: 'z' },
          { display: 'X', value: 'x' },
          { display: 'C', value: 'c' },
          { display: 'V', value: 'v' },
          { display: 'B', value: 'b' },
          { display: 'N', value: 'n' },
          { display: 'M', value: 'm' },
          { display: '!', value: '!' },
          { display: '?', value: '?' },
          { display: '.', value: '.' },
        ],
        [
          { display: '1', value: '1' },
          { display: '2', value: '2' },
          { display: '3', value: '3' },
          { display: '4', value: '4' },
          { display: '5', value: '5' },
          { display: '6', value: '6' },
          { display: '7', value: '7' },
          { display: '8', value: '8' },
          { display: '9', value: '9' },
          { display: '0', value: '0' },
        ],
        [
          { display: '@', value: '@' },
          { display: ' ', value: ' ', functional: true, className: 'space', display: 'Space' },
          { display: 'Enter', value: 'enter', functional: true, className: 'enter' },
        ],
      ],
    };

    return layouts[this.options.keyLayout] || layouts.qwerty;
  }

  handleKeyPress(key) {
    if (!this.activeInput) return;

    if (key.value === 'backspace') {
      const currentValue = this.activeInput.value;
      this.activeInput.value = currentValue.slice(0, -1);
    } else if (key.value === 'enter') {
      this.activeInput.value += '\n';
    } else {
      this.activeInput.value += key.value;
    }

    // Trigger input event for Unity and other listeners
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
    this.activeInput.focus();
  }

  handleInputFocus() {
    // Select all input fields and textareas on the page
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        this.activeInput = e.target;
        if (this.options.autoOpen) {
          this.open();
        }
      });

      input.addEventListener('blur', () => {
        // Don't close immediately to allow clicking on keyboard
        setTimeout(() => {
          if (document.activeElement !== this.keyboardElement && 
              !this.keyboardElement.contains(document.activeElement)) {
            this.activeInput = null;
          }
        }, 100);
      });
    });
  }

  open() {
    if (this.keyboardElement && !this.isOpen) {
      this.keyboardElement.classList.add('active');
      this.isOpen = true;
    }
  }

  close() {
    if (this.keyboardElement && this.isOpen) {
      this.keyboardElement.classList.remove('active');
      this.isOpen = false;
      this.activeInput = null;
    }
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  setLanguage(lang) {
    this.options.language = lang;
    this.keyboardElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    // Update header text
    const header = this.keyboardElement.querySelector('.keyboard-header');
    header.innerHTML = `
      <span>${lang === 'ar' ? 'لوحة المفاتيح' : 'Keyboard'}</span>
      <button class="keyboard-close-btn">${lang === 'ar' ? 'إغلاق' : 'Close'}</button>
    `;
    header.querySelector('.keyboard-close-btn').addEventListener('click', () => {
      this.close();
    });
  }
}

// Auto-initialize keyboard when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeKeyboard);
} else {
  initializeKeyboard();
}

function initializeKeyboard() {
  window.customKeyboard = new CustomKeyboard({
    language: 'en', // Change to 'ar' for Arabic
    keyLayout: 'qwerty',
    autoOpen: true, // Automatically open on input focus
  });
}

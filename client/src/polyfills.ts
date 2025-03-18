// Polyfills for Node.js built-ins
import * as buffer from 'buffer';
import * as process from 'process';

// Make Buffer available globally
window.Buffer = buffer.Buffer;
// Make process available globally
(window as any).process = process;

// Log that polyfills have been loaded
console.log('Node.js polyfills loaded successfully');
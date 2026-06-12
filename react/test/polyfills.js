/**
 * Jest polyfills
 * Must be loaded before any test code runs
 */

const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream, TransformStream } = require('stream/web');

// Polyfill TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Web Streams API for Node environment
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
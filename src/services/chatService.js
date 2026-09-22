export function createChatSearchIndex(chats = []) {
  return chats.map((chat) => ({
    id: chat.id,
    type: chat.type,
    name: chat.user?.name || chat.group?.name || '',
    username: chat.user?.username || '',
    lastMessage: chat.lastMessage?.content || '',
    status: chat.user?.status || 'offline'
  }));
}

export function sanitizeText(value = '') {
  return String(value)
    .replace(/<script|javascript:|onerror=/gi, '')
    .trim()
    .slice(0, 2000);
}

export function validateMediaFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'audio/webm', 'audio/mpeg', 'application/pdf'];
  const maxSize = 25 * 1024 * 1024;

  if (!file) return { valid: false, reason: 'No file selected' };
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, reason: 'Unsupported file type' };
  }
  if (file.size > maxSize) {
    return { valid: false, reason: 'File exceeds 25MB limit' };
  }
  return { valid: true };
}

/**
 * Simple in-memory cache for roulette excluded IDs
 * In production, consider using Redis or similar
 */

interface RouletteSession {
  excludedIds: Set<string>;
  createdAt: number;
  lastAccessed: number;
}

class RouletteCacheService {
  private sessions: Map<string, RouletteSession> = new Map();
  private readonly SESSION_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Cleanup old sessions periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * Get or create a session
   */
  getSession(sessionId: string): Set<string> {
    const now = Date.now();
    let session = this.sessions.get(sessionId);

    if (!session || (now - session.lastAccessed) > this.SESSION_TTL) {
      // Create new session or reset expired one
      session = {
        excludedIds: new Set<string>(),
        createdAt: now,
        lastAccessed: now,
      };
      this.sessions.set(sessionId, session);
    } else {
      session.lastAccessed = now;
    }

    return session.excludedIds;
  }

  /**
   * Add restaurant IDs to excluded list
   */
  addExcludedIds(sessionId: string, restaurantIds: string[]): void {
    const excludedIds = this.getSession(sessionId);
    restaurantIds.forEach(id => excludedIds.add(id));
  }

  /**
   * Get excluded IDs as array
   */
  getExcludedIds(sessionId: string): string[] {
    const excludedIds = this.getSession(sessionId);
    return Array.from(excludedIds);
  }

  /**
   * Clear session
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Reset excluded IDs for a session (keep session but clear excluded list)
   */
  resetExcludedIds(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.excludedIds.clear();
      session.lastAccessed = Date.now();
    }
  }

  /**
   * Cleanup expired sessions
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if ((now - session.lastAccessed) > this.SESSION_TTL) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Get session count (for monitoring)
   */
  getSessionCount(): number {
    return this.sessions.size;
  }
}

export default new RouletteCacheService();



export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Search posts by keyword (title, excerpt, content)
 */
export function searchPosts(posts: any[], keyword: string): any[] {
  if (!keyword.trim()) return posts;

  const lowerKeyword = keyword.toLowerCase();
  return posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowerKeyword) ||
      post.excerpt.toLowerCase().includes(lowerKeyword) ||
      post.content.toLowerCase().includes(lowerKeyword)
    );
  });
}

/**
 * Filter posts by tags
 */
export function filterByTags(posts: any[], selectedTags: string[]): any[] {
  if (selectedTags.length === 0) return posts;

  return posts.filter((post) =>
    selectedTags.some((tagId) =>
      post.tags.some((tag: any) => tag.id === tagId)
    )
  );
}

/**
 * Filter posts by status
 */
export function filterByStatus(posts: any[], status: string): any[] {
  if (!status) return posts;
  return posts.filter((post) => post.status === status);
}

/**
 * Format date to Vietnamese format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get related posts (same tags, exclude current post)
 */
export function getRelatedPosts(
  posts: any[],
  currentPostId: string,
  limit: number = 3
): any[] {
  const currentPost = posts.find((p) => p.id === currentPostId);
  if (!currentPost) return [];

  const currentTagIds = new Set(currentPost.tags.map((t: any) => t.id));

  return posts
    .filter(
      (post) =>
        post.id !== currentPostId &&
        post.status === 'published' &&
        post.tags.some((tag: any) => currentTagIds.has(tag.id))
    )
    .slice(0, limit);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

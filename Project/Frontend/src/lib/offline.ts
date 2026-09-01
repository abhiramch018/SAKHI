const QUEUE_KEY = 'sakhi_offline_queue';

export interface PendingCounselling {
  id: string;
  beneficiaryId: string;
  tier: number;
  answers: { questionId: string; answer: string }[];
  timestamp: string;
  beneficiaryName: string;
}

export const offlineQueue = {
  getQueue: (): PendingCounselling[] => {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
  enqueue: (item: PendingCounselling) => {
    const current = offlineQueue.getQueue();
    current.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(current));
  },
  dequeue: (id: string) => {
    const current = offlineQueue.getQueue();
    const filtered = current.filter(i => i.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  },
  clear: () => {
    localStorage.removeItem(QUEUE_KEY);
  }
};


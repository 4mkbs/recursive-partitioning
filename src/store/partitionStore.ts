import { makeAutoObservable } from 'mobx';

export type PartitionId = string;
export type SplitDirection = 'horizontal' | 'vertical';

export interface Partition {
  id: PartitionId;
  color: string;
  splitDirection?: SplitDirection;
  splitRatio?: number; // 0 to 1, represents the split position
  children?: [PartitionId, PartitionId];
}

class PartitionStore {
  partitions: Map<PartitionId, Partition> = new Map();
  rootId: PartitionId = 'root';

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  initialize() {
    const rootPartition: Partition = {
      id: 'root',
      color: this.getRandomColor(),
    };
    this.partitions.set('root', rootPartition);
    this.rootId = 'root';
  }

  getRandomColor(): string {
    const colors = [
      '#FF00FF', // Magenta
      '#00FFFF', // Cyan
      '#FFFF00', // Yellow
      '#FF6B35', // Orange
      '#00FF00', // Lime
      '#FF1493', // Deep Pink
      '#00CED1', // Dark Turquoise
      '#FFD700', // Gold
      '#FF4500', // Orange Red
      '#7FFF00', // Chartreuse
      '#9370DB', // Medium Purple
      '#20B2AA', // Light Sea Green
      '#FF69B4', // Hot Pink
      '#32CD32', // Lime Green
      '#FF8C00', // Dark Orange
      '#4B0082', // Indigo
      '#00FA9A', // Medium Spring Green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  split(id: PartitionId, direction: SplitDirection) {
    const partition = this.partitions.get(id);
    if (!partition || partition.children) return;

    const childId1 = `${id}-${direction[0]}1-${Date.now()}`;
    const childId2 = `${id}-${direction[0]}2-${Date.now()}`;

    const child1: Partition = {
      id: childId1,
      color: partition.color,
    };

    const child2: Partition = {
      id: childId2,
      color: this.getRandomColor(),
    };

    this.partitions.set(childId1, child1);
    this.partitions.set(childId2, child2);

    partition.splitDirection = direction;
    partition.splitRatio = 0.5;
    partition.children = [childId1, childId2];
  }

  remove(id: PartitionId) {
    if (id === this.rootId) return;

    // Find parent
    let parentId: PartitionId | null = null;
    let siblingId: PartitionId | null = null;

    for (const [pId, partition] of this.partitions.entries()) {
      if (partition.children) {
        const [child1, child2] = partition.children;
        if (child1 === id) {
          parentId = pId;
          siblingId = child2;
          break;
        } else if (child2 === id) {
          parentId = pId;
          siblingId = child1;
          break;
        }
      }
    }

    if (!parentId || !siblingId) return;

    const parent = this.partitions.get(parentId);
    const sibling = this.partitions.get(siblingId);

    if (!parent || !sibling) return;

    // Remove the partition and its descendants
    this.removePartitionAndDescendants(id);

    // Promote sibling to parent's position
    parent.color = sibling.color;
    parent.splitDirection = sibling.splitDirection;
    parent.splitRatio = sibling.splitRatio;
    parent.children = sibling.children;

    // Remove sibling
    this.partitions.delete(siblingId);
  }

  removePartitionAndDescendants(id: PartitionId) {
    const partition = this.partitions.get(id);
    if (!partition) return;

    if (partition.children) {
      const [child1, child2] = partition.children;
      this.removePartitionAndDescendants(child1);
      this.removePartitionAndDescendants(child2);
    }

    this.partitions.delete(id);
  }

  updateSplitRatio(id: PartitionId, ratio: number) {
    const partition = this.partitions.get(id);
    if (partition && partition.children) {
      // Snap to 1/4, 1/2, 3/4
      const snapPoints = [0.25, 0.5, 0.75];
      const threshold = 0.05;
      
      let snappedRatio = ratio;
      for (const snapPoint of snapPoints) {
        if (Math.abs(ratio - snapPoint) < threshold) {
          snappedRatio = snapPoint;
          break;
        }
      }
      
      partition.splitRatio = Math.max(0.1, Math.min(0.9, snappedRatio));
    }
  }

  getPartition(id: PartitionId): Partition | undefined {
    return this.partitions.get(id);
  }
}

export const partitionStore = new PartitionStore();

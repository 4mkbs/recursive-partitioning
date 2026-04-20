import { observer } from 'mobx-react-lite';
import { useState, useRef, useEffect } from 'react';
import { partitionStore, PartitionId } from '../store/partitionStore';

interface PartitionViewProps {
    id: PartitionId;
}

export const PartitionView = observer(({ id }: PartitionViewProps) => {
    const partition = partitionStore.getPartition(id);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    if (!partition) return null;

    const handleSplit = (direction: 'horizontal' | 'vertical') => {
        partitionStore.split(id, direction);
    };

    const handleRemove = () => {
        partitionStore.remove(id);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!partition.children) return;
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging || !partition.children) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !partition.splitDirection) return;

            const rect = containerRef.current.getBoundingClientRect();
            let ratio: number;

            if (partition.splitDirection === 'horizontal') {
                ratio = (e.clientY - rect.top) / rect.height;
            } else {
                ratio = (e.clientX - rect.left) / rect.width;
            }

            partitionStore.updateSplitRatio(id, ratio);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, id, partition.children, partition.splitDirection]);

    if (partition.children) {
        const [child1Id, child2Id] = partition.children;
        const splitRatio = partition.splitRatio || 0.5;
        const isHorizontal = partition.splitDirection === 'horizontal';

        return (
            <div
                ref={containerRef}
                className="relative w-full h-full"
                style={{ backgroundColor: partition.color }}
            >
                <div
                    className={`flex ${isHorizontal ? 'flex-col' : 'flex-row'} w-full h-full`}
                >
                    <div
                        style={{
                            [isHorizontal ? 'height' : 'width']: `${splitRatio * 100}%`,
                        }}
                        className="relative"
                    >
                        <PartitionView id={child1Id} />
                    </div>

                    {/* Draggable divider */}
                    <div
                        className={`${isHorizontal
                                ? 'h-1 w-full cursor-row-resize'
                                : 'w-1 h-full cursor-col-resize'
                            } bg-black hover:bg-gray-700 transition-colors z-10`}
                        onMouseDown={handleMouseDown}
                    />

                    <div
                        style={{
                            [isHorizontal ? 'height' : 'width']: `${(1 - splitRatio) * 100}%`,
                        }}
                        className="relative"
                    >
                        <PartitionView id={child2Id} />
                    </div>
                </div>
            </div>
        );
    }

    // Leaf partition with controls
    return (
        <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ backgroundColor: partition.color }}
        >
            <div className="flex gap-1 bg-white rounded shadow-lg p-1">
                <button
                    onClick={() => handleSplit('vertical')}
                    className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-sm font-medium transition-colors"
                    title="Split Vertically"
                >
                    v
                </button>
                <button
                    onClick={() => handleSplit('horizontal')}
                    className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-sm font-medium transition-colors"
                    title="Split Horizontally"
                >
                    h
                </button>
                {id !== partitionStore.rootId && (
                    <button
                        onClick={handleRemove}
                        className="px-3 py-1 bg-white hover:bg-red-100 border border-gray-300 rounded text-sm font-medium transition-colors"
                        title="Remove Partition"
                    >
                        -
                    </button>
                )}
            </div>
        </div>
    );
});

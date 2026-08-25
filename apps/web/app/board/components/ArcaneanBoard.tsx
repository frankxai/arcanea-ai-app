'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { BoardHeader } from './BoardHeader';
import { BoardSidebar } from './BoardSidebar';
import { BoardGenerateDialog } from './BoardGenerateDialog';
import { BoardShareDialog } from './BoardShareDialog';
import { DawnswornStrip } from './DawnswornStrip';
import { InfiniteCanvas } from './InfiniteCanvas';
import { cosmic } from '@arcanea/design-system/tokens';

type BoardTemplate = 'arcanea' | 'blank';

interface CanvasImage {
  id: string;
  url: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SEEDED_BOARDS: Record<BoardTemplate, { id: string; name: string; images: CanvasImage[] }> = {
  arcanea: {
    id: 'arcanea-kings-table',
    name: "Arcanea King's Table",
    images: [
      { id: 'leyla', url: '/guardians/gallery/leyla-gallery-2.webp', label: 'Leyla - Water Guardian', x: -400, y: -200, width: 300, height: 400 },
      { id: 'draconia', url: '/guardians/gallery/draconia-gallery-2.webp', label: 'Draconia - Fire Guardian', x: 0, y: -300, width: 300, height: 400 },
      { id: 'lyria', url: '/guardians/gallery/lyria-gallery-5.webp', label: 'Lyria - Sight Guardian', x: 400, y: -200, width: 300, height: 400 },
      { id: 'alera', url: '/guardians/gallery/alera-gallery-2.webp', label: 'Alera - Voice Guardian', x: -200, y: 100, width: 300, height: 400 },
      { id: 'shinkami', url: '/guardians/gallery/shinkami-gallery-3.webp', label: 'Shinkami - Source Guardian', x: 200, y: 100, width: 300, height: 400 },
    ],
  },
  blank: {
    id: 'blank-world',
    name: 'New World',
    images: [],
  },
};

export function ArcaneanBoard() {
  const [currentBoard, setCurrentBoard] = useState<BoardTemplate>('arcanea');
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [images, setImages] = useState<CanvasImage[]>(SEEDED_BOARDS.arcanea.images);

  const handleNewWorld = useCallback(() => {
    setCurrentBoard('blank');
    setImages([]);
  }, []);

  const handleLoadArcanea = useCallback(() => {
    setCurrentBoard('arcanea');
    setImages(SEEDED_BOARDS.arcanea.images);
  }, []);

  const handleAddImage = useCallback((url: string, x: number, y: number) => {
    const newImage: CanvasImage = {
      id: `img-${Date.now()}`,
      url,
      label: 'New Image',
      x,
      y,
      width: 300,
      height: 400,
    };
    setImages((prev) => [...prev, newImage]);
  }, []);

  const board = SEEDED_BOARDS[currentBoard];

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: cosmic.void }}>
      <BoardHeader
        boardName={board.name}
        onGenerate={() => setShowGenerateDialog(true)}
        onShare={() => setShowShareDialog(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex-1 flex relative overflow-hidden">
        {sidebarOpen && (
          <BoardSidebar
            currentBoard={currentBoard}
            onNewWorld={handleNewWorld}
            onLoadArcanea={handleLoadArcanea}
          />
        )}

        <div className="flex-1 relative">
          <InfiniteCanvas images={images} onAddImage={handleAddImage} />
        </div>
      </div>

      <DawnswornStrip />

      {showGenerateDialog && (
        <BoardGenerateDialog onClose={() => setShowGenerateDialog(false)} onImageGenerated={handleAddImage} />
      )}

      {showShareDialog && (
        <BoardShareDialog
          boardId={board.id}
          boardName={board.name}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}

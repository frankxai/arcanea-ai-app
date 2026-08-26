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

interface BoardState {
  currentBoard: BoardTemplate;
  images: CanvasImage[];
  version: number;
}

const STORAGE_KEY = 'arcanea-board-state';

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
  const [viewportTransform, setViewportTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const state: BoardState = JSON.parse(saved);
          setCurrentBoard(state.currentBoard);
          setImages(state.images);
        }
      } catch (error) {
        console.error('Failed to load board state:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window !== 'undefined') {
      try {
        const state: BoardState = {
          currentBoard,
          images,
          version: 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save board state:', error);
      }
    }
  }, [currentBoard, images, mounted]);

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

  const handleExportBoard = useCallback(() => {
    const state: BoardState = {
      currentBoard,
      images,
      version: 1,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${SEEDED_BOARDS[currentBoard].name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.arcanea-board.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentBoard, images]);

  const handleImportBoard = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.arcanea-board.json,application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const state: BoardState = JSON.parse(text);
          setCurrentBoard(state.currentBoard);
          setImages(state.images);
        } catch (error) {
          console.error('Failed to import board:', error);
          alert('Failed to import board. Please ensure the file is a valid .arcanea-board.json file.');
        }
      }
    };
    input.click();
  }, []);

  const board = SEEDED_BOARDS[currentBoard];

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: cosmic.void }}>
      <BoardHeader
        boardName={board.name}
        onGenerate={() => setShowGenerateDialog(true)}
        onShare={() => setShowShareDialog(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onExport={handleExportBoard}
        onImport={handleImportBoard}
        sidebarOpen={sidebarOpen}
      />

      <DawnswornStrip />

      <div className="flex-1 flex relative overflow-hidden">
        {sidebarOpen && (
          <BoardSidebar
            currentBoard={currentBoard}
            onNewWorld={handleNewWorld}
            onLoadArcanea={handleLoadArcanea}
          />
        )}

        <div className="flex-1 relative">
          <InfiniteCanvas images={images} onAddImage={handleAddImage} onTransformChange={setViewportTransform} />
        </div>
      </div>

      {showGenerateDialog && (
        <BoardGenerateDialog
          onClose={() => setShowGenerateDialog(false)}
          onImageGenerated={handleAddImage}
          viewportTransform={viewportTransform}
        />
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

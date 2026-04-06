export const DICE_FACES = {
  1: [
    { type: 'ellipse', x: -4, y: -4, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' }
  ],
  2: [
    { type: 'ellipse', x: -29, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' }
  ],
  3: [
    { type: 'ellipse', x: -29, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: -4, y: -4, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' }
  ],
  4: [
    { type: 'ellipse', x: -29, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: -29, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' }
  ],
  5: [
    { type: 'ellipse', x: -29, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: -29, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: -4, y: -4, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' }
  ],
  6: [
    { type: 'ellipse', x: -29, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: -29, y: -4, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: -29, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: -29, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: -4, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' },
    { type: 'ellipse', x: 21, y: 21, width: 8, height: 8, strokeColor: '#000000', backgroundColor: '#000000', fillStyle: 'solid' }
  ]
};

export const MANIPULATIVES_DATA = {
  'k-1': [
    {
      id: 'ten-frame-audit',
      label: 'Ten Frame',
      thumbnail: '🔢',
      elements: [
        // Row 1: 5 rectangles
        ...Array.from({length: 5}).map((_, i) => ({
          type: 'rectangle', x: -125 + (i * 50), y: 0, width: 50, height: 50, strokeColor: '#1e293b', backgroundColor: 'transparent', fillStyle: 'solid', roughness: 0 
        })),
        // Row 2: 5 rectangles
        ...Array.from({length: 5}).map((_, i) => ({
          type: 'rectangle', x: -125 + (i * 50), y: 54, width: 50, height: 50, strokeColor: '#1e293b', backgroundColor: 'transparent', fillStyle: 'solid', roughness: 0 
        })),
        // 5 Red circles in top row cells centered
        ...Array.from({length: 5}).map((_, i) => ({
          type: 'ellipse', x: -112.5 + (i * 50), y: 12.5, width: 25, height: 25, strokeColor: '#b91c1c', backgroundColor: '#ef4444', fillStyle: 'solid', roughness: 0
        }))
      ]
    },
    {
      id: 'counting-blocks-10',
      label: '10 Counting Blocks',
      thumbnail: '🟥',
      elements: Array.from({length: 10}).map((_, i) => ({
        type: 'rectangle', 
        x: -160 + (i * 32), 
        y: -15, 
        width: 30, 
        height: 30, 
        strokeColor: '#e11d48', 
        backgroundColor: '#fecdd3', 
        fillStyle: 'solid', 
        strokeWidth: 1,
        roughness: 0
      }))
    },
    {
      id: 'coins-gbp-full',
      label: 'GBP Coin Set',
      thumbnail: '💷',
      elements: [
        { type: 'ellipse', x: -180, y: -12, width: 24, height: 24, strokeColor: '#92400e', backgroundColor: '#d97706', fillStyle: 'solid', label: '1p', roughness: 0 },
        { type: 'ellipse', x: -148, y: -14, width: 28, height: 28, strokeColor: '#92400e', backgroundColor: '#d97706', fillStyle: 'solid', label: '2p', roughness: 0 },
        { type: 'ellipse', x: -112, y: -15, width: 30, height: 30, strokeColor: '#475569', backgroundColor: '#cbd5e1', fillStyle: 'solid', label: '5p', roughness: 0 },
        { type: 'ellipse', x: -74, y: -17, width: 34, height: 34, strokeColor: '#475569', backgroundColor: '#cbd5e1', fillStyle: 'solid', label: '10p', roughness: 0 },
        { type: 'ellipse', x: -32, y: -18, width: 36, height: 36, strokeColor: '#475569', backgroundColor: '#cbd5e1', fillStyle: 'solid', label: '20p', roughness: 0 },
        { type: 'ellipse', x: 12, y: -19, width: 38, height: 38, strokeColor: '#854d0e', backgroundColor: '#facc15', fillStyle: 'solid', label: '50p', roughness: 0 },
        { type: 'ellipse', x: 58, y: -21, width: 42, height: 42, strokeColor: '#854d0e', backgroundColor: '#facc15', fillStyle: 'solid', label: '£1', roughness: 0 },
        { type: 'ellipse', x: 108, y: -21, width: 42, height: 42, strokeColor: '#854d0e', backgroundColor: '#facc15', fillStyle: 'solid', label: '£2', roughness: 0 },
        { type: 'text', x: -100, y: 35, text: 'GBP — more currencies coming soon', fontSize: 14, strokeColor: '#94a3b8' }
      ]
    },
    {
      id: 'dice-k1',
      label: 'Dice',
      thumbnail: '🎲',
      elements: [
        { type: 'rectangle', x: -50, y: -50, width: 100, height: 100, strokeColor: '#1e293b', backgroundColor: '#ffffff', fillStyle: 'solid', strokeWidth: 2, roughness: 0, roundness: { type: 3 } },
        ...DICE_FACES[1]
      ]
    }
  ],
  '2-3': [
    {
      id: 'fraction-tiles-audit',
      label: 'Fraction Tiles',
      thumbnail: '📊',
      elements: [
        // whole=420px, ½=210px, ⅓=140px, ¼=105px, ⅙=70px, ⅛=52px
        { type: 'rectangle', x: -210, y: -70, width: 420, height: 24, strokeColor: '#1e293b', backgroundColor: '#f8fafc', fillStyle: 'solid', label: '1', roughness: 0 },
        { type: 'rectangle', x: -210, y: -45, width: 210, height: 24, strokeColor: '#b91c1c', backgroundColor: '#fee2e2', fillStyle: 'solid', label: '1/2', roughness: 0 },
        { type: 'rectangle', x: 0, y: -45, width: 210, height: 24, strokeColor: '#b91c1c', backgroundColor: '#fee2e2', fillStyle: 'solid', label: '1/2', roughness: 0 },
        { type: 'rectangle', x: -210, y: -20, width: 140, height: 24, strokeColor: '#c2410c', backgroundColor: '#ffedd5', fillStyle: 'solid', label: '1/3', roughness: 0 },
        { type: 'rectangle', x: -70, y: -20, width: 140, height: 24, strokeColor: '#c2410c', backgroundColor: '#ffedd5', fillStyle: 'solid', label: '1/3', roughness: 0 },
        { type: 'rectangle', x: 70, y: -20, width: 140, height: 24, strokeColor: '#c2410c', backgroundColor: '#ffedd5', fillStyle: 'solid', label: '1/3', roughness: 0 },
        { type: 'rectangle', x: -210, y: 5, width: 105, height: 24, strokeColor: '#15803d', backgroundColor: '#dcfce7', fillStyle: 'solid', label: '1/4', roughness: 0 },
        { type: 'rectangle', x: -105, y: 5, width: 105, height: 24, strokeColor: '#15803d', backgroundColor: '#dcfce7', fillStyle: 'solid', label: '1/4', roughness: 0 },
        { type: 'rectangle', x: 0, y: 5, width: 105, height: 24, strokeColor: '#15803d', backgroundColor: '#dcfce7', fillStyle: 'solid', label: '1/4', roughness: 0 },
        { type: 'rectangle', x: 105, y: 5, width: 105, height: 24, strokeColor: '#15803d', backgroundColor: '#dcfce7', fillStyle: 'solid', label: '1/4', roughness: 0 }
      ]
    },
    {
      id: 'math-clock-3',
      label: 'Math Clock (3:00)',
      thumbnail: '🕒',
      elements: [
        { type: 'ellipse', x: -50, y: -50, width: 100, height: 100, strokeColor: '#1e293b', strokeWidth: 2, roughness: 0 },
        { type: 'line', x: 0, y: 0, points: [[0, 0], [35, 0]], strokeColor: '#b91c1c', strokeWidth: 4 }, // hour hand at 3
        { type: 'line', x: 0, y: 0, points: [[0, 0], [0, -42]], strokeColor: '#1e293b', strokeWidth: 2 }, // minute hand at 12
        { type: 'text', x: -5, y: -45, text: '12', fontSize: 12 },
        { type: 'text', x: 38, y: -5, text: '3', fontSize: 12 },
        { type: 'text', x: -3, y: 35, text: '6', fontSize: 12 },
        { type: 'text', x: -45, y: -5, text: '9', fontSize: 12 }
      ]
    }
  ],
  '4-6': [
    {
      id: 'coordinate-grid-audit',
      label: 'Coordinate Grid',
      thumbnail: '🌐',
      elements: [
        ...Array.from({length: 11}).map((_, i) => ({
          type: 'line', x: -100 + (i * 20), y: -100, points: [[0,0], [0,200]], strokeColor: '#e2e8f0', strokeWidth: 0.5 
        })),
        ...Array.from({length: 11}).map((_, i) => ({
          type: 'line', x: -100, y: -100 + (i * 20), points: [[0,0], [200,0]], strokeColor: '#e2e8f0', strokeWidth: 0.5
        })),
        { type: 'line', x: -100, y: 0, points: [[0,0], [200,0]], strokeColor: '#000000', strokeWidth: 2 }, // bold x axis
        { type: 'line', x: 0, y: -100, points: [[0,0], [0,200]], strokeColor: '#000000', strokeWidth: 2 }, // bold y axis
        { type: 'ellipse', x: -3, y: -3, width: 6, height: 6, strokeColor: '#b91c1c', backgroundColor: '#ef4444', fillStyle: 'solid', roughness: 0 }, // origin point
        { type: 'text', x: 5, y: -15, text: 'y', fontSize: 12 },
        { type: 'text', x: 90, y: 5, text: 'x', fontSize: 12 },
        // Axis numeric labels - assume 20px = 1 unit, label every 2 units (40px)
        { type: 'text', x: -85, y: 5, text: '-4', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: -45, y: 5, text: '-2', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: 35, y: 5, text: '2', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: 75, y: 5, text: '4', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: 5, y: -85, text: '4', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: 5, y: -45, text: '2', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: 5, y: 35, text: '-2', fontSize: 10, strokeColor: '#475569' },
        { type: 'text', x: 5, y: 75, text: '-4', fontSize: 10, strokeColor: '#475569' }
      ]
    },
    {
      id: 'algebra-tiles-full',
      label: 'Algebra Tiles',
      thumbnail: '🔲',
      elements: [
        { type: 'rectangle', x: -80, y: -25, width: 50, height: 50, strokeColor: '#b91c1c', backgroundColor: '#fee2e2', fillStyle: 'solid', label: 'x²', roughness: 0 },
        { type: 'rectangle', x: -25, y: -25, width: 15, height: 50, strokeColor: '#15803d', backgroundColor: '#dcfce7', fillStyle: 'solid', label: 'x', roughness: 0 },
        { type: 'rectangle', x: -5, y: -25, width: 15, height: 50, strokeColor: '#b91c1c', backgroundColor: '#fee2e2', fillStyle: 'solid', label: '-x', roughness: 0 },
        { type: 'rectangle', x: 15, y: -10, width: 20, height: 20, strokeColor: '#1d4ed8', backgroundColor: '#dbeafe', fillStyle: 'solid', label: '1', roughness: 0 },
        { type: 'rectangle', x: 40, y: -10, width: 20, height: 20, strokeColor: '#b91c1c', backgroundColor: '#fee2e2', fillStyle: 'solid', label: '-1', roughness: 0 }
      ]
    }
  ]
};

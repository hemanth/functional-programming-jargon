import React, { useRef, useEffect, useState, useCallback } from 'react';
import { soundEffects } from '../utils/audio';

// Category emblems (math/FP symbols)
const CATEGORY_SYMBOLS = {
  'core-functions': 'λ',
  'composition': '∘',
  'purity-state': '≡',
  'category-morphisms': '→',
  'algebraic-structures': '★',
  'types-data': '∑'
};

export default function GraphCanvas({
  graphData,
  categories,
  selectedNodeId,
  onSelectNode,
  searchQuery,
  useCategoryColors,
  soundEnabled,
  isDark,
  isPanelOpen,
  onPointerMove
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Simulation and camera state refs (mutable for 60fps render loop)
  const stateRef = useRef({
    nodes: [],
    links: [],
    nodeMap: new Map(),
    camera: { x: 0, y: 0, scale: 0.95, targetX: 0, targetY: 0, targetScale: 0.95 },
    panStart: { x: 0, y: 0, camX: 0, camY: 0 },
    isPanning: false,
    dragNode: null,
    animId: null,
    clusterCenters: {}
  });

  // Initialize nodes and clusters
  useEffect(() => {
    if (!graphData || !graphData.nodes) return;

    const clusterAngles = {
      'core-functions': 0.1 * Math.PI,
      'composition': 0.45 * Math.PI,
      'purity-state': 0.8 * Math.PI,
      'category-morphisms': 1.15 * Math.PI,
      'algebraic-structures': 1.5 * Math.PI,
      'types-data': 1.85 * Math.PI
    };

    const clusterRadius = 400;
    const clusterCenters = {};
    Object.keys(clusterAngles).forEach(cat => {
      const angle = clusterAngles[cat];
      clusterCenters[cat] = {
        x: Math.cos(angle) * clusterRadius,
        y: Math.sin(angle) * clusterRadius
      };
    });
    stateRef.current.clusterCenters = clusterCenters;

    // Build node map and initial positions
    const nodeMap = new Map();
    const nodes = graphData.nodes.map((n, idx) => {
      const cluster = clusterCenters[n.category] || { x: 0, y: 0 };
      const spreadAngle = (idx / graphData.nodes.length) * Math.PI * 2;
      const spreadDist = 50 + Math.random() * 140;
      
      const node = {
        ...n,
        x: cluster.x + Math.cos(spreadAngle) * spreadDist + (Math.random() - 0.5) * 40,
        y: cluster.y + Math.sin(spreadAngle) * spreadDist + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        radius: Math.max(18, Math.min(36, 16 + (n.val || 3) * 2.2)),
        mass: Math.max(1, (n.val || 2) * 0.85)
      };
      nodeMap.set(node.id, node);
      return node;
    });

    // Build links with node references
    const links = graphData.links.map(l => ({
      source: typeof l.source === 'object' ? l.source : nodeMap.get(l.source) || l.source,
      target: typeof l.target === 'object' ? l.target : nodeMap.get(l.target) || l.target,
      type: l.type
    })).filter(l => l.source && l.target && l.source.id && l.target.id);

    stateRef.current.nodes = nodes;
    stateRef.current.links = links;
    stateRef.current.nodeMap = nodeMap;

    // Center camera on initially selected node (e.g. pure-function)
    if (selectedNodeId) {
      const selNode = nodeMap.get(selectedNodeId);
      if (selNode) {
        stateRef.current.camera.x = -selNode.x;
        stateRef.current.camera.y = -selNode.y;
        stateRef.current.camera.targetX = -selNode.x;
        stateRef.current.camera.targetY = -selNode.y;
        stateRef.current.camera.scale = 1.35;
        stateRef.current.camera.targetScale = 1.35;
      }
    }
  }, [graphData]);

  // Center on selected node when selection changes or panel opens/closes
  // When sidebar opens, offset the camera so the node remains centered in the visible left viewport
  useEffect(() => {
    if (!selectedNodeId) return;
    const node = stateRef.current.nodeMap?.get(selectedNodeId);
    if (node) {
      const targetScale = 1.35;
      
      let offsetX = 0;
      if (isPanelOpen && typeof window !== 'undefined' && window.innerWidth >= 640) {
        const sidebarWidth = window.innerWidth >= 1024 ? 560 : 500;
        // Shift camera so the node is centered in (window.innerWidth - sidebarWidth)
        offsetX = (sidebarWidth / 2) / targetScale;
      }

      stateRef.current.camera.targetX = -node.x - offsetX;
      stateRef.current.camera.targetY = -node.y;
      stateRef.current.camera.targetScale = targetScale;
    }
  }, [selectedNodeId, isPanelOpen]);

  // Simulation & rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let running = true;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    }
    resize();
    window.addEventListener('resize', resize);

    let pulseTime = 0;

    function loop() {
      if (!running) return;
      pulseTime += 0.025;

      const { nodes, links, camera, clusterCenters, dragNode } = stateRef.current;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Smooth camera interpolation
      camera.x += (camera.targetX - camera.x) * 0.08;
      camera.y += (camera.targetY - camera.y) * 0.08;
      camera.scale += (camera.targetScale - camera.scale) * 0.08;

      // Force-directed physics calculation
      const kRepel = 950;
      const kSpring = 0.0035;
      const springLength = 130;
      const kCenter = 0.0005;
      const kCluster = 0.0055;

      // 1. Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let distSq = dx * dx + dy * dy;
          if (distSq < 1) distSq = 1;
          const dist = Math.sqrt(distSq);
          if (dist < 460) {
            const force = (kRepel * (a.radius + b.radius)) / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (a !== dragNode) { a.vx -= fx / a.mass; a.vy -= fy / a.mass; }
            if (b !== dragNode) { b.vx += fx / b.mass; b.vy += fy / b.mass; }
          }
        }
      }

      // 2. Link springs
      for (let i = 0; i < links.length; i++) {
        const { source, target } = links[i];
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - springLength;
        const force = displacement * kSpring;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (source !== dragNode) { source.vx += fx; source.vy += fy; }
        if (target !== dragNode) { target.vx -= fx; target.vy -= fy; }
      }

      // 3. Cluster pull and global centering
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n === dragNode) continue;

        // Cluster center gravity
        const center = clusterCenters[n.category] || { x: 0, y: 0 };
        n.vx += (center.x - n.x) * kCluster;
        n.vy += (center.y - n.y) * kCluster;

        // Gentle central gravity
        n.vx -= n.x * kCenter;
        n.vy -= n.y * kCenter;

        // Velocity damping
        n.vx *= 0.88;
        n.vy *= 0.88;

        n.x += n.vx;
        n.y += n.vy;
      }

      // Clear Canvas (transparent so vgpu background shows through!)
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Camera transformation
      ctx.translate(width / 2, height / 2);
      ctx.scale(camera.scale, camera.scale);
      ctx.translate(camera.x, camera.y);

      // Identify active/highlighted set
      const activeId = hoveredNodeId || selectedNodeId;
      let connectedIds = new Set();
      if (activeId) {
        connectedIds.add(activeId);
        links.forEach(l => {
          if (l.source.id === activeId) connectedIds.add(l.target.id);
          if (l.target.id === activeId) connectedIds.add(l.source.id);
        });
      }

      // Search match set
      let searchMatchedIds = null;
      if (searchQuery && searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        searchMatchedIds = new Set();
        nodes.forEach(n => {
          if (
            n.name.toLowerCase().includes(q) ||
            n.id.includes(q) ||
            (n.summary && n.summary.toLowerCase().includes(q))
          ) {
            searchMatchedIds.add(n.id);
          }
        });
      }

      // Render Cluster Backdrop Glows and Constellation Rings
      Object.keys(clusterCenters).forEach(catId => {
        const cat = categories[catId];
        const center = clusterCenters[catId];
        if (!cat || !center) return;
        const color = useCategoryColors ? cat.color : (isDark ? '#38bdf8' : '#0284c7');
        
        // Radial ambient glow
        const grad = ctx.createRadialGradient(center.x, center.y, 20, center.x, center.y, 260);
        grad.addColorStop(0, isDark ? `${color}20` : `${color}15`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 260, 0, Math.PI * 2);
        ctx.fill();

        // Constellation boundary dashed ring
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = isDark ? `${color}30` : `${color}40`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 220, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Cluster Header Pill
        ctx.save();
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const label = cat.name.toUpperCase();
        const metrics = ctx.measureText(label);
        const pillW = metrics.width + 16;
        const pillH = 22;
        const pillY = center.y - 230;

        ctx.fillStyle = isDark ? 'rgba(26, 26, 25, 0.9)' : 'rgba(226, 226, 223, 0.92)';
        ctx.strokeStyle = isDark ? 'rgba(240, 240, 238, 0.15)' : 'rgba(26, 26, 25, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(center.x - pillW / 2, pillY - pillH / 2, pillW, pillH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f0f0ee' : '#1a1a19';
        ctx.fillText(label, center.x, pillY + 4);
        ctx.restore();
      });

      // Helper to draw curved link with arrow
      const drawCurvedLink = (l, isHighlight, isDimmed, isSearchDimmed) => {
        const sx = l.source.x;
        const sy = l.source.y;
        const tx = l.target.x;
        const ty = l.target.y;

        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.hypot(dx, dy) || 1;

        // Slight curve offset
        const midX = (sx + tx) / 2 + (-dy / dist) * 16;
        const midY = (sy + ty) / 2 + (dx / dist) * 16;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(midX, midY, tx, ty);

        if (isHighlight) {
          const cat = categories[l.source.category];
          const strokeColor = useCategoryColors && cat ? cat.color : (isDark ? '#93c5fd' : '#2563eb');
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2.8;
          ctx.stroke();

          // Flowing energy particle
          const t = (pulseTime * 1.6) % 1;
          const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * midX + t * t * tx;
          const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * midY + t * t * ty;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = strokeColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Arrowhead pointing to target
          const angle = Math.atan2(ty - midY, tx - midX);
          const arrowDist = l.target.radius + 6;
          const ax = tx - Math.cos(angle) * arrowDist;
          const ay = ty - Math.sin(angle) * arrowDist;
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-7, -4);
          ctx.lineTo(-7, 4);
          ctx.closePath();
          ctx.fillStyle = strokeColor;
          ctx.fill();
          ctx.restore();
        } else {
          let alpha = isDark ? 0.22 : 0.28;
          if (isDimmed || isSearchDimmed) alpha = 0.04;
          ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(15, 23, 42, ${alpha})`;
          ctx.lineWidth = l.type === 'reference' ? 1.0 : 1.4;
          if (l.type === 'reference') {
            ctx.setLineDash([3, 4]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      };

      // Render Links
      links.forEach(l => {
        const isHighlight = activeId && (l.source.id === activeId || l.target.id === activeId);
        const isDimmed = activeId && !isHighlight;
        const isSearchDimmed = searchMatchedIds && (!searchMatchedIds.has(l.source.id) || !searchMatchedIds.has(l.target.id));
        drawCurvedLink(l, isHighlight, isDimmed, isSearchDimmed);
      });

      // Render Nodes
      nodes.forEach(n => {
        const isSelected = n.id === selectedNodeId;
        const isHovered = n.id === hoveredNodeId;
        const isConnected = connectedIds.has(n.id);
        const isDimmed = activeId && !isConnected;
        const isSearchMatched = !searchMatchedIds || searchMatchedIds.has(n.id);

        const cat = categories[n.category] || {};
        const baseColor = useCategoryColors ? (cat.color || '#3b82f6') : (isDark ? '#93c5fd' : '#2563eb');
        const symbol = CATEGORY_SYMBOLS[n.category] || 'λ';

        ctx.save();
        
        let opacity = 1;
        if (isDimmed || !isSearchMatched) opacity = 0.16;
        ctx.globalAlpha = opacity;

        // Selected halo pulse & beacon animation (invitation to click)
        if (isSelected) {
          const haloPulse = 6 + Math.sin(pulseTime * 3) * 4;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + haloPulse + 4, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `${baseColor}35` : `${baseColor}20`;
          ctx.fill();

          // Expanding beacon ripple
          const ripplePhase = (pulseTime * 0.75) % 1;
          const rippleR = n.radius + 6 + ripplePhase * 24;
          const rippleAlpha = (1 - ripplePhase) * 0.65;
          ctx.beginPath();
          ctx.arc(n.x, n.y, rippleR, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? `rgba(240, 240, 238, ${rippleAlpha})` : `rgba(26, 26, 25, ${rippleAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 2.4;
          ctx.stroke();
        } else if (isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
          ctx.fill();
        }

        // Search match highlight ring
        if (searchMatchedIds && searchMatchedIds.has(n.id) && !isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Node Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        
        if (useCategoryColors) {
          ctx.fillStyle = isDark ? '#111827' : '#ffffff';
          ctx.fill();
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = isSelected || isHovered ? 3.5 : 2.2;
          ctx.stroke();

          // Symbol in center
          ctx.fillStyle = baseColor;
          ctx.font = `700 ${Math.max(11, n.radius * 0.55)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, n.x, n.y);
        } else {
          // Minimalist / Blueprint theme
          ctx.fillStyle = isDark ? (isSelected ? '#f8fafc' : '#1e293b') : (isSelected ? '#0f172a' : '#ffffff');
          ctx.fill();
          ctx.strokeStyle = isDark ? (isSelected ? '#93c5fd' : '#64748b') : (isSelected ? '#2563eb' : '#94a3b8');
          ctx.lineWidth = isSelected ? 3 : 1.8;
          ctx.stroke();

          // Center symbol
          ctx.fillStyle = isDark ? (isSelected ? '#0f172a' : '#cbd5e1') : (isSelected ? '#ffffff' : '#334155');
          ctx.font = `700 ${Math.max(11, n.radius * 0.55)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, n.x, n.y);
        }

        // Label below node
        ctx.save();
        ctx.font = `${isSelected || isHovered ? '600' : '500'} ${Math.max(10.5, Math.min(12.5, 9.5 + n.radius * 0.1))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const labelY = n.y + n.radius + 6;
        const text = n.name;
        
        // High contrast backing pill for flawless text legibility
        const metrics = ctx.measureText(text);
        const padX = 6;
        const padY = 2;

        ctx.fillStyle = isDark
          ? (isSelected ? '#f0f0ee' : 'rgba(26, 26, 25, 0.92)')
          : (isSelected ? '#1a1a19' : 'rgba(234, 234, 232, 0.94)');
        ctx.strokeStyle = isDark ? 'rgba(240, 240, 238, 0.15)' : 'rgba(26, 26, 25, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          n.x - metrics.width / 2 - padX,
          labelY - padY,
          metrics.width + padX * 2,
          16 + padY * 2,
          3
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark
          ? (isSelected ? '#121212' : '#f0f0ee')
          : (isSelected ? '#eaeae8' : (isHovered ? '#000000' : '#1a1a19'));
        ctx.fillText(text, n.x, labelY + 1);

        ctx.restore();
        ctx.restore();
      });

      ctx.restore();
      stateRef.current.animId = requestAnimationFrame(loop);
    }

    stateRef.current.animId = requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
    };
  }, [categories, selectedNodeId, hoveredNodeId, searchQuery, useCategoryColors, isDark]);

  // Convert client mouse coordinate to world coordinates
  const clientToWorld = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const xScreen = clientX - rect.left - rect.width / 2;
    const yScreen = clientY - rect.top - rect.height / 2;
    const { camera } = stateRef.current;
    return {
      x: xScreen / camera.scale - camera.x,
      y: yScreen / camera.scale - camera.y
    };
  }, []);

  // Find node under world coordinates
  const getNodeAt = useCallback((worldX, worldY) => {
    const { nodes } = stateRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dist = Math.hypot(n.x - worldX, n.y - worldY);
      if (dist <= n.radius + 8) {
        return n;
      }
    }
    return null;
  }, []);

  // Mouse / Touch Interaction Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const pos = clientToWorld(e.clientX, e.clientY);
    const hitNode = getNodeAt(pos.x, pos.y);

    if (hitNode) {
      stateRef.current.dragNode = hitNode;
      hitNode.vx = 0;
      hitNode.vy = 0;
    } else {
      stateRef.current.isPanning = true;
      stateRef.current.panStart = {
        x: e.clientX,
        y: e.clientY,
        camX: stateRef.current.camera.x,
        camY: stateRef.current.camera.y
      };
    }
  };

  const handleMouseMove = (e) => {
    const { isPanning, panStart, dragNode, camera } = stateRef.current;
    const pos = clientToWorld(e.clientX, e.clientY);

    // Notify parent of normalized pointer position for WebGPU shader
    const canvas = canvasRef.current;
    if (canvas && onPointerMove) {
      const rect = canvas.getBoundingClientRect();
      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      onPointerMove({ x: normX, y: normY });
    }

    if (dragNode) {
      dragNode.x = pos.x;
      dragNode.y = pos.y;
      dragNode.vx = 0;
      dragNode.vy = 0;
      return;
    }

    if (isPanning) {
      const dx = (e.clientX - panStart.x) / camera.scale;
      const dy = (e.clientY - panStart.y) / camera.scale;
      camera.x = panStart.camX + dx;
      camera.y = panStart.camY + dy;
      camera.targetX = camera.x;
      camera.targetY = camera.y;
      return;
    }

    // Check hover
    const hitNode = getNodeAt(pos.x, pos.y);
    if (hitNode) {
      if (hoveredNodeId !== hitNode.id) {
        setHoveredNodeId(hitNode.id);
        soundEffects.hover(soundEnabled);
      }
      const rect = canvas.getBoundingClientRect();
      setTooltip({
        node: hitNode,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else {
      if (hoveredNodeId !== null) {
        setHoveredNodeId(null);
        setTooltip(null);
      }
    }
  };

  const handleMouseUp = (e) => {
    const { dragNode, isPanning } = stateRef.current;
    
    if (dragNode) {
      onSelectNode(dragNode.id);
      soundEffects.select(soundEnabled);
      stateRef.current.dragNode = null;
    } else if (!isPanning) {
      const pos = clientToWorld(e.clientX, e.clientY);
      const hit = getNodeAt(pos.x, pos.y);
      if (hit) {
        onSelectNode(hit.id);
        soundEffects.select(soundEnabled);
      }
    }

    stateRef.current.isPanning = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const { camera } = stateRef.current;
    const newScale = Math.max(0.3, Math.min(3.5, camera.targetScale * zoomFactor));
    camera.targetScale = newScale;
  };

  const handleResetCamera = () => {
    const { camera } = stateRef.current;
    const targetScale = 0.95;
    let offsetX = 0;
    if (isPanelOpen && typeof window !== 'undefined' && window.innerWidth >= 640) {
      const sidebarWidth = window.innerWidth >= 1024 ? 560 : 500;
      offsetX = (sidebarWidth / 2) / targetScale;
    }
    camera.targetX = -offsetX;
    camera.targetY = 0;
    camera.targetScale = targetScale;
    soundEffects.toggle(soundEnabled);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block w-full h-full relative z-10" />

      {/* Floating Hover Tooltip */}
      {tooltip && (
        <div
          className={`absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 shadow-2xl backdrop-blur-md border max-w-xs transition-opacity duration-150 font-mono ${
            isDark
              ? 'bg-[#1a1a19]/95 text-[#f0f0ee] border-[rgba(240,240,238,0.2)]'
              : 'bg-[#eaeae8]/95 text-[#1a1a19] border-[rgba(26,26,25,0.2)]'
          }`}
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y - 12}px` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2"
              style={{ backgroundColor: categories[tooltip.node.category]?.color || '#3b82f6' }}
            />
            <span className={`text-[10px] tracking-wider uppercase opacity-75`}>
              {categories[tooltip.node.category]?.name}
            </span>
          </div>
          <div className="font-semibold text-xs tracking-tight mb-1">
            {tooltip.node.name}
          </div>
          <p className="text-[11px] line-clamp-2 leading-relaxed opacity-80">
            {tooltip.node.summary}
          </p>
        </div>
      )}

      {/* Canvas Floating Controls */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 z-20 font-mono">
        <button
          onClick={handleResetCamera}
          className={`px-2.5 py-1 text-xs border backdrop-blur-md transition flex items-center gap-1.5 ${
            isDark
              ? 'bg-[#1a1a19]/90 hover:bg-[#242422] text-[#f0f0ee] border-[rgba(240,240,238,0.18)]'
              : 'bg-[#eaeae8]/90 hover:bg-[#dcdcd9] text-[#1a1a19] border-[rgba(26,26,25,0.18)]'
          }`}
          title="Reset canvas view"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>[ Reset ]</span>
        </button>
        <div className={`text-[11px] px-2.5 py-1 border backdrop-blur-md ${
          isDark
            ? 'text-[#f0f0ee]/60 bg-[#1a1a19]/70 border-[rgba(240,240,238,0.12)]'
            : 'text-[#1a1a19]/60 bg-[#eaeae8]/80 border-[rgba(26,26,25,0.12)]'
        }`}>
          <span>drag: pan · scroll: zoom</span>
        </div>
      </div>
    </div>
  );
}

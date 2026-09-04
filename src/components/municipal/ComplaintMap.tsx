import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import L from 'leaflet';

interface ComplaintMapProps {
  onSelectIssue: (issue: CivicIssue) => void;
  onAssignWorker: (issue: CivicIssue) => void;
  selectedCategory: string;
  selectedSeverity: string;
}

export const ComplaintMap: React.FC<ComplaintMapProps> = ({
  onSelectIssue,
  onAssignWorker,
  selectedCategory,
  selectedSeverity,
}) => {
  const { issues } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filter issues based on category & severity
  const filteredIssues = issues.filter((issue) => {
    const matchCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    return matchCategory && matchSeverity;
  });

  // Get Marker Color based on severity & status
  const getMarkerColor = (issue: CivicIssue): string => {
    if (issue.status === 'Resolved') return '#10B981'; // Green
    switch (issue.severity) {
      case 'Critical':
        return '#EF4444'; // Red
      case 'High':
        return '#F97316'; // Orange
      case 'Medium':
        return '#F59E0B'; // Amber
      default:
        return '#3B82F6'; // Blue
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.6412],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when filtered issues change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredIssues.forEach((issue) => {
      const color = getMarkerColor(issue);
      const isResolved = issue.status === 'Resolved';

      // Custom HTML Pin
      const customIcon = L.divIcon({
        className: 'custom-civic-pin',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 11px;
              font-weight: 900;
              text-align: center;
            ">
              ${isResolved ? '✓' : issue.severity[0]}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], {
        icon: customIcon,
      });

      // Custom Popup HTML
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-slate-900 min-w-[220px] font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
            #${issue.ticketNumber}
          </span>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isResolved
              ? 'bg-emerald-100 text-emerald-800'
              : issue.severity === 'Critical'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          }">
            ${issue.status}
          </span>
        </div>
        <h4 class="font-bold text-xs text-slate-900 leading-snug mb-1">${issue.title}</h4>
        <p class="text-[10px] text-slate-500 mb-2">${issue.location.address}</p>
        <img src="${issue.photoUrl}" alt="${issue.title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
        <div class="flex space-x-1.5">
          <button id="btn-view-${issue.id}" class="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold">
            View
          </button>
          ${
            !isResolved && !issue.assignedWorkerName
              ? `<button id="btn-assign-${issue.id}" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold">
                  Assign
                </button>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const viewBtn = document.getElementById(`btn-view-${issue.id}`);
        if (viewBtn) {
          viewBtn.onclick = () => onSelectIssue(issue);
        }
        const assignBtn = document.getElementById(`btn-assign-${issue.id}`);
        if (assignBtn) {
          assignBtn.onclick = () => onAssignWorker(issue);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredIssues, onSelectIssue, onAssignWorker]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Severity Heatmap Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200 z-[1000] text-xs">
        <h5 className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
          <span>Complaint Severity & Density</span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({filteredIssues.length} pins)
          </span>
        </h5>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-xs" />
            <span className="text-slate-700 font-medium">Critical Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-xs" />
            <span className="text-slate-700 font-medium">High Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
            <span className="text-slate-700 font-medium">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-slate-700 font-medium">Resolved Cleaned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

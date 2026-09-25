import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIssue } from '../../types';
import L from 'leaflet';
import { MapPin, Flame, Clock } from 'lucide-react';
import { createRipple } from '../common/MaterialRipple';

interface ComplaintMapProps {
  onSelectIssue: (issue: CivicIssue) => void;
  onAssignWorker: (issue: CivicIssue) => void;
  selectedCategory: string;
  selectedSeverity: string;
  heightClassName?: string;
}

export const ComplaintMap: React.FC<ComplaintMapProps> = ({
  onSelectIssue,
  onAssignWorker,
  selectedCategory,
  selectedSeverity,
  heightClassName = 'h-[360px] sm:h-[400px] lg:h-[420px]',
}) => {
  const { issues, t } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinsLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  // Map Controls State: Pins vs Heatmap
  const [mapView, setMapView] = useState<'pins' | 'heatmap'>('pins');
  const [timePeriod, setTimePeriod] = useState<'all' | '24h' | '7d' | '30d'>('all');

  // Filter issues based on category, severity, and time period
  const filteredIssues = issues.filter((issue) => {
    const matchCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;

    let matchTime = true;
    if (timePeriod !== 'all') {
      const issueDate = new Date(issue.createdAt).getTime();
      const now = Date.now();
      const diffHours = (now - issueDate) / (1000 * 60 * 60);
      if (timePeriod === '24h') matchTime = diffHours <= 24;
      else if (timePeriod === '7d') matchTime = diffHours <= 24 * 7;
      else if (timePeriod === '30d') matchTime = diffHours <= 24 * 30;
    }

    return matchCategory && matchSeverity && matchTime;
  });

  // Get Marker Color based on severity & status
  const getMarkerColor = (issue: CivicIssue): string => {
    if (issue.status === 'Resolved') return '#34A853'; // Google Green
    switch (issue.severity) {
      case 'Critical':
        return '#EA4335'; // Google Red
      case 'High':
        return '#F9AB00'; // Google Deep Yellow / Orange
      case 'Medium':
        return '#FBBC05'; // Google Yellow
      default:
        return '#4285F4'; // Google Blue
    }
  };

  // Initialize Map centered on Pune [18.5204, 73.8567]
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [18.5204, 73.8567],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors • PMC Pune GIS',
        maxZoom: 19,
      }).addTo(map);

      pinsLayerRef.current = L.layerGroup().addTo(map);
      heatmapLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size once rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 250);

      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update Layers when filtered issues or mapView changes (Preserving map center and zoom level!)
  useEffect(() => {
    if (!mapInstanceRef.current || !pinsLayerRef.current || !heatmapLayerRef.current) return;

    // Clear both layers
    pinsLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    if (mapView === 'pins') {
      // 1. PIN VIEW MODE
      filteredIssues.forEach((issue) => {
        const color = getMarkerColor(issue);
        const isResolved = issue.status === 'Resolved';

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

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-slate-900 min-w-[220px] font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-mono font-bold bg-[#F1F3F4] text-[#202124] px-1.5 py-0.5 rounded">
              #${issue.ticketNumber}
            </span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isResolved
                ? 'bg-[#E6F4EA] text-[#137333]'
                : issue.severity === 'Critical'
                ? 'bg-[#FCE8E6] text-[#C5221F]'
                : 'bg-[#FEF7E0] text-[#78350F]'
            }">
              ${issue.status}
            </span>
          </div>
          <h4 class="font-bold text-xs text-[#202124] leading-snug mb-1">${issue.title}</h4>
          <p class="text-[10px] text-[#5F6368] mb-2">${issue.location.address}</p>
          <img src="${issue.photoUrl}" alt="${issue.title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
          <div class="flex space-x-1.5">
            <button id="btn-view-${issue.id}" class="flex-1 py-1.5 bg-[#4285F4] hover:bg-[#1A73E8] text-white rounded text-[11px] font-medium uppercase tracking-wider cursor-pointer">
              View
            </button>
            ${
              !isResolved && !issue.assignedWorkerName
                ? `<button id="btn-assign-${issue.id}" class="flex-1 py-1.5 bg-[#34A853] hover:bg-[#2D9247] text-white rounded text-[11px] font-medium uppercase tracking-wider cursor-pointer">
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

        pinsLayerRef.current?.addLayer(marker);
      });
    } else {
      // 2. HEATMAP VIEW MODE: Severity-Weighted Radial Heat Circles & Pulse Indicators
      filteredIssues.forEach((issue) => {
        const isResolved = issue.status === 'Resolved';

        // Severity weight configurations
        const heatConfig = isResolved
          ? { radius: 320, color: '#34A853', outerOpacity: 0.2, innerRadius: 100, innerOpacity: 0.5 }
          : issue.severity === 'Critical'
          ? { radius: 650, color: '#EA4335', outerOpacity: 0.45, innerRadius: 180, innerOpacity: 0.8 }
          : issue.severity === 'High'
          ? { radius: 500, color: '#F9AB00', outerOpacity: 0.4, innerRadius: 140, innerOpacity: 0.7 }
          : issue.severity === 'Medium'
          ? { radius: 380, color: '#FBBC05', outerOpacity: 0.35, innerRadius: 110, innerOpacity: 0.6 }
          : { radius: 280, color: '#4285F4', outerOpacity: 0.3, innerRadius: 80, innerOpacity: 0.5 };

        // Outer heat dissipation circle
        const outerCircle = L.circle([issue.location.lat, issue.location.lng], {
          radius: heatConfig.radius,
          color: heatConfig.color,
          fillColor: heatConfig.color,
          fillOpacity: heatConfig.outerOpacity,
          weight: 0,
        });

        // Inner core intensity circle
        const innerCircle = L.circle([issue.location.lat, issue.location.lng], {
          radius: heatConfig.innerRadius,
          color: heatConfig.color,
          fillColor: heatConfig.color,
          fillOpacity: heatConfig.innerOpacity,
          weight: 1,
        });

        // Core pulsating focal point
        const pulseIcon = L.divIcon({
          className: 'heatmap-pulse-dot',
          html: `
            <div style="
              position: relative;
              width: 16px;
              height: 16px;
              background-color: ${heatConfig.color};
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 10px ${heatConfig.color};
              cursor: pointer;
            ">
              <span style="
                position: absolute;
                inset: -4px;
                border-radius: 50%;
                border: 2px solid ${heatConfig.color};
                opacity: 0.6;
              "></span>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const centerMarker = L.marker([issue.location.lat, issue.location.lng], {
          icon: pulseIcon,
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-slate-900 min-w-[220px] font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              🔥 Hotspot: ${issue.severity}
            </span>
            <span class="text-[10px] font-mono text-[#5F6368]">
              #${issue.ticketNumber}
            </span>
          </div>
          <h4 class="font-bold text-xs text-[#202124] mb-1">${issue.title}</h4>
          <p class="text-[10px] text-[#5F6368] mb-2">${issue.location.ward} • ${issue.location.address}</p>
          <div class="flex space-x-1.5">
            <button id="btn-hm-view-${issue.id}" class="flex-1 py-1.5 bg-[#4285F4] hover:bg-[#1A73E8] text-white rounded text-[11px] font-medium uppercase tracking-wider cursor-pointer">
              Inspect
            </button>
            ${
              !isResolved && !issue.assignedWorkerName
                ? `<button id="btn-hm-assign-${issue.id}" class="flex-1 py-1.5 bg-[#34A853] hover:bg-[#2D9247] text-white rounded text-[11px] font-medium uppercase tracking-wider cursor-pointer">
                    Assign
                  </button>`
                : ''
            }
          </div>
        `;

        centerMarker.bindPopup(popupContent);
        outerCircle.bindPopup(popupContent);

        centerMarker.on('popupopen', () => {
          const viewBtn = document.getElementById(`btn-hm-view-${issue.id}`);
          if (viewBtn) viewBtn.onclick = () => onSelectIssue(issue);
          const assignBtn = document.getElementById(`btn-hm-assign-${issue.id}`);
          if (assignBtn) assignBtn.onclick = () => onAssignWorker(issue);
        });

        heatmapLayerRef.current?.addLayer(outerCircle);
        heatmapLayerRef.current?.addLayer(innerCircle);
        heatmapLayerRef.current?.addLayer(centerMarker);
      });
    }
  }, [filteredIssues, mapView, onSelectIssue, onAssignWorker]);

  return (
    <div className={`relative w-full ${heightClassName} rounded-xl overflow-hidden border border-[#DADCE0] shadow-elevation-1`}>
      {/* Top Map Toolbar: View Mode Toggle & Time Filter */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-[1000] flex flex-wrap items-center gap-2">
        {/* Map View Switcher: Pins vs Heatmap */}
        <div className="bg-white/95 backdrop-blur-xs p-1 rounded-lg shadow-elevation-3 border border-[#DADCE0] flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              createRipple(e);
              setMapView('pins');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mapView === 'pins'
                ? 'bg-[#1A73E8] text-white shadow-xs'
                : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.mapViewPins || 'Pins'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              createRipple(e);
              setMapView('heatmap');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mapView === 'heatmap'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.mapViewHeatmap || 'Heatmap'}</span>
          </button>
        </div>

        {/* Time Period Filter */}
        <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-elevation-3 border border-[#DADCE0] flex items-center space-x-1.5 text-xs text-[#5F6368]">
          <Clock className="w-3.5 h-3.5 text-[#1A73E8]" />
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as any)}
            className="bg-transparent text-xs font-medium text-[#202124] focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">{t.timeRangeAll || 'All Time'}</option>
            <option value="24h">{t.timeRange24h || 'Past 24 Hours'}</option>
            <option value="7d">{t.timeRange7d || 'Past 7 Days'}</option>
            <option value="30d">{t.timeRange30d || 'Past 30 Days'}</option>
          </select>
        </div>

        {/* Live Filter Indicator */}
        <div className="hidden md:flex items-center bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg shadow-elevation-2 border border-[#DADCE0] text-[11px] text-[#5F6368]">
          <span>Pune PMC: <strong>{filteredIssues.length}</strong> complaints active</span>
        </div>
      </div>

      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-elevation-4 border border-[#DADCE0] z-[1000] text-xs max-w-[280px]">
        {mapView === 'pins' ? (
          <div>
            <h5 className="font-semibold text-[#202124] mb-1.5 flex items-center justify-between uppercase tracking-wider text-[11px]">
              <span>Complaint Severity</span>
              <span className="text-[10px] text-[#5F6368] font-normal lowercase">
                ({filteredIssues.length} pins)
              </span>
            </h5>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EA4335] shadow-xs" />
                <span className="text-[#5F6368] font-medium">Critical</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F9AB00] shadow-xs" />
                <span className="text-[#5F6368] font-medium">High</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FBBC05] shadow-xs" />
                <span className="text-[#5F6368] font-medium">Medium</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#34A853] shadow-xs" />
                <span className="text-[#5F6368] font-medium">Resolved</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h5 className="font-semibold text-[#202124] mb-1.5 flex items-center justify-between uppercase tracking-wider text-[11px]">
              <span className="flex items-center gap-1 text-rose-600">
                <Flame className="w-3.5 h-3.5" /> Heat Density Intensity
              </span>
              <span className="text-[10px] text-[#5F6368] font-normal lowercase">
                ({filteredIssues.length} sources)
              </span>
            </h5>
            <div className="space-y-1 text-[10px] text-[#5F6368]">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-rose-600 shadow-xs" />
              <div className="flex justify-between font-medium">
                <span>Low / Dispersed</span>
                <span>Medium</span>
                <span className="text-rose-600 font-bold">Critical Hotspot</span>
              </div>
              <p className="text-[9px] text-slate-500 pt-0.5 leading-tight">
                Severity-weighted radial density. Overlapping complaints intensify heat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

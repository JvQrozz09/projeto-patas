/* eslint-disable react-hooks/static-components */
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Corrigindo o ícone do marcador que às vezes some no React
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapaSelecao = ({ aoSelecionarLocal }) => {
  const [posicao, setPosicao] = useState(null);

  // Coordenadas centrais de São Vicente/Santos para começar
  const centroInicial = [-23.9619, -46.3869]; 

  function CliqueNoMapa() {
    useMapEvents({
      click(e) {
        setPosicao(e.latlng);
        aoSelecionarLocal(e.latlng);
      },
    });
    return posicao === null ? null : <Marker position={posicao} />;
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
      <MapContainer 
        center={centroInicial} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <CliqueNoMapa/>
      </MapContainer>
      {posicao && (
        <p className="text-[10px] text-gray-400 mt-1 px-2">
          Coordenadas: {posicao.lat.toFixed(4)}, {posicao.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default MapaSelecao;
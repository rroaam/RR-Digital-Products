/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Constants & Data ---

const CITIES = [
  { name: 'Los Angeles', lat: 34.05, lng: -118.24 },
  { name: 'San Francisco', lat: 37.77, lng: -122.42 },
  { name: 'New York', lat: 40.71, lng: -74.01 },
  { name: 'Miami', lat: 25.76, lng: -80.19 },
  { name: 'Chicago', lat: 41.88, lng: -87.63 },
  { name: 'Las Vegas', lat: 36.17, lng: -115.14 },
  { name: 'Austin', lat: 30.27, lng: -97.74 },
  { name: 'Toronto', lat: 43.65, lng: -79.38 },
  { name: 'Vancouver', lat: 49.28, lng: -123.12 },
  { name: 'Tulum', lat: 20.21, lng: -87.47 },
  { name: 'Mexico City', lat: 19.43, lng: -99.13 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63 },
  { name: 'Rio de Janeiro', lat: -22.91, lng: -43.17 },
  { name: 'Buenos Aires', lat: -34.60, lng: -58.38 },
  { name: 'London', lat: 51.51, lng: -0.13 },
  { name: 'Paris', lat: 48.86, lng: 2.35 },
  { name: 'Amsterdam', lat: 52.37, lng: 4.90 },
  { name: 'Berlin', lat: 52.52, lng: 13.41 },
  { name: 'Barcelona', lat: 41.39, lng: 2.17 },
  { name: 'Ibiza', lat: 38.91, lng: 1.42 },
  { name: 'Florence', lat: 43.77, lng: 11.26 },
  { name: 'Milan', lat: 45.46, lng: 9.19 },
  { name: 'Rome', lat: 41.90, lng: 12.50 },
  { name: 'Lake Como', lat: 45.99, lng: 9.26 },
  { name: 'Stockholm', lat: 59.33, lng: 18.07 },
  { name: 'Copenhagen', lat: 55.68, lng: 12.57 },
  { name: 'Herceg Novi', lat: 42.45, lng: 18.54 },
  { name: 'Tokyo', lat: 35.68, lng: 139.65 },
  { name: 'Seoul', lat: 37.57, lng: 126.98 },
  { name: 'Singapore', lat: 1.35, lng: 103.82 },
  { name: 'Hong Kong', lat: 22.32, lng: 114.17 },
  { name: 'Dubai', lat: 25.20, lng: 55.27 },
  { name: 'Bali', lat: -8.34, lng: 115.09 },
  { name: 'Sydney', lat: -33.87, lng: 151.21 },
  { name: 'Melbourne', lat: -37.81, lng: 144.96 },
  { name: 'Auckland', lat: -36.85, lng: 174.76 },
];

const GLOBE_RADIUS = 5;

// Convert Lat/Lng to Vector3
function getPosition(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// --- Atmosphere Shader ---
const vertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vNormal;
void main() {
  float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
  gl_FragColor = vec4(0.9, 0.95, 1.0, 1.0) * intensity;
}
`;

// --- Components ---

type CityMarkerProps = {
  position: THREE.Vector3;
  name: string;
  onHover: (hovering: boolean) => void;
};

const CityMarker: React.FC<CityMarkerProps> = ({ position, name, onHover }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  // Pulsing effect
  useFrame((state) => {
    if (ref.current) {
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 2 + position.x) * 0.2;
        ref.current.scale.setScalar(scale);
        
        // Material pulse
        const material = ref.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0.6 + Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            onHover(true);
        }}
        onPointerOut={(e) => {
            setHover(false);
            onHover(false);
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#E8E4DD" transparent />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={10} position={[0, 0.2, 0]}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#E8E4DD',
            padding: '4px 8px',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            border: '1px solid #333',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

function Atmosphere() {
  return (
    <mesh scale={[1.1, 1.1, 1.1]}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  );
}

function Continents() {
  // Use a standard specular map as a mask for continents
  // This texture is public and stable.
  const map = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
  
  return (
    <>
      {/* 1. The continents highlight */}
      <mesh scale={[1.001, 1.001, 1.001]}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial 
          map={map}
          transparent={true}
          opacity={0.2}
          color="#ffffff"
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* 2. A faint wireframe grid over the whole globe to give it structure */}
       <mesh scale={[1.002, 1.002, 1.002]}>
        <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
        <meshBasicMaterial 
          color="#333333" 
          wireframe={true} 
          transparent 
          opacity={0.1} 
        />
      </mesh>
    </>
  );
}

function Earth() {
    return (
        <mesh>
            <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
            <meshPhongMaterial 
                color="#050505" 
                emissive="#000000"
                specular="#111111"
                shininess={10}
            />
        </mesh>
    )
}

function Scene() {
  const [hovering, setHovering] = useState(false);
  const cities = useMemo(() => CITIES.map(city => ({
    ...city,
    pos: getPosition(city.lat, city.lng, GLOBE_RADIUS)
  })), []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#444444" />
      
      <group>
        <Earth />
        <Continents />
        <Atmosphere />
        {cities.map((city, i) => (
          <CityMarker 
            key={i} 
            position={city.pos} 
            name={city.name} 
            onHover={setHovering} 
          />
        ))}
      </group>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={7}
        maxDistance={15}
        autoRotate={!hovering}
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function GlobeVisualization() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#000000' }}>
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
             <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlay Metadata similar to screenshot */}
      <div style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          fontFamily: 'Roboto Mono, monospace',
          fontSize: '10px',
          color: '#555',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
      }}>
          <div style={{ display: 'flex', gap: '20px' }}>
              <span>LAT: 34.0522° N</span>
              <span>LNG: 118.2437° W</span>
          </div>
          <div style={{ width: '100%', height: '1px', background: '#333', marginTop: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
             <span>SYS: ONLINE</span>
             <span>VEL: 0.00 km/s</span>
          </div>
      </div>

       <div style={{
          position: 'absolute',
          top: 40,
          right: 40,
          fontFamily: 'Roboto Mono, monospace',
          fontSize: '10px',
          color: '#555',
          pointerEvents: 'none',
          textAlign: 'right'
      }}>
          <div>TARGET: GLOBAL_NEXUS</div>
          <div>NODES: 85 ACTIVE</div>
      </div>
    </div>
  );
}
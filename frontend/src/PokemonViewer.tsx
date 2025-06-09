import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface PokemonModelViewerProps {
  modelUrl: string;
}

const PokemonViewer: React.FC<PokemonModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 1, 3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf: any) => {
        scene.add(gltf.scene);
        animate();
      },
      undefined,
      (error: any) => {
        console.error("GLB Load Error:", error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  return <div ref={mountRef} style={{ width: "100%", height: "500px" }} />;
};

export default PokemonViewer;

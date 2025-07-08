import React, { useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';
import * as THREE from 'three';

export default function Pet3D() {
  const modelRef = useRef();

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Load the 3D model
    const asset = Asset.fromModule(require('../assets/models/yourPet.glb'));
    await asset.downloadAsync();

    const loader = new GLTFLoader();
    loader.load(
      asset.localUri || asset.uri,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop
    const render = () => {
      requestAnimationFrame(render);
      if (modelRef.current) modelRef.current.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}

'use client'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'

interface CompactSphereProps {
  size?: number // Размер в пикселях
  color?: number // Цвет в hex формате (например, 0x22d3ee для cyan)
}

/**
 * Компактная 3D сфера с упрощенной сеткой для использования в карточках проектов
 * Автоматически вращается, без интерактивности для производительности
 */
export default function CompactSphere({ size = 150, color = 0x22d3ee }: CompactSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // Scene / Camera / Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 3.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(size, size, true)
    container.appendChild(renderer.domElement)

    // Group
    const group = new THREE.Group()
    scene.add(group)

    // Materials
    const lineMat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    })
    const nodeMat = new THREE.MeshBasicMaterial({ color: color })

    // Fibonacci points (меньше точек для производительности)
    const N = 60
    const R = 0.8
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * Math.PI * (3 - Math.sqrt(5))
      const x = Math.cos(phi) * r
      const z = Math.sin(phi) * r
      pts.push(new THREE.Vector3(x * R, y * R, z * R))
    }

    // Connect nearest neighbors
    const k = 2 // Меньше соединений
    const segments: number[] = []
    const used = new Set<string>()
    for (let i = 0; i < N; i++) {
      const d: { j: number; s: number }[] = []
      for (let j = 0; j < N; j++) {
        if (i === j) continue
        d.push({ j, s: pts[i].distanceToSquared(pts[j]) })
      }
      d.sort((a, b) => a.s - b.s)
      for (let m = 0; m < k; m++) {
        const j = d[m].j
        const a = Math.min(i, j)
        const b = Math.max(i, j)
        const key = `${a}-${b}`
        if (used.has(key)) continue
        used.add(key)
        segments.push(i, j)
      }
    }

    // Lines
    const linePos = new Float32Array(segments.length * 3)
    for (let s = 0; s < segments.length; s++) {
      const v = pts[segments[s]]
      linePos[s * 3 + 0] = v.x
      linePos[s * 3 + 1] = v.y
      linePos[s * 3 + 2] = v.z
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    group.add(lines)

    // Nodes (меньше деталей)
    const nodeGeo = new THREE.SphereGeometry(0.025, 8, 8)
    const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, N)
    const dummy = new THREE.Object3D()
    for (let i = 0; i < N; i++) {
      dummy.position.copy(pts[i])
      dummy.updateMatrix()
      nodes.setMatrixAt(i, dummy.matrix)
    }
    nodes.instanceMatrix.needsUpdate = true
    group.add(nodes)

    // Render loop с автовращением
    let raf = 0
    const clock = new THREE.Clock()
    const render = () => {
      const t = clock.getElapsedTime()

      // Медленное автовращение
      group.rotation.y = t * 0.15
      group.rotation.x = Math.sin(t * 0.2) * 0.1

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    // Cleanup
    return () => {
      cancelAnimationFrame(raf)
      lineGeo.dispose()
      nodeGeo.dispose()
      lineMat.dispose()
      nodeMat.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [size, color])

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    />
  )
}
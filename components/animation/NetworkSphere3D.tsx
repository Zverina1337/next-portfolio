'use client'

import * as THREE from 'three'
import { useLayoutEffect, useRef, useState } from 'react'

export default function NetworkSphere3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer>(null)
  const groupRef = useRef<THREE.Group>(null)

  // состояние для интерактивного вращения
  const rotationRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // Scene / Camera / Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 3.6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(container.clientWidth, container.clientHeight || container.clientWidth, true)
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Group
    const g = new THREE.Group()
    groupRef.current = g
    scene.add(g)

    // Materials
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff })

    // Fibonacci points
    const N = 120
    const R = 1
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
    const k = 3
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
    g.add(lines)

    // Nodes
    const nodeGeo = new THREE.SphereGeometry(0.02, 12, 12)
    const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, N)
    const dummy = new THREE.Object3D()
    for (let i = 0; i < N; i++) {
      dummy.position.copy(pts[i])
      dummy.updateMatrix()
      nodes.setMatrixAt(i, dummy.matrix)
    }
    nodes.instanceMatrix.needsUpdate = true
    g.add(nodes)

    // Cyan satellites
    const satMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    const satGeo = new THREE.SphereGeometry(0.05, 16, 16)
    const s1 = new THREE.Mesh(satGeo, satMat)
    s1.position.set(-0.7, 0.65, 0.2)
    const s2 = new THREE.Mesh(satGeo, satMat)
    s2.scale.setScalar(0.85)
    s2.position.set(0.8, -0.2, -0.15)
    g.add(s1, s2)

    // ===============================
    // Mouse / Touch interactivity
    // ===============================
    const onDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true
      lastPosRef.current = {
        x: 'touches' in e ? e.touches[0].clientX : e.clientX,
        y: 'touches' in e ? e.touches[0].clientY : e.clientY,
      }
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const dx = clientX - lastPosRef.current.x
      const dy = clientY - lastPosRef.current.y
      lastPosRef.current = { x: clientX, y: clientY }
      rotationRef.current.y += dx * 0.003
      rotationRef.current.x += dy * 0.003
    }

    const onUp = () => {
      isDraggingRef.current = false
    }

    container.addEventListener('mousedown', onDown)
    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseup', onUp)
    container.addEventListener('mouseleave', onUp)
    container.addEventListener('touchstart', onDown)
    container.addEventListener('touchmove', onMove)
    container.addEventListener('touchend', onUp)

    // Render loop
    let raf = 0
    const clock = new THREE.Clock()
    const render = () => {
      const t = clock.getElapsedTime()

      // автоворот + интерактивное вращение
      g.rotation.y = t * 0.18 + rotationRef.current.y
      g.rotation.x = Math.sin(t * 0.25) * 0.08 + rotationRef.current.x

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    // Resize
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight || w
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, true)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    // Cleanup
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      container.removeEventListener('mousedown', onDown)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseup', onUp)
      container.removeEventListener('mouseleave', onUp)
      container.removeEventListener('touchstart', onDown)
      container.removeEventListener('touchmove', onMove)
      container.removeEventListener('touchend', onUp)

      lineGeo.dispose()
      nodeGeo.dispose()
      satGeo.dispose()
      lineMat.dispose()
      nodeMat.dispose()
      satMat.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-[72vw] max-w-[720px] aspect-square cursor-grab" />
}

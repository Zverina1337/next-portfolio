'use client'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'

interface SkillBoxProps {
  icon: string
}

export default function SkillBox({ icon }: SkillBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // Scene / Camera / Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    )
    camera.position.set(0, 0, 2)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(container.clientWidth, container.clientHeight, true)
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Group для всех объектов
    const group = new THREE.Group()
    groupRef.current = group
    scene.add(group)

    // Создаём куб с материалом
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9, 12, 12, 12)

    // Создаём материалы для каждой стороны куба
    // Фронтальная сторона (Z+) - с иконкой и контуром
    const frontCanvas = document.createElement('canvas')
    frontCanvas.width = 512
    frontCanvas.height = 512
    const frontCtx = frontCanvas.getContext('2d')!

    // Прозрачный фон
    frontCtx.fillStyle = 'rgba(0, 0, 0, 0)'
    frontCtx.fillRect(0, 0, 512, 512)

    // Градиентный контур
    const gradient = frontCtx.createLinearGradient(0, 0, 512, 512)
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.8)')
    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.5)')
    gradient.addColorStop(1, 'rgba(22, 78, 99, 0.8)')

    frontCtx.strokeStyle = gradient
    frontCtx.lineWidth = 8
    frontCtx.strokeRect(20, 20, 472, 472)

    // Отрисовываем эмодзи в центре
    frontCtx.font = 'bold 300px Arial'
    frontCtx.textAlign = 'center'
    frontCtx.textBaseline = 'middle'
    frontCtx.fillStyle = 'white'
    frontCtx.shadowColor = 'rgba(34, 211, 238, 0.6)'
    frontCtx.shadowBlur = 30
    frontCtx.shadowOffsetX = 0
    frontCtx.shadowOffsetY = 0
    frontCtx.fillText(icon, 256, 256)

    const frontTexture = new THREE.CanvasTexture(frontCanvas)

    // Остальные стороны - только контур без иконки
    const sideCanvas = document.createElement('canvas')
    sideCanvas.width = 512
    sideCanvas.height = 512
    const sideCtx = sideCanvas.getContext('2d')!

    sideCtx.fillStyle = 'rgba(0, 0, 0, 0)'
    sideCtx.fillRect(0, 0, 512, 512)

    const sideGradient = sideCtx.createLinearGradient(0, 0, 512, 512)
    sideGradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)')
    sideGradient.addColorStop(1, 'rgba(6, 182, 212, 0.2)')

    sideCtx.strokeStyle = sideGradient
    sideCtx.lineWidth = 6
    sideCtx.strokeRect(20, 20, 472, 472)

    const sideTexture = new THREE.CanvasTexture(sideCanvas)

    // Создаём массив материалов для каждой грани
    // Порядок: Right, Left, Top, Bottom, Front, Back
    const materials = [
      // Right (X+)
      new THREE.MeshPhongMaterial({
        map: sideTexture,
        transparent: true,
        opacity: 0.7,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.2,
        shininess: 80,
      }),
      // Left (X-)
      new THREE.MeshPhongMaterial({
        map: sideTexture,
        transparent: true,
        opacity: 0.7,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.2,
        shininess: 80,
      }),
      // Top (Y+)
      new THREE.MeshPhongMaterial({
        map: sideTexture,
        transparent: true,
        opacity: 0.65,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.18,
        shininess: 80,
      }),
      // Bottom (Y-)
      new THREE.MeshPhongMaterial({
        map: sideTexture,
        transparent: true,
        opacity: 0.65,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.18,
        shininess: 80,
      }),
      // Front (Z+) - с иконкой
      new THREE.MeshPhongMaterial({
        map: frontTexture,
        transparent: true,
        opacity: 0.85,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.3,
        shininess: 80,
      }),
      // Back (Z-)
      new THREE.MeshPhongMaterial({
        map: sideTexture,
        transparent: true,
        opacity: 0.7,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.2,
        shininess: 80,
      }),
    ]

    const cube = new THREE.Mesh(geometry, materials)
    group.add(cube)

    // Начальный наклон для лучшей видимости 3D формы
    group.rotation.x = Math.PI * 0.15 // 27 градусов
    group.rotation.y = Math.PI * 0.2  // 36 градусов

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 1.2)
    directionalLight.position.set(5, 5, 3)
    scene.add(directionalLight)

    // Дополнительный свет для объёма
    const backLight = new THREE.DirectionalLight(0x0891b2, 0.5)
    backLight.position.set(-3, -2, -2)
    scene.add(backLight)

    // ===============================
    // Mouse interactivity
    // ===============================
    const mouseRef = { x: 0, y: 0 }
    const targetRotationRef = { x: 0, y: 0 }
    const currentRotationRef = { x: 0, y: 0 }

    const scaleRef = { current: 1 }
    const scaleTargetRef = { target: 1 }

    const onMouseEnter = () => {
      isHoveredRef.current = true
      scaleTargetRef.target = 1.3
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isHoveredRef.current || !container.getBoundingClientRect) return

      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      mouseRef.x = (e.clientX - rect.left) / rect.width - 0.5
      mouseRef.y = (e.clientY - rect.top) / rect.height - 0.5

      targetRotationRef.x = mouseRef.y * Math.PI * 0.3
      targetRotationRef.y = mouseRef.x * Math.PI * 0.3
    }

    const onMouseLeave = () => {
      isHoveredRef.current = false
      targetRotationRef.x = 0
      targetRotationRef.y = 0
      scaleTargetRef.target = 1
    }

    container.addEventListener('mouseenter', onMouseEnter)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    // Render loop
    let raf = 0
    const baseRotationX = Math.PI * 0.15
    const baseRotationY = Math.PI * 0.2

    const render = () => {
      // Плавная интерполяция вращения
      currentRotationRef.x += (targetRotationRef.x - currentRotationRef.x) * 0.1
      currentRotationRef.y += (targetRotationRef.y - currentRotationRef.y) * 0.1

      // Применяем вращение относительно базового наклона
      group.rotation.x = baseRotationX + currentRotationRef.x
      group.rotation.y = baseRotationY + currentRotationRef.y

      // Плавная интерполяция масштабирования
      scaleRef.current += (scaleTargetRef.target - scaleRef.current) * 0.08
      group.scale.set(scaleRef.current, scaleRef.current, scaleRef.current)

      // Лёгкое постоянное вращение по оси Z
      if (!isHoveredRef.current) {
        group.rotation.z += 0.0005
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    // Resize
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
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
      container.removeEventListener('mouseenter', onMouseEnter)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)

      geometry.dispose()
      frontTexture.dispose()
      sideTexture.dispose()
      materials.forEach((mat) => mat.dispose())
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [icon])

  return (
    <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />
  )
}

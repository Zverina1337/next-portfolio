'use client'

import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { Html } from '@react-three/drei'

type Skill = {
  name: string
  icon: string
}

interface SkillsPyramidProps {
  skills: Skill[]
  isVisible: boolean
}

// Физический куб навыка с перетаскиванием
function PhysicsSkillBox({
  position,
  icon,
  name,
  onDragStart,
  onDragEnd,
}: {
  position: [number, number, number]
  icon: string
  name: string
  onDragStart?: (data: { ref: React.RefObject<THREE.Object3D>; api: ReturnType<typeof useBox>[1] }) => void
  onDragEnd?: () => void
}) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1.5, 1.5, 1.5],
    material: {
      friction: 0.5,
      restitution: 0.3,
    },
  }))

  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'grab'
    } else {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  // Создаем текстуры для куба
  const textures = useRef<THREE.Texture[]>([])

  useEffect(() => {
    // Фронтальная сторона с иконкой
    const frontCanvas = document.createElement('canvas')
    frontCanvas.width = 512
    frontCanvas.height = 512
    const frontCtx = frontCanvas.getContext('2d')!

    // Черный фон
    frontCtx.fillStyle = '#000000'
    frontCtx.fillRect(0, 0, 512, 512)

    // Бирюзовый border
    frontCtx.strokeStyle = '#22d3ee'
    frontCtx.lineWidth = 8
    frontCtx.strokeRect(20, 20, 472, 472)

    // Проверяем, это путь к изображению или эмодзи
    const isImagePath = icon.startsWith('/') || icon.startsWith('http')

    if (isImagePath) {
      // Загружаем изображение
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        // Рисуем изображение выше центра для размещения текста снизу
        const size = 280 // уменьшаем размер изображения для текста
        const x = (512 - size) / 2
        const y = 80 // смещаем вверх

        // Добавляем тень для изображения
        frontCtx.shadowColor = 'rgba(34, 211, 238, 0.6)'
        frontCtx.shadowBlur = 30
        frontCtx.drawImage(img, x, y, size, size)

        // Рисуем название навыка снизу
        frontCtx.shadowBlur = 0
        frontCtx.font = 'bold 36px Arial'
        frontCtx.textAlign = 'center'
        frontCtx.textBaseline = 'middle'
        frontCtx.fillStyle = '#22d3ee'
        frontCtx.fillText(name, 256, 420)

        // Обновляем текстуру после загрузки изображения
        const frontTexture = new THREE.CanvasTexture(frontCanvas)
        textures.current[4] = frontTexture // Обновляем фронтальную текстуру
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${icon}`)
        // Fallback на текст, если изображение не загрузилось
        frontCtx.font = 'bold 300px Arial'
        frontCtx.textAlign = 'center'
        frontCtx.textBaseline = 'middle'
        frontCtx.fillStyle = 'white'
        frontCtx.fillText('?', 256, 200)

        // Название навыка
        frontCtx.font = 'bold 36px Arial'
        frontCtx.fillStyle = '#22d3ee'
        frontCtx.fillText(name, 256, 420)
      }
      img.src = icon
    } else {
      // Рисуем эмодзи выше центра
      frontCtx.font = 'bold 240px Arial'
      frontCtx.textAlign = 'center'
      frontCtx.textBaseline = 'middle'
      frontCtx.fillStyle = 'white'
      frontCtx.shadowColor = 'rgba(34, 211, 238, 0.6)'
      frontCtx.shadowBlur = 30
      frontCtx.fillText(icon, 256, 200)

      // Рисуем название навыка снизу
      frontCtx.shadowBlur = 0
      frontCtx.font = 'bold 36px Arial'
      frontCtx.fillStyle = '#22d3ee'
      frontCtx.fillText(name, 256, 420)
    }

    const frontTexture = new THREE.CanvasTexture(frontCanvas)

    // Боковые стороны без иконки
    const sideCanvas = document.createElement('canvas')
    sideCanvas.width = 512
    sideCanvas.height = 512
    const sideCtx = sideCanvas.getContext('2d')!

    // Черный фон
    sideCtx.fillStyle = '#000000'
    sideCtx.fillRect(0, 0, 512, 512)

    // Бирюзовый border
    sideCtx.strokeStyle = '#22d3ee'
    sideCtx.lineWidth = 6
    sideCtx.strokeRect(20, 20, 472, 472)

    const sideTexture = new THREE.CanvasTexture(sideCanvas)

    textures.current = [
      sideTexture, // Right
      sideTexture, // Left
      sideTexture, // Top
      sideTexture, // Bottom
      frontTexture, // Front (с иконкой)
      sideTexture, // Back
    ]
  }, [icon, name])

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'grabbing'

    // Делаем куб kinematic (без гравитации) для перетаскивания
    api.mass.set(0)

    if (onDragStart) {
      onDragStart({ ref, api })
    }
  }

  const handlePointerUp = () => {
    document.body.style.cursor = hovered ? 'grab' : 'auto'

    // Возвращаем физику
    api.mass.set(1)

    if (onDragEnd) {
      onDragEnd()
    }
  }

  return (
    <>
      <mesh
        ref={ref}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        {textures.current.map((texture, i) => (
          <meshPhongMaterial
            key={i}
            attach={`material-${i}`}
            map={texture}
            emissive={0x22d3ee}
            emissiveIntensity={hovered ? 0.2 : 0}
            shininess={100}
          />
        ))}
        {hovered && (
          <Html
            position={[0, 1.5, 0]}
            center
            distanceFactor={6}
            occlude={false}
            zIndexRange={[100, 0]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div className="px-4 py-2 bg-black/90 border border-cyan-400 rounded-lg shadow-lg shadow-cyan-500/50 backdrop-blur-sm whitespace-nowrap">
              <span className="text-cyan-400 font-bold text-sm">{name}</span>
            </div>
          </Html>
        )}
      </mesh>
    </>
  )
}

// Физический пол (невидимый)
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0], // На уровне Y = 0
    material: {
      friction: 0.7,
      restitution: 0.2,
    },
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial visible={false} />
    </mesh>
  )
}

// Звездное поле фона
function Starfield() {
  const count = 2000
  const positions = useRef<Float32Array | null>(null)

  useEffect(() => {
    // Создаем случайные позиции для звезд
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Распределяем звезды в кубическом пространстве
      pos[i3] = (Math.random() - 0.5) * 50 // X
      pos[i3 + 1] = (Math.random() - 0.5) * 30 // Y
      pos[i3 + 2] = (Math.random() - 0.5) * 40 - 10 // Z (смещение назад)
    }
    positions.current = pos
  }, [count])

  if (!positions.current) return null

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Декоративный фон
function Background() {
  return (
    <>
      {/* Звездное поле */}
      <Starfield />

      {/* Пол с отражением */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#0e7490"
          emissiveIntensity={0.05}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Сетка на полу для глубины */}
      <gridHelper
        args={[20, 20, '#0891b2', '#0e7490']}
        position={[0, 0.05, 0]}
        material-opacity={0.15}
        material-transparent={true}
      />
    </>
  )
}

// Основная сцена с физикой
function PhysicsScene({ skills, dropped }: { skills: Skill[]; dropped: boolean }) {
  const { camera, gl } = useThree()
  const dragStateRef = useRef<{
    isDragging: boolean
    api: ReturnType<typeof useBox>[1]
    meshRef: React.RefObject<THREE.Object3D>
    plane: THREE.Plane
    offset: THREE.Vector3
  } | null>(null)

  // Направляем камеру на центр пирамиды
  useEffect(() => {
    camera.lookAt(0, 2.5, 2)
  }, [camera])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current?.isDragging) return

      const rect = gl.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)

      const intersection = new THREE.Vector3()
      raycaster.ray.intersectPlane(dragStateRef.current.plane, intersection)

      if (intersection && dragStateRef.current.api) {
        const newPos = intersection.sub(dragStateRef.current.offset)
        dragStateRef.current.api.position.set(newPos.x, newPos.y, newPos.z)
      }
    }

    const handlePointerUp = () => {
      if (dragStateRef.current) {
        dragStateRef.current.isDragging = false
        dragStateRef.current = null
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [camera, gl])

  const handleDragStart = ({ ref: meshRef, api }: { ref: React.RefObject<THREE.Object3D>; api: ReturnType<typeof useBox>[1] }) => {
    if (!meshRef || !meshRef.current) return

    // Создаем плоскость, перпендикулярную взгляду камеры
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)

    const objectPosition = new THREE.Vector3()
    meshRef.current.getWorldPosition(objectPosition)

    const plane = new THREE.Plane()
    plane.setFromNormalAndCoplanarPoint(cameraDirection.negate(), objectPosition)

    dragStateRef.current = {
      isDragging: true,
      api: api,
      meshRef: meshRef,
      plane: plane,
      offset: new THREE.Vector3(),
    }
  }

  // Позиции для пирамиды с учетом размера куба 1.5
  // 17 навыков: 6 + 5 + 4 + 2 (или 8 + 5 + 3 + 1)
  const pyramidPositions: [number, number, number][] = [
    // Ряд 1 (основание) - 8 кубов (Y = 0.75 на полу, Z = 2 ближе к камере)
    [-5.25, dropped ? 0.75 : 12, 2],
    [-3.75, dropped ? 0.75 : 12, 2],
    [-2.25, dropped ? 0.75 : 12, 2],
    [-0.75, dropped ? 0.75 : 12, 2],
    [0.75, dropped ? 0.75 : 12, 2],
    [2.25, dropped ? 0.75 : 12, 2],
    [3.75, dropped ? 0.75 : 12, 2],
    [5.25, dropped ? 0.75 : 12, 2],
    // Ряд 2 - 5 кубов (Y = 2.25, на первом ряду)
    [-3, dropped ? 2.25 : 13.5, 2],
    [-1.5, dropped ? 2.25 : 13.5, 2],
    [0, dropped ? 2.25 : 13.5, 2],
    [1.5, dropped ? 2.25 : 13.5, 2],
    [3, dropped ? 2.25 : 13.5, 2],
    // Ряд 3 - 3 куба (Y = 3.75, на втором ряду)
    [-1.5, dropped ? 3.75 : 15, 2],
    [0, dropped ? 3.75 : 15, 2],
    [1.5, dropped ? 3.75 : 15, 2],
    // Ряд 4 - 1 куб (верхушка, Y = 5.25)
    [0, dropped ? 5.25 : 16.5, 2],
  ]

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 3]} intensity={1.5} color={0x22d3ee} castShadow />
      <directionalLight position={[-3, -2, -2]} intensity={0.6} color={0x0891b2} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color={0x22d3ee} />

      {/* Фон для глубины */}
      <Background />

      <Physics gravity={[0, -9.8, 0]}>
        <Ground />
        {skills.slice(0, 17).map((skill, i) => (
          <PhysicsSkillBox
            key={skill.name}
            position={pyramidPositions[i]}
            icon={skill.icon}
            name={skill.name}
            onDragStart={handleDragStart}
            onDragEnd={() => {
              if (dragStateRef.current) {
                dragStateRef.current.isDragging = false
                dragStateRef.current = null
              }
            }}
          />
        ))}
      </Physics>
    </>
  )
}

export default function SkillsPyramid({ skills, isVisible }: SkillsPyramidProps) {
  const [dropped, setDropped] = useState(false)

  useEffect(() => {
    if (isVisible && !dropped) {
      // Задержка перед падением для драматического эффекта
      const timer = setTimeout(() => {
        setDropped(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, dropped])

  return (
    <div className="relative w-full h-[900px] bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 6, 12], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PhysicsScene skills={skills} dropped={dropped} />
      </Canvas>

      {/* Градиент сверху для видимости звёзд */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent" />
    </div>
  )
}

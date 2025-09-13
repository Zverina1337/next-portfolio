import { useGLTF } from '@react-three/drei'


export function useModel(path: string) {
  // small helper; extend later with DRACO, KTX2, etc.
  const gltf = useGLTF(path)
  
  return gltf
}
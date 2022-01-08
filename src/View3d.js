import { Canvas } from '@react-three/fiber'
import * as THREE from 'three';
import { OrbitControls, Center } from '@react-three/drei';
import { useControls } from 'leva';


//import { Stack } from './Stack';

function BranchLeaves({length, radius, accScaleDown}) {

    const startOffset = 0.2;
    const endOffset = 1.0;

    const leafLength = 0.15 / accScaleDown;
    const leafWidth = 0.1 / accScaleDown;
    const numLeaves = 20;
    let vertices = [];
    let normals = [];
    for(let i=0; i<numLeaves; i++) {
            const t = i / (numLeaves-1);
            const ang = 360 * Math.PI / 180.0 * Math.random(); //t*360.0 * Math.PI / 180.0;
            const h = length * (startOffset + t * (endOffset - startOffset));

            const vecx = Math.cos(ang);
            const vecy = Math.sin(ang);
            const x0 = radius * vecx;
            const y0 = radius * vecy;

            const x1 = (radius + leafLength) * vecx - (leafWidth / 2.0) * vecy;
            const y1 = (radius + leafLength) * vecy + (leafWidth / 2.0) * vecx;
            const x2 = (radius + leafLength) * vecx + (leafWidth / 2.0) * vecy;
            const y2 = (radius + leafLength) * vecy - (leafWidth / 2.0) * vecx;

            vertices.push(x0, h, y0);
            vertices.push(x1, h, y1);
            vertices.push(x2, h, y2);

            normals.push(0,0,1);
            normals.push(0,0,1);
            normals.push(0,0,1);

            vertices.push(x0, h, y0);
            vertices.push((radius + leafLength) * vecx, h + (leafWidth / 2.0), (radius + leafLength) * vecy);
            vertices.push((radius + leafLength) * vecx, h - (leafWidth / 2.0), (radius + leafLength) * vecy);

            normals.push(0,1,0);
            normals.push(0,1,0);
            normals.push(0,1,0);
        }

    return (
        <mesh castShadow>
            <bufferGeometry>
                <bufferAttribute
                    attachObject={["attributes", "position"]}
                    count={vertices.length / 3}
                    array={new Float32Array(vertices)}
                    itemSize={3}
                />
                <bufferAttribute
                    attachObject={["attributes", "normal"]}
                    count={normals.length / 3}
                    array={new Float32Array(normals)}
                    itemSize={3}
                /> 
            </bufferGeometry>
            <meshStandardMaterial color={'#1B512D'} side={THREE.DoubleSide} />
        </mesh>
    );
}

function Tree(props) {

    const { level, height, radius, accScaleDown, ...meshProps } = props;

    //let s = new Stack();
    //const m = new THREE.Matrix4();
    //m.makeTranslation(0, 5, 0);
    // mesh matrixAutoUpdate={false} matrix={m}

    if(level === 0) return null;


    //const twistAngL = -60 + 120*Math.random();
    //const twistAngR = -60 + 120*Math.random();
    //const turnAngL = 20 + 40*Math.random();
    //const turnAngR = 20 + 40*Math.random();

    //const branchDistL = 0.5 + 0.5*Math.random();
    //const branchDistR = 0.5 + 0.5*Math.random();

    const h = height || 1; //0.5 + 1*Math.random();
    const r = radius || 0.1; //0.05 + 0.15*Math.random();

    const scaleDown = 0.75;

    const accScale = accScaleDown || 1.0;

    const branchAngles = level > 5 ? [0, 90, 180, 270] : (level > 2 ? [0, 120, 240] : [0, 180]);
    const sectionAng = 360 / branchAngles.length;
    return (
        <group {...meshProps}>
            <mesh castShadow position={[0, h/2.0, 0]}>
                <cylinderGeometry args={[r*scaleDown, r, h, 6]} />
                <meshStandardMaterial color={'#3C332A'} />
            </mesh>
            { (level <= 2) && <group>
                    <BranchLeaves length={h} radius={r} accScaleDown={accScaleDown}/> 
                </group>
            }

            { level > 1 && branchAngles.map((branchAng, branchIdx) => {

                const branchDistR = branchIdx === 0 ? 0.97 : 0.5 + 0.47*Math.random();
                const turnAngR = 20 + 40*Math.random();
                const twistAngR = -(sectionAng/2.0) + sectionAng*Math.random();
                return (
                    <group key={'brang'+branchAng} rotation={[0, branchAng * Math.PI/180.0, 0]} scale={scaleDown} position={[0, branchDistR*h, 0]}>
                        <group rotation={[0, twistAngR * Math.PI/180.0, turnAngR * Math.PI / 180.0]}>
                            <Tree level={level-1} height={h} radius={r} accScaleDown={accScale * scaleDown} />
                        </group>
                    </group>
                );
            }) }
            {/*
            <group position={[0, branchDistL*h, 0]}>
                <group scale={0.75}>
                    <group rotation={[0, twistAngL * Math.PI/180.0, -turnAngL * Math.PI / 180.0]}>
                        <Tree level={level-1} height={h} radius={r}/>
                    </group>
                </group>
            </group> */ }
        </group>
    );
}






export function View3d() {

    /*
    const {  myNumber  } = useControls({
        myNumber: {
            value: 4,
            min: 0,
            max: 10,
            step: 1,
          },
    })*/

    return (

        <div style={{width:'75vw', height:'75vh'}}>
            <Canvas shadows camera={{position: [0,10,20], fov: 45}} pixelRatio={window.devicePixelRatio}>

                <color attach="background" args={['#67abeb']} />
                <OrbitControls autoRotate enablePan={true} enableZoom={true} enableRotate={true} />

                <ambientLight args={[0x7f7f7f, 1]} />
                <directionalLight position={[5, 50, 5]} 
                    castShadow
                    shadow-mapSize-height={2048}
                    shadow-mapSize-width={2048}
                />

                <Center alignTop={false}>
                    <gridHelper args={[10, 10, `white`, `gray`]} />

                    <mesh receiveShadow rotation={[90 * Math.PI / 180.0, 0, 0]}>
                        <planeGeometry args={[10,10]} />
                        <meshStandardMaterial color={'#DBBEA1'} side={THREE.DoubleSide} />

                    </mesh>

                    { [[0,0,0], /* [5,0,0], [-5,0,0], [0,0,-5], [0,0,5], [-5,0,5], [5,0,5], [-5,0,-5], [5,0,-5]*/ ].map((pos,i) => {

                        return (
                            <Tree key={'Tree'+i} level={6} position={pos} height={1 + 2*Math.random()} radius={0.05 + 0.15*Math.random()}/>
                        );
                    })}

                </Center>
            </Canvas>
        </div>
    );
}
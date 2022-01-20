import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { DoubleSide, RepeatWrapping, sRGBEncoding } from "three";
import { connect } from "react-redux";
import {
    vertexShader,
    fragmentShader,
    decodePolyline,
    latlong2coords,
    latlonTo3D,
    normalizeCoords,
    scale_array,
    transform_array,
    scale_array2,
    rotate_x,
    rotate_y,
    rotate_z
} from "../utils";

import {
    Loader,
    OrbitControls,
    PerspectiveCamera,
    Line,
    useTexture,
    OrthographicCamera,
    CubeCamera
} from "@react-three/drei";
import { Vector3 } from "three";

require("dotenv").config()

// center BC 39.5946/-106.5086

//new https://tangrams.github.io/heightmapper/#13.19/39.5990128/-106.5210928
// z:x scale factor: 0.05593703454256223

//newest https://tangrams.github.io/heightmapper/#12.48275/39.5877/-106.5158
// 0.04500531138264616

const Terrain = () => {
    // load render
    const heightMap = useTexture("/render_BC2.png");
    // Apply some properties to ensure it renders correctly
    heightMap.encoding = sRGBEncoding;
    heightMap.wrapS = RepeatWrapping;
    heightMap.wrapT = RepeatWrapping;
    heightMap.anisotropy = 16;

    //23040 × 11232

    return (
        <mesh
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            scale={[1 / 8192, 1 / 8192, 1 / 8192]}>
            <planeBufferGeometry args={[512, 512, 1024, 1024]} />
            <shaderMaterial
                uniforms={{
                    // Feed the heightmap
                    bumpTexture: { value: heightMap },
                    // Feed the scaling constant for the heightmap
                    bumpScale: { value: 50 }
                }}
                // Feed the shaders as strings
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={DoubleSide} />
        </mesh>
    )
}

const Render = ({ user, returnTokens }) => {
    const [userData, setUserData] = useState(user.data);

    const activity = userData[0].map.summary_polyline;
    const polyline = decodePolyline(activity);
    const center = userData[0].start_latlng;

    console.log(polyline)

    let orig_poly = polyline

    let new_center = latlonTo3D(39.5990128, -106.5210928, 2000, 6378137.0)
    console.log(new_center)
    // for (let i = 0; i < orig_poly.length; i++) {
    //     orig_poly[i] = latlonTo3D(orig_poly[i][0], orig_poly[i][1], 2000, 6378137.0)
    //     orig_poly[i][0] -= new_center[0]
    //     orig_poly[i][1] -= new_center[1]
    //     orig_poly[i][2] -= new_center[2]

    // }

    // let new_polyline = scale_array(polyline, -1, 1)
    // console.log(new_polyline)
    // for (let i = 0; i < polyline.length; i++) {
    //     polyline[i].splice(1, 0, 0.01)
    // }
    polyline.push([39.5990128, -106.5210928])

    // let old_poly = scale_array( polyline, -1, 1);
    // let new_poly = transform_array(polyline, 39.5990128, -106.5210928) //make constants, abstract out
    let new_poly = polyline
    for (let i = 0; i < new_poly.length; i++) {
        new_poly[i] = latlonTo3D(new_poly[i][0], new_poly[i][1], 2000, 6378137.0)
        new_poly[i][0] -= new_center[0]
        new_poly[i][1] -= new_center[1]
        new_poly[i][2] -= new_center[2]

    }
    new_poly = scale_array(new_poly, -1, 1)
    for (let i = 0; i < new_poly.length; i++) {
        new_poly[i] = scale_array2(new_poly[i], [0, 0, 0], 0.04500531138264616/2)
    }
    for (let i = 0; i < new_poly.length; i++) {
        new_poly[i] = rotate_x(new_poly[i], 11)
        new_poly[i] = rotate_y(new_poly[i], 0)
        new_poly[i] = rotate_z(new_poly[i], 9)

    }

    // for (let i = 0; i < new_poly.length; i++) {
    //     new_poly[i].splice(1, 1, 1)
    // }
    console.log("new", new_poly)
    // console.log("old", old_poly)
    console.log("orig", polyline)

    return (
        <div>
            <Canvas style={{ height: "100vh", width: "100vh" }}>
                <Suspense fallback={null}>
                    <group>
                        <Terrain />
                        {/* <Line color={'blue'} points={old_poly} />
                        <Line color={'red'} points={new_poly} /> */}
                        <Line color={'purple'} points={new_poly} />
                        <Line color={'pink'} points={[[0, 0, 0], [0, 1, 1], [0, 0, 1]]} />
                    </group>
                    <ambientLight />
                </Suspense>
                <PerspectiveCamera
                    position={[0.5, 0.5, 0.5]}
                    near={0.01}
                    far={1000}
                    makeDefault
                />
                <OrbitControls screenSpacePanning={false} />
            </Canvas>
            <Loader />
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        returnTokens: state.returnTokens,
    };
};

export default connect(mapStateToProps)(Render);
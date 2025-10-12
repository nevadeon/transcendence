import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";

// Y devient Z

export type BabylonArena3DProps = {
    pad1Pos: number;
    pad2Pos: number;
    ballPos: { x: number; y: number };

};

export default function BabylonArena3D({ pad1Pos, pad2Pos, ballPos }: BabylonArena3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const ballGroupRef = useRef<BABYLON.TransformNode | null>(null);
    const leftPadGroupRef = useRef<BABYLON.TransformNode | null>(null);
    const rightPadGroupRef = useRef<BABYLON.TransformNode | null>(null);

    const engineRef = useRef<BABYLON.Engine | null>(null);
    const sceneRef = useRef<BABYLON.Scene | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const engine = new BABYLON.Engine(canvas, true);
        engineRef.current = engine;

        var createScene = function () 
            {
                var scene = new BABYLON.Scene(engine);
                sceneRef.current = scene;
                const camera = new BABYLON.ArcRotateCamera(
                    "camera",
                    4.71,                            // alpha (≈ 270°)
                    0.5898,                            // beta (≈ 45°)
                    1254.4028,                          // distance
                    new BABYLON.Vector3(0, 0, 0),      // cible (centre de la scène)
                    scene
                );

                scene.autoClear = false;
                scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

                camera.attachControl(canvas, true);
                camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha;
                camera.lowerBetaLimit  = camera.upperBetaLimit  = camera.beta;
                camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;


                var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

                light.intensity = 0.7;

                function randomBetween(min: number, max: number) 
                {
                    const rand = Math.random() * (max - min) + min;
                    return rand;
                }

                const ballGroup = new BABYLON.TransformNode("ballGroup", scene);
                ballGroupRef.current = ballGroup;
                const leftPadGroup = new BABYLON.TransformNode("leftPadGroup", scene);
                leftPadGroupRef.current = leftPadGroup; 
                const rightPadGroup = new BABYLON.TransformNode("rightPadGroup", scene);
                rightPadGroupRef.current = rightPadGroup;
                const map = new BABYLON.TransformNode("map", scene);

                var ball = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10.8, segments: 32}, scene)
                ball.parent = ballGroup;
                var leftPad = BABYLON.BoxBuilder.CreateBox("box", {size:3.6});
                leftPad.parent = leftPadGroup;
                var rightPad = BABYLON.BoxBuilder.CreateBox("box", {size:3.6});
                rightPad.parent = rightPadGroup;

                var wallHeight = randomBetween(100, 300);
                var wall = BABYLON.MeshBuilder.CreatePlane("wall", {width: 10, height: wallHeight}, scene);
                wall.parent = map;
                wall.position.y += (wallHeight / 2) - 5;
                wall.position.z += 375.5;
                wall.position.x -= 595;
                wall.registerInstancedBuffer("color", 4);
                wall.instancedBuffers.color = new BABYLON.Color4(0, 0.79, 0.07, 0.98);

                var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 1200, height: 751}, scene);
                ground.position.y -= 5;
                ground.registerInstancedBuffer("color", 4);
                ground.instancedBuffers.color = new BABYLON.Color4(0.76, 0.77, 1);

                ball.registerInstancedBuffer("color", 4);
                ball.instancedBuffers.color = new BABYLON.Color4(0, 1, 0, 0.3);

                leftPad.registerInstancedBuffer("color", 4);
                leftPad.instancedBuffers.color = new BABYLON.Color4(0, 1, 0, 0.3);

                rightPad.registerInstancedBuffer("color", 4);
                rightPad.instancedBuffers.color = new BABYLON.Color4(0.68, 0, 1, 0.3);

                function randomPointInSphere(radius: number) 
                {
                    const u = Math.random();
                    const v = Math.random();
                    const theta = 2 * Math.PI * u;
                    const phi = Math.acos(2 * v - 1);

                    const r = radius * Math.cbrt(Math.random()) * 3;

                    const x = r * Math.sin(phi) * Math.cos(theta);
                    const y = r * Math.sin(phi) * Math.sin(theta);
                    const z = r * Math.cos(phi);

                    return new BABYLON.Vector3(x, y, z);
                }
                function randomPointInBox(radius: number) 
                {
                    // const radius = 12; // Nouveau rayon

                    const x = (Math.random() * 2 - 1) * radius * 7.2; // Plage de -16 à 16 pour l'axe X
                    const y = (Math.random() * 2 - 1) * radius * 10;  // Plage de -120 à 120 pour l'axe Y
                    const z = (Math.random() * 2 - 1) * radius * 40;  // Plage de -480 à 480 pour l'axe Z

                    return new BABYLON.Vector3(x, y, z);

                }

                function randomGreenBall()
                {
                    var x = Math.random();
                    if (x < 0.50)
                        var color = new BABYLON.Color4(0.71, 1, 0.73, 0.98);
                    else
                        var color =  new BABYLON.Color4(0, 1, 0.08, 0.98);
                    return color;
                }
                function randomGreenPad()
                {
                    var x = Math.random();
                    if (x < 0.33)
                        var color = new BABYLON.Color4(0, 0.79, 0.07, 0.98);
                    else if (x < 0.66)
                        var color =  new BABYLON.Color4(0.66, 0.95, 0.69, 0.98);
                    else
                        var color =  new BABYLON.Color4(0.01, 0.35, 0.04, 0.98);
                    return color;
                }

                function randomPurpleBall()
                    {
                        var x = Math.random();
                        if (x < 0.50)
                            var color = new BABYLON.Color4(0.75, 0.3, 1, 0.98);
                        else
                            var color =  new BABYLON.Color4(0.84, 0.42, 1, 0.98);
                        return color;
                    }

                function randomPurplePad()
                {
                    var x = Math.random();
                    if (x < 0.33)
                        var color = new BABYLON.Color4(0.47, 0, 0.79, 0.98);
                    else if (x < 0.66)
                        var color =  new BABYLON.Color4(0.84, 0.66, 0.95, 0.98);
                    else
                        var color =  new BABYLON.Color4(0.24, 0.01, 0.35, 0.98);
                    return color;
                }

                for (var index = 1; index < 120; index++)
                {
                    var wallHeight = randomBetween(100, 300);
                    var wallInstances = BABYLON.MeshBuilder.CreatePlane("wall", {width: 10, height: wallHeight}, scene);
                    wallInstances.parent = map;

                    wallInstances.registerInstancedBuffer("color", 4);
                    wallInstances.instancedBuffers.color = new BABYLON.Color4(0, 0.79, 0.07, 0.98);

                    wallInstances.position.y += (wallHeight / 2) - 5;
                    wallInstances.position.z += 375.5;
                    wallInstances.position.x -= 10 * index - 605;
                }

                for (var index = 0; index < 800; index++)
                {
                    var ballInstances = ball.createInstance("box" + index);
                    var leftPadInstances = leftPad.createInstance("leftPad" + index);
                    var rightPadInstances = rightPad.createInstance("rightPad" + index);

                    ballInstances.position = randomPointInSphere(12);
                    if (Math.random() > 0.5)
                        ballInstances.instancedBuffers.color = randomPurpleBall();
                    else
                        ballInstances.instancedBuffers.color = randomGreenBall();

                    leftPadInstances.position = randomPointInBox(1.2);
                    leftPadInstances.instancedBuffers.color = randomGreenPad();

                    rightPad.position = randomPointInBox(1.2);
                    rightPad.instancedBuffers.color = randomPurplePad();

                    ballInstances.parent = ballGroup;
                    leftPadInstances.parent = leftPadGroup;
                    rightPadInstances.parent = rightPadGroup;
                }

                leftPadGroup.position.x -= 525;
                rightPadGroup.position.x += 525;

                return scene;
            };

        const scene = createScene();

        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());

        return () => {
            engine.dispose();
            window.removeEventListener("resize", () => engine.resize());
        };
    }, []);

    useEffect(() => {
    if (!ballGroupRef.current || !leftPadGroupRef.current || !rightPadGroupRef.current) return;

    const ballGroup = ballGroupRef.current;
    const leftPadGroup = leftPadGroupRef.current;
    const rightPadGroup = rightPadGroupRef.current;

    ballGroup.position.z = ballPos.y - 375.5;
    ballGroup.position.x = ballPos.x - 600;
    leftPadGroup.position.z = pad1Pos - 375.5;
    rightPadGroup.position.z = pad2Pos - 375.5;

  }, [pad1Pos, pad2Pos, ballPos]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                display: "block",
            }}
        />
    );
}